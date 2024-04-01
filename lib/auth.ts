import { User } from "@prisma/client";
import { SignJWT, base64url, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcryptjs';

const secretKey = "secret";
const key = new TextEncoder().encode(secretKey);


export async function hashPassword(password: string): Promise<string> {
    try {
        // Gera o salt para hashing
        const salt = await bcrypt.genSalt(10);
        // Gera o hash da senha
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        console.error('Erro ao gerar hash da senha:', error);
        throw new Error('Erro ao gerar hash da senha');
    }
}

export async function comparePasswords(plainPassword: string, hashedPassword: string | null) {
    try {
        if (!hashedPassword) throw new Error
        // Compara a senha fornecida com o hash armazenado
        const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
        return isMatch;
    } catch (error) {
        console.error('Erro ao comparar senhas:', error);
        throw new Error('Erro ao comparar senhas');
    }
}

export async function encrypt(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("3600 min from now")
        .sign(key);
}

export async function decrypt(input: string): Promise<any> {
    const { payload } = await jwtVerify(input, key, {
        algorithms: ["HS256"],
    });
    return payload;
}

export async function magicLogin(user: User) {

    // Create the session
    const expires = new Date(Date.now() + 3600 * 1000);
    const session = await encrypt({ user, expires });

    // Save the session in a cookie
    cookies().set("session", session, { expires, httpOnly: true });
}

export async function login(formData: FormData) {
    // Verify credentials && get the user

    const user = { email: formData.get("email"), name: "John" };

    // Create the session
    const expires = new Date(Date.now() + 3600 * 1000);
    const session = await encrypt({ user, expires });

    // Save the session in a cookie
    cookies().set("session", session, { expires, httpOnly: true });
}

export async function logout() {
    // Destroy the session
    cookies().set("session", "", { expires: new Date(0) });
}

export async function updateSession(request: NextRequest) {
    const session = request.cookies.get("session")?.value;
    if (!session) return;

    // Refresh the session so it doesn't expire
    const parsed = await decrypt(session);

    parsed.expires = new Date(Date.now() + 3600 * 1000);
    const res = NextResponse.next();
    res.cookies.set({
        name: "session",
        value: await encrypt(parsed),
        httpOnly: true,
        expires: parsed.expires,
    });
    //@ts-ignore
    res.headers.append('Authorization', res.cookies.get('session'))
    return res;
}