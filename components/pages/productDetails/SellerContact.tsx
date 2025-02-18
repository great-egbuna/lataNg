import { View } from "react-native";
import ImageText from "@/components/ui/ImageText";
import Button from "@/components/general/Button";
import { colors } from "@/colors";
import { images } from "@/constants/images";

export default function SellerContact() {
  return (
    <View className={" px-11 py-6 border border-grey-2 rounded-[10px]"}>
      <ImageText
        title={"Techking Gadgets"}
        text={"08087453840"}
        imgSource={images.itel}
      />

      <SellerCTA />
    </View>
  );
}

const SellerCTA = () => {
  return (
    <View className="gap-2 mt-6">
      <Button
        customStyle={{
          backgroundColor: colors.purple,
          width: "100%",
          fontWeight: 600,
          borderRadius: 12,
        }}
        text={"WhatsApp Seller"}
      />
      <Button
        customStyle={{
          backgroundColor: colors.white,
          width: "100%",
          borderWidth: 1,
          borderColor: colors.purple,
          borderRadius: 12,
        }}
        buttonTextStyle={{
          fontWeight: 600,
          color: colors.purple,
        }}
        text={"Call Seller"}
      />
      <Button
        customStyle={{
          backgroundColor: colors.white,
          width: "100%",
          borderWidth: 1,
          borderColor: colors.purple,
          borderRadius: 12,
        }}
        buttonTextStyle={{
          fontWeight: 600,
          color: colors.purple,
        }}
        text={"Send message to Seller"}
      />
    </View>
  );
};
