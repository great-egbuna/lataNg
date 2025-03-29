import { FlatList, ImageSourcePropType, Text, View } from "react-native";
import { products } from "@/constants/products";
import ProductCard from "@/components/ui/Cards/ProductCard";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors } from "@/colors";
import { useSavedProducts } from "@/hooks/useProducts";
import { useAuth } from "@/context/AuthContext";
import { IAUTH } from "@/interfaces/context/auth";
import Loader from "@/components/general/Loader";
import PromptLogin from "@/components/ui/PromptLogin";
import { AppContextProps, useApp } from "@/context/AppContext";

export default function SavedPageComponent() {
  const router = useRouter();
  const { user, isLoggedIn } = useAuth() as IAUTH;
  const { setSelectedProduct } = useApp() as AppContextProps;

  const { savedProducts, loading, loadMoreSavedProducts } = useSavedProducts();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Loader size="large" />;
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
            id={item.product?.id as string}
            name={item?.product?.name as string}
            desc={item?.product?.description as string}
            label={item.meta?.planName}
            imgSource={item?.product?.files?.[0]?.url as ImageSourcePropType}
            location={item?.product?.state}
            price={item?.product?.price?.toLocaleString() as string}
            onPress={() => {
              setSelectedProduct(item);
              router.push(`/product/${item?.id}`);
            }}
            isOwnProduct={item.product?.userId === user?.id}
          />
        )}
        keyExtractor={(_item, index) => index.toString()}
        numColumns={2}
        columnWrapperClassName="mb-4 gap-4"
        className="mt-6"
        ListHeaderComponent={
          <Text className="text-base my-5 font-semibold">Saved Products</Text>
        }
        onEndReached={loadMoreSavedProducts}
        onEndReachedThreshold={0.7}
        /*       ListFooterComponent={loadingSearch ? <Loader /> : null} */
      />
    </View>
  );
}
