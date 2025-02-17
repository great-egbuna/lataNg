import React from "react";
import Header from "@/components/ui/Header/Header";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Slot, Tabs } from "expo-router";
import TabBarIcon from "@/components/ui/tabs/TabBarIcon";

export default function AppLayout() {
  return (
    <SafeAreaView className="bg-white  h-full ">
      <Header />

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
          name="profile"
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
      </Tabs>
    </SafeAreaView>
  );
}
