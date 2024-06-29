import { API_BASE_URL } from "@/helpers/common.helper";
import { APIService } from "./api.service";

export class FileService extends APIService {
    constructor() {
        super(API_BASE_URL);
      }
    
    async uploadUserFile(files: FormData): Promise<any> {
        return await this.post("api/users/file-assets", files)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data;
            });
    }
}

