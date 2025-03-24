import { categoryService } from "@/services/category.service";
import { locationService } from "@/services/location.service";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { ImageSourcePropType } from "react-native";

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

interface States {
  id: string;
  name: string;
}

export interface IProduct {
  id?: string;
  name?: string;
  description?: string;
  planName?: string;
  meta?: { selectedImage: string | ImageSourcePropType; planName: string };
  price?: string;
  state: string;
  city: string;
  user: { name: string; phoneNumber: string; avatar: string };
  userId: string;
}

interface ICities {
  id: string;
  name: string;
}

export interface ICategory {
  id: string;
  name: string;
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
  states: States[] | null;
  setStates: (value: States[] | null) => void;
  selectedProduct: IProduct | null;
  setSelectedProduct: (value: IProduct | null) => void;
  cities: ICities[] | null;
  setCities: (value: ICities[] | null) => void;
  categories: ICategory[] | null;
  setCategories: (value: ICategory[] | null) => void;
  subCategories: ICategory[] | null;
  setSubCategories: (value: ICategory[] | null) => void;
  myProduct: IProduct | null;
  setMyProduct: (value: IProduct | null) => void;
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
  const [states, setStates] = useState<States[] | null>(null);
  const [cities, setCities] = useState<ICities[] | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [categories, setCategories] = useState<ICategory[] | null>(null);
  const [subCategories, setSubCategories] = useState<ICategory[] | null>(null);
  const [myProduct, setMyProduct] = useState<IProduct | null>(null);

  const loadApp = () => {
    setAppLoading(false);
  };

  useEffect(() => {
    loadApp();
  }, []);

  useEffect(() => {
    (async () => {
      const states = await locationService.getStates();
      setStates(states);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const cities = await locationService.getCities();
      setCities(cities);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const res = await categoryService.getCategories();
      setCategories(res);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const res = await categoryService.getSubCategories();
      setSubCategories(res);
    })();
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
    states,
    setStates,
    selectedProduct,
    setSelectedProduct,
    cities,
    setCities,
    categories,
    setCategories,
    subCategories,
    setSubCategories,
    myProduct,
    setMyProduct,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
