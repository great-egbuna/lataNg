import { $http } from "@/config/$http";

interface CreateFeedbackParams {
  type: "SUPPORT" | "PRODUCT";
  productId?: string;
  transactionId?: string;
  description: string;
  rating?: number;
  sender: string;
  files?: File[];
  userId: string;
}

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

  async getProductFeedback(productId: string) {
    try {
      const res = await $http.get(`/feedbacks/product/${productId}`);

      return res?.data;
    } catch (error) {
      return new Error(
        error?.response?.data?.message || "Failed to fetch product feedback"
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

  async createFeedback(feedbackData: CreateFeedbackParams) {
    try {
      const response = await $http.post("/feedbacks", feedbackData);

      return response.data;
    } catch (error: any) {
      console.log("FeedBackError", error?.response?.data);
      if (error?.response?.data?.isOwnProduct) {
        return {
          success: false,
          isOwnProduct: true,
          message: "You cannot give feedback to your own product",
        };
      }

      return {
        success: false,
        message: error?.response?.data?.message || "Failed to create feedback",
      };
    }
  }
}

export const feedbackService = new FeedbackService();
