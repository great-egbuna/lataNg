import { ScrollView, Text, View } from "react-native";
import ProductPreview from "@/components/pages/SellerForm/ProductPreview";
import ProductForm from "@/components/pages/SellerForm/ProductForm";
import { Link } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { IAUTH } from "@/interfaces/context/auth";
import { useState } from "react";

export default function Sell() {
  const { user, isLoggedIn } = useAuth() as IAUTH;

  const [selectedImage, setSelectedImage] = useState<any>(null);

  if (!user || !isLoggedIn || user.role !== "SELLER") {
    return (
      <View className="h-full bg-white items-center justify-center gap-4">
        <Text className="text-grey-9 font-normal text-sm">
          Please Login to see notifications
        </Text>

        <Link
          href={"/login"}
          className="bg-purple w-[140px] rounded-md flex-row items-center justify-center p-2"
        >
          <Text className=" text-white  font-black text-center text-base ">
            Login
          </Text>
        </Link>
      </View>
    );
  }
  return (
    <ScrollView className={"h-full bg-white px-2 gap-3"}>
      <ProductPreview imgSource={selectedImage} />

      <ProductForm setSelectedImage={setSelectedImage} />
    </ScrollView>
  );
}
