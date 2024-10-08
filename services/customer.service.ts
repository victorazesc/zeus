// services
import { APIService } from "./api.service";
import { API_BASE_URL } from "@/helpers/common.helper";


export class CustomerService extends APIService {
  constructor() {
    super(API_BASE_URL);
  }

  async getCustomers(): Promise<Customer[]> {
    return this.get("/api/customers/")
      .then((response) => {
        return response?.data
      }
      )
      .catch((error) => {
        throw error?.response;
      });
  }
  async createCustomer(data: Partial<Customer>): Promise<Customer> {
    return this.post("/api/customers/", data)
      .then((response) => {
        return response?.data
      }
      )
      .catch((error) => {
        throw error?.response;
      });
  }
  async updateCustomer(data: Partial<Customer>, customerId: number): Promise<Customer> {
    return this.put(`/api/customers/${customerId}`, data)
      .then((response) => {
        return response?.data
      }
      )
      .catch((error) => {
        throw error?.response;
      });
  }
}
