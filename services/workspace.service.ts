// services
import { User } from "@prisma/client";
import { APIService } from "./api.service";
import { IWorkspace } from "@/types/workspace";



export class WorkspaceService extends APIService {

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
    async userWorkspaces(): Promise<IWorkspace[]> {
        return this.get("/api/users/me/workspaces/")
          .then((response) => response?.data)
          .catch((error) => {
            throw error?.response?.data;
          });
      }
}
