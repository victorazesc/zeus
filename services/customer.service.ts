// services
import { APIService } from "./api.service";
import { API_BASE_URL } from "@/helpers/common.helper";
import { Customer } from "@/types/customer";



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
}
