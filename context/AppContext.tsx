import { categoryService } from "@/services/category.service";
import { locationService } from "@/services/location.service";
import { productService } from "@/services/product.service";
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
  subCategoryId?: string;
}

interface ICities {
  id: string;
  name: string;
}

export interface ICategory {
  id: string;
  name: string;
}

export interface ICategoryWithSubcategories extends ICategory {
  subcategories?: { id: string; name: string }[];
  image?: any;
}

// Extended context interface with category overlay functionality
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

  categoryOverlayVisible: boolean;
  setCategoryOverlayVisible: (value: boolean) => void;
  subcategoryOverlayVisible: boolean;
  setSubcategoryOverlayVisible: (value: boolean) => void;
  selectedCategory: ICategoryWithSubcategories | null;
  setSelectedCategory: (value: ICategoryWithSubcategories | null) => void;
  handleCategorySelect: (category: ICategoryWithSubcategories) => void;
  handleSubcategorySelect: (
    subcategoryId: string,
    categoryId: string
  ) => Promise<void>;
  loadingProducts: boolean;
  categoryProducts: IProduct[];
  subCategoryProducts: IProduct[] | null;
  setSubCategoryProducts: (value: IProduct[] | null) => void;
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

  // New state for category overlay
  const [categoryOverlayVisible, setCategoryOverlayVisible] = useState(false);
  const [subcategoryOverlayVisible, setSubcategoryOverlayVisible] =
    useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<ICategoryWithSubcategories | null>(null);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [categoryProducts, setCategoryProducts] = useState<IProduct[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [subCategoryProducts, setSubCategoryProducts] = useState<
    IProduct[] | null
  >(null);

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

  // Handle category selection
  const handleCategorySelect = (category: ICategoryWithSubcategories) => {
    setSelectedCategory(category);

    if (category.subcategories && category.subcategories.length > 0) {
      setSubcategoryOverlayVisible(true);
    } else {
      // If no subcategories, load products for the category directly
      handleSubcategorySelect(category.id, category.id);
      setCategoryOverlayVisible(false);
    }
  };

  // Handle subcategory selection
  const handleSubcategorySelect = async (
    subcategoryId: string,
    categoryId: string
  ) => {
    setLoadingProducts(true);
    try {
      const res = await productService.getProductsByCategory({
        page: currentPage,
        categoryId,
      });

      setCategoryProducts(res.data || []);
      setLastPage(res.meta?.last_page || 1);
      setSubcategoryOverlayVisible(false);
      setCategoryOverlayVisible(false);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Load more products
  const loadMoreCategoryProducts = async () => {
    if (currentPage < lastPage && !loadingProducts && selectedCategory) {
      setLoadingProducts(true);
      try {
        const nextPage = currentPage + 1;
        const res = await productService.getProductsByCategory({
          page: nextPage,
          categoryId: selectedCategory.id,
        });

        setCategoryProducts((prev) => [...prev, ...(res.data || [])]);
        setCurrentPage(nextPage);
      } catch (error) {
        console.error("Error loading more products:", error);
      } finally {
        setLoadingProducts(false);
      }
    }
  };

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

    // New category overlay context
    categoryOverlayVisible,
    setCategoryOverlayVisible,
    subcategoryOverlayVisible,
    setSubcategoryOverlayVisible,
    selectedCategory,
    setSelectedCategory,
    handleCategorySelect,
    handleSubcategorySelect,
    loadingProducts,
    categoryProducts,
    subCategoryProducts,
    setSubCategoryProducts,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
