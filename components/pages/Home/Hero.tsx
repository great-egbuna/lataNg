import React, { useEffect, useState } from "react";
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
import { AppContextProps, ICategory, useApp } from "@/context/AppContext";
import { useRouter } from "expo-router";
import { Reel } from "../Reels";
import CategoriesOverlay from "@/components/ui/Categories/CategoriesOverlay";
import FLatlistDropdown, {
  Dropdown,
} from "@/components/general/FlatlistDropDown";
import { productService } from "@/services/product.service";
import { useProductContext } from "@/context/ProductContext";

interface Props {
  setSelectedCategory: (value: ICategory | null) => void;
  selectedCategory?: ICategory;
  title?: string;
  showTitle?: boolean;
}

const ReelCircle = ({ item }: Reel) => {
  const router = useRouter();
  const { setSelectedReel } = useApp() as AppContextProps;

  return (
    <TouchableOpacity
      style={styles.reelCircle}
      onPress={() => {
        setSelectedReel(item as any);
        router.push("/reels");
      }}
    >
      <Image
        source={
          item.user?.avatar ? { uri: item?.user?.avatar } : images.lataLogoBig
        }
        /*         style={styles.avatar} */
        className="w-[60px] h-[60px] rounded-full border-[3px] border-[#C724FF] "
      />
      <Text style={styles.username} numberOfLines={1}>
        {item.user.name}
      </Text>
    </TouchableOpacity>
  );
};

export default function Hero({
  setSelectedCategory,
  selectedCategory,
  title,
}: Props) {
  const { categories, setSpecificCategoryProducts, reels } =
    useApp() as AppContextProps;

  const { setLoadingProducts, setProductFetchError } = useProductContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleFetchSpecificCategories = async (value: ICategory) => {
    setLoadingProducts(true);
    setSelectedCategory(value);
    setIsOpen(false);
    const specificProductsResponse = await productService.getProductsByCategory(
      {
        categoryId: value?.id,
      }
    );

    if (specificProductsResponse instanceof Error) {
      setProductFetchError(
        `Failed to ${value.name} products. Please reload the app`
      );
    } else {
      setSpecificCategoryProducts(specificProductsResponse?.data);
    }

    setLoadingProducts(false);
  };

  return (
    <View>
      <View
        style={styles.heroBox}
        className="mt-2  flex-row justify-between items-end rounded "
      >
        <Image
          source={images.manWithPhone}
          className="relative top-[5px] h-full"
        />
        <Image
          source={images.boyGirlWithPhone}
          className="relative top-[5px] h-full"
        />
      </View>

      <FlatList
        data={reels}
        horizontal
        bounces={false}
        renderItem={({ item }) => <ReelCircle item={item} />}
        className="mt-2"
        showsHorizontalScrollIndicator={false}
      />

      <View className="flex-row itms-center justify-between mt-4">
        {/*  <ButtonSecondary text="Select category" icon={"keyboard-arrow-down"} /> */}

        <View className="w-[140px] py-0.5 ">
          <FLatlistDropdown
            placeholder={selectedCategory?.name}
            btnClassName="py-0 rounded-xl  border-purple min-h-[28px]"
            textClassName="text-purple text-bold"
            iconColor={colors.purple}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
        </View>

        <ButtonSecondary
          text="BUY HERE"
          customStyles="bg-purple self-start min-h-[28px]"
          customTextStyles=" text-white font-semibold"
          onPress={toggleModal}
        />
      </View>
      {isOpen && (
        <Dropdown
          onPress={(value) => handleFetchSpecificCategories(value)}
          data={categories as ICategory[]}
        />
      )}

      <Text className={`text-base md:text-lg  font-medium my-2`}>
        {title || "Trending Products"}
      </Text>

      {/* Categories Overlay */}
      <CategoriesOverlay
        visible={modalVisible}
        onClose={toggleModal}
        title="Select Category to Buy"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  heroBox: {
    /*  flex: 1, */
    backgroundColor: colors.purple,

    height: 150,
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
