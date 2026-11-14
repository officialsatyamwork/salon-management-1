import logging
import time
import uuid
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import text

from app.api.routes import auth, dashboard, salons, settings, users
from app.core.config import get_settings
from app.core.errors import register_error_handlers
from app.core.logging import request_id_ctx, setup_logging
from app.db.session import dispose_engine, get_engine

log = logging.getLogger("app.access")


@asynccontextmanager
async def lifespan(_: FastAPI):
    get_engine()
    yield
    await dispose_engine()


def create_app() -> FastAPI:
    s = get_settings()
    setup_logging("DEBUG" if s.debug else "INFO", json_logs=s.environment != "development")

    app = FastAPI(
        title=s.app_name,
        version="1.0.0",
        lifespan=lifespan,
        # Interactive docs only outside production.
        docs_url=None if s.is_production else "/docs",
        redoc_url=None,
        openapi_url=None if s.is_production else "/openapi.json",
    )

    app.add_middleware(GZipMiddleware, minimum_size=1024)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=s.cors_origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allow_headers=["Authorization", "Content-Type", "X-Request-ID"],
        expose_headers=["X-Request-ID", "Retry-After"],
        max_age=600,
    )

    @app.middleware("http")
    async def request_context(request: Request, call_next):
        rid = request.headers.get("x-request-id") or uuid.uuid4().hex
        token = request_id_ctx.set(rid[:64])
        start = time.perf_counter()
        status = 500
        try:
            response = await call_next(request)
            status = response.status_code
        finally:
            ms = round((time.perf_counter() - start) * 1000, 1)
            if request.url.path not in ("/health", "/ready"):
                log.info(
                    "request",
                    extra={
                        "method": request.method,
                        "path": request.url.path,
                        "status": status,
                        "duration_ms": ms,
                        "client_ip": request.client.host if request.client else None,
                    },
                )
            request_id_ctx.reset(token)
        response.headers["X-Request-ID"] = rid[:64]
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        if request.url.path.startswith(s.api_prefix):
            response.headers["Cache-Control"] = "no-store"
        if s.is_production:
            response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        return response

    register_error_handlers(app)

    for r in (auth.router, users.router, salons.router, salons.public_router, settings.router, dashboard.router):
        app.include_router(r, prefix=s.api_prefix)

    @app.get("/health", tags=["ops"], include_in_schema=False)
    async def health() -> dict:
        return {"status": "ok"}

    @app.get("/ready", tags=["ops"], include_in_schema=False)
    async def ready():
        try:
            async with get_engine().connect() as conn:
                await conn.execute(text("select 1"))
        except Exception:
            log.exception("readiness check failed")
            return JSONResponse({"status": "unavailable"}, status_code=503)
        return {"status": "ready"}

    return app


app = create_app()
