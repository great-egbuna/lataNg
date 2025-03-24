import React, { useEffect, useState } from "react";
import { ScrollView, Text, View, ActivityIndicator } from "react-native";
import SubscriptionCards from "@/components/ui/Cards/SubscriptionCard";
import { Link, useRouter } from "expo-router";
import { AppContextProps, useApp } from "@/context/AppContext";

// Import the subscription service
import { subscriptionService } from "@/services/subscription.service";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { useAuth } from "@/context/AuthContext";
import { IAUTH } from "@/interfaces/context/auth";
import Loader from "@/components/general/Loader";
import PromptLogin from "@/components/ui/PromptLogin";

export const getColor = (index: number) => {
  const colors = ["bg-purple-5", "bg-purple", "bg-purple-8"];
  return colors[index % colors.length];
};

export default function SubscriptionsComponent() {
  const router = useRouter();
  const { selectedPackage, setSelectedPackage } = useApp() as AppContextProps;
  const { user, isLoggedIn } = useAuth() as IAUTH;

  const {
    subscriptionPackages,
    userData,
    loading,
    error,
    refetchSubscriptions,
  } = useSubscriptions();

  if (!isLoggedIn || !user) {
    return <PromptLogin />;
  }

  if (user?.role !== "SELLER") {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500 text-center mb-4">
          You are not a seller.
        </Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Loader size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-red-500 text-center mb-4">{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView className={"py-6 pb-10  rounded-[10px] bg-white"}>
      <View className={"border border-grey-2 gap-2  px-3"}>
        <View className={"px-10"}>
          <Text className={"text-base font-semibold text-grey-8 "}>
            Increase your product sales with our subscription packages
          </Text>

          <Text className={"text-sm text-grey-8 font-normal"}>
            Choose the right category of ads for you products to experience
            massive sales
          </Text>
        </View>

        <View className={"gap-6 mt-4 mb-8"}>
          {subscriptionPackages?.map((item, index) => {
            return (
              <SubscriptionCards
                text={item?.name as any}
                className={getColor(index)}
                key={index}
                onPress={() => {
                  setSelectedPackage(item);

                  router.push("/subscription-details");
                }}
                image={item?.meta?.image}
              />
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}
