import React from "react";
import { colors } from "@/colors";
import { images } from "@/constants/images";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import ReelCircle from "./ReelCircle";
import ButtonSecondary from "@/components/general/ButtonSecondary";
import DropdownInput from "@/components/general/Dropdown";
import { AppContextProps, ICategory, useApp } from "@/context/AppContext";

interface Props {
  setCategory: (value: ICategory | null) => void;
}

const reels = [
  {
    name: "My Store",
    imgSource: images.itel,
  },
  {
    name: "Tech",
    imgSource: images.airFryer,
  },
  {
    name: "Appliances",
    imgSource: images.clippers,
  },
  {
    name: "Fashion",
    imgSource: images.fashion,
  },
  {
    name: "Breverage",
    imgSource: images.drinks,
  },
  {
    name: "Gadgets",
    imgSource: images.pc,
  },
  {
    name: "Jumia",
    imgSource: images.ps5,
  },
  {
    name: "Gaming",
    imgSource: images.gameChair,
  },
];

export default function Hero({ setCategory }: Props) {
  const { categories } = useApp() as AppContextProps;

  return (
    <>
      <View
        style={styles.heroBox}
        className="mt-8 mb-6 flex-row justify-between "
      >
        <Image source={images.manWithPhone} />
        <Image source={images.boyGirlWithPhone} />
      </View>

      <FlatList
        data={reels}
        horizontal
        bounces={false}
        renderItem={({ item }) => <ReelCircle {...item} />}
        showsHorizontalScrollIndicator={false}
      />

      <View className="flex-row justify-between mt-8">
        {/*  <ButtonSecondary text="Select category" icon={"keyboard-arrow-down"} /> */}

        <DropdownInput
          placeholder="Select category"
          className="min-w-[140px] grow-0  py-0.5"
          btnClassName="py-0 rounded-xl min-h-[32px] border-purple"
          textClassName="text-purple text-bold"
          iconColor={colors.purple}
          data={categories as ICategory[]}
          onSelect={(value) => setCategory(value)}
        />
        <ButtonSecondary
          text="BUY HERE"
          customStyles="bg-purple"
          customTextStyles=" text-white font-semibold"
        />
      </View>

      <Text className="text-base my-5 font-semibold">Trending Products</Text>
    </>
  );
}

const styles = StyleSheet.create({
  heroBox: {
    flex: 1,
    backgroundColor: colors.purple,
    borderRadius: 7,
    height: 160,
    padding: 4,
  },
});
