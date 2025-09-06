import { productService } from "@/services/product.service";
import { SplashScreen } from "expo-router";
import {
  createContext,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { AppContextProps, IProduct, useApp } from "./AppContext";
import { ImageSourcePropType } from "react-native";

interface ProductContextComponentInterface {
  children: React.ReactNode;
}

interface FetchedProductsMetaInterface {
  planName: string;
  selectedImage: ImageSourcePropType;
}

export interface FetchedProductsInterface {
  id: string;
  userId: string;
  name: string;
  description: string;
  state: string;
  price: number;
  discount: number;
  meta: FetchedProductsMetaInterface;
}

interface ProductContextInterface {
  productFetchError: string;
  trendingProducts: FetchedProductsInterface[];
  otherProducts: FetchedProductsInterface[];
  lastPage: number;
  loadingProducts: boolean;

  // setters
  setProductFetchError: (value: string) => void;
  setTrendingProducts: (value: FetchedProductsInterface[]) => void;
  setOtherProducts: (value: FetchedProductsInterface[]) => void;
  setLastPage: (value: number) => void;
  setLoadingProducts: (value: boolean) => void;
}

const initialProductContext: ProductContextInterface = {
  productFetchError: "",
  trendingProducts: [],
  otherProducts: [],
  lastPage: 0,
  loadingProducts: true,

  setProductFetchError: (value: string) => {},
  setTrendingProducts: (value: FetchedProductsInterface[]) => {},
  setOtherProducts: (value: FetchedProductsInterface[]) => {},
  setLastPage: (value: number) => {},
  setLoadingProducts: (value: boolean) => {},
};

const ProductContext = createContext<ProductContextInterface>(
  initialProductContext
);

export default function ProductContextProvider(
  props: ProductContextComponentInterface
) {
  const { categories } = useApp() as AppContextProps;

  const [productFetchError, setProductFetchError] = useState<string>("");
  const [trendingProducts, setTrendingProducts] = useState<
    FetchedProductsInterface[]
  >([]);
  const [otherProducts, setOtherProducts] = useState<
    FetchedProductsInterface[]
  >([]);
  const [lastPage, setLastPage] = useState(0);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    (async () => {
      const [trendingProductsResponse, otherProductsResponse] =
        await Promise.all([
          productService.getTrendingProducts(),
          productService.getProductsByCategory({
            page: 1,
            categoryId: categories[0].id,
          }),
        ]);

      if (
        trendingProductsResponse instanceof Error ||
        otherProductsResponse instanceof Error
      ) {
        setProductFetchError(
          "Could not fetch products. Please exit the app and relaunch"
        );
        return;
      }
      setTrendingProducts(trendingProductsResponse?.trendingProducts);
      setOtherProducts(otherProductsResponse?.data);

      setLastPage(otherProductsResponse.meta.last_page);
      setLoadingProducts(false);
      await SplashScreen.hideAsync();
    })();
  }, []);

  const contextValues = {
    productFetchError,
    trendingProducts,
    otherProducts,
    lastPage,
    loadingProducts,

    setProductFetchError,
    setTrendingProducts,
    setOtherProducts,
    setLastPage,
    setLoadingProducts,
  };

  return (
    <ProductContext.Provider value={contextValues}>
      {props.children}
    </ProductContext.Provider>
  );
}

export const useProductContext = () => useContext(ProductContext);
