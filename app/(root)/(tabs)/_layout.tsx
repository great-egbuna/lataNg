import React, { useEffect } from "react";
import Header from "@/components/ui/Header/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import { Slot, Tabs } from "expo-router";
import TabBarIcon from "@/components/ui/tabs/TabBarIcon";
import Sidebar from "@/components/ui/Sidebar/Sidebar";
import { AppContextProps, useApp } from "@/context/AppContext";
import FeedbackModal from "@/components/ui/Modal/FeedbackModal";

export default function AppLayout() {
  const { setNavOpen, navOpen } = useApp() as AppContextProps;

  return (
    <SafeAreaView className="bg-white  h-full relative ">
      <Header />
      <FeedbackModal />

      <Sidebar />
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,

          tabBarStyle: {
            backgroundColor: "#5113a1",
            minHeight: 102,
          },
          tabBarIconStyle: {
            flex: 1,
            width: "100%",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => {
              return <TabBarIcon text="Home" focused={focused} icon={"home"} />;
            },
          }}
        />{" "}
        <Tabs.Screen
          name="message"
          options={{
            headerShown: false,
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
          name="notifications"
          options={{
            headerShown: false,
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
      </Tabs>
    </SafeAreaView>
  );
}
