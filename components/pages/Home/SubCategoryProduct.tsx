import Loader, { FullScreenLoader } from "@/components/general/Loader";
import ProductCard from "@/components/ui/Cards/ProductCard";
import { AppContextProps, IProduct, useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { IAUTH } from "@/interfaces/context/auth";
import { useRouter } from "expo-router";
import {
  FlatList,
  ImageSourcePropType,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import Hero from "./Hero";

export default function SubCategoroyProducts({
  setCategory,
  products,
}: {
  setCategory: (category: any) => void;
  products: any[];
}) {
  const { width } = useWindowDimensions();
  const { user } = useAuth() as IAUTH;

  const { subCategoryProducts, setSelectedProduct, loadingCategory } =
    useApp() as AppContextProps;
  const router = useRouter();

  const getNumOfColumns = () => {
    if (width >= 800) return 3;
    return 2;
  };

  if (loadingCategory) return <FullScreenLoader label="Please wait..." />;

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
            discount={item.discount as string}
            label={item.meta?.planName}
            imgSource={item.meta?.selectedImage as ImageSourcePropType}
            location={item?.state}
            price={item.price as number}
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
        ListFooterComponent={
          <View>
            <FlatList
              data={products}
              renderItem={({ item }) => (
                <ProductCard
                  name={item?.name}
                  desc={item?.description}
                  label={item.meta?.planName}
                  imgSource={item.meta?.selectedImage}
                  location={item?.state}
                  price={item.price}
                  discount={item?.discount}
                  onPress={() => {
                    setSelectedProduct(item);
                    router.push(`/product/${item.id}`);
                  }}
                  id={item.id as string}
                  isOwnProduct={item.userId === user?.id}
                />
              )}
              keyExtractor={(_item, index) => index.toString()}
              numColumns={getNumOfColumns()}
              columnWrapperClassName="mb-4 gap-4"
            />
          </View>
        }
      />
    </View>
  );
}
