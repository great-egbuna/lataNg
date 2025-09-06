import React, { useEffect, useState } from "react";
import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import Header from "@/components/ui/Header/Header";
import ImageCurosel from "@/components/pages/productDetails/ImageCurosel";
import ProductDescription from "@/components/pages/productDetails/ProductDescription";
import SellerContact from "@/components/pages/productDetails/SellerContact";
import SafetyTips from "@/components/pages/productDetails/SafetyTips";
import { AppContextProps, useApp } from "@/context/AppContext";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/colors";
import { useAuth } from "@/context/AuthContext";
import { IAUTH } from "@/interfaces/context/auth";
import { showToast } from "@/components/general/Toast";
import FeedbackModal from "@/components/ui/Modal/FeedbackModal";
import { productService } from "@/services/product.service";
import ProductFeedback from "@/components/pages/productDetails/ProductFeedback";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FullScreenLoader } from "@/components/general/Loader";
import ErrorCard from "@/components/ui/ErrorCard";
import ProductInsight from "@/components/pages/productDetails/ProductInsight";
import ProductMgtButton from "@/components/pages/productDetails/ProductMgtButton";
import SimilarProducts from "@/components/pages/productDetails/SimilarProducts";

export default function ProductDefault() {
  const { id } = useLocalSearchParams();

  const {
    selectedProduct,
    setSelectedProduct,
    states,
    cities,
    openFeedbackModal,
  } = useApp() as AppContextProps;

  const router = useRouter();

  const productId = selectedProduct?.product?.id;

  const { user, isLoggedIn } = useAuth() as IAUTH;
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [deleting, setIsDeleting] = useState(false);

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

  const handleDelete = async (id: string) => {
    const res = await productService.delete(id);
    setIsDeleting(false);
    if (res instanceof Error) {
      showToast({
        type: "error",
        text1: "Error",
        text2: "Failed to delete product",
      });
      setIsDeleting(false);
      return;
    }

    showToast({
      type: "success",
      text1: "success",
      text2: "Product deleted successfully",
    });

    setIsDeleting(false);
    router.push("/shop");
  };

  const handleOpenFeedback = () => {
    if (!isLoggedIn) {
      showToast({
        type: "error",
        text1: "Error",
        text2: "Please login to leave feedback",
      });
      return;
    }

    // Don't allow feedback on own product

    if (
      user &&
      selectedProduct &&
      user.id === selectedProduct?.product?.userId
    ) {
      showToast({
        type: "error",
        text1: "Error",
        text2: "You cannot give feedback on your own product",
      });
      return;
    }

    const productName = selectedProduct?.product?.name;
    openFeedbackModal(productId, productName);
  };

  const getProductFeedbacks = async () => {
    const feedbacks = await productService.getProductFeedbacks(
      selectedProduct?.product.id as string
    );
    setFeedbacks(feedbacks?.data);
  };

  const product_owner_id = selectedProduct?.product.userId;
  const isOwnProduct = user?.id === product_owner_id;

  useEffect(() => {
    getProductFeedbacks();
  }, []);

  useEffect(() => {
    if (selectedProduct?.product?.id === id) {
      setLoading(false);
      return;
    }

    (async () => {
      const response = await productService.getProductById(id as string);

      if (response instanceof Error) {
        setError(response?.message);
        setLoading(false);
      }

      setSelectedProduct(response);
      setLoading(false);
    })();
  }, [id]);

  if (loading) return <FullScreenLoader />;

  if (error) return <ErrorCard error={error} />;

  return (
    <>
      <View className={"bg-white"}>
        <Header />
      </View>
      <ScrollView className={"w-full h-full bg-white px-2"}>
        <View className={"flex flex-col gap-4 py-3  mt-6 "}>
          <ImageCurosel
            uri={selectedProduct?.product?.meta?.selectedImage as string}
            images={selectedProduct?.product?.files}
          />

          <ProductDescription
            price={selectedProduct?.product?.price as number}
            name={selectedProduct?.product?.name!}
            description={selectedProduct?.product?.description!}
            location={`${
              getCitiy(selectedProduct?.product?.city!) ||
              selectedProduct?.product?.city ||
              " "
            } ${
              getState(selectedProduct?.product?.state!) ||
              selectedProduct?.product?.state
            }`}
            postTime={selectedProduct?.product?.createdAt!}
            category={selectedProduct?.product?.category?.name!}
            subCategoryId={selectedProduct?.product?.subCategoryId!}
            type={selectedProduct?.product?.productType!}
          />

          <SellerContact product={selectedProduct?.product!} />

          <SafetyTips />

          {isOwnProduct && (
            <>
              <ProductInsight
                views={selectedProduct?.product?.views!}
                saved={selectedProduct?.product?.saved!}
                clicks={selectedProduct?.product?.phoneClicks!}
                visits={selectedProduct?.product?.userData?.profileViews!}
              />

              <ProductMgtButton
                label="Edit product"
                className="bg-purple "
                customTextStyle="text-white text-base font-semibold"
                onclick={() => router.push(`/product/edit/${id}`)}
              />

              <ProductMgtButton
                label={deleting ? "Deleting" : "Delete"}
                className="border-red-5  "
                customTextStyle="text-red-5 text-base font-semibold"
                onclick={() => handleDelete(id as string)}
              />
            </>
          )}

          <TouchableOpacity
            className="flex-row items-center justify-center py-3 px-4 bg-purple-2 rounded-lg mt-4"
            onPress={handleOpenFeedback}
          >
            <Ionicons name="star-outline" size={20} color={colors.purple} />
            <Text className="ml-2 text-purple font-medium text-base md:text-lg">
              Leave Feedback
            </Text>
          </TouchableOpacity>

          <ProductFeedback productId={selectedProduct?.product?.id!} />
          <SimilarProducts categoryId={selectedProduct?.product?.categoryId!} />

          {/* Feedback Button */}
        </View>
        <FeedbackModal productId={selectedProduct?.product?.id} />
      </ScrollView>
    </>
  );
}
