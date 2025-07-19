import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View, Alert } from "react-native";
import { Formik } from "formik";
import ProfileDetails from "@/components/pages/Profile/ProfileDetails";
import PasswordDetails from "@/components/pages/Profile/PasswordDetails";
import ProfileSettings from "@/components/pages/Profile/ProfileSettings";
import { useAuth } from "@/context/AuthContext";
import { IAUTH } from "@/interfaces/context/auth";
import PromptLogin from "@/components/ui/PromptLogin";
import { useProfileUpdate } from "@/hooks/useUser";

export default function Profile() {
  const { user, isLoggedIn } = useAuth() as IAUTH;
  const userSettings = user?.settings[0]?.columnValue;

  const [submitting, setSubmitting] = useState(false);

  const { updateProfile, loading, error, success } = useProfileUpdate({
    onSuccess: () => {
      Alert.alert("Success", "Your profile has been updated successfully");
      setSubmitting(false);
    },
    onError: (err) => {
      Alert.alert("Error", err.message || "Failed to update profile");
      setSubmitting(false);
    },
  });

  const onSubmit = async (values: any) => {
    setSubmitting(true);

    try {
      // Create a clean copy of values that doesn't include undefined values
      const cleanValues = Object.entries(values).reduce((acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, any>);

      // Prepare the metadata string - this is crucial to fix the SQL error
      const metaString = JSON.stringify({
        ...(user?.meta
          ? typeof user.meta === "string"
            ? JSON.parse(user.meta)
            : user.meta
          : {}),
        lastUpdated: new Date().toISOString(),
      });

      // First create a base object with the correct types
      const profileData: Record<string, any> = {
        // Include fields with correct types
        name: cleanValues.name,
        address: cleanValues.address,
        aboutBusiness: cleanValues.aboutBusiness,
        phoneNumber: cleanValues.phoneNumber,
        oldPassword: cleanValues.oldPassword,
        newPassword: cleanValues.newPassword,
        confirmPassword: cleanValues.confirmPassword,
        feature: Boolean(cleanValues.feature),
        sms: Boolean(cleanValues.sms),
        feedback: Boolean(cleanValues.feedback),
        subscription: Boolean(cleanValues.subscription),
        meta: metaString,
      };

      // Only include file if it exists
      if (cleanValues.file) {
        profileData.file = cleanValues.file;
      }

      await updateProfile(profileData);
    } catch (err) {
      console.error("Error in form submission:", err);
      Alert.alert("Error", "Failed to process form data");
      setSubmitting(false);
    }
  };

  if (!user || !isLoggedIn) {
    return <PromptLogin />;
  }

  return (
    <ScrollView className={"h-full bg-white px-2 gap-3"}>
      <Formik
        onSubmit={onSubmit}
        initialValues={{
          name: user?.name || "",
          address: user?.address || "",
          aboutBusiness: user?.aboutBusiness || "",
          phoneNumber: user?.phoneNumber || "",
          feature: userSettings?.feature || false,
          subscription: userSettings?.subscription || false,
          feedback: userSettings?.feedback || false,
          sms: userSettings?.sms || false,
        }}
      >
        {({
          handleChange,
          handleBlur,
          setFieldValue,
          handleSubmit,
          values,
        }) => {
          return (
            <>
              <View className={"px-2 h-full bg-white"}>
                <Text className={"font-semibold text-grey-9 text-base mt-4 "}>
                  Settings
                </Text>

                <ProfileDetails
                  handleChange={(field) => handleChange(field)}
                  handleBlur={(field) => handleBlur(field)}
                  setFieldValue={setFieldValue}
                  values={values}
                />

                <PasswordDetails
                  handleChange={(field) => handleChange(field)}
                  handleBlur={(field) => handleBlur(field)}
                  values={values}
                  setFieldValue={setFieldValue}
                />

                <ProfileSettings
                  handleChange={(field, value) => setFieldValue(field, value)}
                  values={values}
                />

                <View className={"items-end my-4"}>
                  <TouchableOpacity
                    className={`w-[86px] h-[40px] rounded-[12px] ${
                      loading || submitting ? "bg-purple-300" : "bg-purple"
                    } flex items-center justify-center`}
                    onPress={() => handleSubmit()}
                    disabled={loading || submitting}
                  >
                    <Text className={"text-white font-semibold"}>
                      {loading || submitting ? "Saving..." : "Save"}
                    </Text>
                  </TouchableOpacity>
                </View>

                {error && (
                  <Text className="text-red-500 text-center mb-4">
                    {error.message}
                  </Text>
                )}

                {success && (
                  <Text className="text-green-500 text-center mb-4">
                    Profile updated successfully
                  </Text>
                )}
              </View>
            </>
          );
        }}
      </Formik>
    </ScrollView>
  );
}
