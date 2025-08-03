import { ScrollView, Text, View } from "react-native";
import ProductPreview from "@/components/pages/SellerForm/ProductPreview";
import ProductForm from "@/components/pages/SellerForm/ProductForm";
import { Link } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { IAUTH } from "@/interfaces/context/auth";
import { useState } from "react";
import ButtonSecondary from "@/components/general/ButtonSecondary";

export default function Sell() {
  const { user, isLoggedIn } = useAuth() as IAUTH;

  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [productFiles, setProductFiles] = useState<any[]>([]);
  const [selectedImg, setSelectedImg] = useState<any | null>(null);
  const [deletedImages, setDeletedImages] = useState<any[]>([]);
  const [showOverlay, setShowOverlay] = useState(false);
  const [productName, setProductName] = useState<string | undefined>(undefined);
  const [productPrice, setProductPrice] = useState<string | undefined>(
    undefined
  );

  const handleImgDelete = () => {
    const newProductFiles = productFiles?.filter(
      (file) => file?.id !== selectedImg?.id
    );
    setDeletedImages([...deletedImages, selectedImg?.id]);
    setProductFiles(newProductFiles);
    setShowOverlay(false);
  };

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
    <ScrollView className={"h-full bg-white  gap-3"}>
      {showOverlay && (
        <View className="absolute inset-0 bg-black/50 z-[1000] justify-center items-center">
          <View className="bg-white p-12 rounded">
            <Text className="text-base">Are you sure ?</Text>

            <ButtonSecondary
              customStyles="border-red-500 rounded-[2px] my-2"
              customTextStyles="text-red-500"
              text={"Delete"}
              onPress={handleImgDelete}
            />
            <ButtonSecondary
              customStyles=" rounded-[2px] "
              text={"Cancel"}
              onPress={() => setShowOverlay(false)}
            />
          </View>
        </View>
      )}

      <ProductPreview
        imgSource={selectedImage}
        name={productName}
        price={productPrice}
      />

      <ProductForm
        setSelectedImage={setSelectedImage}
        productFiles={productFiles}
        setSelectedImg={setSelectedImg}
        setShowOverlay={setShowOverlay}
        setProductFiles={setProductFiles}
        setProductName={setProductName}
        setProductPrice={setProductPrice}
      />
    </ScrollView>
  );
}
