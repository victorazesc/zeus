import nodemailer from 'nodemailer';

// Configuração de transporte
const transporter = nodemailer.createTransport({

    host: process.env.SMTP_HOST,
    requireTLS: true,
    port: Number(process.env.SMTP_PORT),
    auth: {
        user: process.env.SMTP_USER,
        pass:  process.env.SMTP_PASS,
    },
});

export default transporter;