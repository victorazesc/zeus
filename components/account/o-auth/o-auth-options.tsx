import { observer } from "mobx-react-lite";
import { AuthService } from "@/services/auth.service";
import { GoogleSignInButton } from "./google-sign-in";
import { toast } from "sonner";
import { AppConfigService } from "@/services/app_config.service";
import useSWR from "swr";
import { Spinner } from "@/components/ui/circular-spinner";
import { useState } from "react";

type Props = {
  handleSignInRedirection: () => Promise<void>;
  type: "sign_in" | "sign_up";
};

// services
const authService = new AuthService();
const appConfig = new AppConfigService();
export const OAuthOptions: React.FC<Props> = observer((props) => {
  const { handleSignInRedirection, type } = props;
  const [isLoading, setIsLoading] = useState(false);
  // mobx store
  const { data: envConfig } = useSWR("APP_CONFIG", () => appConfig.envConfig());

  const handleGoogleSignIn = async ({ clientId, credential }: any) => {
    try {
      if (clientId && credential) {
        setIsLoading(true);
        const socialAuthPayload = {
          medium: "google",
          credential,
          clientId,
        };
        const response = await authService.socialAuth(socialAuthPayload);

        if (response) await handleSignInRedirection();
        setIsLoading(false);
      } else throw Error("Cant find credentials");
    } catch (error: any) {
      toast.error("Ah, não! algo deu errado.", {
        description: error.message ?? "Houve um problema com a sua requisição.",
      });
    }
  };

  if (isLoading)
    return (
      <div className="grid h-screen fixed top-0 left-0 right-0 place-items-center bg-custom-background-100 p-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <Spinner />
        </div>
      </div>
    );

  return (
    <>
      <div className="mx-auto mt-4 flex items-center sm:w-96">
        <hr className="w-full border-onboarding-border-100" />
        <p className="mx-3 flex-shrink-0 text-center text-sm text-onboarding-text-400">
          Ou continue com
        </p>
        <hr className="w-full border-onboarding-border-100" />
      </div>
      <div className={`mx-auto mt-7 grid gap-4 overflow-hidden sm:w-96`}>
        {envConfig?.google_client_id && (
          <div
            className="flex h-[42px] items-center justify-center !overflow-hidden"
            style={{ colorScheme: "light" }}
          >
            <GoogleSignInButton
              clientId={envConfig?.google_client_id}
              handleSignIn={handleGoogleSignIn}
              type={type}
            />
          </div>
        )}
      </div>
    </>
  );
});
