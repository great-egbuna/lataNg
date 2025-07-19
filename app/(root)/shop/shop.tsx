import { FullScreenLoader } from "@/components/general/Loader";
import MyProducts from "@/components/pages/MyProducts/MyProducts";
import MyProductsLayout from "@/components/pages/MyProducts/MyProductsLayout";
import NoProducts from "@/components/pages/MyProducts/NoProducts";
import ErrorCard from "@/components/ui/ErrorCard";
import { AppContextProps, useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { IAUTH } from "@/interfaces/context/auth";
import { productService } from "@/services/product.service";
import { useEffect, useState } from "react";

export default function MyShopPage() {
  const { user, isLoggedIn, loading: authLoading } = useAuth() as IAUTH;
  const { myProdActiveTab, myProdQueryTab } = useApp() as AppContextProps;

  const [myProducts, setMyProducts] = useState<any>([]);
  const [error, setError] = useState<null | string>(null);
  const [myProductsPage, setMyProductsPage] = useState<any>(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (isLoggedIn && user?.role === "SELLER") {
        const myProd = await productService.getMyProducts({
          page: myProductsPage,
          tab: myProdQueryTab?.toLowerCase(),
        });
        if (myProd instanceof Error) {
          setError("There Was An Error While Trying To Fetch Your Products.");
        }
        setMyProducts(myProd);
      }
      setLoading(false);
    })();
  }, [isLoggedIn, authLoading, user, myProdActiveTab, myProdQueryTab]);

  if (loading) return <FullScreenLoader />;

  if (error) {
    return <ErrorCard error={error} />;
  }

  if (myProducts?.length === 0) {
    return (
      <MyProductsLayout myProducts={myProducts}>
        <NoProducts />
      </MyProductsLayout>
    );
  }

  return (
    <MyProductsLayout myProducts={myProducts}>
      <MyProducts myProducts={myProducts} />
    </MyProductsLayout>
  );
}
