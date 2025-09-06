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
        return new Error(
          error.response.data?.message || "Failed to fetch notifications"
        );
      }
      return new Error("Notifications failed to fetch!");
    }
  }

  async markAsRead() {
    try {
      await $http.put("/notifications/read-all");
    } catch (error) {
      return new Error(`Error: ${error?.response?.data}`);
    }
  }

  async markAsReadSingle(id: string) {
    try {
      await $http.put(`/notifications/read/${id}`);
    } catch (error) {
      return new Error(`Error: ${error?.response?.data}`);
    }
  }
}

export const notificationService = new NotificationService();
