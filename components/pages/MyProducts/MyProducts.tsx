import ProductCard from "@/components/ui/Cards/ProductCard";
import { AppContextProps, useApp } from "@/context/AppContext";
import { useRouter } from "expo-router";
import React from "react";

import { FlatList } from "react-native";

export default function MyProducts({
  myProducts,
}: {
  myProducts: Record<string, any>;
}) {
  const router = useRouter();
  const { setMyProduct } = useApp() as AppContextProps;
  console.log("myProducts", myProducts);
  return (
    <FlatList
      data={myProducts.data}
      renderItem={({ item, index }) => (
        <>
          <ProductCard
            key={index}
            name={item?.name}
            desc={item?.description}
            label={item.meta?.planName}
            imgSource={item.files?.[0].url}
            location={item?.state}
            price={item.price?.toLocaleString()}
            onPress={() => {
              setMyProduct(item);
              router.push(`/product/${item.id}`);
            }}
          />
        </>
      )}
      numColumns={2}
      className="h-full bg-white px-2 gap-2"
      columnWrapperClassName="mb-4 gap-4"
      ListHeaderComponentClassName="relative z-10"
      keyExtractor={(item) => item.id}
    />
  );
}
