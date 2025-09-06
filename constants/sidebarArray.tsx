import {
  MaterialCommunityIcons,
  Octicons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export const sidebar = [
  {
    icon: (
      <MaterialCommunityIcons name="home-outline" size={16} color={"#292929"} />
    ),
    label: "Home",
    path: "/",
  },

  {
    icon: <Ionicons name={"call-outline"} color={"#292929"} size={16} />,
    label: "Messages",
    path: "/message",
  },

  {
    icon: (
      <MaterialCommunityIcons
        name="bookmark-multiple-outline"
        size={16}
        color={"#292929"}
      />
    ),
    label: "Saved",
    path: "/saved",
  },

  {
    icon: (
      <MaterialCommunityIcons name="storefront" size={16} color={"#292929"} />
    ),
    label: "My Shop",
    path: "/shop",
  },

  {
    icon: <Ionicons name={"wallet-outline"} color={"#292929"} size={16} />,
    label: "Balance",
    path: "/balance",
  },

  {
    icon: (
      <MaterialCommunityIcons
        name={"keyboard-return"}
        color={"#292929"}
        size={16}
      />
    ),
    label: "Feedback",
    path: "/feedbacks",
  },

  {
    icon: <Octicons name={"credit-card"} color={"#292929"} size={16} />,
    label: "Subscriptions",
    path: "/subscriptions",
  },

  {
    icon: (
      <MaterialCommunityIcons
        name={"trending-up"}
        size={16}
        color={"#292929"}
      />
    ),
    label: "Analytics",
    path: "/analytics",
  },

  {
    icon: <SimpleLineIcons name={"settings"} color={"#292929"} size={16} />,
    label: "Settings",
    path: "/profile-form",
  },

  {
    icon: <Ionicons name={"call-outline"} color={"#292929"} size={16} />,
    label: "Call Manager",
    path: "/call-manager",
  },

  {
    icon: <MaterialCommunityIcons name={"table"} size={16} color={"#292929"} />,
    label: "Reels",
    path: "/create-reel",
  },
  {
    icon: (
      <MaterialIcons name={"manage-accounts"} size={16} color={"#292929"} />
    ),
    label: "Manage",
    path: "/manage",
  },
  {
    icon: (
      <MaterialIcons name={"pending-actions"} size={16} color={"#292929"} />
    ),
    label: "Sales Agreement",
    path: "/sales-agreement",
  },

  {
    icon: <MaterialIcons name={"logout"} size={16} color={"#292929"} />,
    label: "Logout",
    path: "/logout",
  },
];

export const buyerSidebar = [
  {
    icon: (
      <MaterialCommunityIcons name="home-outline" size={16} color={"#292929"} />
    ),
    label: "Home",
    path: "/",
  },
  {
    icon: <Ionicons name={"call-outline"} color={"#292929"} size={16} />,
    label: "Messages",
    path: "/message",
  },
  {
    icon: (
      <MaterialCommunityIcons
        name="bookmark-multiple-outline"
        size={16}
        color={"#292929"}
      />
    ),
    label: "Saved",
    path: "/saved",
  },
  {
    icon: (
      <MaterialIcons name="notifications-none" size={16} color={"#292929"} />
    ),
    label: "Notifications",
    path: "/notifications",
  },

  {
    icon: <SimpleLineIcons name={"settings"} color={"#292929"} size={16} />,
    label: "Settings",
    path: "/profile-form",
  },

  {
    icon: <Ionicons name={"call-outline"} color={"#292929"} size={16} />,
    label: "Call Manager",
    path: "/call-manager",
  },

  {
    icon: <MaterialIcons name={"logout"} size={16} color={"#292929"} />,
    label: "Logout",
    path: "/logout",
  },
];

export const notLoggedInSidebar = [
  {
    icon: (
      <MaterialCommunityIcons name="home-outline" size={16} color={"#292929"} />
    ),
    label: "Home",
    path: "/",
  },

  {
    icon: <Ionicons name={"call-outline"} color={"#292929"} size={16} />,
    label: "Message",
    path: "/message",
  },
  {
    icon: <Ionicons name={"call-outline"} color={"#292929"} size={16} />,
    label: "Call Manager",
    path: "/call-manager",
  },

  {
    icon: <MaterialIcons name={"logout"} size={16} color={"#292929"} />,
    label: "Logout",
    path: "/logout",
  },
];

export const getNotLoggedInSidebar = (isLoggedIn: boolean) => {
  return [
    {
      icon: (
        <MaterialCommunityIcons
          name="home-outline"
          size={16}
          color={"#292929"}
        />
      ),
      label: "Home",
      path: "/",
    },

    {
      icon: <MaterialIcons name={"mail-outline"} color={"#292929"} size={16} />,
      label: "Messages",
      path: isLoggedIn ? "/message" : "/login",
    },
    {
      icon: (
        <MaterialCommunityIcons
          name="bookmark-multiple-outline"
          size={16}
          color={"#292929"}
        />
      ),
      label: "Saved",
      path: isLoggedIn ? "/saved" : "/login",
    },
    {
      icon: (
        <MaterialIcons name="notifications-none" size={16} color={"#292929"} />
      ),
      label: "Notifications",
      path: isLoggedIn ? "/notifications" : "/login",
    },

    {
      icon: <SimpleLineIcons name={"settings"} color={"#292929"} size={16} />,
      label: "Settings",
      path: isLoggedIn ? "/profile-form" : "/login",
    },
  ];
};
