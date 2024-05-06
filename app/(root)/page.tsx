"use client"
import useUserAuth from "@/hooks/use-user-auth";
import { SessionContextValue } from "@/types/user";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function Home() {
  const { status, data, update } = useSession() as SessionContextValue

  const { } = useUserAuth({ routeAuth: "onboarding", user: data?.user, isLoading: status === 'loading' });

  return (
    <h1>pagina inicial</h1>
  );
}
