import React, { useState } from "react";
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
import CategoriesOverlay from "@/components/ui/Categories/CategoriesOverlay";

interface Props {
  setCategory: (value: ICategory | null) => void;
  title?: string;
}

const ReelCircle = ({ item }: Reel) => {
  const router = useRouter();
  const { setSelectedReel } = useApp() as AppContextProps;
  return (
    <TouchableOpacity
      style={styles.reelCircle}
      onPress={() => {
        setSelectedReel(item.reels as any);
        router.push("/reels");
      }}
    >
      <Image
        source={
          item.user?.avatar ? { uri: item?.user?.avatar } : images.lataLogoBig
        }
        style={styles.avatar}
      />
      <Text style={styles.username} numberOfLines={1}>
        {item.user.name}
      </Text>
    </TouchableOpacity>
  );
};

export default function Hero({ setCategory, title }: Props) {
  const { categories, setSubCategoryProducts, reels } =
    useApp() as AppContextProps;
  const [modalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <>
      <View
        style={styles.heroBox}
        className="mt-8 mb-6 flex-row justify-between items-end"
      >
        <Image source={images.manWithPhone} className="relative top-[5px]" />
        <Image
          source={images.boyGirlWithPhone}
          className="relative top-[5px]"
        />
      </View>

      <FlatList
        data={reels}
        horizontal
        bounces={false}
        renderItem={({ item }) => <ReelCircle item={item} />}
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
          onSelect={(value) => {
            setCategory(value);
            setSubCategoryProducts(null);
          }}
        />
        <ButtonSecondary
          text="BUY HERE"
          customStyles="bg-purple"
          customTextStyles=" text-white font-semibold"
          onPress={toggleModal}
        />
      </View>

      <Text className="text-base my-5 font-semibold">
        {title || "Trending Products"}
      </Text>

      {/* Categories Overlay */}
      <CategoriesOverlay
        visible={modalVisible}
        onClose={toggleModal}
        title="Select Category to Buy"
      />
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
    borderColor: colors.purple,
  },
  username: {
    fontSize: 12,
    marginTop: 4,
    width: 60,
    textAlign: "center",
  },
});
