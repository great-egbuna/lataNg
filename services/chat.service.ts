import { $http } from "@/config/$http";

class ChatService {
  async initiateChat(data: {
    message: string;
    productId?: string | number;
    receiverId?: string | number;
    senderId?: string | number;
  }) {
    try {
      const response = await $http.post("/chats", data);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return new Error(
          error.response.data.message || "Failed to initiate chat"
        );
      }
      return new Error("Error while creating chat");
    }
  }
}

export const chatService = new ChatService();
