// services
import { User } from "@prisma/client";
import { APIService } from "./api.service";



export class UserService extends APIService {

    async currentUser(): Promise<User> {
        return this.get("/api/users/me/")
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response;
            });
    }

    async updateMe(data: any): Promise<any> {
        return this.patch("/api/users/me/", data)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data;
            });
    }
}
