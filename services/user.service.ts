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

class UserService {
  async updateProfile(profileData: UpdateProfileData) {
    try {
      let data;

      if (profileData.file) {
        const formData = new FormData();

        console.log("profileData.file", profileData.file);

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
      console.log("HERE");

      const response = await $http.put("/users", data, {
        headers: profileData.file
          ? {
              "Content-Type": "multipart/form-data",
            }
          : {
              "Content-Type": "application/json",
            },
      });

      console.log("profile update response", response?.data);
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
}

export const userService = new UserService();
