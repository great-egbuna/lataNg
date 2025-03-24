import { $http } from "@/config/$http";

class PaymentService {
  async getWalletCreditCredentials(amount: number) {
    try {
      const response = await $http.post("payments/wallet/", {
        amount,
      });
      return response.data;
    } catch (error: any) {
      return new Error(
        error?.response?.data?.message || "Failed to get payment credentials"
      );
    }
  }

  async getSubscriptionCredentials(
    planId: number,
    type: "paystack" | "transfer",
    useWallet: boolean
  ) {
    try {
      const response = await $http.post("/payments/subscribe", {
        planId,
        type,
        useWallet,
      });
      return response.data;
    } catch (error: any) {
      return new Error(
        error?.response?.data?.message ||
          "Failed to get subscription credentials"
      );
    }
  }
}

export const paymentService = new PaymentService();
