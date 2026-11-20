import { APIService } from "./api.service";
import { API_BASE_URL } from "@/helpers/common.helper";
import { IWorkspaceInvitation } from "@/types/workspace";

export class InvitationService extends APIService {
  constructor() {
    super(API_BASE_URL);
  }

  async list(workspaceSlug: string): Promise<IWorkspaceInvitation[]> {
    return this.get(`/api/workspaces/${workspaceSlug}/invitations/`)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response;
      });
  }

  async create(
    workspaceSlug: string,
    data: { email: string; role?: string }
  ): Promise<IWorkspaceInvitation> {
    return this.post(`/api/workspaces/${workspaceSlug}/invitations/`, data)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response;
      });
  }

  async revoke(workspaceSlug: string, invitationId: number): Promise<void> {
    return this.delete(
      `/api/workspaces/${workspaceSlug}/invitations/${invitationId}`
    )
      .then(() => undefined)
      .catch((error) => {
        throw error?.response;
      });
  }
}
