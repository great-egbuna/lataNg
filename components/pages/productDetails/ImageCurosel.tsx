import { Image, View } from "react-native";
import { images } from "@/constants/images";
import Button from "@/components/general/Button";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";

interface Props {
  uri: string;
  images: string[];
}

export default function ImageCurosel({ uri, images }: Props) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const onClickRightArrow = () => {
    const imagesArrLength = images?.length - 1;
    if (activeImageIndex === imagesArrLength) {
      setActiveImageIndex(0);
      return;
    }

    setActiveImageIndex((prev) => prev + 1);
  };

  const onClickLeftArrow = () => {
    const imagesArrLength = images?.length - 1;
    if (activeImageIndex === 0) {
      setActiveImageIndex(imagesArrLength);
      return;
    }

    setActiveImageIndex((prev) => prev - 1);
  };

  return (
    <View className={"flex-1 h-[350px] rounded-md relative"}>
      <Image
        className={"w-full h-full rounded-md object-cover bg-indigo-100/40"}
        source={{ uri: images[activeImageIndex]?.url || uri }}
        resizeMode={"cover"}
      />

      {images?.length > 1 && (
        <View
          className={
            "absolute inset-0 bg-rgba(0,0,0,0.6) flex-row items-center justify-between px-4"
          }
        >
          <Button
            icon={<Ionicons name={"arrow-back"} />}
            className="bg-white h-8 w-8 rounded-full border  border-gray-300"
            onPress={onClickLeftArrow}
          />

          <Button
            icon={<Ionicons name={"arrow-forward"} />}
            className="bg-white h-8 w-8 rounded-full border-gray-300"
            onPress={onClickRightArrow}
          />
        </View>
      )}

      {images?.length > 1 && (
        <View className="absolute bottom-5 w-full flex-row gap-2 items-center justify-center">
          {Array.from(images, (_, i) => {
            return (
              <View
                key={i}
                className={`w-2 h-2 rounded-full z-20  ${
                  i === activeImageIndex ? "bg-purple" : "bg-white"
                }`}
              ></View>
            );
          })}
        </View>
      )}
    </View>
  );
}
