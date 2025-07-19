import { Text, View } from "react-native";
import IconText from "@/components/general/IconText";
import { formatRelativeTime } from "@/utils/utils";
import { AppContextProps, useApp } from "@/context/AppContext";
import { FontAwesome6 } from "@expo/vector-icons";

interface IProductDetails {
  price: number;
  name: string;
  description: string;
  location: string;
  postTime: string;
  category: string;
  subCategoryId: string;
  type: string | null;
}

export default function ProductDescription({
  price,
  name,
  description,
  location,
  postTime,
  category,
  subCategoryId,
  type,
}: IProductDetails) {
  const { subCategories } = useApp() as AppContextProps;

  const subCategory = subCategories?.find(
    (subCat) => subCat?.id === subCategoryId
  );

  return (
    <View
      className={"flex-col gap-2.5  border border-grey-2 rounded-[10px] p-3"}
    >
      <Text className={"text-purple font-extrabold text-xl"}>
        <FontAwesome6 name="naira-sign" size={20} />
        {price?.toLocaleString()}
      </Text>

      <Text className={"text-grey-10 font-semibold text-xl tracking-[-0.72px]"}>
        {name}
      </Text>

      <View
        className={"flex-row gap-3 items-center border-b border-gray-200 pb-2"}
      >
        <IconText text={formatRelativeTime(postTime)} icon={"time-outline"} />
        <IconText text={location} icon={"location-outline"} />
      </View>

      <View>
        <Text
          className={"text-grey-8-100 font-semibold text-xl tracking-[-0.72px]"}
        >
          Product Description
        </Text>

        <Text
          className={
            "text-gray-700 font-light text-lg mt-1-5 max-w-2xl tracking-[-0.72px]"
          }
        >
          {description}
        </Text>
      </View>

      <View>
        <Text
          className={"text-grey-8-100 font-semibold text-xl tracking-[-0.72px]"}
        >
          Product Category
        </Text>

        <Text
          className={
            "text-gray-700 font-light text-lg mt-1-5 max-w-2xl tracking-[-0.72px]"
          }
        >
          {category}
        </Text>
      </View>

      <View>
        <Text
          className={"text-grey-8-100 font-semibold text-xl tracking-[-0.72px]"}
        >
          Product Subcategory
        </Text>

        <Text
          className={
            "text-gray-700 font-light text-lg tracking-[-0.72px] mt-1-5 max-w-2xl"
          }
        >
          {/* SubCategory Id can be the actual sub category name */}

          {subCategory?.name || subCategoryId}
        </Text>
      </View>

      {type && (
        <View>
          <Text
            className={
              "text-grey-8-100 font-semibold text-xl tracking-[-0.72px]"
            }
          >
            Product Type
          </Text>

          <Text
            className={
              "text-gray-700 font-light text-lg tracking-[-0.72px] mt-1-5 max-w-2xl"
            }
          >
            {type}
          </Text>
        </View>
      )}
    </View>
  );
}
