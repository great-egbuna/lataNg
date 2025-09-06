import { $http } from "@/config/$http";

interface UpdateProfileData {
  message?: boolean;
  address?: string;
  aboutBusiness?: string;
  phoneNumber?: string;
  name?: string;
  file?: File | null;
  oldPassword?: string;
  newPassword?: string;
  feature?: boolean;
  sms?: boolean;
  feedback?: boolean;
  subscription?: boolean;
  meta?: string;
  [key: string]: any;
}

const mainSiteLink = `https://lata-main-backend.azurewebsites.net/v1`;

class UserService {
  async updateProfile(profileData: UpdateProfileData) {
    try {
      let data;

      if (profileData.file) {
        const formData = new FormData();

        formData.append("file", profileData.file);

        Object.entries(profileData).forEach(([key, value]) => {
          if (key !== "file" && value !== undefined) {
            if (key === "meta" && value) {
              try {
                JSON.parse(value as string);
                formData.append(key, value as string);
              } catch (e) {
                console.error("Invalid meta JSON:", value);
                formData.append(key, JSON.stringify({}));
              }
            } else {
              formData.append(key, String(value));
            }
          }
        });

        data = formData;
      } else {
        if (profileData.meta === undefined) {
          profileData.meta = JSON.stringify({});
        }
        data = profileData;
      }

      const response = await $http.put("/users", data, {
        headers: profileData.file
          ? {
              "Content-Type": "multipart/form-data",
            }
          : {
              "Content-Type": "application/json",
            },
      });

      return response?.data;
    } catch (error: any) {
      console.log("profile update error", error?.response?.data);
      console.error("Full error details:", JSON.stringify(error));

      if (error.response && error.response.data) {
        return new Error(
          error.response.data.message || "Failed to update profile"
        );
      }
      return new Error("Profile update failed!");
    }
  }

  async getSellerInfo(sellerId: string) {
    try {
      const sellerInfoResponse = await $http.get(
        `${mainSiteLink}/users/seller/${sellerId}`
      );
      const seller = sellerInfoResponse?.data?.seller;

      return seller;
    } catch (error) {
      console.log("sellers", error);
      return new Error("Failed to fetch sellers details");
    }
  }
}

export const userService = new UserService();
