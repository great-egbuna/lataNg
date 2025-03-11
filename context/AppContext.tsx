import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface AppProviderProps {
  children: ReactNode;
  mounted: boolean;
}

export interface ISocialUser {
  role: string;
  name: string;
  email: string;
  shouldCompleteProfile: boolean;
}

export interface AppContextProps {
  navOpen: boolean;
  setNavOpen: (value: boolean) => void;
  feedbackOpen: boolean;
  setFeedbackOpen: (value: boolean) => void;
  selectedPackage: Record<string, any>;
  setSelectedPackage: (value: Record<string, any>) => void;
  appLoading: boolean;
  setAppLoading: (value: boolean) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  mounted: boolean;
  decision: string;
  setDecision: (value: string) => void;
  socialUser: ISocialUser | null;
  setSocialUser: (prev: ISocialUser | null) => void;
}

const AppContext = createContext<AppContextProps | null>(null);

export const useApp = () => useContext(AppContext);

export default function AppProvider({ children, mounted }: AppProviderProps) {
  const [navOpen, setNavOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Record<string, any>>(
    {}
  );
  const [appLoading, setAppLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [socialUser, setSocialUser] = useState<ISocialUser | null>(null);
  const [decision, setDecision] = useState<string>("SELLER");

  const checkLogin = () => {
    setAppLoading(false);
  };

  useEffect(() => {
    checkLogin();
  }, []);

  const value = {
    navOpen,
    setNavOpen,
    feedbackOpen,
    setFeedbackOpen,
    selectedPackage,
    setSelectedPackage,
    appLoading,
    isLoggedIn,
    setAppLoading,
    setIsLoggedIn,
    mounted,
    socialUser,
    setSocialUser,
    decision,
    setDecision,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
