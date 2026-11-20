import { NextResponse } from "next/server";
import transporter from "../lib/nodemailer";
import { kv } from "@vercel/kv";
import { base64url } from "jose";
import { User } from "@prisma/client";

export async function sendOtpEmail(email: string) {
    const otp = generateToken()

    const mailOptions = {
        from: `Time Zeus <${process.env.SMTP_USER}>`,
        to: email,
        sender: 'Time Zeus',
        subject: `Seu código de login exclusivo do Zeus é ${otp}`,
        html: `<h1>${otp}</h1>`
    };

    try {
        await transporter.sendMail(mailOptions);
        await kv.set(`otp_${email}`, otp);
        //Todo implementar logica para limites de tentativas
        return NextResponse.json(true)
    } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
        return NextResponse.json(false)
    }
}

export async function sendEmailLink(email: string, url: string) {
    const token = generateToken()
    const link = `reset-password/?token=${token}&email=${email}`
    const mailOptions = {
        from: `Time Zeus <${process.env.SMTP_USER}>`,
        to: email,
        sender: 'Time Zeus',
        subject: `Seu para redefinir a senha `,
        html: `<h1>      <a
        href="${url}/${link}"
        target="_blank"
      >
        <span>Reset password</span></a</h1>`
    };

    try {
        await transporter.sendMail(mailOptions);
        await kv.set(`otp_${email}`, token);
        //Todo implementar logica para limites de tentativas
        return NextResponse.json(true)
    } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
        return NextResponse.json(false)
    }
}

export async function sendWorkspaceInvitationEmail({
    email,
    workspaceName,
    inviterName,
    inviteLink,
}: {
    email: string;
    workspaceName: string;
    inviterName: string;
    inviteLink: string;
}) {
    const mailOptions = {
        from: `Time Zeus <${process.env.SMTP_USER}>`,
        to: email,
        sender: "Time Zeus",
        subject: `${inviterName} convidou você para o workspace ${workspaceName}`,
        html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
          <h2>Olá!</h2>
          <p><strong>${inviterName}</strong> convidou você para colaborar no workspace <strong>${workspaceName}</strong>.</p>
          <p>Para acessar, basta clicar no botão abaixo e entrar com este e-mail:</p>
          <p style="text-align: center; margin: 32px 0;">
            <a href="${inviteLink}"
               style="display: inline-block; padding: 12px 20px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 6px;">
              Acessar workspace
            </a>
          </p>
          <p>Se o botão não funcionar, copie e cole o link a seguir no seu navegador:</p>
          <p style="word-break: break-all;">${inviteLink}</p>
          <p style="margin-top: 32px;">Nos vemos por lá!<br/>Equipe Zeus</p>
        </div>
        `,
    };

    await transporter.sendMail(mailOptions);
}


function generateToken() {
    const randomChars = (length: number) => {
        const characters = 'abcdefghijklmnopqrstuvwxyz';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    };

    const token = `${randomChars(4)}-${randomChars(4)}-${randomChars(4)}`;
    return token;
}
