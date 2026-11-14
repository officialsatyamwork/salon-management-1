import asyncio
import logging
import smtplib
from email.message import EmailMessage

from app.core.config import get_settings

log = logging.getLogger("app.email")

# Last messages sent with the console backend; handy in tests and local dev.
outbox: list[EmailMessage] = []


def _send_smtp(msg: EmailMessage) -> None:
    s = get_settings()
    with smtplib.SMTP(s.smtp_host, s.smtp_port, timeout=15) as smtp:
        if s.smtp_starttls:
            smtp.starttls()
        if s.smtp_user and s.smtp_password:
            smtp.login(s.smtp_user, s.smtp_password)
        smtp.send_message(msg)


async def send_email(to: str, subject: str, body: str) -> None:
    """Send a plain-text email. Failures are logged, never raised to the caller."""
    s = get_settings()
    msg = EmailMessage()
    msg["From"] = s.smtp_from
    msg["To"] = to
    msg["Subject"] = subject
    msg.set_content(body)
    try:
        if s.email_backend == "smtp":
            await asyncio.to_thread(_send_smtp, msg)
        else:
            outbox.append(msg)
            del outbox[:-50]
            log.info("email (console backend) to=%s subject=%s\n%s", to, subject, body)
    except Exception:
        log.exception("Failed to send email to %s", to)


async def send_password_reset(to: str, name: str, token: str) -> None:
    s = get_settings()
    link = f"{s.frontend_url}/reset-password?token={token}"
    await send_email(
        to,
        "Reset your Velura password",
        f"Hi {name},\n\nUse this link to set a new password. It expires in {s.password_reset_ttl_minutes} minutes.\n\n{link}\n\n"
        "If you did not ask for this, you can ignore this email.",
    )


async def send_invite(to: str, name: str, business: str, token: str) -> None:
    s = get_settings()
    link = f"{s.frontend_url}/accept-invite?token={token}"
    await send_email(
        to,
        f"You've been invited to {business} on Velura",
        f"Hi {name},\n\n{business} has added you on Velura. Set your password to get started:\n\n{link}\n\n"
        f"This link expires in {s.invite_ttl_hours} hours.",
    )
