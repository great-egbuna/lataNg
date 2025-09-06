import ProductCard from "@/components/ui/Cards/ProductCard";
import { AppContextProps, useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { IAUTH } from "@/interfaces/context/auth";
import { productService } from "@/services/product.service";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function SimilarProducts({
  categoryId,
}: {
  categoryId: string;
}) {
  const { user } = useAuth() as IAUTH;
  const router = useRouter();
  const { setSelectedProduct } = useApp() as AppContextProps;
  const [loading, setLoading] = useState(true);
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const res = await productService.getProductsByCategory({
        page: 1,
        categoryId,
        limit: 4,
      });

      setSimilarProducts(res?.data);
      setLoading(false);
    })();
  }, []);

  if (loading) return null;

  return (
    <View>
      <Text
        className={
          "text-black font-medium text-base md:text-lg tracking-[-0.72px] mb-2"
        }
      >
        Similar Products
      </Text>
      <View className="flex-row ">
        {similarProducts?.slice(0, 2).map((item, index) => {
          return (
            <ProductCard
              key={index}
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
          );
        })}
      </View>

      <View className="flex-row ">
        {similarProducts?.slice(2, 4).map((item, index) => {
          return (
            <ProductCard
              key={index}
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
          );
        })}
      </View>
    </View>
  );
}
