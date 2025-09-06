import React, { useState } from "react";
import Loader, { FullScreenLoader } from "@/components/general/Loader";
import ProductCard from "@/components/ui/Cards/ProductCard";
import {
  AppContextProps,
  ICategory,
  IProduct,
  useApp,
} from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { IAUTH } from "@/interfaces/context/auth";
import { useRouter } from "expo-router";
import {
  FlatList,
  ImageSourcePropType,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { productService } from "@/services/product.service";
import Hero from "./Hero";

export default function SubCategoroyProducts({
  setSelectedCategory,
  selectedCategory,
  products,
}: {
  setSelectedCategory: (category: any) => void;
  selectedCategory?: ICategory;
  products: any[];
}) {
  const { width } = useWindowDimensions();
  const { user } = useAuth() as IAUTH;
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);

  const {
    specificCategoryProducts,
    setSpecificCategoryProducts,
    setSelectedProduct,
    loadingCategory,
  } = useApp() as AppContextProps;
  const router = useRouter();

  const getNumOfColumns = () => {
    if (width >= 800) return 3;
    return 2;
  };

  const loadMoreProducts = async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      const nextPage = currentPage + 1;
      const response = await productService.getProductsByCategory({
        categoryId: specificCategoryProducts[0]?.categoryId,
        page: nextPage,
      });

      if (response instanceof Error) {
        setLoadMoreError(
          "Failed to load more products. Please refresh the app and try again."
        );
        setHasMore(false);
        return;
      }

      if (response.data && response.data.length > 0) {
        setSpecificCategoryProducts([
          ...specificCategoryProducts,
          ...response.data,
        ]);
        setCurrentPage(nextPage);
        setLoadMoreError(null); // Clear any previous errors
      } else {
        setHasMore(false);
      }
    } catch (error) {
      setLoadMoreError(
        "Something went wrong. Please refresh the app and try again."
      );
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  };

  if (loadingCategory) return <FullScreenLoader label="Please wait..." />;

  return (
    <View className="px-2 bg-white">
      <FlatList
        data={specificCategoryProducts}
        renderItem={({ item }) => (
          <ProductCard
            id={item.id as string}
            name={item?.name as string}
            desc={item?.description as string}
            discount={item.discount as number}
            label={item.meta?.planName}
            imgSource={item.meta?.selectedImage as ImageSourcePropType}
            location={item?.state}
            price={item.price as number}
            onPress={() => {
              router.push(`/product/${item?.id}`);
            }}
            isOwnProduct={item.userId === user?.id}
          />
        )}
        keyExtractor={(_item, index) => index.toString()}
        numColumns={2}
        columnWrapperClassName="mb-4 gap-4"
        className="mt-6"
        onEndReached={loadMoreProducts}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={
          <Hero
            setSelectedCategory={setSelectedCategory}
            title={selectedCategory?.name || "Products"}
          />
        }
        ListFooterComponent={
          <>
            {loadingMore ? (
              <View className="py-4">
                <Loader />
              </View>
            ) : loadMoreError ? (
              <View className="py-4 px-4">
                <Text className="text-red-500 text-center">
                  {loadMoreError}
                </Text>
              </View>
            ) : null}
            {/*     <View>
              <FlatList
                data={products}
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
                numColumns={getNumOfColumns()}
                columnWrapperClassName="mb-4 gap-4"
              />
            </View> */}
          </>
        }
      />
    </View>
  );
}
