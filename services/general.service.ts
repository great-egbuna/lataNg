import { $http } from "@/config/$http";
import { ISEARCH } from "@/interfaces/general";

class GeneralService {
  public async searchProducts(payload: ISEARCH, page: number = 1) {
    try {
      const res = await $http.post(`/products/search?page=${page}`, payload);

      return res.data;
    } catch (error: any) {
      console.log("error", error?.response?.data);
      return new Error("An Error Occured while searching");
    }
  }

  async getWallet() {
    try {
      const response = await $http.get("/wallets/me");
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return new Error(
          error.response.data.message || "Failed to fetch wallet"
        );
      }
      return new Error("Wallet fetch failed!");
    }
  }

  async getUserClicks() {
    try {
      const response = await $http.get("/views");
      console.log("clicks response", response.data);
      return response.data;
    } catch (error: any) {
      console.log("error", error?.response?.data);

      if (error.response && error.response.data) {
        return new Error(
          error.response.data.message || "Failed to fetch user clicks"
        );
      }
      return new Error("User clicks fetch failed!");
    }
  }

  async getClicksByMonth(month: number) {
    try {
      // Validate month parameter
      if (!month || isNaN(month) || month < 1 || month > 12) {
        return new Error("Month must be a number between 1 and 12");
      }

      const response = await $http.get(`/views/month/${month}`);
      console.log("clicks by month response", response.data);
      return response.data;
    } catch (error: any) {
      console.log("error", error?.response?.data);

      if (error.response && error.response.data) {
        return new Error(
          error.response.data.message || "Failed to fetch clicks by month"
        );
      }
      return new Error("Clicks by month fetch failed!");
    }
  }
}

export const generalService = new GeneralService();
