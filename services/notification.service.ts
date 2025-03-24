import { $http } from "@/config/$http";

class NotificationService {
  async getNotifications(page = 1, limit = 10) {
    try {
      const response = await $http.get("/notifications", {
        params: { page, limit },
      });

      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        throw new Error(
          error.response.data.message || "Failed to fetch notifications"
        );
      }
      throw new Error("Notifications failed to fetch!");
    }
  }
}

export const notificationService = new NotificationService();
