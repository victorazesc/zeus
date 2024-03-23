"use client";

import SignUpForm from "@/components/forms/siginUpForm";
import SignInForm from "@/components/forms/signInForm";
import SignInFormWithOtp from "@/components/forms/signInFormWithOtp";
import SignInFormWithPassword from "@/components/forms/signInFormWithPassword";

export default function Page() {
    const email = true
    const otp = false
    const password = false
    const signUp = false
    return (
        <section className="h-full overflow-auto rounded-t-md bg-custom-auth-background-100 px-7 pb-56 pt-24 sm:px-0">
            {email && <SignInForm email={""} />}

            {otp && <SignInFormWithOtp email={""} />}

            {password && <SignInFormWithPassword email={""} />}

            {signUp && <SignUpForm email={""} />}

        </section>
    )
}
