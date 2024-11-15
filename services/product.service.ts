// services
import type { Product } from "@prisma/client";
import { APIService } from "./api.service";
import { API_BASE_URL } from "@/helpers/common.helper";

export class ProductService extends APIService {
  constructor() {
    super(API_BASE_URL);
  }

  async getProducts(): Promise<Product[]> {
    return this.get("/api/products/")
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response;
      });
  }
  async createProduct(data: Partial<Product>): Promise<Product> {
    return this.post("/api/products/", data)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response;
      });
  }
  async updateProduct(
    data: Partial<Product>,
    productId: number
  ): Promise<Product> {
    return this.post(`/api/products/${productId}`, data)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response;
      });
  }

  async deleteProduct(productId: number): Promise<Product> {
    return this.delete(`/api/products/${productId}`)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response.data;
      });
  }
}
