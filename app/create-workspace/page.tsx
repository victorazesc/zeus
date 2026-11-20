"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { WorkspaceCreateSchema } from "@/lib/validations/workspace";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useWorkspace } from "@/hooks/stores/use-workspace";
import { useUser } from "@/hooks/stores/use-user";
import { Spinner } from "@/components/ui/circular-spinner";
import { WorkspaceService } from "@/services/workspace.service";

const workspaceService = new WorkspaceService();

type WorkspaceCreateFormData = z.infer<typeof WorkspaceCreateSchema>;

const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export default function CreateWorkspacePage() {
  const router = useRouter();
  const { currentUser, updateCurrentUser } = useUser();
  const { createWorkspace, fetchWorkspaces } = useWorkspace();

  const [isSlugChecking, setIsSlugChecking] = useState(false);
  const [isSlugAvailable, setIsSlugAvailable] = useState<boolean | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<WorkspaceCreateFormData>({
    resolver: zodResolver(WorkspaceCreateSchema),
    defaultValues: {
      name: "",
      tradeName: "",
      slug: "",
      document: "",
      ie: "",
    },
  });

  const nameValue = watch("name");
  const slugValue = watch("slug");

  useEffect(() => {
    setIsSlugAvailable(null);
  }, [slugValue]);

  const slugDirty = !!dirtyFields.slug;

  useEffect(() => {
    if (!nameValue) {
      return;
    }
    if (!slugDirty) {
      setValue("slug", slugify(nameValue));
      setIsSlugAvailable(null);
    }
  }, [nameValue, setValue, slugDirty]);

  const handleSlugBlur = async () => {
    if (!slugValue) return;
    setIsSlugChecking(true);
    try {
      const response = await workspaceService.workspaceSlugCheck(slugValue);
      const available = Boolean(response?.status);
      setIsSlugAvailable(available);
      if (!available) {
        toast.error("Slug indisponível", {
          description: "Escolha outro identificador para o workspace.",
        });
      }
    } catch (error: any) {
      setIsSlugAvailable(null);
      toast.error("Não foi possível verificar o slug", {
        description: error?.message ?? "Tente novamente em instantes.",
      });
    } finally {
      setIsSlugChecking(false);
    }
  };

  const onSubmit = async (data: WorkspaceCreateFormData) => {
    try {
      const response = await createWorkspace(data);

      toast.success("Workspace criado com sucesso!");

      await fetchWorkspaces();
      await updateCurrentUser({ lastWorkspaceId: response.id });

      router.push(`/${response.slug}`);
    } catch (error: any) {
      toast.error("Erro ao criar workspace", {
        description:
          error?.message ?? "Ocorreu um erro inesperado. Tente novamente.",
      });
    }
  };

  if (!currentUser) {
    return (
      <div className="grid h-screen place-items-center bg-custom-background-100 p-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-custom-background-90 text-custom-text-100">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-10">
        <div>
          <h1 className="text-2xl font-semibold">Criar novo workspace</h1>
          <p className="text-sm text-custom-text-300">
            Cadastre um novo espaço de trabalho para gerenciar clientes, produtos e vendas.
          </p>
        </div>

        <form
          className="space-y-6 rounded-lg border border-custom-border-200 bg-custom-background-100 p-6 shadow-custom-shadow-sm"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Razão social *</Label>
              <Input
                id="name"
                placeholder="Ex.: Zeus LTDA"
                {...register("name")}
              />
              {errors.name && (
                <span className="text-xs text-red-400">{errors.name.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="tradeName">Nome fantasia *</Label>
              <Input
                id="tradeName"
                placeholder="Ex.: Zeus Sistemas"
                {...register("tradeName")}
              />
              {errors.tradeName && (
                <span className="text-xs text-red-400">
                  {errors.tradeName.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="document">CNPJ *</Label>
              <Input
                id="document"
                placeholder="Digite o CNPJ"
                {...register("document")}
              />
              {errors.document && (
                <span className="text-xs text-red-400">
                  {errors.document.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="ie">Inscrição estadual</Label>
              <Input id="ie" placeholder="Opcional" {...register("ie")} />
              {errors.ie && (
                <span className="text-xs text-red-400">{errors.ie.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <Label htmlFor="slug">Slug (URL) *</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="slug"
                  placeholder="minha-empresa"
                  {...register("slug")}
                  onBlur={handleSlugBlur}
                />
                {isSlugChecking && <Spinner width="18" height="18" />}
              </div>
              {isSlugAvailable === false && (
                <span className="text-xs text-red-400">
                  Já existe um workspace com esse endereço.
                </span>
              )}
              {isSlugAvailable && (
                <span className="text-xs text-green-400">
                  Esse slug está disponível.
                </span>
              )}
              {errors.slug && (
                <span className="text-xs text-red-400">{errors.slug.message}</span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || isSlugChecking}>
              {isSubmitting ? "Criando..." : "Criar workspace"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
