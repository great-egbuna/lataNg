import ButtonSecondary from "@/components/general/ButtonSecondary";
import { images } from "@/constants/images";
import { AppContextProps, useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { IAUTH } from "@/interfaces/context/auth";
import { useState } from "react";
import { Image, Text, View } from "react-native";

const tabs = [
  {
    label: "Active",
    status: "ACTIVE",
    tab: "active",
    color: "text-[#292929]",
    bg: "bg-purple",
  },

  {
    label: "Reviewing",
    status: "INACTIVE",
    tab: "reviewing",

    color: "text-yellow-100",
    bg: "bg-yellow-100",
  },
  {
    label: "Declined",
    status: "CANCELLED",
    tab: "denied",

    color: "text-red-5",
    bg: "bg-red-5",
  },
  {
    label: "Draft",
    status: "DRAFT",
    tab: "draft",
    color: "text-[#000000]",
    bg: "bg-[#000]",
  },
];

export default function MyShopTabs({
  active,
  denied,
  draft,
  reviewing,
}: {
  active: number;
  denied: number;
  draft: number;
  reviewing: number;
}) {
  const { loading } = useAuth() as IAUTH;
  const {
    myProdActiveTab: isActiveTab,
    setMyProdActiveTab: setIsActiveTab,
    setMyProdQueryTab,
  } = useApp() as AppContextProps;

  const renderStatus = (label: string) => {
    switch (label) {
      case "Active":
        return active;

      case "Reviewing":
        return reviewing;

      case "Draft":
        return draft;

      case "Declined":
        return denied;
    }
  };

  const onPress = (tab: string, q: string) => {
    setIsActiveTab!(tab);
    setMyProdQueryTab!(q);
  };
  return (
    <View className=" gap-2 px-3.5 pt-4">
      <Text className="text-grey-9 font-semibold text-lg">My Shop</Text>
      <View className="flex-row">
        {tabs.map((tab) => {
          return (
            <ButtonSecondary
              text={`${tab.label} (${
                loading ? "..." : renderStatus(tab.label)
              })`}
              customStyles={`border-0 min-w-[1px] flex-1 min-h-[5px] py-1 px-0.5  rounded-3xl  ${
                isActiveTab === tab.status && tab.bg
              }`}
              customTextStyles={`${
                tab.color
              }  font-semibold text-center text-sm ${
                isActiveTab === tab.status && "text-white"
              } ${
                isActiveTab === "INACTIVE" && tab.status === "INACTIVE"
                  ? "text-[#fff]"
                  : tab.color
              }  
               
              `}
              key={tab.label}
              onPress={() => onPress(tab.status, tab.tab)}
            />
          );
        })}
      </View>
    </View>
  );
}
