import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import { getMe } from "./user.action";
import { randomUUID } from "crypto";
import { sendWorkspaceInvitationEmail } from "./notify.action";
import { User } from "@prisma/client";

interface CreateInvitationDto {
  email: string;
  role?: string;
}

const COMPLETED_ONBOARDING = {
  profile_complete: true,
  workspace_create: true,
  workspace_information: true,
  workspace_join: true,
};

async function ensureWorkspaceOwnership(
  request: NextRequest,
  workspaceSlug: string
) {
  const currentUser = await getMe(request);

  if (!currentUser?.id) {
    throw new Error("Usuário não autenticado");
  }

  const workspace = await prisma.workspace.findUnique({
    where: { slug: workspaceSlug },
  });

  if (!workspace) {
    throw new Error("Workspace não encontrado");
  }

  if (workspace.ownerId !== currentUser.id) {
    const member = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId: workspace.id,
        userId: currentUser.id,
        role: { in: ["admin", "manager"] },
      },
    });

    if (!member) {
      throw new Error("Acesso ao workspace negado");
    }
  }

  return { currentUser, workspace };
}

async function markUserOnboarded(userId: number, workspaceId?: number | null) {
  const membership = await prisma.workspaceMember.findFirst({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });

  const ownedWorkspace = await prisma.workspace.findFirst({
    where: { ownerId: userId },
    orderBy: { createdAt: "asc" },
  });

  if (!membership && !ownedWorkspace) return;

  const targetWorkspaceId = workspaceId ?? membership?.workspaceId ?? ownedWorkspace?.id ?? null;

  await prisma.user.update({
    where: { id: userId },
    data: {
      isOnbordered: true,
      onboardingStep: COMPLETED_ONBOARDING,
      ...(targetWorkspaceId
        ? {
            lastWorkspaceId: targetWorkspaceId,
          }
        : {}),
    },
  });
}

export async function listWorkspaceInvitations(
  request: NextRequest,
  workspaceSlug: string
) {
  const { workspace } = await ensureWorkspaceOwnership(request, workspaceSlug);

  return prisma.workspaceInvitation.findMany({
    where: { workspaceId: workspace.id },
    orderBy: { createdAt: "desc" },
  });
}

export async function createWorkspaceInvitation(
  request: NextRequest,
  workspaceSlug: string,
  data: CreateInvitationDto
) {
  const { currentUser, workspace } = await ensureWorkspaceOwnership(
    request,
    workspaceSlug
  );

  if (!data.email) {
    throw new Error("E-mail é obrigatório");
  }

  const invitation = await prisma.workspaceInvitation.create({
    data: {
      email: data.email.toLowerCase(),
      role: data.role ?? "collaborator",
      workspaceId: workspace.id,
      invitedById: currentUser.id,
      token: randomUUID(),
      status: "pending",
    },
  });

  const baseUrl = request.nextUrl.origin;
  await sendWorkspaceInvitationEmail({
    email: invitation.email,
    workspaceName: workspace.tradeName ?? workspace.name ?? workspace.slug,
    inviterName: currentUser.name ?? currentUser.email,
    inviteLink: `${baseUrl}/sign-in?invite=${invitation.token}&email=${encodeURIComponent(
      invitation.email
    )}`,
  });

  return invitation;
}

export async function revokeWorkspaceInvitation(
  request: NextRequest,
  workspaceSlug: string,
  invitationId: number
) {
  const { workspace } = await ensureWorkspaceOwnership(request, workspaceSlug);

  const invitation = await prisma.workspaceInvitation.findUnique({
    where: { id: invitationId },
  });

  if (!invitation || invitation.workspaceId !== workspace.id) {
    throw new Error("Convite não encontrado");
  }

  await prisma.workspaceInvitation.update({
    where: { id: invitationId },
    data: {
      status: "revoked",
    },
  });

  return true;
}

export async function acceptPendingInvitationsForUser(user: User) {
  if (!user.email) return;

  const pendingInvitations = await prisma.workspaceInvitation.findMany({
    where: {
      email: user.email.toLowerCase(),
      status: "pending",
    },
    orderBy: { createdAt: "asc" },
  });

  if (!pendingInvitations.length) {
    await markUserOnboarded(user.id, user.lastWorkspaceId);
    return;
  }

  await prisma.$transaction(async (tx) => {
    for (const invitation of pendingInvitations) {
      await tx.workspaceInvitation.update({
        where: { id: invitation.id },
        data: {
          status: "accepted",
          acceptedAt: new Date(),
          acceptedById: user.id,
        },
      });

      await tx.workspaceMember.upsert({
        where: {
          workspaceId_userId: {
            workspaceId: invitation.workspaceId,
            userId: user.id,
          },
        },
        create: {
          workspaceId: invitation.workspaceId,
          userId: user.id,
          role: invitation.role,
        },
        update: {
          role: invitation.role,
        },
      });
    }
  });

  const latestInvitation = pendingInvitations[pendingInvitations.length - 1];
  await markUserOnboarded(user.id, latestInvitation.workspaceId);
}
