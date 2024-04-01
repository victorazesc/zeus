import { NextResponse } from "next/server";
import transporter from "../nodemailer";
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