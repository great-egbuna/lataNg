import { getValueFor } from "@/store/storage";

export const useUser = async () => {
  const user = await getValueFor("lataUser");

  return {
    user,
  };
};
