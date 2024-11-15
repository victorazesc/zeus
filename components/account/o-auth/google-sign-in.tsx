import { FC, useEffect, useRef, useCallback, useState } from "react";
import Script from "next/script";
import { GsiButtonConfiguration } from "@/types/gsiButtonConfiguration";

type Props = {
  handleSignIn: (response: any) => void;
  clientId: string;
  type: "sign_in" | "sign_up";
};

export const GoogleSignInButton: FC<Props> = ({ handleSignIn, clientId, type }) => {
  const googleSignInButton = useRef<HTMLDivElement>(null);
  const [gsiScriptLoaded, setGsiScriptLoaded] = useState(false);

  const loadScript = useCallback(() => {
    if (!googleSignInButton.current || gsiScriptLoaded) return;

    // Inicializa o Google ID
    window?.google?.accounts.id.initialize({
      client_id: clientId,
      callback: handleSignIn,
      ux_mode: "popup", // Define o modo UX
      auto_select: false, // Seleção automática de contas
      itp_support: true, // Intelligent Tracking Prevention support
    });

    try {
      // Renderiza o botão com as novas configurações
      window?.google?.accounts.id.renderButton(
        googleSignInButton.current,
        {
          type: "standard",
          theme: "outline", // ou "filled_black"
          size: "large",
          logo_alignment: "left",
          text: type === "sign_in" ? "signin_with" : "signup_with",
          width: "100%",
        } as GsiButtonConfiguration
      );
    } catch (err) {
      console.error("Erro ao renderizar o botão Google Sign-In:", err);
    }

    // Mostra o prompt de seleção de conta, se necessário
    window?.google?.accounts.id.prompt();
    setGsiScriptLoaded(true);
  }, [handleSignIn, gsiScriptLoaded, clientId, type]);

  useEffect(() => {
    if (window?.google?.accounts?.id) {
      loadScript();
    }
    return () => {
      window?.google?.accounts.id.cancel();
    };
  }, [loadScript]);

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        async
        defer
        onLoad={loadScript}
      />
      <div
        id="g_id_onload"
        data-client_id={clientId}
        data-context={type}
        data-ux_mode="popup"
        data-auto_select="true"
        data-itp_support="true"
      />
      <div
        className="g_id_signin"
        ref={googleSignInButton}
      />
    </>
  );
};