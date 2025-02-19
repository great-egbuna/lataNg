import { ScrollView } from "react-native";
import ProductPreview from "@/components/pages/SellerForm/ProductPreview";
import ProductForm from "@/components/pages/SellerForm/ProductForm";

export default function Sell() {
  return (
    <ScrollView className={"h-full bg-white px-2 gap-3"}>
      <ProductPreview />

      <ProductForm />
    </ScrollView>
  );
}
