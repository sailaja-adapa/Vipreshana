const signUpMailTemplate = ({
    email,
    name,
    subject,
}) => {
    return {
        to: email,
        subject: subject,
        html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Welcome to Vipreshana</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        width: 100%;
                        padding: 20px;
                        background-color: #f4f4f4;
                    }
                    .content {
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #ffffff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        text-align: center;
                    }
                    h1 {
                        color: #333333;
                    }
                    p {
                        color: #666666;
                    }
                    .button {
                        display: inline-block;
                        padding: 10px 20px;
                        margin-top: 20px;
                        background-color: #28a745;
                        color: #ffffff;
                        text-decoration: none;
                        border-radius: 5px;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 20px;
                        color: #999999;
                        font-size: 12px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="content">
                        <h1>Welcome to Vipreshana! 🚚</h1>
                        <p>Dear ${name},</p>
                        <p>Thank you for joining <strong>Vipreshana</strong> – your smart and efficient goods transportation platform.</p>
                        <p>With Vipreshana, you can:</p>
                        <ul style="text-align: left;">
                            <li>📍 Track your goods in real-time.</li>
                            <li>📦 Get regular delivery status updates.</li>
                            <li>💬 Communicate seamlessly with verified drivers.</li>
                            <li>🤝 Ensure trust and safety in every delivery.</li>
                        </ul>
                        <p>We’re excited to help you move your goods securely and reliably.</p>
                        <a href="https://vipreshana-2.vercel.app/" class="button">Start Shipping</a>
                        <div class="footer">
                            <p>&copy; 2025 Vipreshana. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </body>
            </html>`,
    }
}

module.exports = signUpMailTemplate;