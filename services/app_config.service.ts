// services

import { API_BASE_URL } from "@/helpers/common.helper";
import { IAppConfig } from "@/types/app";
import { APIService } from "./api.service";


export class AppConfigService extends APIService {
  constructor() {
    super(API_BASE_URL);
  }

  async envConfig(): Promise<IAppConfig> {
    return this.get("/api/configs/", {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }
}
