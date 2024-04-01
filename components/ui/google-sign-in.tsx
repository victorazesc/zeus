import { FC, useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { getCookie } from "@/lib/utils";
import { Button } from "./button";

interface IGoogleSignInAccount {
  avatar: string
  name: string
  email: string
}

export const GoogleSignInButton: FC = () => {

  const [googleAccount, setGoogleAccount] = useState<IGoogleSignInAccount | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleClick = async () => {
    setIsLoading(true)
    await signIn('google')

  }

  useEffect(() => {
    if (getCookie('last-google-account')) {
      setGoogleAccount(JSON.parse(getCookie('last-google-account')));
    }
  }, []);

  return (
    <>


      {googleAccount ?
        <Button onClick={handleClick} loading={isLoading} size={'lg'} variant={'outline'} className="w-full flex gap-2 px-2">
          <img className="w-6 h-6 rounded-full" src={googleAccount?.avatar} loading="lazy" alt="google logo" />
          <div className="w-full flex flex-col text-xs ">
            <span className="flex font-bold">Fazer login como {googleAccount.name}</span>
            <span className="flex">{googleAccount.email}</span>
          </div>
        </Button>
        :
        <Button onClick={handleClick} loading={isLoading} size={'lg'} variant={'outline'} className="w-full flex gap-2 px-2">
          <img className="w-6 h-6" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo" />
          <span className="w-full -ml-10">Entrar com o Google</span>
        </Button>
      }
    </>
  );
};
