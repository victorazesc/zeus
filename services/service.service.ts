// services
import { APIService } from "./api.service";
import { API_BASE_URL } from "@/helpers/common.helper";

export class ServiceService extends APIService {
  constructor() {
    super(API_BASE_URL);
  }

  async getServices(): Promise<Service[]> {
    return this.get("/api/services/")
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response;
      });
  }
  async createService(data: Partial<Service>): Promise<Service> {
    return this.post("/api/services/", data)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response;
      });
  }
  async updateService(
    data: Partial<Service>,
    serviceId: number
  ): Promise<Service> {
    return this.put(`/api/services/${serviceId}`, data)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response.data;
      });
  }
  async deleteService(serviceId: number): Promise<Service> {
    return this.delete(`/api/services/${serviceId}`)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response.data;
      });
  }
}
