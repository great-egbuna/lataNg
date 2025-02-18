import { ScrollView, Text, View } from "react-native";
import Header from "@/components/ui/Header/Header";
import ImageCurosel from "@/components/pages/productDetails/ImageCurosel";
import ProductDescription from "@/components/pages/productDetails/ProductDescription";
import SellerContact from "@/components/pages/productDetails/SellerContact";
import SafetyTips from "@/components/pages/productDetails/SafetyTips";

export default function ProductDefault() {
  return (
    <>
      <View className={"bg-white px-2"}>
        <Header />
      </View>
      <ScrollView className={"w-full h-full bg-white px-2"}>
        <View
          className={
            "flex flex-col gap-4 border p-3 rounded-lg mt-6 border-grey-2"
          }
        >
          <ImageCurosel />

          <ProductDescription
            price={"450,000"}
            name={"Apple iPhone 12pro"}
            description={`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ut purus nibh. Suspendisse eros felis, fermentum ac mi a, pharetra convallis turpis. Maecenas sit amet nunc placerat nibh sagittis congue id in ipsum. Pellentesque ultricies, dolor eu hendrerit tempor, eros lectus sodales tortor, vitae dictum felis elit eu urna.`}
            location={"Ikeja, Lagos"}
            postTime={"Posted 2 hours"}
          />

          <SellerContact />

          <SafetyTips />
        </View>
      </ScrollView>
    </>
  );
}
