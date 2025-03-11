import Loader from "@/components/general/Loader";
import { IAUTH, IUSER } from "@/interfaces/context/auth";
import { authService } from "@/services/auth.service";
import { getValueFor, save } from "@/store/storage";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { View } from "react-native";

const AuthContext = createContext<IAUTH | null>(null);

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<IUSER | null>(null);

  const checkAuth = async () => {
    try {
      const publicToken = await getValueFor("lataPubToken");

      if (!publicToken) {
        console.log("No public token found");
        setIsLoggedIn(false);
        setLoading(false);
        return;
      }

      const res = await authService.callback({ publicToken });

      if (res instanceof Error) {
        setIsLoggedIn(false);
        setLoading(false);
        return;
      }

      if (res?.id) {
        setUser(res);
        await save("lataUser", JSON.stringify(res));
        setIsLoggedIn(true);
        setLoading(false);
      }

      setLoading(false);
    } catch (error) {
      console.log("AuthContextError", error);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const values = {
    isLoggedIn,
    setIsLoggedIn,
    checkAuth,
    user,
    setUser,
  };

  return (
    <AuthContext.Provider value={values}>
      {loading ? (
        <View className="h-full bg-white items-center justify-center">
          <Loader />
        </View>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
