"use client"
import { CreateUser } from "@/lib/validations/user";
import { IWorkspace } from "@/types/workspace";
import { Prisma, User } from "@prisma/client";
import { Camera, User2Icon } from "lucide-react";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { UserImageUploadModal } from "../modals/user-image-upload-modal";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { OnboardingSidebar } from "./onboarding-sidebar";
import { OnboardingStepIndicator } from "./step-indicator";
import { useUser } from "@/hooks/stores/use-user";
import { useWorkspace } from "@/hooks/stores/use-workspace";

type Props = {
  user?: User;
  setUserName: (name: string) => void;
  workspacesList: IWorkspace[]
};

const USE_CASES = [
  "Controle de Clientes",
  "Vendas",
  "Controle de estoque",
  "Controle orçamentário",
  "Gestão de negócio"
];

export const UserDetails: React.FC<Props> = observer((props) => {
  const { user, setUserName } = props;

  const [isRemoving, setIsRemoving] = useState(false);
  const [isImageUploadModalOpen, setIsImageUploadModalOpen] = useState(false);

  const { updateCurrentUser } = useUser()
  const { workspaces } = useWorkspace()

  const workspaceName = workspaces ? Object.values(workspaces)?.[0]?.name : "New Workspace";

  const {
    handleSubmit,
    control,
    getValues,
    setValue,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<z.infer<typeof CreateUser>>({
    defaultValues: {
      name: user?.name ?? "",
      avatar: user?.avatar ?? "",
      useCase: user?.useCase ?? ""
    },
    mode: "onChange",
  });

  const onSubmit = async (formData: z.infer<typeof CreateUser>) => {
    if (!user) return;

    const payload: Partial<User> = {
      ...formData,
      name: formData.name,
      onboardingStep: {
        ...user.onboardingStep as Prisma.JsonObject,
        profile_complete: true,
      },
    };

    await updateCurrentUser(payload)
      .then(() => { })
      .catch(() => {
        toast.error("Ah, não! algo deu errado.", {
          description: "Houve um problema com a sua requisição.",
        })
      });
  };
  const handleDelete = async (url: string | null | undefined) => {
    if (!url) return;
    setIsRemoving(true);
    updateCurrentUser({ avatar: "" })
    setValue("avatar", "");
    setIsRemoving(false);
  };
  return (
    <div className="flex h-full w-full space-y-7 overflow-y-auto sm:space-y-10 ">
      <div className="fixed hidden h-full w-1/5 max-w-[320px] lg:block">
        <Controller
          control={control}
          name="name"
          render={({ field: { value } }) => (
            <OnboardingSidebar
              userFullName={value?.length === 0 ? undefined : value}
              showProject
              workspaceName={workspaceName}
            />
          )}
        />
      </div>
      <Controller
        control={control}
        name="avatar"
        render={({ field: { onChange, value } }) => (
          <UserImageUploadModal
            isOpen={isImageUploadModalOpen}
            onClose={() => setIsImageUploadModalOpen(false)}
            isRemoving={isRemoving}
            handleDelete={() => handleDelete(getValues("avatar"))}
            onSuccess={(url) => {
              onChange(url);
              setIsImageUploadModalOpen(false);
            }}
            value={value && value.trim() !== "" ? value : null}
          />
        )}
      />
      <div className="ml-auto flex w-full flex-col justify-between lg:w-4/5 ">
        <div className="mx-auto flex flex-col px-7 pt-3 md:px-0 lg:w-4/5">
          <form onSubmit={handleSubmit(onSubmit)} className="ml-auto  md:w-11/12">
            <div className="flex items-center justify-between">
              <p className="text-xl font-semibold sm:text-2xl">Como podemos chamar você? </p>
              <OnboardingStepIndicator step={1} />
            </div>
            <div className="mt-6 flex w-full ">
              <button type="button" onClick={() => setIsImageUploadModalOpen(true)}>
                {!watch("avatar") || watch("avatar") === "" ? (
                  <div className="relative mr-3 flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-custom-background-70 hover:cursor-pointer">
                    <div className="absolute -right-1 bottom-1 flex h-6 w-6 items-center justify-center rounded-full bg-custom-background-80">
                      <Camera className="h-4 w-4 stroke-custom-text-400" />
                    </div>
                    <User2Icon className="h-10 w-10 stroke-custom-text-400" />
                  </div>
                ) : (
                  <div className="relative mr-3 h-16 w-16 overflow-hidden">
                    <img
                      src={watch("avatar")}
                      className="absolute left-0 top-0 h-full w-full rounded-full object-cover"
                      onClick={() => setIsImageUploadModalOpen(true)}
                      alt={user?.username ?? ""}
                    />
                  </div>
                )}
              </button>

              <div className="flex flex-col gap-1 w-full">
                <div className="my-2 mr-10 flex w-full rounded-md bg-onboarding-background-200 text-sm">
                  <Controller
                    control={control}
                    name="name"
                    render={({ field: { value, onChange, ref } }) => (
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={value}
                        autoFocus
                        onChange={(event) => {
                          setUserName(event.target.value);
                          onChange(event);
                        }}
                        ref={ref}
                        placeholder="Escreva seu nome completo..."
                        className="w-full border-onboarding-border-100 focus:border-custom-primary-100"
                      />
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="mb-10 mt-14">
              <Controller
                control={control}
                name="name"
                render={({ field: { value } }) => (
                  <p className="p-0 text-xl font-medium text-onboarding-text-200 sm:text-2xl">
                    Como você pretende utilizar o Zeus?
                  </p>
                )}
              />

              <p className="my-3 text-sm font-medium text-onboarding-text-300">Escolha uma das alternativas</p>

              <Controller
                control={control}
                name="useCase"
                render={({ field: { value, onChange } }) => (
                  <div className="flex flex-wrap overflow-auto break-all">
                    {USE_CASES.map((useCase) => (
                      <div
                        key={useCase}
                        className={`mb-3 flex-shrink-0 border hover:cursor-pointer hover:bg-onboarding-background-300/30 ${value === useCase ? "border-custom-primary-100" : "border-onboarding-border-100"
                          } mr-3 rounded-sm p-3 text-sm font-medium`}
                        onClick={() => onChange(useCase)}
                      >
                        {useCase}
                      </div>
                    ))}
                  </div>
                )}
              />
            </div>

            <Button type="submit" className="text-white" disabled={!isValid} loading={isSubmitting}>
              Continuar
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
});
