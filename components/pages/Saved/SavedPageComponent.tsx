import {
  FlatList,
  ImageSourcePropType,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import ProductCard from "@/components/ui/Cards/ProductCard";
import { useRouter } from "expo-router";
import { useSavedProducts } from "@/hooks/useProducts";
import { useAuth } from "@/context/AuthContext";
import { IAUTH } from "@/interfaces/context/auth";
import Loader from "@/components/general/Loader";
import PromptLogin from "@/components/ui/PromptLogin";
import { AppContextProps, useApp } from "@/context/AppContext";
import { getNumOfColumns } from "@/utils/utils";
import { useEffect } from "react";

export default function SavedPageComponent() {
  const { width } = useWindowDimensions();

  const router = useRouter();
  const { user, isLoggedIn } = useAuth() as IAUTH;
  const { setSelectedProduct, saveProductId } = useApp() as AppContextProps;

  const {
    savedProducts,
    loading,
    loadMoreSavedProducts,
    refreshSavedProducts,
  } = useSavedProducts();

  useEffect(() => {
    (async () => await refreshSavedProducts())();
  }, [saveProductId]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Loader size="large" />
      </View>
    );
  }

  if (!isLoggedIn || !user) {
    return <PromptLogin />;
  }

  return (
    <View className="px-2 bg-white h-full">
      <FlatList
        data={savedProducts}
        renderItem={({ item }) => (
          <ProductCard
            saved
            id={item.product?.id as string}
            name={item?.product?.name as string}
            desc={item?.product?.description as string}
            label={item.meta?.planName}
            imgSource={item?.product?.files?.[0]?.url as ImageSourcePropType}
            location={item?.product?.state}
            price={item?.product?.price}
            discount={item?.product?.discount}
            onPress={() => {
              setSelectedProduct(item);
              router.push(`/product/${item?.id}`);
            }}
            isOwnProduct={item.product?.userId === user?.id}
          />
        )}
        keyExtractor={(_item, index) => index.toString()}
        numColumns={getNumOfColumns(width)}
        columnWrapperClassName="mb-4 gap-4"
        className="mt-3"
        ListHeaderComponent={() => (
          <Text className="text-lg my-3 font-semibold">Saved Products</Text>
        )}
        onEndReached={loadMoreSavedProducts}
        onEndReachedThreshold={0.7}
        ListEmptyComponent={() => (
          <Text className="font-light text-gray-500 text-base">
            No products found
          </Text>
        )}
      />
    </View>
  );
}
