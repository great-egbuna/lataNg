import Overlay from "@/components/general/Overlay";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { AppContextProps, useApp } from "@/context/AppContext";
import ButtonOutline from "@/components/general/ButtonOutline";

export default function FeedbackModal() {
  const { feedbackOpen, setFeedbackOpen } = useApp() as AppContextProps;

  return (
    <Overlay>
      <View
        className={
          "relative  bg-white w-full self-start  rounded-[7px] p-5 mb-7"
        }
      >
        <TouchableOpacity
          className={"self-end"}
          onPress={() => setFeedbackOpen(false)}
        >
          <FontAwesome5 name={"times"} size={20} />
        </TouchableOpacity>

        <View className={"gap-3"}>
          <Text className={"text-black font-normal text-sm"}>
            Leave a feedback for joy shop
          </Text>

          <Text className={"text-black font-normal text-xs"}>
            How was your experience?
          </Text>

          <View className={"flex-row gap-3"}>
            <ButtonOutline
              text={"Positive"}
              className={"border-green"}
              textStyle={"text-green"}
            />

            <ButtonOutline
              text={"Positive"}
              className={"border-yellow"}
              textStyle={"text-green text-yellow"}
            />

            <ButtonOutline
              text={"Positive"}
              className={"border-danger-100"}
              textStyle={"text-danger-100"}
            />
          </View>
        </View>

        <View className={"gap-3 mt-5"}>
          <TextInput
            className={
              "border border-grey-5 h-[150px] placeholder:justify-start"
            }
            multiline={true}
            placeholder={"Type your message"}
          />

          <View className={"flex-row justify-end"}>
            <TouchableOpacity
              className={"w-[102px] bg-white h-8 items-center justify-center"}
            >
              <Text className={"font-semibold text-base text-purple"}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={
                "w-[168px] bg-purple h-8 items-center justify-center rounded-xl"
              }
            >
              <Text className={"font-semibold text-white"}>Send Feedback</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Overlay>
  );
}
