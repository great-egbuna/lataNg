import Hero from "@/components/pages/Home/Hero";
import ProductCard from "@/components/ui/Cards/ProductCard";
import Header from "@/components/ui/Header/Header";
import { products } from "@/constants/products";
import { FlatList, Text, View } from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

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
