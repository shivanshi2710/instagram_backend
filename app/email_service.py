import smtplib

from email.message import EmailMessage


EMAIL_ADDRESS = "shivanshishri2710@gmail.com"
EMAIL_PASSWORD = "mmgmnyyyiwmzgaqu"


def send_signup_email(email, name):

    message = EmailMessage()

    message["Subject"] = "Welcome to Instagram Backend"

    message["From"] = EMAIL_ADDRESS

    message["To"] = email

    message.set_content(
        f"""
Hi {name},

Welcome to Instagram Backend!

Your account has been created successfully.

Thank you,
Instagram Backend Team
"""
    )

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
        smtp.login(
            EMAIL_ADDRESS,
            EMAIL_PASSWORD
        )

        smtp.send_message(message)
