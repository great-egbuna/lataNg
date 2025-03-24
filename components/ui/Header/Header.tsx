import { View, StyleSheet } from "react-native";

import Button from "@/components/general/Button";
import Input from "@/components/general/Input";
import LocationBox from "./LocationBox";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { IAUTH } from "@/interfaces/context/auth";
import CustomToast from "../CustomToast";
import { useState } from "react";
import StatesDropdown from "../StatesDropdown";
import { ISearchContextProps, useSearch } from "@/context/SearchContext";

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

  return (
    <View style={styles.containerStyle} className="px-2 items-center relative">
      <Button
        text="SELL"
        customStyle={{
          width: 50,
          flexShrink: 0,
          padding: 0,
          height: 35,
        }}
        onPress={onPress}
        className="rounded-base"
      />

      <Input
        placeholder="Search for products here"
        showBtn={true}
        onChangeText={(text) => onChangeText(text)}
        onPress={handleSearch}
        loading={loadingSearch}
      />

      <LocationBox text={state} onPress={() => setShow(!show)} />

      <StatesDropdown onSelect={handleLoocationSelect} show={show} />

      <CustomToast
        text={`Only sellers can sell \nproducts`}
        buttonText="Become a seller"
        show={showCustomToast}
        onClose={() => setShowCustomToast(false)}
        onPress={() => router.push("/upgrade-buyer")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 12,
    /*    height: 42, */
  },
});
