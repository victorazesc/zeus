// services
import { Customer } from "@prisma/client";
import { APIService } from "./api.service";
import { API_BASE_URL } from "@/helpers/common.helper";

export class CustomerService extends APIService {
  constructor() {
    super(API_BASE_URL);
  }

  async getCustomers(): Promise<Customer[]> {
    return this.get("/api/customers/")
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response;
      });
  }
  async createCustomer(data: Partial<Customer>) {
    return this.post("/api/customers/", data)
      .then((response) => {
        console.log(response);
        return response?.data;
      })
      .catch((error) => {
        throw error?.response.data;
      });
  }
  async updateCustomer(
    data: Partial<Customer>,
    customerId: number
  ): Promise<Customer> {
    return this.put(`/api/customers/${customerId}`, data)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response.data;
      });
  }
  async deleteCustomer(customerId: number): Promise<Customer> {
    return this.delete(`/api/customers/${customerId}`)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response.data;
      });
  }
}
