import React from "react";

import Hero from "@/components/pages/Home/Hero";
import ProductCard from "@/components/ui/Cards/ProductCard";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { AppContextProps, ICategory, useApp } from "@/context/AppContext";
import { colors } from "@/colors";
import { useEffect, useState } from "react";
import { productService } from "@/services/product.service";
import Loader from "@/components/general/Loader";
import { useAuth } from "@/context/AuthContext";
import { IAUTH } from "@/interfaces/context/auth";
import NoProducts from "@/components/pages/MyProducts/NoProducts";
import MyProductsLayout from "@/components/pages/MyProducts/MyProductsLayout";
import MyProducts from "@/components/pages/MyProducts/MyProducts";
import SearchProducts from "@/components/pages/Home/SearchedProducts";
import { ISearchContextProps } from "@/context/SearchContext";
import { useSearch } from "@/context/SearchContext";
import SubCategoroyProducts from "@/components/pages/Home/SubCategoryProduct";

export default function Index() {
  const router = useRouter();
  const { appLoading, setSelectedProduct, subCategoryProducts } =
    useApp() as AppContextProps;
  const { user, isLoggedIn } = useAuth() as IAUTH;
  const { searchResult } = useSearch() as ISearchContextProps;

  const [products, setProducts] = useState<any>([]);
  const [otherProducts, setOtherProducts] = useState<any>([]);
  const [myProducts, setMyProducts] = useState<any>([]);
  const [myProductsPage, setMyProductsPage] = useState<any>(1);
  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState<number | undefined>(undefined);
  const [category, setCategory] = useState<ICategory | null>(null);

  useEffect(() => {
    (async () => {
      const res = await productService.getMyProducts(myProductsPage);

      console.log("myProducts", res.data[0].files);
      setMyProducts(res);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const res = await productService.getTrendingProducts();
      setProducts(res.trendingProducts);

      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setIsFetching(true);
      const res = await productService.getProductsByCategory({
        page,
        categoryId: category?.id,
      });
      setOtherProducts([...otherProducts, ...res.data]);
      setLastPage(res.meta.last_page);
      setIsFetching(false);
    })();
  }, [page]);

  useEffect(() => {
    (async () => {
      if (category) {
        setIsFetching(true);
        const res = await productService.getProductsByCategory({
          categoryId: category?.id,
        });
        setOtherProducts(res.data);
        setLastPage(res.meta.last_page);
        setIsFetching(false);
      }
    })();
  }, [category]);
  const loadMore = () => {
    if (lastPage && lastPage > page) {
      setPage((prev) => prev + 1);
    }
  };

  if (appLoading) {
    return (
      <View className="items-center justify-center h-full bg-white">
        <ActivityIndicator size={"large"} color={colors.purple} />
      </View>
    );
  }

  if (loading) {
    return (
      <View className="items-center justify-center h-full bg-white">
        <Text>Fetching products..</Text>
      </View>
    );
  }

  if (
    user &&
    user.role === "SELLER" &&
    isLoggedIn &&
    myProducts?.data?.length === 0
  ) {
    return (
      <MyProductsLayout myProducts={myProducts}>
        <NoProducts />
      </MyProductsLayout>
    );
  }
  if (
    user &&
    user?.role === "SELLER" &&
    isLoggedIn &&
    myProducts?.data?.length > 0
  ) {
    return (
      <MyProductsLayout myProducts={myProducts}>
        <MyProducts myProducts={myProducts} />
      </MyProductsLayout>
    );
  }

  if (searchResult?.length > 0) return <SearchProducts />;

  if (subCategoryProducts && subCategoryProducts?.length > 0)
    return <SubCategoroyProducts setCategory={setCategory} />;

  return (
    <FlatList
      data={products}
      ListHeaderComponent={() => {
        if (subCategoryProducts && subCategoryProducts?.length < 1) {
          return (
            <>
              <Text className="text-base my-5 font-semibold">
                No products found in that category
              </Text>
              <Hero setCategory={setCategory} />
            </>
          );
        }
        return <Hero setCategory={setCategory} />;
      }}
      renderItem={({ item, index }) => (
        <>
          <ProductCard
            key={index}
            name={item?.name}
            desc={item?.description}
            label={item.meta?.planName}
            imgSource={item.meta?.selectedImage}
            location={item?.state}
            price={item.price?.toLocaleString()}
            onPress={() => {
              setSelectedProduct(item);
              router.push(`/product/${item.id}`);
            }}
            id={item.id as string}
            isOwnProduct={item.userId === user?.id}
          />
        </>
      )}
      numColumns={2}
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
                price={item.price?.toLocaleString()}
                onPress={() => {
                  setSelectedProduct(item);
                  router.push(`/product/${item.id}`);
                }}
                id={item.id as string}
                isOwnProduct={item.userId === user?.id}
              />
            )}
            keyExtractor={(_item, index) => index.toString()}
            numColumns={2}
            columnWrapperClassName="mb-4 gap-4"
            className="mt-6"
            ListHeaderComponent={
              <Text className="text-base my-5 font-semibold">
                {category?.name || "Others"}
              </Text>
            }
            onEndReached={loadMore}
            onEndReachedThreshold={0.7}
          />

          {isFetching && <Loader />}
        </View>
      }
    />
  );
}
