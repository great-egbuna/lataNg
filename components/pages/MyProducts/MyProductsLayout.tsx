import { View } from "react-native";
import MyShopTabs from "./MyShopTabs";
import { ReactNode } from "react";

export default function MyProductsLayout({
  myProducts,
  children,
}: {
  myProducts: Record<string, any>;
  children: ReactNode;
}) {
  return (
    <View className="h-full bg-white gap-9">
      <MyShopTabs
        active={myProducts.statusCounts?.active}
        denied={myProducts.statusCounts?.denied}
        reviewing={myProducts.statusCounts?.reviewing}
        draft={myProducts.statusCounts?.draft}
      />

      {children}
    </View>
  );
}
