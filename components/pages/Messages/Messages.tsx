import { FlatList, Text, View } from "react-native";
import MessageItem from "@/components/pages/Messages/MessageItem";
import Input from "@/components/general/Input";

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
    <View className={"gap-6"}>
      <View className={"bg-purple rounded px-4 py-3"}>
        <Text className={"text-white font-semibold text-sm"}>My Messages</Text>
      </View>

      <Input
        placeholder={"Search messages "}
        customStyles={{
          flexDirection: "column",
        }}
      />
    </View>
  );
};
