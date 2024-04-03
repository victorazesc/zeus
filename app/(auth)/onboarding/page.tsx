"use client";
import { Spinner } from "@/components/ui/circular-spinner"
import { SessionContextValue, TOnboardingSteps } from "@/types/user";
import { signOut, useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { OnboardingSidebar } from "@/components/onboarding/OnboardingSidebar";
import { IWorkspace } from "@/types/workspace";
import { OnboardingStepIndicator } from "@/components/onboarding/StepIndicator";
import { WorkspaceForm } from "@/components/forms/registerWorkspaceForm";
import { z } from "zod";
import { WorkspaceCreateSchema } from "@/lib/validations/workspace";
import { Button } from "@/components/ui/button";
import { Prisma, User } from "@prisma/client";
import { JoinWorkspaces } from "@/components/onboarding/joinWorkspace";
import useSWR from 'swr'
import { WorkspaceService } from "@/services/workspace.service";

const workspaceService = new WorkspaceService()

export default function Page() {

    const { status, data, update } = useSession() as SessionContextValue
    const [step, setStep] = useState<number | null>(2);
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

        // await updateUserOnBoard()
        //     .then(() => {
        //         captureEvent(USER_ONBOARDING_COMPLETED, {
        //             user_role: user.role,
        //             email: user.email,
        //             user_id: user.id,
        //             status: "SUCCESS",
        //         });
        //     })
        //     .catch((error) => {
        //         console.log(error);
        //     });

        // router.replace(`/${workspacesList[0]?.slug}`);
    };

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



    if (status === 'loading') {
        return (<div className="grid fixed bg-white top-0 left-0 right-0 h-screen place-items-center">
            <Spinner />
        </div>)
    }
    else {
        if (!data?.user) {
            redirect('/sign-in')
        }

        if (data.user.isOnbordered) {
            redirect('/')
        }
        return (
            <>
                <div className="absolute top-12 right-36 text-white"><Button onClick={() => { signOut() }}>sair</Button></div>
                <div className="flex w-full">
                    {step === 1 ? (
                        <JoinWorkspaces
                            setTryDiffAccount={() => {
                                // setShowDeleteAccountModal(true);
                            }}
                            finishOnboarding={finishOnboarding}
                            stepChange={stepChange}
                        />
                    ) : step === 2 ? (
                        <h1>user details</h1>
                        // <UserDetails setUserName={(value) => setValue("full_name", value)} user={user} />
                    ) : (
                        <h1>envites</h1>
                        // <InviteMembers
                        //     finishOnboarding={finishOnboarding}
                        //     stepChange={stepChange}
                        //     user={user}
                        //     workspace={workspacesList?.[0]}
                        // />
                    )}
                    {/* {step == 1 && <JoinWorkspaces
                        setTryDiffAccount={() => {
                            // setShowDeleteAccountModal(true);
                        }}
                        finishOnboarding={finishOnboarding}
                        stepChange={stepChange}
                    />} */}

                    {/* <div className="fixed hidden h-full w-1/5 max-w-[320px] lg:block">
                        <Controller
                            control={control}
                            name="name"
                            render={({ field: { value } }) => (
                                <OnboardingSidebar
                                    watch={watch}
                                    setValue={setValue}
                                    control={control}
                                    showProject={false}
                                    workspaceName={value.length > 0 ? value : "New Workspace"}
                                />
                            )}
                        />
                    </div>
                    <div className="ml-auto w-full lg:w-2/3 ">
                        <div className="mx-auto my-16 w-full px-7 lg:w-4/5 lg:px-0">
                            <div className="flex items-center justify-between">
                                <p className="text-xl font-semibold text-onboarding-text-200 sm:text-2xl">De um nome para seu espaço de trabalho?</p>
                                <OnboardingStepIndicator step={1} />
                            </div>
                            <WorkspaceForm
                                user={data.user ?? undefined}
                                control={control}
                                handleSubmit={handleSubmit}
                                setValue={setValue}
                                errors={errors}
                                isSubmitting={isSubmitting}
                            />
                        </div>
                    </div> */}
                </div>
            </>

        )
    }

}