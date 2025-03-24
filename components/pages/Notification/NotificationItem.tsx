import { Text, View } from "react-native";
import RoundedImage from "@/components/ui/RoundedImage";
import { images } from "@/constants/images";
import { formatRelativeTime } from "@/utils/utils";

interface Props {
  message: string;
  image: string;
  id?: string;
  createdAt: string;
}

export default function NotificationItem({
  message,
  image,
  id,
  createdAt,
}: Props) {
  return (
    <View className={"flex-row gap-4 my-2 border-b border-grey-1 py-3"}>
      <RoundedImage imgSource={{ uri: image }} className={"self-center"} />

      <View className={"gap-0.5 flex-1"}>
        <Text className={"font-normal text-small text-grey-9"}>{message}</Text>

        <Text className={"font-normal text-tiny text-grey-8-100"}>
          {formatRelativeTime(createdAt)}
        </Text>
      </View>
    </View>
  );
}
