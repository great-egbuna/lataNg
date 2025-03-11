import { FlatList, Text, View } from "react-native";
import { products } from "@/constants/products";
import ProductCard from "@/components/ui/Cards/ProductCard";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors } from "@/colors";

export default function SavedPageComponent() {
  const router = useRouter();
  return (
    <FlatList
      data={products}
      renderItem={({ item }) => (
        <ProductCard
          {...item}
          onPress={() => router.push(`/product/${item.id}`)}
          saved={true}
        />
      )}
      numColumns={2}
      className="h-full bg-white px-2 gap-2"
      columnWrapperClassName="mb-4 gap-4"
      ListHeaderComponent={() => <Header />}
    />
  );
}

const Header = () => {
  return (
    <View
      className={
        "justify-between  py-10 flex-row px-[45px] items-center bg-white"
      }
    >
      <Text className={"text-grey-9 font-semibold text-sm"}>Saved</Text>

      <View className={"flex-row gap-2"}>
        <Ionicons name={"trash-outline"} color={colors.purple} />
        <Text className={"text-purple font-normal text-small"}>Delete all</Text>
      </View>
    </View>
  );
};
