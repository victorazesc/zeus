// services
import { User } from "@prisma/client";
import { APIService } from "./api.service";
import { IUserSettings } from "@/types/user";
import { API_BASE_URL } from "@/helpers/common.helper";



export class UserService extends APIService {
  constructor() {
    super(API_BASE_URL);
  }


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

  async currentUserSettings(): Promise<IUserSettings> {
    return this.get("/api/users/me/settings/")
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response;
      });
  }
  currentUserInstanceAdminStatus() {
    throw new Error("Method not implemented.");
  }

  async currentUser(): Promise<User> {
    return this.get("/api/users/me/")
      .then((response) => {
        return response?.data
      }
      )
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

  async getUsers(): Promise<User[]> {
    return this.get("/api/users/")
      .then((response) => {
        return response?.data
      }
      )
      .catch((error) => {
        throw error?.response;
      });
  }
}
