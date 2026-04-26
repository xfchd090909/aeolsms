import nodemailer from 'nodemailer';

export async function handler(event, context) {
    const { subject, fileName, fileSize, longUrl, shortUrl, password } = JSON.parse(event.body);

    // Outlook SMTP 凭证存储在 Netlify 环境变量
    const transporter = nodemailer.createTransport({
        host: 'smtp.office365.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.OUTLOOK_EMAIL,
            pass: process.env.OUTLOOK_PASSWORD
        }
    });

    let emailText = `
标题: ${subject}
文件名: ${fileName}
文件大小: ${fileSize} bytes
文件长链接: ${longUrl}
文件短链接: ${shortUrl}
`;

    if (password) {
        emailText += `文件密码: ${password}`;
    }

    try {
        await transporter.sendMail({
            from: process.env.OUTLOOK_EMAIL,
            to: process.env.OUTLOOK_EMAIL, // 可改为其他收件人
            subject: subject,
            text: emailText
        });
        return { statusCode: 200, body: JSON.stringify({ success: true }) };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ success: false, error: error.message }) };
    }
}
