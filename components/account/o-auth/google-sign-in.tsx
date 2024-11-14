import { FC, useEffect, useRef, useCallback, useState } from "react";
import Script from "next/script";
import { GsiButtonConfiguration } from "@/types/gsiButtonConfiguration";

type Props = {
  handleSignIn: React.Dispatch<any>;
  clientId: string;
  type: "sign_in" | "sign_up";
};

export const GoogleSignInButton: FC<Props> = (props) => {
  const { handleSignIn, clientId, type } = props;
  const googleSignInButton = useRef<HTMLDivElement>(null);
  const [gsiScriptLoaded, setGsiScriptLoaded] = useState(false);

  const loadScript = useCallback(() => {
    if (!googleSignInButton.current || gsiScriptLoaded) return;

    window?.google?.accounts.id.initialize({
      client_id: clientId,
      callback: handleSignIn,
    });

    try {
      window?.google?.accounts.id.renderButton(
        googleSignInButton.current,
        {
          type: "standard",
          theme: "outline", // ou "filled_black"
          size: "large",
          width: '100%',
          logo_alignment: "center",
          text: type === "sign_in" ? "signin_with" : "signup_with",
        } as GsiButtonConfiguration
      );
    } catch (err) {
      console.error(err);
    }

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
      <Script src="https://accounts.google.com/gsi/client" async defer onLoad={loadScript} />
      <div
        className="flex w-full justify-center overflow-hidden rounded bg-custom-background-100"
        id="googleSignInButton"
        ref={googleSignInButton}
        style={{ padding: '4px', borderRadius: '8px' }}
      />
    </>
  );
};