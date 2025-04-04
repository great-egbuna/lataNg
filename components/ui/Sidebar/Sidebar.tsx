import {
  notLoggedInSidebar,
  buyerSidebar,
  sidebar,
} from "@/constants/sidebarArray";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { Link, RelativePathString, useRouter } from "expo-router";
import { AppContextProps, useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { IAUTH } from "@/interfaces/context/auth";

export default function Sidebar() {
  const { navOpen, setNavOpen } = useApp() as AppContextProps;

  const { user, isLoggedIn } = useAuth() as IAUTH;

  const getSidebar = () => {
    if (isLoggedIn && user?.role === "BUYER") {
      return buyerSidebar;
    }

    if (isLoggedIn && user?.role === "SELLER") {
      return sidebar;
    }
    return notLoggedInSidebar;
  };

  return (
    <View
      className={`absolute  z-50 bg-white left-0  w-[180px] h-full px-6 -translate-x-full ${
        navOpen && "translate-x-0"
      }`}
    >
      <FlatList
        data={getSidebar()}
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
