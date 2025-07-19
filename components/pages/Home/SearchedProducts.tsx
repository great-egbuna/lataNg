import Loader from "@/components/general/Loader";
import ProductCard from "@/components/ui/Cards/ProductCard";
import { AppContextProps, useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { ISearchContextProps, useSearch } from "@/context/SearchContext";
import { IAUTH } from "@/interfaces/context/auth";
import { getNumOfColumns } from "@/utils/utils";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { useWindowDimensions } from "react-native";
import { FlatList, ImageSourcePropType, Text, View } from "react-native";

export default function SearchProducts() {
  const {
    searchResult,
    setSearchPageCount,
    searchPageCount,
    meta,
    loadingSearch,
    handleSearch,
  } = useSearch() as ISearchContextProps;
  const { width } = useWindowDimensions();
  const { user } = useAuth() as IAUTH;

  const { setSelectedProduct } = useApp() as AppContextProps;
  const router = useRouter();

  const loadMore = async () => {
    if (meta.next_page_url) {
      setSearchPageCount((prev) => prev + 1);
    }
  };
  useEffect(() => {
    if (searchPageCount > 1) {
      handleSearch();
    }
  }, [searchPageCount]);

  if (searchResult.length === 0) return null;

  return (
    <View className="px-2 bg-white h-full">
      <FlatList
        data={searchResult}
        renderItem={({ item }) => (
          <ProductCard
            id={item.id as string}
            name={item?.name as string}
            desc={item?.description as string}
            label={item.meta?.planName}
            imgSource={item.meta?.selectedImage as ImageSourcePropType}
            location={item?.state}
            price={item.price as number}
            discount={item?.discount as string}
            onPress={() => {
              setSelectedProduct(item);
              router.push(`/product/${item?.id}`);
            }}
            isOwnProduct={item.userId === user?.id}
          />
        )}
        keyExtractor={(_item, index) => index.toString()}
        numColumns={getNumOfColumns(width)}
        columnWrapperClassName="mb-4 gap-4"
        ListHeaderComponent={
          <Text className="text-base my-5 font-semibold">Products</Text>
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.7}
        ListFooterComponent={loadingSearch ? <Loader /> : null}
      />
    </View>
  );
}
