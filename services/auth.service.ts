import { $http } from "@/config/$http";
import {
  ICALLBACK,
  ICHANGEPASSWORD,
  IFORGOTPASSWORD,
  ILOGIN,
  IREGISTER,
  IRESENDOPT,
  IVERIFYEMAIL,
  IVERIFYOPT,
} from "@/interfaces/auth";
import { customLogger, getErrorMessage } from "@/utils/utils";

class AuthService {
  public async register(payload: IREGISTER) {
    try {
      const res = await $http.post("/auth/register", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (error) {
      console.log("error", JSON.stringify(error?.response?.data));
      return new Error(
        error?.response?.data?.error[0]?.message || "Failed to register"
      );
    }
  }

  public async completeRegisteration(payload: FormData) {
    try {
      const res = await $http.post("/auth/complete-registration", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (error) {
      customLogger({
        file: "auth.service.ts",
        component: "",
        log: JSON.stringify(error?.response?.data),
      });
      return new Error(getErrorMessage(error?.response?.data));
    }
  }

  public async login(payload: ILOGIN) {
    try {
      const res = await $http.post("/auth/login", payload);

      return res.data;
    } catch (error) {
      console.log("error", JSON.stringify(error?.response?.data));
      console.log("error", JSON.stringify(error));
      return new Error(error?.response?.data?.errorInfo || "Login failed");
    }
  }

  public async callback(payload: ICALLBACK) {
    try {
      const res = await $http.post("/auth/callback", payload);
      return res?.data;
    } catch (error) {
      console.log("error", JSON.stringify(error?.response?.data));
      return new Error("Requst failed");
    }
  }

  public async forgotPassword(payload: IFORGOTPASSWORD) {
    try {
      const res = await $http.post("/auth/auth-password", payload);

      return res?.data;
    } catch (error) {
      return new Error("Login failed");
    }
  }

  public async verifyOtp(payload: IVERIFYOPT) {
    try {
      const res = await $http.post("/auth/verify-otp", payload);

      return res?.data;
    } catch (error) {
      return new Error("Login failed");
    }
  }

  public async resendOtp(payload: IRESENDOPT) {
    try {
      const res = await $http.post("/auth/resend-otp", payload);

      return res?.data;
    } catch (error) {
      return new Error("Login failed");
    }
  }

  public async changePassword(payload: ICHANGEPASSWORD) {
    try {
      const res = await $http.post("/auth/change-password", payload);

      return res?.data;
    } catch (error) {
      return new Error("Login failed");
    }
  }

  public async verifyEmail(payload: IVERIFYEMAIL) {
    try {
      const res = await $http.post("/auth/verify-otp", payload);

      return res?.data;
    } catch (error) {
      return new Error("Login failed");
    }
  }
}

export const authService = new AuthService();
