import { FullScreenLoader } from "@/components/general/Loader";
import { showToast } from "@/components/general/Toast";
import { userService } from "@/services/user.service";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import SellerContact from "../productDetails/SellerContact";
import SafetyTips from "../productDetails/SafetyTips";
import ProductCard from "@/components/ui/Cards/ProductCard";
import { ICreateProduct } from "@/interfaces/product";
import { ImageSourcePropType } from "react-native";
import { AppContextProps, useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { IAUTH } from "@/interfaces/context/auth";

interface ISellerProfile {
  id: string;
  name: string;
  phoneNumber?: string;
  userId?: string;
  avatar?: string;
  aboutBusiness?: string;
  products?: ICreateProduct[];
}

export default function SellerProfileComponent() {
  const { setSelectedProduct } = useApp() as AppContextProps;
  const { user } = useAuth() as IAUTH;

  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [seller, setSeller] = useState<ISellerProfile | null>(null);

  useEffect(() => {
    (async () => {
      const sellerInfo = await userService.getSellerInfo(id as string);

      if (sellerInfo instanceof Error) {
        showToast({
          type: "error",
          text1: "Error",
          text2: sellerInfo.message,
        });

        setLoading(false);
        setError(true);
        return;
      }

      setSeller(sellerInfo);
      setLoading(false);
    })();
  }, []);

  if (loading) return <FullScreenLoader />;

  if (error)
    return (
      <View className="min-h-full items-center justify-center">
        An Error Occurred. Please, Contact admin if issues persist
      </View>
    );

  return (
    <FlatList
      className="p-4 bg-white "
      ListHeaderComponent={
        <>
          <SellerContact
            name={seller?.name}
            phoneNumber={seller?.phoneNumber}
            userId={seller?.id}
            avatar={seller?.avatar}
          />

          <View className="my-4">
            <Text
              className={
                "text-grey-8-100 font-semibold text-xl tracking-[-0.72px]"
              }
            >
              About
            </Text>

            <Text
              className={
                "text-gray-700 font-light text-lg mt-1-5 max-w-2xl tracking-[-0.72px]"
              }
            >
              {seller?.aboutBusiness}
            </Text>
          </View>

          <SafetyTips />

          <Text
            className={
              "text-grey-8-100 font-semibold text-xl tracking-[-0.72px] my-4"
            }
          >
            Seller's Products
          </Text>
        </>
      }
      data={seller?.products}
      renderItem={({ item }) => (
        <ProductCard
          name={item?.name}
          desc={item?.description}
          label={item.meta?.planName}
          imgSource={item.meta?.selectedImage as ImageSourcePropType}
          location={item?.state}
          price={item.price}
          discount={item?.discount as number}
          onPress={() => {
            setSelectedProduct(item);
            router.push(`/product/${item.id}`);
          }}
          id={item.id as string}
          isOwnProduct={item.userId === user?.id}
        />
      )}
      numColumns={2}
    />
  );
}
