"use client";

import { ReactElement } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useSWR from "swr";
import { useWorkspace } from "@/hooks/stores/use-workspace";
import AppLayout from "../../app-layout";
import { InvitationService } from "@/services/invitation.service";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/circular-spinner";
import { NextPageWithLayout } from "@/types/types";
import { observer } from "mobx-react";

const invitationSchema = z.object({
  email: z.string().email("Informe um e-mail válido"),
  role: z.enum(["admin", "manager", "collaborator"]).default("collaborator"),
});

type InvitationFormData = z.infer<typeof invitationSchema>;

const invitationService = new InvitationService();

const InvitationsPage: NextPageWithLayout = observer(() => {
  const { currentWorkspace } = useWorkspace();
  const workspaceSlug = currentWorkspace?.slug;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<InvitationFormData>({
    resolver: zodResolver(invitationSchema),
    defaultValues: {
      email: "",
      role: "collaborator",
    },
  });

  const { data, error, isLoading, mutate } = useSWR(
    workspaceSlug ? ["workspace-invitations", workspaceSlug] : null,
    () => invitationService.list(workspaceSlug!)
  );

  const onSubmit = async (formData: InvitationFormData) => {
    if (!workspaceSlug) return;
    try {
      await invitationService.create(workspaceSlug, formData);
      toast.success("Convite enviado!");
      reset({ email: "", role: formData.role });
      mutate();
    } catch (err: any) {
      toast.error("Não foi possível enviar o convite", {
        description:
          err?.data?.error ?? err?.message ?? "Tente novamente mais tarde.",
      });
    }
  };

  const handleRevoke = async (invitationId: number) => {
    if (!workspaceSlug) return;
    try {
      await invitationService.revoke(workspaceSlug, invitationId);
      toast.success("Convite cancelado");
      mutate();
    } catch (err: any) {
      toast.error("Não foi possível cancelar o convite", {
        description:
          err?.data?.error ?? err?.message ?? "Tente novamente mais tarde.",
      });
    }
  };

  if (!currentWorkspace || !workspaceSlug) {
    return (
      <div className="grid h-screen place-items-center bg-custom-background-90">
        <Spinner />
      </div>
    );
  }

  const header = (
    <div className="flex w-full flex-col gap-2">
      <h2 className="text-lg font-semibold">Convites do workspace</h2>
      <p className="text-sm text-custom-text-300">
        Convide novos colaboradores para <strong>{currentWorkspace.name}</strong> e gerencie os convites pendentes.
      </p>
    </div>
  );

  return (
    <AppLayout header={header}>
      <div className="flex h-full flex-col gap-6 p-6">
        <section className="max-w-xl rounded-lg border border-custom-border-200 bg-custom-background-100 p-5 shadow-custom-shadow-sm">
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="nome@empresa.com"
                {...register("email")}
              />
              {errors.email && (
                <span className="text-xs text-red-400">{errors.email.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="role">Função</Label>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value as InvitationFormData["role"])}
                  >
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Selecione o papel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="manager">Gestor</SelectItem>
                      <SelectItem value="collaborator">Colaborador</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.role && (
                <span className="text-xs text-red-400">{errors.role.message}</span>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" type="button" onClick={() => reset()}>
                Limpar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Enviando" : "Enviar convite"}
              </Button>
            </div>
          </form>
        </section>

        <section className="flex-1 rounded-lg border border-custom-border-200 bg-custom-background-100 p-5 shadow-custom-shadow-sm">
          <h3 className="mb-4 text-base font-medium">Convites enviados</h3>
          {isLoading ? (
            <div className="grid h-40 place-items-center">
              <Spinner />
            </div>
          ) : error ? (
            <div className="rounded border border-red-500/50 bg-red-500/10 p-4 text-sm text-red-300">
              Não foi possível carregar os convites.
            </div>
          ) : data && data.length > 0 ? (
            <div className="overflow-hidden rounded border border-custom-border-200">
              <table className="w-full text-sm">
                <thead className="bg-custom-background-90 text-custom-text-300">
                  <tr>
                    <th className="px-4 py-2 text-left">E-mail</th>
                    <th className="px-4 py-2 text-left">Função</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((invitation) => (
                    <tr
                      key={invitation.id}
                      className="border-t border-custom-border-200 text-custom-text-100"
                    >
                      <td className="px-4 py-3">{invitation.email}</td>
                      <td className="px-4 py-3 capitalize">{invitation.role}</td>
                      <td className="px-4 py-3 capitalize">
                        {invitation.status === "pending"
                          ? "Pendente"
                          : invitation.status === "accepted"
                          ? "Aceito"
                          : "Revogado"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {invitation.status === "pending" ? (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => handleRevoke(invitation.id)}
                          >
                            Cancelar
                          </Button>
                        ) : (
                          <span className="text-sm text-custom-text-300">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-custom-text-300">
              Nenhum convite pendente por aqui.
            </p>
          )}
        </section>
      </div>
    </AppLayout>
  );
});

InvitationsPage.getLayout = function getLayout(page: ReactElement) {
  return { page };
};

export default InvitationsPage;
