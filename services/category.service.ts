import { $http } from "@/config/$http";
import { prodApi } from "@/constants/backend_api";

class CategoryService {
  public async getCategories() {
    try {
      const res = await $http.get(`${prodApi}/categories`);

      return res.data;
    } catch (error: any) {
      console.log(error?.response.data);
    }
  }

  public async getSubCategories() {
    try {
      const res = await $http.get(`${prodApi}/sub-categories`);

      return res.data;
    } catch (error: any) {
      console.log(error?.response.data);
    }
  }
}

export const categoryService = new CategoryService();
