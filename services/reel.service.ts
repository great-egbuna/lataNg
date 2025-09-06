import { $http } from "@/config/$http";

interface Reel {
  title: string;
  description?: string;
  video: { uri: string; name: string; type: string };
}

const newDeploymentUrl = `https://lata-api.go2.ng/v1`;

class ReelService {
  async getReels() {
    try {
      const response = await $http.get(`${newDeploymentUrl}/reels`);
      const reels = (response.data.reels as any[])?.reduce(
        (accumulatedValue, currentValue) => {
          const currentReels = currentValue.reels || [];
          const currentReelsLastReel = currentReels[0];
          const previousReel = accumulatedValue[0]?.reels;
          if (previousReel) {
            const previousReelLastReel = previousReel[0];

            const currentReelsLastReelCreatedAt =
              currentReelsLastReel.created_at;

            const previousReelLastReelCreatedAt =
              previousReelLastReel.created_at;

            const timeA = new Date(currentReelsLastReelCreatedAt);

            if (previousReelLastReelCreatedAt) {
              const timeB = new Date(previousReelLastReelCreatedAt);

              if (timeA > timeB) {
                return [currentValue, ...accumulatedValue];
              } else return [...accumulatedValue, currentValue];
            }
          } else {
            return [currentValue];
          }
        },
        []
      );

      return reels;
    } catch (error: any) {
      console.log("error message", error);
      return new Error(error?.response?.data || "Error getting reels");
    }
  }

  async createReel(reel: any) {
    try {
      const response = await $http.post(`${newDeploymentUrl}/reels`, reel, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error: any) {
      console.log("error message", JSON.stringify(error?.response?.data));
      return new Error(error?.response?.data || "Error creating reel");
    }
  }

  async destroy(reelId: string) {
    try {
      const response = await $http.delete(
        `${newDeploymentUrl}/reels/?reelId=${reelId}`
      );
      return response.data;
    } catch (error: any) {
      console.log("error message", JSON.stringify(error?.response?.data));
      return new Error(error?.response?.data || "Error creating reel");
    }
  }

  async getUserReels() {
    try {
      const response = await $http.get(`${newDeploymentUrl}/reels/my-reels`);
      return response.data?.reels;
    } catch (error: any) {
      console.log("reel error message", JSON.stringify(error?.response?.data));
      return new Error(error?.response?.data || "Error getting reels");
    }
  }
}

export const reelService = new ReelService();
