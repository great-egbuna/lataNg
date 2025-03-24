import { sidebar } from "@/constants/sidebarArray";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { Link, RelativePathString, useRouter } from "expo-router";
import { AppContextProps, useApp } from "@/context/AppContext";

export default function Sidebar() {
  const { navOpen, setNavOpen } = useApp() as AppContextProps;

  return (
    <View
      className={`absolute  z-50 bg-white left-0  w-[180px] h-full px-6 -translate-x-full ${
        navOpen && "translate-x-0"
      }`}
    >
      <FlatList
        data={sidebar}
        renderItem={({ item }) => <SidebarItem item={item} />}
      />
    </View>
  );
}

const SidebarItem = ({ item }: { item: (typeof sidebar)[0] }) => {
  const { setFeedbackOpen, setNavOpen } = useApp() as AppContextProps;
  const router = useRouter();
  return (
    <TouchableOpacity
      className={"flex flex-row items-center gap-2 mb-6"}
      onPress={() => {
        /*  if (item.path === "/feedback" ) {
          setFeedbackOpen(true);
          return;
        } */
        setNavOpen(false);
        router.push(item.path as RelativePathString);
      }}
    >
      <View
        className={
          "w-8 h-8 rounded-full bg-offwhite items-center justify-center"
        }
      >
        {item.icon}
      </View>
      <Text>{item.label}</Text>
    </TouchableOpacity>
  );
};
