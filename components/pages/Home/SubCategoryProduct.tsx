import Loader from "@/components/general/Loader";
import ProductCard from "@/components/ui/Cards/ProductCard";
import { AppContextProps, useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { IAUTH } from "@/interfaces/context/auth";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { FlatList, ImageSourcePropType, Text, View } from "react-native";
import Hero from "./Hero";

export default function SubCategoroyProducts({
  setCategory,
}: {
  setCategory: (category: any) => void;
}) {
  const { user } = useAuth() as IAUTH;

  const { subCategoryProducts, setSelectedProduct } =
    useApp() as AppContextProps;
  const router = useRouter();

  if (!subCategoryProducts) return null;

  if (subCategoryProducts && subCategoryProducts?.length === 0) return null;

  return (
    <View className="px-2 bg-white">
      <FlatList
        data={subCategoryProducts}
        renderItem={({ item }) => (
          <ProductCard
            id={item.id as string}
            name={item?.name as string}
            desc={item?.description as string}
            label={item.meta?.planName}
            imgSource={item.meta?.selectedImage as ImageSourcePropType}
            location={item?.state}
            price={item.price?.toLocaleString() as string}
            onPress={() => {
              setSelectedProduct(item);
              router.push(`/product/${item?.id}`);
            }}
            isOwnProduct={item.userId === user?.id}
          />
        )}
        keyExtractor={(_item, index) => index.toString()}
        numColumns={2}
        columnWrapperClassName="mb-4 gap-4"
        className="mt-6"
        ListHeaderComponent={
          <Hero setCategory={setCategory} title="Products" />
        }
        // onEndReached={loadMore}
        // onEndReachedThreshold={0.7}
        // ListFooterComponent={loadingSearch ? <Loader /> : null}
      />
    </View>
  );
}
