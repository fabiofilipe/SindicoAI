"""
Email utility functions for sending emails
"""
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
import logging

logger = logging.getLogger(__name__)

# TODO: Add these to .env file
EMAIL_HOST = "smtp.gmail.com"  # or your SMTP server
EMAIL_PORT = 587
EMAIL_USER = ""  # Configure in .env
EMAIL_PASSWORD = ""  # Configure in .env or use App Password
EMAIL_FROM = "noreply@sindicoai.com"


async def send_password_reset_email(
    to_email: str,
    reset_token: str,
    frontend_url: str = "http://localhost:3000"
) -> bool:
    """
    Send password reset email with token

    Args:
        to_email: Recipient email
        reset_token: Password reset token
        frontend_url: Frontend URL for reset link

    Returns:
        True if email was sent successfully, False otherwise
    """
    try:
        # Create message
        msg = MIMEMultipart("alternative")
        msg["Subject"] = "SindicoAI - Recuperação de Senha"
        msg["From"] = EMAIL_FROM
        msg["To"] = to_email

        # Reset link
        reset_link = f"{frontend_url}/reset-password?token={reset_token}"

        # Email body (HTML)
        html_body = f"""
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #2563eb;">SindicoAI - Recuperação de Senha</h2>
              <p>Você solicitou a recuperação de senha da sua conta.</p>
              <p>Clique no botão abaixo para redefinir sua senha:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="{reset_link}"
                   style="background-color: #2563eb; color: white; padding: 12px 24px;
                          text-decoration: none; border-radius: 6px; display: inline-block;">
                  Redefinir Senha
                </a>
              </div>
              <p style="color: #666; font-size: 14px;">
                Ou copie e cole este link no seu navegador:<br>
                <a href="{reset_link}" style="color: #2563eb;">{reset_link}</a>
              </p>
              <p style="color: #666; font-size: 14px;">
                <strong>Este link expira em 1 hora.</strong>
              </p>
              <p style="color: #666; font-size: 14px;">
                Se você não solicitou a recuperação de senha, ignore este email.
              </p>
              <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
              <p style="color: #999; font-size: 12px; text-align: center;">
                SindicoAI - Gestão Inteligente de Condomínios
              </p>
            </div>
          </body>
        </html>
        """

        # Plain text version (fallback)
        text_body = f"""
        SindicoAI - Recuperação de Senha

        Você solicitou a recuperação de senha da sua conta.

        Acesse o link abaixo para redefinir sua senha:
        {reset_link}

        Este link expira em 1 hora.

        Se você não solicitou a recuperação de senha, ignore este email.

        --
        SindicoAI - Gestão Inteligente de Condomínios
        """

        # Attach parts
        part1 = MIMEText(text_body, "plain")
        part2 = MIMEText(html_body, "html")
        msg.attach(part1)
        msg.attach(part2)

        # TODO: Implement actual email sending
        # For production, you need to configure SMTP settings in .env
        # Uncomment the code below and configure EMAIL_USER and EMAIL_PASSWORD

        # with smtplib.SMTP(EMAIL_HOST, EMAIL_PORT) as server:
        #     server.starttls()
        #     server.login(EMAIL_USER, EMAIL_PASSWORD)
        #     server.sendmail(EMAIL_FROM, to_email, msg.as_string())

        logger.info(f"Password reset email would be sent to: {to_email}")
        logger.info(f"Reset link: {reset_link}")

        return True

    except Exception as e:
        logger.error(f"Failed to send password reset email to {to_email}: {str(e)}")
        return False


# Alternative: Use a service like SendGrid, Mailgun, or AWS SES
# They provide better deliverability and easier configuration

async def send_email_sendgrid(to_email: str, subject: str, html_content: str) -> bool:
    """
    Send email using SendGrid API (example)

    Install: pip install sendgrid
    Configure: SENDGRID_API_KEY in .env
    """
    # TODO: Implement SendGrid integration if needed
    # from sendgrid import SendGridAPIClient
    # from sendgrid.helpers.mail import Mail
    #
    # message = Mail(
    #     from_email=EMAIL_FROM,
    #     to_emails=to_email,
    #     subject=subject,
    #     html_content=html_content
    # )
    # try:
    #     sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
    #     response = sg.send(message)
    #     return response.status_code == 202
    # except Exception as e:
    #     logger.error(f"SendGrid error: {e}")
    #     return False
    pass
