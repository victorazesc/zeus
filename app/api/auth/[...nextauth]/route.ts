import NextAuth, { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { signWithPassword, validadeOtpAndSingIn } from "@/lib/actions/user.action";
import GoogleProvider from "next-auth/providers/google";
import { User } from "@prisma/client";

const nextAuthOptions: AuthOptions = {
    providers: [

        GoogleProvider({
            id: 'google',
            clientId: process.env.GOOGLE_CLIENT_ID ?? '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ''
        }),
        CredentialsProvider({
            id: 'auth-magic',
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "text", placeholder: "Digite o seu e-mail" },
                magicToken: { label: "magic-token", type: "text", placeholder: "Digite o token" },
            },
            //@ts-ignore
            async authorize(credentials, req): Promise<User | null> {
                try {
                    const result: User | any = await validadeOtpAndSingIn({ email: credentials?.email, inputedOtp: credentials?.magicToken })


                    if (!result) {
                        throw new Error('Seu código de login está incorreto. Por favor, tente novamente.')
                    }

                    return result
                } catch (error: Error | any) {
                    throw new Error(error.message ?? error);
                }

            }
        }),
        CredentialsProvider({
            id: 'auth-tidi',
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "text", placeholder: "Digite o seu e-mail" },
                password: { label: "Password", type: "password", placeholder: "Digite a sua senha" }
            },
            //@ts-ignore
            async authorize(credentials, req): Promise<User | null> {
                try {
                    const result: User | any = await signWithPassword({ email: credentials?.email, sendedPassword: credentials?.password })

                    if (!result) {
                        throw new Error('Desculpe, não foi possível encontrar um usuário com as credenciais fornecidas. Tente novamente.')
                    }

                    return result
                } catch (error: Error | any) {
                    throw new Error(error.message ?? error);
                }


            }
        })
    ],
    secret: process.env.SECRET,
    callbacks: {
        async signIn({ user, account, profile, email, credentials }: any) {
            return user
        },
        //@ts-ignore
        async jwt({ token, user, trigger, session }) {
            if (trigger === "update") {
                return { ...token, ...session.user };
            }
            return { ...token, ...user };
        },
        //@ts-ignore
        async session({ session, token }) {
            session.user = token as any;
            return session;
        },
    }

}

const handler = NextAuth(nextAuthOptions)

export { handler as GET, handler as POST }