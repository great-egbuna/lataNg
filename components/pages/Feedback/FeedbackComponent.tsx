import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Clipboard,
  Alert,
} from "react-native";
import { images } from "@/constants/images";
import { colors } from "@/colors";
import Loader from "@/components/general/Loader";
import { Ionicons } from "@expo/vector-icons";
import { useFeedbacks } from "@/hooks/useFeedback";
import { IAUTH } from "@/interfaces/context/auth";
import { useAuth } from "@/context/AuthContext";
import { Link } from "expo-router";

export default function FeedbackComponent() {
  const { user } = useAuth() as IAUTH;

  const [activeTab, setActiveTab] = useState<"received" | "sent">("received");

  const {
    feedbacks,
    loading,
    error,
    pagination,
    refreshFeedbacks,
    loadMoreFeedbacks,
    changeTab,
  } = useFeedbacks({
    type: "PRODUCT",
    tab: activeTab,
  });

  const handleTabChange = (tab: "received" | "sent") => {
    setActiveTab(tab);
    /*  changeTab(tab); */
  };

  const handleCopyLink = () => {
    const feedbackLink = `https://lata.ng/feedback/${user?.id}`;
    Clipboard.setString(feedbackLink);
    Alert.alert("Success", "Feedback link copied to clipboard");
  };

  if (loading && !feedbacks.length) {
    return (
      <View className="h-full items-center justify-center bg-white">
        <Loader />
      </View>
    );
  }

  if (error) {
    return (
      <View className="h-full items-center justify-center bg-white p-4">
        <Text className="text-red-500 text-center mb-4">{error}</Text>
        <TouchableOpacity
          className="bg-purple px-4 py-2 rounded-lg"
          onPress={refreshFeedbacks}
        >
          <Text className="text-white">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderEmptyState = () => (
    <View className="items-center justify-center p-6 mt-10">
      <Image
        source={images.smileyEyes}
        className="w-32 h-32 mb-6"
        resizeMode="contain"
      />
      <Text className="text-grey-9 font-semibold text-lg text-center mb-2">
        You have not received any Feedback yet.
      </Text>
      <Text className="text-grey-6 text-center mb-1">
        Ask your customers to drop feedbacks for you.
      </Text>

      <Text className="text-grey-8 mb-2">
        Copy and send the below link to them.
      </Text>
      <View className="rounded-lg w-full mb-4">
        <View className="flex-col items-center justify-between gap-2">
          <Text className="text-purple flex-1 mr-2" numberOfLines={1}>
            {`https://lata.ng/feedback/${user?.id}`}
          </Text>
          <TouchableOpacity
            className="bg-purple p-2 rounded-md rounded-xl  px-6 w-full"
            onPress={handleCopyLink}
          >
            <Text className="text-white text-base text-center ">
              Copy my ink
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderFeedbackItem = ({ item }: { item: any }) => {
    const getRating = () => {
      switch (item.rating) {
        case 1:
          return "Negative";
        case 2:
          return "Neutral";
        case 3:
          return "Positive";
      }
    };

    return (
      <View className="border border-grey-2 rounded-lg p-4 mb-4">
        <View className="flex-row">
          <View className="bg-green rounded-lg py-1 px-2">
            <Text className="text-white text-base">{getRating()}</Text>
          </View>
        </View>

        <View className="flex-row justify-between my-2">
          <Text className="font-semibold">
            {item.product?.name || "Product"}
          </Text>
          <Text className="text-grey-6 text-xs">
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <Text className="text-black text-base font-bold">
          {activeTab === "received"
            ? item.user?.name || item?.sender || "Customer"
            : "You"}
        </Text>

        <Text className="text-grey-8 mb-2">{item?.description}</Text>

        <View className="flex-row items-center mb-1">
          <View className="flex-row">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Ionicons
                  key={i}
                  name={i < item.rating ? "star" : "star-outline"}
                  size={16}
                  color={i < item.rating ? "#FFD700" : colors.offWhite}
                  style={{ marginRight: 2 }}
                />
              ))}
          </View>
        </View>

        <Link href={`/product/${item?.product?.id}`}>
          <Text className="text-blue-700   font-bold"> View product</Text>
        </Link>
      </View>
    );
  };

  return (
    <View className="h-full bg-white py-4 px-2  relative z-50">
      <View className="flex-row justify-between mb-6 border-b border-grey-2 pb-2">
        <TouchableOpacity
          className={`px-6 py-2 ${
            activeTab === "received" ? "border-b-2 border-purple" : ""
          }`}
          onPress={() => handleTabChange("received")}
        >
          <Text
            className={
              activeTab === "received"
                ? "text-purple font-semibold"
                : "text-grey-6"
            }
          >
            Received ({pagination.totalReceived})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`px-6 py-2 relative ${
            activeTab === "sent" ? "border-b-2 border-purple" : ""
          }`}
          onPress={() => handleTabChange("sent")}
        >
          <Text
            className={
              activeTab === "sent" ? "text-purple font-semibold" : "text-grey-6"
            }
          >
            Sent ({pagination.totalSent})
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={feedbacks}
        renderItem={renderFeedbackItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={renderEmptyState}
        onEndReached={loadMoreFeedbacks}
        onEndReachedThreshold={0.3}
        refreshControl={
          <RefreshControl
            refreshing={loading && feedbacks.length > 0}
            onRefresh={refreshFeedbacks}
            colors={[colors.purple]}
            tintColor={colors.purple}
          />
        }
        ListFooterComponent={
          pagination.currentPage < pagination.lastPage && loading ? (
            <ActivityIndicator
              color={colors.purple}
              style={{ marginVertical: 20 }}
            />
          ) : null
        }
      />
    </View>
  );
}
