import { $http } from "@/config/$http";

interface Reel {
  title: string;
  description?: string;
  video: { uri: string; name: string; type: string };
}

class ReelService {
  async createReel(reel: any) {
    try {
      const response = await $http.post("/reels", reel, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return new Error(error?.response?.data || "Error creating reel");
    }
  }
}

export const reelService = new ReelService();
