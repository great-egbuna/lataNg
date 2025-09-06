import React from "react";

import Hero from "@/components/pages/Home/Hero";
import ProductCard from "@/components/ui/Cards/ProductCard";
import { FlatList, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { AppContextProps, ICategory, useApp } from "@/context/AppContext";
import { useState } from "react";
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
import {
  FetchedProductsInterface,
  useProductContext,
} from "@/context/ProductContext";
import { productService } from "@/services/product.service";
import useNotifications from "@/hooks/useNotifications";

export default function Index() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { appLoading, specificCategoryProducts, categories } =
    useApp() as AppContextProps;
  const { user } = useAuth() as IAUTH;


  const { searchResult } = useSearch() as ISearchContextProps;
  const productContext = useProductContext();
  const [reFetching, setReFetching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [reFetchError, setReFetchError] = useState("");

  const loadMore = async () => {
    setReFetching(true);
    if (productContext.lastPage > currentPage) {
      const nextPage = currentPage + 1;
      setCurrentPage((prev) => prev + 1);

      const moreProducts = await productService.getProductsByCategory({
        page: nextPage,
        categoryId: categories[0].id,
      });

      if (moreProducts instanceof Error) {
        setReFetchError("Failed to fetch more products");
      } else {
        productContext.setOtherProducts([
          ...productContext.otherProducts,
          ...moreProducts?.data,
        ]);
      }

      setReFetching(false);
    }
  };

  if (appLoading) {
    return <FullScreenLoader label="Loading app..." />;
  }

  if (productContext.loadingProducts) {
    return <FullScreenLoader label="Loading products.." />;
  }

  if (productContext.productFetchError) {
    return <ErrorCard error={productContext.productFetchError} />;
  }

  if (searchResult?.length > 0) return <SearchProducts />;

  if (
    specificCategoryProducts?.length > 0 &&
    selectedCategory?.name !== "All categories"
  )
    return (
      <SubCategoroyProducts
        setSelectedCategory={setSelectedCategory}
        selectedCategory={selectedCategory as ICategory}
        products={productContext.trendingProducts}
      />
    );

  return (
    <>
      <FlatList
        data={productContext.trendingProducts}
        ListHeaderComponent={() => {
          return (
            <Hero
              setSelectedCategory={setSelectedCategory}
              selectedCategory={selectedCategory as ICategory}
              showTitle={
                !!!selectedCategory?.name ||
                selectedCategory?.name === "All categories"
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
              data={
                productContext.otherProducts.length > 0
                  ? productContext.otherProducts
                  : (specificCategoryProducts as FetchedProductsInterface[])
              }
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
                  {selectedCategory?.name || "Other Products"}
                </Text>
              }
              onEndReached={loadMore}
              onEndReachedThreshold={0.7}
            />

            {reFetching && <Loader />}

            {reFetchError && <View>{reFetchError}</View>}
          </View>
        }
      />
    </>
  );
}
