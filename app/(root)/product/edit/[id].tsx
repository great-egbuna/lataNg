import ButtonSecondary from "@/components/general/ButtonSecondary";
import { FullScreenLoader } from "@/components/general/Loader";
import EditProductForm from "@/components/pages/MyProducts/EditProduct";
import ProductPreview from "@/components/pages/SellerForm/ProductPreview";
import ErrorCard from "@/components/ui/ErrorCard";
import { productService } from "@/services/product.service";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ImageSourcePropType, ScrollView, Text, View } from "react-native";

export default function EditProductPage() {
  const { id } = useLocalSearchParams();
  const [selectedImage, setSelectedImage] = useState<
    ImageSourcePropType | undefined
  >(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [productFiles, setProductFiles] = useState<any[]>();
  const [selectedImg, setSelectedImg] = useState<any | null>(null);
  const [deletedImages, setDeletedImages] = useState<any[]>([]);

  const handleImgDelete = () => {
    const newProductFiles = productFiles?.filter(
      (file) => file?.id !== selectedImg?.id
    );
    setDeletedImages([...deletedImages, selectedImg?.id]);
    setProductFiles(newProductFiles);
    setShowOverlay(false);
  };

  useEffect(() => {
    (async () => {
      const res = await productService.getProductById(id as string);

      if (res instanceof Error) {
        setError(res?.message);
        setLoading(false);
      }
      setSelectedProduct(res);
      setSelectedImage(res?.product?.files[0]?.url);
      setProductFiles(res?.product?.files);
      setLoading(false);
    })();
  }, []);

  if (loading) return <FullScreenLoader />;

  if (error) return <ErrorCard error={error} />;

  return (
    <ScrollView className="-full bg-white">
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
        price={selectedProduct?.product?.price}
        name={selectedProduct?.product?.name}
      />

      <EditProductForm
        product={selectedProduct?.product}
        setSelectedImg={setSelectedImg}
        productFiles={productFiles}
        deletedImages={deletedImages}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        setShowOverlay={setShowOverlay}
      />
    </ScrollView>
  );
}
