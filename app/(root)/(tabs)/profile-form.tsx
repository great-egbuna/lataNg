import React from "react";

import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Formik } from "formik";
import ProfileDetails from "@/components/pages/Profile/ProfileDetails";
import PasswordDetails from "@/components/pages/Profile/PasswordDetails";
import ProfileSettings from "@/components/pages/Profile/ProfileSettings";

export default function Profile() {
  const onSubmit = (values: any) => {};

  return (
    <ScrollView className={"h-full bg-white px-2 gap-3"}>
      <Formik onSubmit={onSubmit} initialValues={{}}>
        {({ handleChange, handleBlur }) => {
          return (
            <>
              <View className={"px-2 h-full bg-white"}>
                <Text className={"font-semibold text-grey-9 text-sm my-6"}>
                  Settings
                </Text>

                <ProfileDetails
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                />

                <PasswordDetails
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                />

                <ProfileSettings />

                <View className={"items-end my-4"}>
                  <TouchableOpacity
                    className={
                      "w-[86px] h-[40px] rounded-[12px]  bg-purple flex items-center justify-center"
                    }
                  >
                    <Text className={"text-white font-semibold "}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          );
        }}
      </Formik>
    </ScrollView>
  );
}
