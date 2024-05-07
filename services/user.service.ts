// services
import { User } from "@prisma/client";
import { APIService } from "./api.service";



export class UserService extends APIService {
    deactivateAccount() {
      throw new Error("Method not implemented.");
    }
    updateUser(data: Partial<{ id: number; name: string | null; username: string | null; addressId: number | null; password: string | null; email: string; phone: string | null; avatar: string | null; isOnbordered: boolean; isActive: boolean; isSocialAuth: boolean; isAccessPassword: boolean; role: string | null; lastWorkspaceId: number | null; useCase: string | null; onboardingStep: import(".prisma/client").Prisma.JsonValue; createdAt: Date; }>) {
      throw new Error("Method not implemented.");
    }
    updateUserTourCompleted() {
      throw new Error("Method not implemented.");
    }
    updateUserOnBoard() {
      throw new Error("Method not implemented.");
    }
    currentUserSettings() {
      throw new Error("Method not implemented.");
    }
    currentUserInstanceAdminStatus() {
      throw new Error("Method not implemented.");
    }

    async currentUser(): Promise<User> {
        return this.get("/api/users/me/")
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response;
            });
    }

    async updateMe(data: any): Promise<any> {
        return this.put("/api/users/me/", data)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data;
            });
    }
}
