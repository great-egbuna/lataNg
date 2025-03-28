import { $http } from "@/config/$http";

class FeedbackService {
  async getFeedbacks(params: {
    page?: number;
    limit?: number;
    type: "SUPPORT" | "PRODUCT";
    tab?: "sent" | "received";
  }) {
    try {
      const response = await $http.get("/feedbacks", { params });
      return response.data;
    } catch (error: any) {
      return new Error(
        error?.response?.data?.message || "Failed to fetch feedbacks"
      );
    }
  }

  async messageLata(message: string) {
    try {
      const response = await $http.post("/feedbacks/message-lata", { message });
      return response.data;
    } catch (error: any) {
      return new Error(
        error?.response?.data?.message || "Failed to send message"
      );
    }
  }
}

export const feedbackService = new FeedbackService();
