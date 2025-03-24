import { $http } from "@/config/$http";

class SubscriptionService {
  async getSubscriptions() {
    try {
      const response = await $http.get("/subscriptions");
      return response.data;
    } catch (error: any) {
      console.log("error", error?.response?.data);

      if (error.response && error.response.data) {
        return new Error(
          error.response.data.message || "Subscriptions failed to fetch!"
        );
      }
      return new Error("Subscriptions failed to fetch!");
    }
  }
}

export const subscriptionService = new SubscriptionService();
