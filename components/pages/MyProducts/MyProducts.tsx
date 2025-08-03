import ProductCard from "@/components/ui/Cards/ProductCard";
import { AppContextProps, useApp } from "@/context/AppContext";
import { getNumOfColumns } from "@/utils/utils";
import { useRouter } from "expo-router";
import React from "react";

import { FlatList, Text, useWindowDimensions } from "react-native";

export default function MyProducts({
  myProducts,
}: {
  myProducts: Record<string, any>;
  tab: string;
}) {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const { setMyProduct, myProdActiveTab: tab } = useApp() as AppContextProps;
  const productNew = myProducts.data;

  console.log("productNew:", productNew[productNew.length - 1]);
  return (
    <FlatList
      data={productNew}
      renderItem={({ item, index }) => (
        <>
          <ProductCard
            discount={item?.discount}
            isOwnProduct
            key={index}
            name={item?.name}
            desc={item?.description}
            label={item.meta?.planName}
            imgSource={item.files?.[0].url}
            location={item?.state}
            price={item.price}
            onPress={() => {
              setMyProduct(item);
              router.push(`/product/${item.id}`);
            }}
            review={tab === "INACTIVE"}
          />
        </>
      )}
      numColumns={getNumOfColumns(width)}
      className="h-full bg-white  px-2 gap-2"
      columnWrapperClassName="mb-4 gap-4"
      ListHeaderComponentClassName="relative z-10"
      keyExtractor={(item) => item.id}
      ListEmptyComponent={() => (
        <Text className="text-gray-400 font-semibold text-base">
          No products found
        </Text>
      )}
    />
  );
}
