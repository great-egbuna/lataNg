import {
  notLoggedInSidebar,
  buyerSidebar,
  sidebar,
  getNotLoggedInSidebar,
} from "@/constants/sidebarArray";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { Link, RelativePathString, useRouter } from "expo-router";
import { AppContextProps, useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { IAUTH } from "@/interfaces/context/auth";
import { usePathname } from "expo-router";

export default function Sidebar() {
  const { navOpen } = useApp() as AppContextProps;

  const { user, isLoggedIn } = useAuth() as IAUTH;

  const getSidebar = () => {
    if (isLoggedIn && user?.role === "BUYER") {
      return buyerSidebar;
    }

    if (isLoggedIn && user?.role === "SELLER") {
      return sidebar;
    }
    return getNotLoggedInSidebar(isLoggedIn);
  };

  return (
    <View
      className={`absolute  z-50 bg-white left-0  w-[200px] h-full px-6 -translate-x-full ${
        navOpen && "translate-x-0"
      } `}
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
  const pathname = usePathname();

  const router = useRouter();
  return (
    <TouchableOpacity
      className={`flex flex-row items-center gap-2 mb-2 rounded  p-2  ${
        pathname === item.path && "bg-purple-2"
      } `}
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
      <Text
        className={`text-gray-900 ${pathname === item.path && "text-purple"} `}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );
};
