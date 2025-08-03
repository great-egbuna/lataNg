import {
  Image,
  ImageSourcePropType,
  Pressable,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

import IonIcons from "@expo/vector-icons/Ionicons";
import { colors } from "@/colors";
import { AppContextProps, useApp } from "@/context/AppContext";
import { useEffect, useState } from "react";
import { showToast } from "@/components/general/Toast";
import { useSavedProducts } from "@/hooks/useProducts";
import { IAUTH } from "@/interfaces/context/auth";
import { useAuth } from "@/context/AuthContext";
import { FontAwesome6 } from "@expo/vector-icons";

interface Props {
  discount: number;
  price: number;
  name: string;
  desc: string;
  location: string;
  saved?: boolean;
  imgSource: ImageSourcePropType;
  label?: string;
  onPress?: () => void;
  isOwnProduct: boolean;
  id: string;
  review?: boolean;
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
  review,
}: Props) {
  const { width } = useWindowDimensions();
  const { states, setSaveProductId, saveProductId } =
    useApp() as AppContextProps;
  const { checkIfProductIsSaved, toggleSaveProduct, savedProducts } =
    useSavedProducts();
  const { user, isLoggedIn } = useAuth() as IAUTH;
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(saved || false);

  const uuidRgx =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/;

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

      setIsSaved(!isSaved);

      setIsSaving(true);
      await toggleSaveProduct(id);
      setIsSaving(false);

      setSaveProductId!((prevId: string | undefined) => {
        if (prevId === id) return undefined;
        return id;
      });
    } catch (error: any) {
      setIsSaving(false);
      showToast({
        type: "error",
        text1: "Error",
        text2: error.message,
      });
    }
  };

  const getCardWidth = () => {
    if (width > 800) {
      return "max-w-[400px]";
    } else {
      return "may-w-[380px]";
    }
  };

  const calculateDiscount = (discount: number) => {
    const discountFloat = discount / 100;
    const discountedPrice = price * discountFloat;

    const priceAfterDiscount = price - discountedPrice;

    return priceAfterDiscount.toLocaleString();
  };

  const handleCardClick = () => {
    onPress!();
    /* router.push(`/product/${id}`); */
  };

  useEffect(() => {
    setIsSaved(checkIfProductIsSaved(id));
  }, [saveProductId, savedProducts]);

  return (
    <TouchableOpacity
      className={`flex-1 ${getCardWidth()} border border-grey-2 p-2 rounded-lg relative `}
      onPress={handleCardClick}
    >
      <View className="relative">
        <Image
          className="w-full h-[148px] rounded-md bg-indigo-100/40"
          source={{ uri: imgSource as string }}
        />
        {review && (
          <View className="absolute inset-0 items-end justify-end">
            <View className="bg-white border border-purple px-3 py-1 rounded">
              <Text className="text-purple">Under Review</Text>
            </View>
          </View>
        )}
      </View>

      <View className="my-2 gap-[6px]">
        {!!discount && (
          <View className="flex-row items-center gap-2">
            <Label
              text={`${discount}% OFF`}
              labelClassName="bg-[#fe0707] px-2 "
            />
          </View>
        )}

        <Discount
          isDiscount={!!discount}
          price={price}
          calculateDiscount={calculateDiscount}
          discount={discount}
        />
        <Text className="font-normal text-base md:text-lg tracking-[-0.72px]">
          {name}
        </Text>

        <Text className="text-base text-grey-8 font-normal w-full  tracking-[-0.72px] line-clamp-2">
          {desc}
        </Text>

        <View className=" flex-row items-center justify-between gap-4 flex-1">
          <View className="flex-row items-center ">
            <IonIcons name="location-outline" size={16} />

            <Text className="text-base md:text-lg text-grey-8 font-normal shrink">
              {/*   {getState(location)} */}

              {uuidRgx.test(location) ? getState(location) : location}
            </Text>
          </View>

          {!isOwnProduct && (
            <Pressable
              className="w-6 h-6 rounded-full flex items-center justify-center bg-offwhite "
              onPress={handleSaveProduct}
              disabled={isSaving}
            >
              <IonIcons
                name={isSaved ? "bookmark" : "bookmarks-outline"}
                size={16}
                color={colors.purple}
              />
            </Pressable>
          )}
        </View>
      </View>
      {!!label && (
        <Label
          text={label as string}
          labelClassName="absolute left-2 top-2 bg-purple"
        />
      )}
    </TouchableOpacity>
  );
}

const Label = ({
  text,
  labelClassName,
}: {
  text: string;
  labelClassName?: string;
}) => {
  return (
    <View
      className={` py-1.5  px-3 rounded-br-[3px] justify-center items-center rounded w-fit ${labelClassName}`}
    >
      <Text className="text-white font-normal text-sm md:text-base">
        {text}
      </Text>
    </View>
  );
};

const Discount = ({
  discount,
  isDiscount,
  price,
  calculateDiscount,
}: {
  isDiscount: boolean;
  discount: number;
  price: number;
  calculateDiscount: (discount: number) => string;
}) => {
  if (!isDiscount)
    return (
      <Text className="text-purple font-extrabold text-xl tracking-[-0.72px]">
        <FontAwesome6 name="naira-sign" size={20} />
        {price?.toLocaleString()}
      </Text>
    );

  return (
    <View>
      <Text className="text-gray-400 font-extrabold text-lg line-through">
        <FontAwesome6 name="naira-sign" size={20} />
        {price?.toLocaleString()}
      </Text>

      <Text className="text-purple font-extrabold text-xl ">
        <FontAwesome6 name="naira-sign" size={20} />
        {calculateDiscount(discount)}
      </Text>
    </View>
  );
};
