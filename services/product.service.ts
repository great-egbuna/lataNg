import { base_url } from "@/constants/env";
import { $http } from "@/config/$http";
import { prodApi } from "@/constants/backend_api";
import { ICreateProduct } from "@/interfaces/product";

interface IGetProductsByCategory {
  categoryId?: string;
  page?: number;
  limit?: number;
  /* For My Products */
  tab?: string;
}

interface SaveProductResponse {
  message: string;
  userData: any; // Type this according to your actual user data structure
}

class ProductService {
  public async store(payload: ICreateProduct) {
    try {
      const res = await $http.post(`/products`, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data.message;
    } catch (error: any) {
      console.log("error", JSON.stringify(error?.response?.data));
      return new Error("Failed to create product");
    }
  }

  public async update(payload: ICreateProduct, id: string) {
    try {
      const res = await $http.put(`/products/${id}`, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data.message;
    } catch (error: any) {
      console.log("error", error?.response?.data);
      return new Error("Failed to update product");
    }
  }

  public async delete(id: string) {
    try {
      const res = await $http.delete(`/products/${id}`);

      return res.data.message;
    } catch (error: any) {
      console.log("error", error?.response?.data);
      return new Error("Failed to delete product");
    }
  }

  public async getTrendingProducts() {
    try {
      const res = await $http.get(
        "https://lata-main-backend.azurewebsites.net/v1/products/trending"
      );
      return res.data;
    } catch (error) {
      console.log("error", JSON.stringify(error?.response?.data));
      return new Error("Something went wrong");
    }
  }

  public async getProductsByCategory({
    categoryId = "58abe3ac-ac93-4257-97fe-a46e786ea1dc",
    page = 1,
    limit = 11,
  }: IGetProductsByCategory) {
    try {
      const res = await $http.get(
        `${prodApi}/products?category=${categoryId}&page=${page}&limit=${limit}`
      );

      return res.data;
    } catch (error: any) {
      console.log("error", JSON.stringify(error?.response?.data));
      return new Error("Something went wrong");
    }
  }

  public async getMyProducts({ page = 1, tab }: IGetProductsByCategory) {
    try {
      const res = await $http.get(
        `/products/my?page=${page}&limit=11&tab=${tab || "active"}`
      );

      console.log("res", res.data);

      return res.data;
    } catch (error: any) {
      console.log(" The  error", JSON.stringify(error?.response?.data));
      return new Error("Something went wrong");
    }
  }

  async saveProduct(
    productId: string | number
  ): Promise<SaveProductResponse | Error> {
    try {
      const response = await $http.get<SaveProductResponse>(
        `/products/save/${productId}`
      );

      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        if (error.response.data.message === "Product already saved!") {
          return new Error("You have already saved this product");
        } else if (
          error.response.data.message === "You can not save your own product!"
        ) {
          return new Error("You cannot save your own product");
        }

        return new Error(
          error.response.data.message || "Failed to save product"
        );
      }

      throw new Error(
        "Unable to connect to the server. Please try again later."
      );
    }
  }

  async getSavedProducts(page: number = 1, limit: number = 10) {
    try {
      const response = await $http.get(
        `${prodApi}/products/saved?page=${page}&limit=${limit}`
      );

      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return new Error(
          error.response.data.message || "Failed to get saved products"
        );
      }
      return new Error("Failed to get saved products!");
    }
  }

  async unsaveProduct(productId: string | number) {
    try {
      const response = await $http.get(`/products/un-save/${productId}`);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return new Error(
          error.response.data.message || "Failed to unsave product"
        );
      }
      return new Error("Failed to unsave product!");
    }
  }

  async getProductFeedbacks(productId: string) {
    try {
      const response = await $http.get(`/feedbacks/product/${productId}`);
      return response.data;
    } catch (error: any) {
      console.log("error", JSON.stringify(error?.response?.data));
      return new Error("Failed to get product feedbacks");
    }
  }

  public async getProductById(id: string) {
    try {
      const response = await $http.get(`/products/${id}`);
      return response?.data;
    } catch (error) {
      console.log("error", JSON.stringify(error?.response?.data));
      return new Error("Failed to get product");
    }
  }
}

export const productService = new ProductService();
