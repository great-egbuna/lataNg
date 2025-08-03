import React, { useState } from "react";
import Input from "@/components/general/Input";
import { ErrorMessage, Formik, FormikProps } from "formik";
import { Image, Text, TouchableOpacity, View } from "react-native";
import ButtonSecondary from "@/components/general/ButtonSecondary";
import { images } from "@/constants/images";
import * as yup from "yup";
import { Link, useRouter } from "expo-router";
import { authService } from "@/services/auth.service";
import { showToast } from "@/components/general/Toast";
import Loader from "@/components/general/Loader";
import { save } from "@/store/storage";
import { useAuth } from "@/context/AuthContext";
import { IAUTH } from "@/interfaces/context/auth";
import { socialAuthService } from "@/services/socialAuth.service";
import { ILOGIN } from "@/interfaces/auth";
import { colors } from "@/colors";
import { AppContextProps, useApp } from "@/context/AppContext";
import { customLogger } from "@/utils/utils";
import { Feather } from "@expo/vector-icons";

const schemaValidation = yup.object().shape({
  email: yup
    .string()
    .trim()
    .email("Must be a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

const loginFields = [
  {
    placeholder: "Enter your email",
    name: "email",
  },

  {
    placeholder: "Enter Your Password",
    name: "password",
  },
];

export default function LoginComponent() {
  const router = useRouter();

  const { checkAuth } = useAuth() as IAUTH;
  const { decision } = useApp() as AppContextProps;

  const [loading, setLoading] = useState(false);
  const [loadingSocialAuth, setLoadingSocialAuth] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (
    values: any,
    { resetForm }: { resetForm: () => void }
  ) => {
    setLoading(true);

    const res = await authService.login(values);

    if (res instanceof Error) {
      showToast({
        type: "error",
        text1: "Error",
        text2: res.message,
      });
      setLoading(false);
      return;
    }

    if (!res.publicToken || !res.isEmailVerified) {
      showToast({
        type: "error",
        text1: "Error",
        text2: "Please verify your email",
      });
      setLoading(false);

      return;
    }

    showToast({
      type: "success",
      text1: "Success",
      text2: res.message,
    });

    resetForm();
    setLoading(false);

    await save("lataPubToken", res.publicToken);

    checkAuth();

    console.log("res", res);
    router.push("/");
  };

  const handleSocialAuth = async () => {
    setLoadingSocialAuth(true);

    const res = await socialAuthService.googleSignUp();

    if (res instanceof Error) {
      showToast({
        type: "error",
        text1: "Request Failed",
        text2: "Failed to sign in with google",
      });
      setLoadingSocialAuth(false);

      return;
    }
    console.log("descison", decision);
    const callbackResponse = await socialAuthService.googleCallbackNotAlly({
      role: "BUYER",
      accessToken: res as string,
    });

    if (callbackResponse instanceof Error) {
      showToast({
        type: "error",
        text1: "Request Failed",
        text2: "Failed to sign in with google",
      });
      setLoadingSocialAuth(false);

      return;
    }

    showToast({
      type: "success",
      text1: "Success",
      text2: "Success",
    });

    // @ts-ignore

    if (callbackResponse?.shouldCompleteProfile) {
      router.push("/complete-signup");
    } else {
      await save("lataPubToken", callbackResponse?.publicToken);
      checkAuth!();
      router.push("/");
      setLoading(false);
      setLoadingSocialAuth(false);
    }

    return;
  };
  const handleSignInBuyer = async () => {
    setLoadingSocialAuth(true);

    const res = await socialAuthService.googleSignUp();
    if (res instanceof Error) {
      showToast({
        type: "error",
        text1: "Request Failed",
        text2: "Failed to sign in with google",
      });
      setLoadingSocialAuth(false);

      return;
    }

    const callbackResponse = await socialAuthService.googleCallbackNotAlly({
      role: decision,
      accessToken: res as string,
    });

    if (callbackResponse instanceof Error) {
      customLogger({
        file: "LoginComponent.tsx",
        component: "LoginComponent",
        log: callbackResponse,
      });

      showToast({
        type: "error",
        text1: "Request Failed",
        text2: "Failed to sign in with google",
      });
      setLoadingSocialAuth(false);
      setLoading(false);

      return;
    }

    showToast({
      type: "success",
      text1: "Success",
      text2: "Success",
    });

    setLoadingSocialAuth(false);

    await save("lataPubToken", callbackResponse?.publicToken);
    checkAuth();

    router.push("/");
  };

  const onPress = handleSocialAuth;

  return (
    <View className=" mt-12">
      <Image source={images.lataLogoSmall} />
      <Text className="font-medium text-xl text-grey-9 mt-3 mb-5">
        Login account
      </Text>

      <Formik
        onSubmit={onSubmit}
        initialValues={{}}
        validationSchema={schemaValidation}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
        }: FormikProps<any>) => (
          <View className="gap-6">
            {loginFields.map((field, index) => {
              const isPassword = field.name === "password";
              return (
                <View key={index} className="flex-1">
                  <Input
                    placeholder={field.placeholder}
                    onChangeText={handleChange(field.name)}
                    onBlur={handleBlur(field.name)}
                    value={values[field.name]}
                    customStyles="bg-white border rounded-md border-grey-12 px-3 py-2 items-center"
                    customInputStyles="bg-white"
                    secureTextEntry={isPassword && !showPassword}
                    // If your Input supports a rightIcon or similar prop:
                    rightIcon={
                      isPassword ? (
                        <TouchableOpacity
                          onPress={() => setShowPassword((prev) => !prev)}
                        >
                          {showPassword ? (
                            <Feather name="eye" size={20} />
                          ) : (
                            <Feather name="eye-off" size={20} />
                          )}
                        </TouchableOpacity>
                      ) : null
                    }
                  />

                  {(errors[field.name] as any) && (
                    <Text className="text-danger  text-small mt-2">
                      {errors[field.name] as any}
                    </Text>
                  )}
                </View>
              );
            })}
            <View className="gap-6">
              <ButtonSecondary
                text={loading ? <Loader size="small" color="white" /> : "Login"}
                customStyles="bg-purple rounded-lg w-full   w-full py-2.5 rounded-md"
                customTextStyles="text-white font-semibold text-base"
                onPress={handleSubmit}
              />

              <Link href={"/decision"}>
                <Text className="font-normal text-lg text-grey-6 text-center mx-auto">
                  Don’t have an account ?{" "}
                  <Text className="text-purple text-lg">Sign up</Text>
                </Text>
              </Link>
              {/* 
              <View className="flex-row items-center gap-[10px]">
                <View className="flex-1 h-0.5 bg-gray-100" />
                <Text className="font-normal text-grey-6">Or login with</Text>
                <View className="flex-1 h-0.5  bg-gray-100" />
              </View>

              <ButtonSecondary
                text={
                  loadingSocialAuth ? (
                    <Loader size="small" color={colors.purple} />
                  ) : (
                    "Sign in with Google"
                  )
                }
                customStyles="bg-white rounded-lg w-full py-2.5 rounded-md"
                customTextStyles="text-purple font-semibold text-base"
                iconSrc={loadingSocialAuth ? "" : images.googleIcon}
                onPress={onPress}
              /> */}

              <Text className="font-normal text-base text-grey-6  mx-auto">
                By creating an account, you agree to the
                <Text className="text-purple">
                  Terms and Conditions
                </Text> and <Text className="text-purple">Privacy Policy</Text>
              </Text>
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
}
