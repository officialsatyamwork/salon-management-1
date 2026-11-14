import json
from functools import lru_cache
from typing import Annotated, Literal

from pydantic import Field, field_validator, model_validator
from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict


class Settings(BaseSettings):
    """All runtime configuration comes from environment variables (or a .env file)."""

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "Velura Salon API"
    environment: Literal["development", "test", "staging", "production"] = "development"
    debug: bool = False
    api_prefix: str = "/api/v1"

    # Database
    database_url: str = "postgresql+asyncpg://salon:salon@localhost:5432/salon"
    db_pool_size: int = 10
    db_max_overflow: int = 20
    db_echo: bool = False

    # Auth
    jwt_secret: str = Field(default="change-me-in-production-please-32-chars-min", min_length=32)
    jwt_algorithm: str = "HS256"
    jwt_issuer: str = "velura-api"
    jwt_audience: str = "velura-web"
    access_token_ttl_minutes: int = 15
    refresh_token_ttl_days: int = 30
    password_reset_ttl_minutes: int = 30
    invite_ttl_hours: int = 72
    refresh_cookie_name: str = "velura_rt"
    refresh_cookie_secure: bool = True
    refresh_cookie_samesite: Literal["lax", "strict", "none"] = "strict"
    refresh_cookie_domain: str | None = None

    # Rate limiting (per process; use a shared store such as Redis when running several instances)
    login_rate_limit: int = 10
    login_rate_window_seconds: int = 60

    # CORS / frontend
    cors_origins: Annotated[list[str], NoDecode] = ["http://localhost:5173"]
    frontend_url: str = "http://localhost:5173"

    # Email
    email_backend: Literal["console", "smtp"] = "console"
    smtp_host: str = "localhost"
    smtp_port: int = 587
    smtp_user: str | None = None
    smtp_password: str | None = None
    smtp_from: str = "Velura <no-reply@velura.app>"
    smtp_starttls: bool = True

    # Business defaults
    trial_days: int = 14

    @field_validator("cors_origins", mode="before")
    @classmethod
    def split_origins(cls, v: object) -> object:
        # Accept either "https://a.com,https://b.com" or a JSON list.
        if isinstance(v, str):
            v = v.strip()
            if v.startswith("["):
                return json.loads(v)
            return [o.strip() for o in v.split(",") if o.strip()]
        return v

    @model_validator(mode="after")
    def check_production(self) -> "Settings":
        if self.environment == "production":
            if self.jwt_secret.startswith("change-me"):
                raise ValueError("JWT_SECRET must be set to a strong random value in production")
            if self.debug:
                raise ValueError("DEBUG must be false in production")
        return self

    @property
    def is_production(self) -> bool:
        return self.environment == "production"


@lru_cache
def get_settings() -> Settings:
    return Settings()
