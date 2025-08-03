import { View, StyleSheet, Image, Text } from "react-native";

import Button from "@/components/general/Button";
import Input from "@/components/general/Input";
import LocationBox from "./LocationBox";
import { Link, useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { IAUTH } from "@/interfaces/context/auth";
import CustomToast from "../CustomToast";
import { useState } from "react";
import StatesDropdown from "../StatesDropdown";
import { ISearchContextProps, useSearch } from "@/context/SearchContext";
import logo from "@/assets/images/icon.png";
import { colors } from "@/colors";
import { usePathname } from "expo-router";
import { Feather } from "@expo/vector-icons";

export default function Header() {
  const { isLoggedIn, user } = useAuth() as IAUTH;
  const {
    setSearchResult,
    loadingSearch,
    state,
    setSearch,
    setState,
    handleSearch,
    setSearchPageCount,
  } = useSearch() as ISearchContextProps;
  const router = useRouter();
  const pathname = usePathname();

  const [showCustomToast, setShowCustomToast] = useState(false);
  const [show, setShow] = useState(false);

  const onPress = () => {
    if (isLoggedIn) {
      if (user && user.role === "SELLER") {
        router.push("/sell");
      } else {
        setShowCustomToast(true);
      }
    }

    if (!isLoggedIn) router.push("/decision");
  };

  const onChangeText = (text: string) => {
    setSearch(text);

    if (text.length === 0) {
      setSearchResult([]);
      setSearchPageCount(1);
    }
  };

  const handleLoocationSelect = (value: any) => {
    setState(value.name);
    setShow(false);
  };

  const handleSearchButtonClick = () => {
    setSearchPageCount(1);
    handleSearch();
  };

  return (
    <>
      <View
        style={styles.containerStyle}
        className="px-2 items-center relative"
      >
        <Image source={logo} />

        <Input
          placeholder="Search for products here "
          showBtn={true}
          onChangeText={(text) => onChangeText(text)}
          onPress={handleSearchButtonClick}
          loading={loadingSearch}
          customInputStyles="shadow-2xl"
          customStyles="self-center max-h-6"
          btnClassName={{ backgroundColor: colors.purple }}
        />

        <LocationBox text={state} onPress={() => setShow(!show)} />
        <Button text="SELL" onPress={onPress} className="rounded-xl" />

        <StatesDropdown onSelect={handleLoocationSelect} show={show} />

        <CustomToast
          text={`Only sellers can sell \nproducts`}
          buttonText="Become a seller"
          show={showCustomToast}
          onClose={() => setShowCustomToast(false)}
          setShow={setShowCustomToast}
          onPress={() => router.push("/upgrade-buyer")}
        />
      </View>

      {pathname !== "/" && (
        <View className="flex-row items-center gap-1">
          <Feather name="arrow-left" color={"#787878"} />
          <Link href={"/"}>
            <Text className="text-base underline   text-base underline text-grey-8">
              Home
            </Text>
          </Link>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 8,
    /*    height: 42, */
  },
});
