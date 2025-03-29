import {
  Image,
  ImageSourcePropType,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import IonIcons from "@expo/vector-icons/Ionicons";
import { truncateString } from "@/utils/utils";
import { colors } from "@/colors";
import { AppContextProps, useApp } from "@/context/AppContext";
import { useState } from "react";
import { showToast } from "@/components/general/Toast";
import { useSavedProducts } from "@/hooks/useProducts";
import { IAUTH } from "@/interfaces/context/auth";
import { useAuth } from "@/context/AuthContext";

interface Props {
  discount?: string;
  price: string;
  name: string;
  desc: string;
  location: string;
  saved?: boolean;
  imgSource: ImageSourcePropType;
  label?: string;
  onPress?: () => void;
  isOwnProduct: boolean;
  id: string;
}

export default function ProductCard({
  discount,
  price,
  name,
  desc,
  location,
  imgSource,
  label,
  onPress,
  saved = false,
  isOwnProduct,
  id,
}: Props) {
  const { states } = useApp() as AppContextProps;
  const { checkIfProductIsSaved, toggleSaveProduct } = useSavedProducts();
  const { user, isLoggedIn } = useAuth() as IAUTH;

  const [isSaving, setIsSaving] = useState(false);

  const getState = (id: string) => {
    if (states) {
      const state = states.find((st) => st.id === id);
      return state?.name;
    }
  };

  const handleSaveProduct = async () => {
    try {
      if (!user || !isLoggedIn) {
        showToast({
          type: "error",
          text1: "Error",
          text2: "Please login to perform this action",
        });
        return;
      }

      if (isOwnProduct) {
        showToast({
          type: "error",
          text1: "Error",
          text2: "You cannot save your own product",
        });
        return;
      }

      setIsSaving(true);
      await toggleSaveProduct(id);
      setIsSaving(false);
    } catch (error: any) {
      setIsSaving(false);
      showToast({
        type: "error",
        text1: "Error",
        text2: error.message,
      });
    }
  };

  return (
    <TouchableOpacity
      className="flex-1 max-w-[194px] border border-grey-2 p-2 rounded-lg relative"
      onPress={onPress}
    >
      <Image
        className="w-full h-[148px] rounded-md"
        resizeMode="contain"
        source={{ uri: imgSource as string }}
      />

      <View className="my-8 gap-[6px]">
        {discount && (
          <Label text={`${discount}% OFF`} className="bg-[#fe0707]" />
        )}

        <Text className="text-purple font-semibold text-xs">N{price}</Text>

        <View className="flex-row justify-between items-center gap-2">
          <Text className="max-w-[50px]">{name}</Text>

          <View className="flex-1 items-end">
            <Pressable
              className="w-6 h-6 rounded-full flex items-center justify-center bg-offwhite "
              onPress={handleSaveProduct}
              disabled={isSaving}
            >
              <IonIcons
                name={
                  checkIfProductIsSaved(id) ? "bookmark" : "bookmarks-outline"
                }
                size={16}
                color={colors.purple}
              />
            </Pressable>
          </View>
        </View>

        <Text className="text-xs text-grey-8 font-normal w-full max-w-[92px]">
          {truncateString(desc)}
        </Text>

        <View className="flex-row items-center">
          <IonIcons name="location-outline" />

          <Text className="text-xs text-grey-8 font-normal w-full max-w-[92px]">
            {getState(location)}
          </Text>
        </View>
      </View>
      {label && (
        <Label text={label as string} className="absolute left-0 top-0" />
      )}
    </TouchableOpacity>
  );
}

const Label = ({ text, className }: { text: string; className?: string }) => {
  return (
    <View
      className={`bg-purple w-[67px] py-1.5 px-3 rounded-br-[3px] justify-center items-center ${className}`}
    >
      <Text className="text-white font-normal text-[10px]">{text}</Text>
    </View>
  );
};
