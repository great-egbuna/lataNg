import { useState } from "react";
import { userService } from "@/services/user.service";
import { useAuth } from "@/context/AuthContext";
import { IAUTH } from "@/interfaces/context/auth";

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
}

interface UseProfileUpdateOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export function useProfileUpdate(options: UseProfileUpdateOptions = {}) {
  const { user, isLoggedIn } = useAuth() as IAUTH;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  const updateProfile = async (profileData: UpdateProfileData) => {
    if (!user || !isLoggedIn) {
      setLoading(false);

      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await userService.updateProfile(profileData);

      if (result instanceof Error) {
        setError(result);
        options.onError?.(result);
        return false;
      }

      setUserData(result.userData);
      setSuccess(true);
      options.onSuccess?.(result);
      return true;
    } catch (err) {
      const errorObj =
        err instanceof Error ? err : new Error("An unexpected error occurred");
      setError(errorObj);
      options.onError?.(errorObj);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  };

  return {
    updateProfile,
    loading,
    error,
    success,
    userData,
    resetState,
  };
}
