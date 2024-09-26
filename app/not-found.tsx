"use client"

import { useRouter } from "next/navigation";
import Image from "next/image"
import { Button } from "@/components/ui/button";

export default function Custom404() {
  const route = useRouter()
  const home = () => {
    route.back()
  }
  return (
    <div className="mt-52 text-center">
      <div className="relative mx-auto h-60 w-60 lg:h-80 lg:w-80">
        <Image src={'/404.svg'} layout="fill" alt="404- Page not found" />
      </div>
      <div className="flex flex-col gap-3 mt-24">
        <h1 className="text-3xl">404 - Página Não Encontrada</h1>
        <p>Oops! A página que você está procurando não existe.</p>
        <div>

          <Button onClick={home}>
            Voltar para a página inicial
          </Button>
        </div>
      </div>

    </div>
  );
}