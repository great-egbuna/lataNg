import ButtonSecondary from "@/components/general/ButtonSecondary";
import Loader from "@/components/general/Loader";
import { images } from "@/constants/images";
import { AppContextProps, useApp } from "@/context/AppContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, View } from "react-native";

export default function DecisionComponent() {
  const router = useRouter();
  const { setDecision } = useApp() as AppContextProps;

  const [loading, setLoading] = useState(false);

  const navigate = async (decison: string) => {
    setLoading(true);

    setDecision(decison);
    /*  await save("lataDecision", decison); */

    router.push("/register");

    setLoading(false);
  };

  return (
    <View className={"h-full bg-white p-3 justify-center items-center"}>
      <Image source={images.lataLogoBig} />

      <View className="w-full mt-28">
        <ButtonSecondary
          text={loading ? <Loader /> : "I want to buy"}
          customStyles="w-full bg-purple rounded-lg py-[10px]"
          customTextStyles="text-white text-base font-semibold"
          onPress={() => navigate("BUYER")}
        />

        <ButtonSecondary
          text={loading ? <Loader /> : "I want to sell"}
          customStyles="w-full  rounded-lg py-[10px] mt-6"
          customTextStyles="text-purple text-base font-semibold "
          onPress={() => navigate("SELLER")}
        />
      </View>
    </View>
  );
}
