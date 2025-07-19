import React from "react";

import Hero from "@/components/pages/Home/Hero";
import ProductCard from "@/components/ui/Cards/ProductCard";
import { FlatList, Text, View } from "react-native";
import { SplashScreen, useRouter } from "expo-router";
import { AppContextProps, ICategory, useApp } from "@/context/AppContext";
import { useEffect, useState } from "react";
import { productService } from "@/services/product.service";
import Loader, { FullScreenLoader } from "@/components/general/Loader";
import { useAuth } from "@/context/AuthContext";
import { IAUTH } from "@/interfaces/context/auth";

import SearchProducts from "@/components/pages/Home/SearchedProducts";
import { ISearchContextProps } from "@/context/SearchContext";
import { useSearch } from "@/context/SearchContext";
import SubCategoroyProducts from "@/components/pages/Home/SubCategoryProduct";
import ErrorCard from "@/components/ui/ErrorCard";
import { useWindowDimensions } from "react-native";
import { getNumOfColumns } from "@/utils/utils";
import { useSavedProducts } from "@/hooks/useProducts";

export default function Index() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { appLoading, setSelectedProduct, subCategoryProducts, saveProductId } =
    useApp() as AppContextProps;
  const { user, isLoggedIn, loading: authLoading } = useAuth() as IAUTH;
  const { searchResult } = useSearch() as ISearchContextProps;
  const { savedProducts } = useSavedProducts();

  const [products, setProducts] = useState<any>([]);
  const [otherProducts, setOtherProducts] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState<number | undefined>(undefined);
  const [category, setCategory] = useState<ICategory | null>(null);
  const [initialPageLoad, setInitialPageLoad] = useState(true);
  const [error, setError] = useState<null | string>(null);
  const [cacheTrendingProducts, setCacheTendingProducts] = useState([]);
  const [cacheOtherProducts, setCacheOtherProducts] = useState<any>([]);
  const [cacheLastPage, setCacheLastPage] = useState(1);
  useEffect(() => {
    (async () => {
      setCategory(null);
      const [trendingProdRes, otherProductsRes] = await Promise.all([
        productService.getTrendingProducts(),
        productService.getProductsByCategory({
          page,
          categoryId: category?.id,
        }),
      ]);

      if (
        trendingProdRes instanceof Error ||
        otherProductsRes instanceof Error
      ) {
        setError("An Error Occured. Please Contact Admin");
      }
      setProducts(trendingProdRes?.trendingProducts);

      setOtherProducts([...otherProductsRes.data]);

      // cache products
      setCacheTendingProducts(trendingProdRes?.trendingProducts);
      setCacheOtherProducts([...otherProductsRes?.data]);
      setLastPage(otherProductsRes.meta.last_page);
      setCacheLastPage(otherProductsRes?.meta?.last_page);
      setInitialPageLoad(false);
      setLoading(false);
      await SplashScreen.hideAsync();
    })();
  }, [authLoading, isLoggedIn, user]);

  useEffect(() => {
    (async () => {
      if (initialPageLoad) return;
      const res = await productService.getTrendingProducts();
      setProducts(res.trendingProducts);

      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (initialPageLoad) return;
      setIsFetching(true);
      const payload = {
        page,
      };

      if (category?.id) payload.categoryId = category?.id;

      const res = await productService.getProductsByCategory(payload);

      setOtherProducts([...otherProducts, ...res.data]);
      setLastPage(res.meta.last_page);
      setIsFetching(false);
    })();
  }, [page]);

  useEffect(() => {
    (async () => {
      if (initialPageLoad) return;
      if (category && category?.name !== "All categories") {
        setIsFetching(true);
        const res = await productService.getProductsByCategory({
          categoryId: category?.id,
        });
        setProducts([]);
        setOtherProducts(res.data);
        setLastPage(res.meta.last_page);
        setIsFetching(false);
      } else {
        setProducts(cacheTrendingProducts);
        setOtherProducts(cacheOtherProducts);
        setLastPage(cacheLastPage);
      }
    })();
  }, [category]);
  const loadMore = () => {
    if (lastPage && lastPage > page) {
      setPage((prev) => prev + 1);
    }
  };

  if (appLoading) {
    return <FullScreenLoader />;
  }

  if (loading) {
    return <FullScreenLoader />;
  }

  if (error) {
    return <ErrorCard error={error} />;
  }

  if (searchResult?.length > 0) return <SearchProducts />;

  if (subCategoryProducts && subCategoryProducts?.length > 0)
    return (
      <SubCategoroyProducts setCategory={setCategory} products={products} />
    );

  return (
    <>
      <FlatList
        data={products}
        ListHeaderComponent={() => {
          return (
            <Hero
              setCategory={setCategory}
              category={category as ICategory}
              showTitle={
                !!!category?.name || category?.name === "All categories"
              }
            />
          );
        }}
        ListEmptyComponent={() => null}
        renderItem={({ item, index }) => (
          <>
            <ProductCard
              key={index}
              name={item?.name}
              desc={item?.description}
              label={item.meta?.planName}
              imgSource={item.meta?.selectedImage}
              location={item?.state}
              discount={item?.discount}
              price={item.price}
              onPress={() => {
                setSelectedProduct(item);
                router.push(`/product/${item.id}`);
              }}
              id={item.id as string}
              isOwnProduct={item.userId === user?.id}
            />
          </>
        )}
        numColumns={getNumOfColumns(width)}
        className="h-full bg-white px-2 gap-2"
        columnWrapperClassName="mb-4 gap-4"
        ListHeaderComponentClassName="relative z-10"
        keyExtractor={(item) => item.id}
        ListFooterComponent={
          <View>
            <FlatList
              data={otherProducts}
              renderItem={({ item }) => (
                <ProductCard
                  name={item?.name}
                  desc={item?.description}
                  label={item.meta?.planName}
                  imgSource={item.meta?.selectedImage}
                  location={item?.state}
                  price={item.price}
                  discount={item?.discount}
                  onPress={() => {
                    setSelectedProduct(item);
                    router.push(`/product/${item.id}`);
                  }}
                  id={item.id as string}
                  isOwnProduct={item.userId === user?.id}
                />
              )}
              keyExtractor={(_item, index) => index.toString()}
              numColumns={getNumOfColumns(width)}
              columnWrapperClassName="mb-4 gap-4"
              ListHeaderComponent={
                <Text className="text-xl my-2 font-semibold">
                  {category?.name || "Other Products"}
                </Text>
              }
              onEndReached={loadMore}
              onEndReachedThreshold={0.7}
            />

            {isFetching && <Loader />}
          </View>
        }
      />
    </>
  );
}
