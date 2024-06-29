// services
import { User } from "@prisma/client";
import { APIService } from "./api.service";
import { IWorkspace, IWorkspaceMemberMe } from "@/types/workspace";
import { API_BASE_URL } from "@/helpers/common.helper";



export class WorkspaceService extends APIService {
    constructor() {
        super(API_BASE_URL);
    }

    async workspaceSlugCheck(slug: string): Promise<any> {
        return this.get(`/api/workspaces/${slug}/check`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data;
            });
    }

    async createWorkspace(data: Partial<IWorkspace>): Promise<IWorkspace> {
        return this.post("/api/workspaces/", data)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data;
            });
    }
    async updateWorkspace(data: Partial<IWorkspace>, id: number | null | undefined): Promise<IWorkspace> {
        return this.put(`/api/workspaces/${id}`, data)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data;
            });
    }
    async userWorkspaces(): Promise<IWorkspace[]> {
        return this.get("/api/users/me/workspaces/")
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data;
            });
    }

    async workspaceMemberMe(workspaceSlug: string): Promise<IWorkspaceMemberMe> {
        return this.get(`/api/workspaces/${workspaceSlug}/workspace-members/me/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response;
            });
    }
}
