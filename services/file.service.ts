// services
import { User } from "@prisma/client";
import { APIService } from "./api.service";
import { useUploadThing } from "@/lib/uploadthing";

const { startUpload } = useUploadThing("media");

export class FileService extends APIService {


    async uploadUserFile(file: FormData): Promise<any> {
        return startUpload(file)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data;
            });
    }
}
