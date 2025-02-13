import React from "react";
import Header from "@/components/ui/Header/Header";
import { StyleSheet, View } from "react-native";

export default function AppLayout() {
  return (
    <View style={styles.layoutStyles}>
      <Header />
    </View>
  );
}

const styles = StyleSheet.create({
  layoutStyles: {
    padding: 10,
  },
});
