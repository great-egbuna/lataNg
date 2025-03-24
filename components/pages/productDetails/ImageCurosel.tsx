import { Image, View } from "react-native";
import { images } from "@/constants/images";
import Button from "@/components/general/Button";
import Ionicons from "@expo/vector-icons/Ionicons";

interface Props {
  uri: string;
}

export default function ImageCurosel({ uri }: Props) {
  return (
    <View className={"flex-1 h-[179px] rounded-md relative"}>
      <Image
        className={"w-full h-full rounded-md object-cover "}
        source={{ uri: uri }}
        resizeMode={"cover"}
      />

      {/*   <View
        className={
          "absolute inset-0 bg-rgba(0,0,0,0.6) flex-row items-center justify-between px-4"
        }
      >
        <Button
          icon={<Ionicons name={"arrow-back"} />}
          customStyle={{
            backgroundColor: "white",
            width: 32,
            height: 32,
            borderRadius: "50%",
          }}
        />

        <Button
          icon={<Ionicons name={"arrow-forward"} />}
          customStyle={{
            backgroundColor: "white",
            width: 32,
            height: 32,
            borderRadius: "50%",
          }}
        />
      </View> */}
    </View>
  );
}
