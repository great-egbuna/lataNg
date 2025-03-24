import React, { useState } from "react";
import Input from "@/components/general/Input";
import { ErrorMessage, Formik, FormikProps } from "formik";
import { Image, Text, View } from "react-native";
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
    placeholder: "Enter  Email",
    name: "email",
  },

  {
    placeholder: "Enter  Password",
    name: "password",
  },
];

export default function LoginComponent() {
  const router = useRouter();

  const { checkAuth } = useAuth() as IAUTH;
  const { decision } = useApp() as AppContextProps;

  const [loading, setLoading] = useState(false);
  const [loadingSocialAuth, setLoadingSocialAuth] = useState(false);

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

  const handleGoogleSignIn = async () => {
    setLoadingSocialAuth(true);

    const googleRes = await socialAuthService.googleSignIn();

    if (googleRes instanceof Error) {
      showToast({
        type: "error",
        text1: "Error",
        text2: googleRes.message,
      });
      setLoadingSocialAuth(false);
      return;
    }
    const values: ILOGIN = {
      email: googleRes?.email as string,
      password: "CompleteUserRegistration123$",
    };

    const res = await authService.login(values);

    if (res instanceof Error) {
      showToast({
        type: "error",
        text1: "Error",
        text2: res.message,
      });
      setLoadingSocialAuth(false);
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
      text2: res.message || "Success",
    });

    setLoadingSocialAuth(false);

    await save("lataPubToken", res.publicToken);

    checkAuth();
    router.push("/");
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

    const callbackResponse = await socialAuthService.googleCallback({
      role: decision,
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

    console.log("callback response", callbackResponse);

    setLoadingSocialAuth(false);

    await save("lataPubToken", callbackResponse?.publicToken);
    checkAuth();

    router.push("/");
  };

  const onPress =
    decision === "SELLER" ? handleGoogleSignIn : handleSignInBuyer;

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
          <View className="gap-10">
            {loginFields.map((field, index) => {
              return (
                <View key={index}>
                  <Input
                    placeholder={field.placeholder}
                    onChangeText={handleChange(field.name)}
                    onBlur={handleBlur(field.name)}
                    value={values[field.name]}
                    customStyles="bg-white"
                    customInputStyles="bg-white border rounded-md border-grey-12"
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

              <Link href={"/register"}>
                <Text className="font-normal text-small text-grey-6 text-center mx-auto">
                  Don’t have an account?{" "}
                  <Text className="text-purple text-small">Sign up</Text>
                </Text>
              </Link>

              <View className="flex-row items-center gap-[10px]">
                <View className="flex-1 h-0.5 text-grey-4" />
                <Text className="font-normal text-grey-6">Or login with</Text>
                <View className="flex-1 h-0.5 text-grey-4" />
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
              />

              <Text className="font-normal text-small text-grey-6 text-center mx-auto">
                By creating an account, you agree to the and{" "}
                <Text className="text-purple">Terms and Conditions</Text>{" "}
                <Text className="text-purple">Privacy Policy</Text>
              </Text>
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
}
