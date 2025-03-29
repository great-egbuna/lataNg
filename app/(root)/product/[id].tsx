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

export default function ProductDefault() {
  const { selectedProduct, states, cities, openFeedbackModal } =
    useApp() as AppContextProps;
  const { user, isLoggedIn } = useAuth() as IAUTH;
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
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
    if (user && selectedProduct && user.id === selectedProduct.userId) {
      showToast({
        type: "error",
        text1: "Error",
        text2: "You cannot give feedback to your own product",
      });
      return;
    }

    openFeedbackModal(selectedProduct?.id, selectedProduct?.name);
  };

  const getProductFeedbacks = async () => {
    const feedbacks = await productService.getProductFeedbacks(
      selectedProduct?.id as string
    );
    console.log("feedbacks", feedbacks);
    setFeedbacks(feedbacks?.data);
  };

  const isOwnProduct =
    user && selectedProduct && user.id === selectedProduct.userId;

  useEffect(() => {
    getProductFeedbacks();
  }, []);

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

          {/* Feedback Button */}

          <TouchableOpacity
            className="flex-row items-center justify-center py-3 px-4 bg-purple-2 rounded-lg mt-4"
            onPress={handleOpenFeedback}
          >
            <Ionicons name="star-outline" size={20} color={colors.purple} />
            <Text className="ml-2 text-purple font-semibold">
              Leave Feedback
            </Text>
          </TouchableOpacity>

          {feedbacks.length > 0 && <ProductFeedback feedbacks={feedbacks} />}
        </View>
        <FeedbackModal />
      </ScrollView>
    </>
  );
}
