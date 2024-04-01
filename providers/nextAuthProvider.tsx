"use client";
import { SessionProvider } from "next-auth/react";
import { useEffect, useState } from 'react';

type Props = {
    children?: React.ReactNode;
};

export const NextAuthProvider = ({ children }: Props) => {

    const [session, setSession] = useState(null);

    useEffect(() => {
        const fetchSession = async () => {
            const res = await fetch('/api/auth/session');
            const data = await res.json();
            if (data?.user?.isSocialAuth) {
                document.cookie = `last-google-account=${JSON.stringify({ name: data?.user?.name?.split(' ')[0] ?? "", email: data.user.email, avatar: data.user.avatar })}`
            }
            setSession(data);
        };

        fetchSession();
    }, []);

    return <SessionProvider>
        {children}
    </SessionProvider>
};


