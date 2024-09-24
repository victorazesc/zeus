import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { getUser, createUser } from './user.action';
import { getTokens } from '@/lib/jwt';
import { comparePasswords } from '@/lib/auth';
import { kv } from '@vercel/kv';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function verifyToken(idToken: string): Promise<TokenPayload | undefined> {
    const ticket = await client.verifyIdToken({
        idToken: idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return payload;
}

export async function oAuth({ medium, credential, clientId }: any) {

    if (medium === 'google') {
        const googleUser = await verifyToken(credential)

        if (!googleUser || typeof googleUser === 'undefined') { throw new Error('') }

        let user = await getUser({ email: googleUser.email })

        if (!user && googleUser.email) {
            const createUserPayload = {
                avatar: googleUser.picture,
                email: googleUser.email,
                name: googleUser.name,
                isSocialAuth: true,
            }
            user = await createUser(createUserPayload)
        }

        if (!user) {
            throw new Error('')
        }

        const { password, ...userWithoutPass } = user;
        const tokens = getTokens(userWithoutPass);
        return tokens
    }



}

export async function signWithPassword({ email, password }: { email?: string, password?: string }) {
    if (!password) return null
    const user = await getUser({ email })
    if (!user) return null

    if (user && await comparePasswords(password, user.password)) {
        const { password, ...userWithoutPass } = user;
        const tokens = getTokens(userWithoutPass);
        return tokens
    } else return null;

}

export async function validateOtpAndSignIn({ email, imputedOTP }: { email: string, imputedOTP?: string }) {
    const cachedOtp = await kv.get(`otp_${email}`);

    if (cachedOtp != imputedOTP) {
        return null
    }
    let user = await getUser({ email })

    if (!user) {
        user = await createUser({ email })
    }

    const { password, ...userWithoutPass } = user;

    await kv.del(`otp_${email}`)
    const tokens = getTokens(userWithoutPass);
    return tokens

}

export async function logout() {
    return true
}