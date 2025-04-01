import ButtonSecondary from "@/components/general/ButtonSecondary";
import { images } from "@/constants/images";
import { useAuth } from "@/context/AuthContext";
import { IAUTH } from "@/interfaces/context/auth";
import { useState } from "react";
import { Image, Text, View } from "react-native";

const tabs = [
  {
    label: "Active",
    color: "text-[#292929]",
  },

  {
    label: "Reviewing",
    color: "text-[#e5ae0f]",
  },
  {
    label: "Declined",
    color: "text-red-5",
  },
  {
    label: "Draft",
    color: "text-black",
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
  const [isActiveTab, setIsActiveTab] = useState("Active");

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

  const onPress = (tab: string) => {
    setIsActiveTab(tab);
  };
  return (
    <View className=" gap-9 px-3.5 pt-9">
      <Text className="text-grey-9 font-semibold">My Shop</Text>
      <View className="flex-row ">
        {tabs.map((tab) => {
          return (
            <ButtonSecondary
              text={`${tab.label} (${
                loading ? "..." : renderStatus(tab.label)
              })`}
              customStyles={`border-0 min-w-[1px] flex-1 ${
                isActiveTab === tab.label && "bg-purple"
              }`}
              customTextStyles={`${tab.color} font-semibold ${
                isActiveTab === tab.label && "text-white"
              }`}
              key={tab.label}
              onPress={() => onPress(tab.label)}
            />
          );
        })}
      </View>
    </View>
  );
}
