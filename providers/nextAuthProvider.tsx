"use client";
import { AuthService } from "@/services/auth.service";
import { SessionProvider } from "next-auth/react";
import { useEffect, useState } from 'react';

type Props = {
    children?: React.ReactNode;
};

const authService = new AuthService()

export const NextAuthProvider = ({ children }: Props) => {

    useEffect(() => {
        authService.fetchSession();
    }, []);

    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    )
};


