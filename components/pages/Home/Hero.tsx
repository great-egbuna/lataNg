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
  ScrollView,
} from "react-native";
import ButtonSecondary from "@/components/general/ButtonSecondary";
import DropdownInput from "@/components/general/Dropdown";
import { AppContextProps, ICategory, useApp } from "@/context/AppContext";
import { useRouter } from "expo-router";
import { Reel } from "../Reels";
import CategoriesOverlay from "@/components/ui/Categories/CategoriesOverlay";
import FLatlistDropdown, {
  Dropdown,
} from "@/components/general/FlatlistDropDown";
import SubCategoroyProducts from "./SubCategoryProduct";

interface Props {
  setCategory: (value: ICategory | null) => void;
  category?: ICategory;
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

export default function Hero({
  setCategory,
  category,
  title,
  showTitle = true,
}: Props) {
  const { categories, setSubCategoryProducts, subCategoryProducts, reels } =
    useApp() as AppContextProps;
  const [modalVisible, setModalVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<ICategory | null>(null);
  const [newCategories, setNewCategories] = useState(categories);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  useEffect(() => {
    const isExists = categories?.find((ctg) => ctg?.name === "All categories");
    if (isExists) return;
    categories?.unshift({ id: "", name: "All categories" });
    setNewCategories(categories);
  }),
    [];

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
        showsHorizontalScrollIndicator={false}
      />

      <View className="flex-row justify-between mt-4">
        {/*  <ButtonSecondary text="Select category" icon={"keyboard-arrow-down"} /> */}

        <View className="w-[140px] py-0.5">
          <FLatlistDropdown
            placeholder={category?.name}
            btnClassName="py-0 rounded-xl  border-purple min-h-[28px]"
            textClassName="text-purple text-bold"
            iconColor={colors.purple}
            data={newCategories as ICategory[]}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            selectedValue={selectedValue?.name}
            setSelectedValue={setSelectedValue}
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
          onPress={(value) => {
            setSelectedValue(value);
            setCategory(value);
            setSubCategoryProducts(null);
            setIsOpen(false);
          }}
          data={categories as ICategory[]}
        />
      )}

      {subCategoryProducts && subCategoryProducts.length === 0 ? (
        <View className="gap">
          <Text className="text-base mt-2 font-semibold text-gray-300">
            No Products Found In That Category
          </Text>

          <Text className="text-xl my-2 font-semibold">
            {title || "Trending Products"}
          </Text>
        </View>
      ) : (
        <>
          {showTitle && (
            <Text className={`text-xl  font-semibold my-2`}>
              {category?.name && category?.name !== "All categories"
                ? title
                : title || "Trending Products"}
            </Text>
          )}
        </>
      )}

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
