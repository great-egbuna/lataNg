import Hero from "@/components/pages/Home/Hero";
import ProductCard from "@/components/ui/Cards/ProductCard";
import { products } from "@/constants/products";
import { ActivityIndicator, FlatList, View } from "react-native";
import { useRouter } from "expo-router";
import { AppContextProps, useApp } from "@/context/AppContext";
import { colors } from "@/colors";
import { useEffect } from "react";
import { $http } from "@/config/$http";

export default function Index() {
  const router = useRouter();
  const { appLoading, isLoggedIn, mounted } = useApp() as AppContextProps;

  /*  useEffect(() => {
    if (mounted) {
      if (!isLoggedIn) {
        router.push("/decision/");
      }
    }
  }, [mounted]); */

  if (appLoading) {
    return (
      <View className="items-center justify-center h-full">
        <ActivityIndicator size={"large"} color={colors.purple} />
      </View>
    );
  }

  return (
    <FlatList
      data={products}
      renderItem={({ item }) => (
        <ProductCard
          {...item}
          onPress={() => router.push(`/product/${item.id}`)}
        />
      )}
      numColumns={2}
      className="h-full bg-white px-2 gap-2"
      columnWrapperClassName="mb-4 gap-4"
      ListHeaderComponent={() => <Hero />}
    />
  );
}
