"use client";
import { UserDetails } from "@/components/onboarding/user-details";
import { Worskspace } from "@/components/onboarding/workspace";
import { JoinWorkspaces } from "@/components/onboarding/join-workspace";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/circular-spinner";
import { useUser } from "@/hooks/stores/use-user";
import useUserAuth from "@/hooks/use-user-auth";
import { WorkspaceCreateSchema } from "@/lib/validations/workspace";
import { WorkspaceService } from "@/services/workspace.service";
import { NextPageWithLayout } from "@/types/types";
import { TOnboardingSteps } from "@/types/user";
import { Prisma, User } from "@prisma/client";
import { observer } from "mobx-react-lite";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useSWR from 'swr';
import { z } from "zod";

const workspaceService = new WorkspaceService()

const OnboardingPage: NextPageWithLayout = observer(() => {
    const { currentUser, currentUserLoader, updateCurrentUser, updateUserOnBoard, signOut } = useUser();
    const user = currentUser ?? undefined;
    const router = useRouter()
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
        if (!user) return;

        const payload: Partial<User> = {
            onboardingStep: {
                ...user.onboardingStep as Prisma.JsonObject,
                ...steps,
            },
        };

        await updateCurrentUser(payload);
    };

    const finishOnboarding = async () => {
        if (!user) return;
    };


    const handleSignOut = async () => {
        await signOut()
            .then(() => {
                router.push("/");
            })


    }

    const { } = useUserAuth({ routeAuth: "onboarding", user, isLoading: currentUserLoader });
    useEffect(() => {
        const handleStepChange = async () => {
            if (!user) return;
            const onboardingStep = user.onboardingStep as any
            // const onboardingStep = {
            //     "profile_complete": true,
            //     "workspace_create": false,
            //     "workspace_join": false,
            //     "workspace_information": false
            // }

            if (
                !onboardingStep.workspace_join &&
                !onboardingStep.workspace_create &&
                workspacesList &&
                workspacesList?.length > 0
            ) {
                await updateCurrentUser({
                    onboardingStep: {
                        ...user.onboardingStep as Prisma.JsonObject,
                        workspace_join: true,
                        workspace_create: true,
                    },
                    lastWorkspaceId: workspacesList[0]?.id,
                });
                setStep(2);
                return;
            }

            if (!onboardingStep.profile_complete && !onboardingStep.workspace_join && !onboardingStep.workspace_create) {
                setStep(1);
            }

            if (!onboardingStep.profile_complete && onboardingStep.workspace_join && onboardingStep.workspace_create && onboardingStep.workspace_information) {
                setStep(1);
            }

            if (onboardingStep.profile_complete && !onboardingStep.workspace_join && !onboardingStep.workspace_create) {
                setStep(2);
            }

            if (onboardingStep.workspace_join || onboardingStep.workspace_create) {
                if (!onboardingStep.workspace_information && !onboardingStep.profile_complete) setStep(1);
                if (onboardingStep.profile_complete && !onboardingStep.workspace_information) setStep(3);
            }

            if (onboardingStep.profile_complete && (onboardingStep.workspace_create || onboardingStep.workspace_join) && onboardingStep.workspace_information) {
                await updateCurrentUser({
                    isOnbordered: true
                });
            }

        };
        handleStepChange();
    }, [user, step, workspacesList]);
    if (!user) {
        redirect('/sign-in')
    }

    if (user.isOnbordered) {
        redirect('/')
    }
    return (
        <>
            <section className="h-full overflow-auto rounded-t-md bg-custom-background-90 px-0 pb-56 md:px-7">
                {user && step !== null && workspaces ? (<>
                    <div className="absolute top-12 right-36 text-white"><Button onClick={handleSignOut}>sair</Button></div>
                    <div className="flex w-full">
                        {step === 1 ? (
                            <UserDetails setUserName={(value) => setValue("name", value)} user={user} workspacesList={workspacesList} />
                        ) : step === 2 ? (
                            <JoinWorkspaces
                                setTryDiffAccount={() => {
                                }}
                                finishOnboarding={finishOnboarding}
                                stepChange={stepChange}
                            />
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