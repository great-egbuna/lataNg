import React from "react";
import { colors } from "@/colors";
import { images } from "@/constants/images";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import ButtonSecondary from "@/components/general/ButtonSecondary";
import DropdownInput from "@/components/general/Dropdown";
import { AppContextProps, ICategory, useApp } from "@/context/AppContext";
import { useRouter } from "expo-router";
import { DUMMY_REELS } from "@/components/pages/Reels/ReelsComponent";
import { Reel } from "../Reels";

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

const ReelCircle = ({ user }: Reel) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.reelCircle}
      onPress={() => router.push("/reels")}
    >
      <Image source={{ uri: user.avatar }} style={styles.avatar} />
      <Text style={styles.username} numberOfLines={1}>
        {user.name}
      </Text>
    </TouchableOpacity>
  );
};

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
        data={DUMMY_REELS}
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
  reelCircle: {
    alignItems: "center",
    marginHorizontal: 5,
    width: 70,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#E1306C",
  },
  username: {
    fontSize: 12,
    marginTop: 4,
    width: 60,
    textAlign: "center",
  },
});
