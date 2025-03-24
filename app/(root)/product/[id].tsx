import React from "react";
import { ScrollView, Text, View } from "react-native";
import Header from "@/components/ui/Header/Header";
import ImageCurosel from "@/components/pages/productDetails/ImageCurosel";
import ProductDescription from "@/components/pages/productDetails/ProductDescription";
import SellerContact from "@/components/pages/productDetails/SellerContact";
import SafetyTips from "@/components/pages/productDetails/SafetyTips";
import { AppContextProps, useApp } from "@/context/AppContext";

export default function ProductDefault() {
  const { selectedProduct, states, cities } = useApp() as AppContextProps;

  const getCitiy = (id: string) => {
    if (cities) {
      const state = cities.find((st) => st.id === id);
      return state?.name;
    }
  };

  const getState = (id: string) => {
    if (states) {
      const state = states.find((st) => st.id === id);
      return state?.name;
    }
  };
  return (
    <>
      <View className={"bg-white"}>
        <Header />
      </View>
      <ScrollView className={"w-full h-full bg-white px-2"}>
        <View
          className={
            "flex flex-col gap-4 border p-3 rounded-lg mt-6 border-grey-2"
          }
        >
          <ImageCurosel uri={selectedProduct?.meta?.selectedImage as string} />

          <ProductDescription
            price={selectedProduct?.price?.toLocaleString() as string}
            name={selectedProduct?.name as string}
            description={selectedProduct?.description as string}
            location={`${getCitiy(selectedProduct?.city as string)}, ${getState(
              selectedProduct?.state as string
            )}`}
            postTime={"Posted 2 hours"}
          />

          <SellerContact />

          <SafetyTips />
        </View>
      </ScrollView>
    </>
  );
}
