"use client";
import { UserDetails } from "@/components/onboarding/UserDetails";
import { Worskspace } from "@/components/onboarding/Workspace";
import { JoinWorkspaces } from "@/components/onboarding/joinWorkspace";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/circular-spinner";
import useUserAuth from "@/hooks/use-user-auth";
import { WorkspaceCreateSchema } from "@/lib/validations/workspace";
import { WorkspaceService } from "@/services/workspace.service";
import { NextPageWithLayout } from "@/types/types";
import { SessionContextValue, TOnboardingSteps } from "@/types/user";
import { User } from "@prisma/client";
import { observer } from "mobx-react-lite";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useSWR from 'swr';
import { z } from "zod";

const workspaceService = new WorkspaceService()

const OnboardingPage: NextPageWithLayout = observer(() => {
// export default function Page() {
    const { status, data } = useSession() as SessionContextValue

    const [step, setStep] = useState<number | null>(null);
    const { data: workspaces } = useSWR(`USER_WORKSPACES_LIST`, async () => (await workspaceService.userWorkspaces()), {
        shouldRetryOnError: false,
    });
    const workspacesList = Object.values(workspaces ?? {});

    const {
        handleSubmit,
        control,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<z.infer<typeof WorkspaceCreateSchema>>({
        defaultValues: {
            name: "",
            slug: "",
        },
        mode: "onChange",
    });

    const stepChange = async (steps: Partial<TOnboardingSteps>) => {
        if (!data?.user) return;

        const payload: Partial<User> = {
            onboardingStep: data.user.onboardingStep
        };

        // await updateCurrentUser(payload);
    };

    const finishOnboarding = async () => {
        if (!data?.user) return;
    };

    const { } = useUserAuth({ routeAuth: "onboarding", user: data?.user, isLoading: status === 'loading' });
    useEffect(() => {
        const handleStepChange = async () => {
            if (!data?.user) return;

            const onboardingStep = data.user.onboardingStep as any
            if (
                !onboardingStep?.workspace_join &&
                !onboardingStep?.workspace_create &&
                workspacesList &&
                workspacesList?.length > 0
            ) {
                // await updateCurrentUser({
                //     onboarding_step: {
                //         ...user.onboarding_step,
                //         workspace_join: true,
                //         workspace_create: true,
                //     },
                //     last_workspace_id: workspacesList[0]?.id,
                // });
                setStep(2);
                return;
            }

            if (!onboardingStep.workspace_join && !onboardingStep.workspace_create && step !== 1) setStep(1);

            if (onboardingStep.workspace_join || onboardingStep.workspace_create) {
                if (!onboardingStep.profile_complete && step !== 2) setStep(2);
            }
            if (
                onboardingStep.profile_complete &&
                (onboardingStep.workspace_join || onboardingStep.workspace_create) &&
                !onboardingStep.workspace_invite &&
                step !== 3
            )
                setStep(3);
        };
        handleStepChange();
    }, [data?.user, step, workspacesList]);

    if (!data?.user) {
        redirect('/sign-in')
    }

    if (data.user.isOnbordered) {
        redirect('/')
    }
    return (
        <>
            <section className="h-full overflow-auto rounded-t-md bg-custom-background-90 px-0 pb-56 md:px-7">
                {data.user && step !== null && workspaces ? (<>
                    <div className="absolute top-12 right-36 text-white"><Button onClick={() => { signOut() }}>sair</Button></div>
                    <div className="flex w-full">
                        {step === 1 ? (
                            <JoinWorkspaces
                                setTryDiffAccount={() => {
                                }}
                                finishOnboarding={finishOnboarding}
                                stepChange={stepChange}
                            />
                        ) : step === 2 ? (
                            <UserDetails setUserName={(value) => setValue("name", value)} user={data.user} workspacesList={workspacesList} />
                        ) : (
                            <Worskspace finishOnboarding={function (): Promise<void> {
                                throw new Error("Function not implemented.");
                            }} stepChange={function (steps: Partial<TOnboardingSteps>): Promise<void> {
                                throw new Error("Function not implemented.");
                            }} setTryDiffAccount={function (): void {
                                throw new Error("Function not implemented.");
                            }} />
                        )}
                    </div>
                </>) : (
                    <div className="grid fixed bg-white top-0 left-0 right-0 h-screen place-items-center">
                        <Spinner />
                    </div>
                )}
            </section>
        </>

    )
})

export default OnboardingPage

// }