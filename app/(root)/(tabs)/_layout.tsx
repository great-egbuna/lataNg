import React, { useEffect } from "react";
import Header from "@/components/ui/Header/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import { Tabs } from "expo-router";
import TabBarIcon from "@/components/ui/tabs/TabBarIcon";
import Sidebar from "@/components/ui/Sidebar/Sidebar";
import { AppContextProps, useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { IAUTH } from "@/interfaces/context/auth";
import { useSearch, ISearchContextProps } from "@/context/SearchContext";

export default function AppLayout() {
  const { setNavOpen, navOpen, subCategories, setSubCategoryProducts } =
    useApp() as AppContextProps;
  const { user, isLoggedIn } = useAuth() as IAUTH;
  const { searchResult, setSearchResult } = useSearch() as ISearchContextProps;

  return (
    <SafeAreaView className="bg-white  h-full relative ">
      <Header />

      <Sidebar />
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,

          tabBarStyle: {
            backgroundColor: "#5113a1",
            minHeight: 70,
          },
          tabBarIconStyle: {
            flex: 1,
            width: "100%",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          listeners={{
            tabPress: () => {
              if (searchResult && searchResult?.length > 0) {
                setSearchResult([]);
              }

              if (subCategories && subCategories?.length > 0) {
                setSubCategoryProducts(null);
              }
            },
          }}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => {
              return (
                <TabBarIcon text={"Home"} focused={focused} icon={"home"} />
              );
            },
          }}
        />{" "}
        <Tabs.Screen
          name="message"
          options={{
            headerShown: false,
            //href: null,
            href: user?.role === "SELLER" ? "/message" : null,
            tabBarIcon: ({ focused }) => {
              return (
                <TabBarIcon
                  text="Message"
                  focused={focused}
                  icon={"mail-outline"}
                />
              );
            },
          }}
        />{" "}
        <Tabs.Screen
          name="sell"
          options={{
            headerShown: false,
            href: user?.role === "SELLER" ? "/sell" : "/decision",
            tabBarIcon: ({ focused }) => {
              return (
                <TabBarIcon
                  text="Sell"
                  focused={focused}
                  icon={"add"}
                  customStyles="border border-grey-5 rounded"
                />
              );
            },
          }}
        />{" "}
        <Tabs.Screen
          name="shop"
          options={{
            headerShown: false,
            href: user?.role === "SELLER" ? "/shop" : null,
            tabBarIcon: ({ focused }) => {
              if (user?.role === "SELLER")
                return (
                  <TabBarIcon
                    focused={focused}
                    text="My Shop"
                    icon={"storefront"}
                  />
                );
            },
          }}
        />
        <Tabs.Screen
          name="notifications"
          options={{
            headerShown: false,
            href: isLoggedIn ? "/notifications" : "/login",
            tabBarIcon: ({ focused }) => {
              return (
                <TabBarIcon
                  text="Notifications"
                  focused={focused}
                  icon={"notifications-none"}
                />
              );
            },
          }}
        />{" "}
        <Tabs.Screen
          name="sidebar-toggle"
          listeners={() => ({
            tabPress: (e) => {
              e.preventDefault();
              setNavOpen(!navOpen);
            },
          })}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => {
              return (
                <TabBarIcon
                  text="Profile"
                  focused={focused}
                  icon={"person-outline"}
                />
              );
            },
          }}
        />
        <Tabs.Screen
          name="saved"
          options={{
            headerShown: false,
            href: null,
          }}
        />
        <Tabs.Screen
          name="balance"
          options={{
            headerShown: false,
            href: null,
          }}
        />
        <Tabs.Screen
          name="subscriptions"
          options={{
            headerShown: false,
            href: null,
          }}
        />
        <Tabs.Screen
          name="subscription-details"
          options={{
            headerShown: false,
            href: null,
          }}
        />{" "}
        <Tabs.Screen
          name="analytics"
          options={{
            headerShown: false,
            href: null,
          }}
        />{" "}
        <Tabs.Screen
          name="profile-form"
          options={{
            headerShown: false,
            href: null,
          }}
        />
        <Tabs.Screen
          name="call-manager"
          options={{
            headerShown: false,
            href: null,
          }}
        />
        <Tabs.Screen
          name="sales-agreement"
          options={{
            headerShown: false,
            href: null,
          }}
        />
        <Tabs.Screen
          name="feedbacks"
          options={{
            headerShown: false,
            href: null,
          }}
        />
        <Tabs.Screen
          name="reels"
          options={{
            headerShown: false,
            href: null,
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
