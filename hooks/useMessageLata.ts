import { useAuth } from "@/context/AuthContext";
import { IAUTH } from "@/interfaces/context/auth";
import { feedbackService } from "@/services/feedback.service";
import { useState } from "react";

export function useMessageLata() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { isLoggedIn } = useAuth() as IAUTH;

  const sendMessage = async (message: string) => {
    if (!isLoggedIn) {
      setError("You must be logged in to send messages");
      return false;
    }

    if (!message.trim()) {
      setError("Message is required");
      return false;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const response = await feedbackService.messageLata(message);

      if (response instanceof Error) {
        setError(response.message);
        return false;
      }

      setSuccess(true);
      return true;
    } catch (err: any) {
      setError(err.message || "Failed to send message");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    sendMessage,
    loading,
    error,
    success,
  };
}
