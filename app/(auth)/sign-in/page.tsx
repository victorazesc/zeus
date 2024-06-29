"use client";
import SignInOptionalSetPasswordForm from "@/components/forms/registerPassword";
import { SignInForm } from "@/components/forms/signInForm";
import SignInFormWithOtp from "@/components/forms/signInFormWithOtp";
import { SignInFormWithPassword } from "@/components/forms/signInFormWithPassword";
import ESignInSteps from "@/constants/enums/signInSteps";
import useSignInRedirection from "@/hooks/use-sign-in-redirection";
import { useRouter } from "next/navigation";
import { useState } from "react";


export default function Page() {
    const route = useRouter()
    const [signInStep, setSignInStep] = useState<ESignInSteps | null>(ESignInSteps.EMAIL);
    const [email, setEmail] = useState("");
    const { handleRedirection } = useSignInRedirection();

    // step 1 submit handler-email verification
    const handleEmailVerification = (isAccessPassword: boolean) => {
        if (!isAccessPassword) setSignInStep(ESignInSteps.UNIQUE_CODE);
        else setSignInStep(ESignInSteps.PASSWORD);
    };

    // step 2 submit handler-unique code sign in
    const handleUniqueCodeSignIn = async (isAccessPassword: boolean) => {
        if (!isAccessPassword) setSignInStep(ESignInSteps.OPTIONAL_SET_PASSWORD);
        else handleRedirection()
    };

    // step 3 submit handler- password sign in
    const handlePasswordSignIn = async () => {
        handleRedirection()
    };


    return (
        <section className="h-full overflow-auto rounded-t-md bg-custom-background-90 px-7 pb-56 pt-24 sm:px-0">

            <>
                {signInStep === ESignInSteps.EMAIL && (
                    <SignInForm onSubmit={handleEmailVerification} updateEmail={setEmail} />
                )}
                {signInStep === ESignInSteps.UNIQUE_CODE && (
                    <SignInFormWithOtp
                        email={email}
                        handleEmailClear={() => {
                            setEmail("");
                            setSignInStep(ESignInSteps.EMAIL);
                        }}
                        onSubmit={handleUniqueCodeSignIn}
                        submitButtonText="Continue"
                    />
                )}

                {signInStep === ESignInSteps.PASSWORD && (
                    <SignInFormWithPassword
                        email={email}
                        handleEmailClear={() => {
                            setEmail("");
                            setSignInStep(ESignInSteps.EMAIL);
                        }}
                        onSubmit={handlePasswordSignIn}
                        handleStepChange={(step) => setSignInStep(step)}
                    />
                )}

                {signInStep === ESignInSteps.USE_UNIQUE_CODE_FROM_PASSWORD && (
                    <SignInFormWithOtp
                        email={email}
                        handleEmailClear={() => {
                            setEmail("");
                            setSignInStep(ESignInSteps.EMAIL);
                        }}
                        onSubmit={handleUniqueCodeSignIn}
                        submitButtonText="Go to workspace"
                    />
                )}

                {signInStep === ESignInSteps.OPTIONAL_SET_PASSWORD && (
                    <SignInOptionalSetPasswordForm email={email} handleSignInRedirection={handleRedirection} />
                )}
            </>
        </section>
    )
}
