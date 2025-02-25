import { FlatList, Text, TouchableOpacity, View } from "react-native";
import MessageItem from "@/components/pages/Messages/MessageItem";
import Input from "@/components/general/Input";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Messages() {
  return (
    <FlatList
      data={[1, 2, 3]}
      renderItem={() => <MessageItem />}
      className={"h-full px-2 bg-white py-4"}
      ListHeaderComponent={<Header />}
    />
  );
}

const Header = () => {
  return (
    <View className={"gap-6 mb-9"}>
      <View
        className={
          "bg-purple rounded-[5px] px-[45px] py-3 flex-row items-center justify-between"
        }
      >
        <Text className={"text-white font-semibold text-sm"}>My Messages</Text>

        <TouchableOpacity>
          <MaterialCommunityIcons
            name={"dots-vertical"}
            color={"white"}
            size={16}
          />
        </TouchableOpacity>
      </View>

      <Input
        placeholder={"Search messages "}
        customInputStyles={"pl-[45px]"}
        customStyles={"pr-[45px] bg-offwhite rounded-[10px]"}
        showBtn={true}
        btnClassName={"bg-[#f5f5f5]"}
        iconSize={16}
        iconColor={"#787878"}
      />
    </View>
  );
};
