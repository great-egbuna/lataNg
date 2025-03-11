import React, { useState } from "react";
import Input from "@/components/general/Input";
import { Formik, FormikProps } from "formik";
import {
  Image,
  ImageSourcePropType,
  Linking,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ButtonSecondary from "@/components/general/ButtonSecondary";
import { images } from "@/constants/images";
import * as yup from "yup";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { ACCEPTED_IMAGE_TYPES } from "@/constants/image_types";
import Loader from "@/components/general/Loader";
import * as ImagePicker from "expo-image-picker";
import { authService } from "@/services/auth.service";
import { showToast } from "@/components/general/Toast";
import { Image as ExpoImage, type ImageSource } from "expo-image";
import { useRouter } from "expo-router";
import { socialAuthService } from "@/services/socialAuth.service";
import { colors } from "@/colors";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { save } from "@/store/storage";
import { AppContextProps, useApp } from "@/context/AppContext";
import { buyerFields, sellerFields } from "@/constants/form";
import { useAuth } from "@/context/AuthContext";
import { IAUTH } from "@/interfaces/context/auth";

const DEFAULT_USER_ROLE = "BUYER";

const phoneNumberValidation = yup
  .string()
  .trim()
  .matches(/^\+?[0-9]{10,15}$/, "Phone number is not valid")
  .min(10, "Phone number must be at least 10 digits")
  .max(15, "Phone number must be at most 15 digits");

const schemaValidation = yup.object().shape({
  name: yup
    .string()
    .trim()
    .when("role", {
      is: "SELLER",
      then: (schema) => schema.required("Business name is required"),
      otherwise: (schema) => schema.required(" name is required"),
    }),
  email: yup
    .string()
    .email("Must be a valid email")
    .required("Email is required"),

  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),

  phoneNumber: phoneNumberValidation.when("role", {
    is: "SELLER",
    then: (schema) => schema.required("Phone number is required for SELLER"),
    otherwise: (schema) => schema.notRequired(),
  }),

  role: yup
    .mixed()
    .oneOf(["BUYER", "SELLER", "ADMIN", "STAFF"])
    .default(DEFAULT_USER_ROLE),

  address: yup
    .string()
    .trim()
    .max(255, "Address must be at most 255 characters long"),
  aboutBusiness: yup.string().trim(),
  file: yup
    .mixed()
    .test("fileSize", "File size is too large", (value: any) => {
      return !value || value.size <= 5 * 1024 * 1024;
    })
    .test("fileType", "Unsupported file format", (value: any) => {
      return !value || ACCEPTED_IMAGE_TYPES.includes(value.type);
    }),
});

export default function RegisterComponent() {
  const { setSocialUser, decision } = useApp() as AppContextProps;
  const { checkAuth } = useAuth() as IAUTH;

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [loadingSocialAuth, setLoadingSocialAuth] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);

  const registerFields = decision === "SELLER" ? sellerFields : buyerFields;

  const onSubmit = async (
    values: any,
    { resetForm }: { resetForm: () => void }
  ) => {
    setLoading(true);

    if (avatar) values.avatar = avatar;

    const res = await authService.register(values);

    if (res instanceof Error) {
      showToast({
        type: "error",
        text1: "Error",
        text2: res.message,
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

    setTimeout(() => router.push("/login"), 30000);
  };

  const handleImageUpload = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      console.log("Image  result", result.assets[0].uri);

      setAvatar!(result.assets[0].uri);
    } else {
      alert("You did not select any image");
    }
  };

  // GOOGLE SIGN UP

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

    setSocialUser(callbackResponse);

    // @ts-ignore

    if (decision === "SELLER") {
      router.push("/complete-signup");
    } else {
      setLoadingSocialAuth(false);

      await save("lataPubToken", callbackResponse?.publicToken);
      checkAuth();

      router.push("/");
    }

    return;
  };

  return (
    <View className=" mt-12 pb-10">
      <Image source={images.lataLogoSmall} />
      <Text className="font-medium text-xl text-grey-9 mt-3 mb-5">
        Register {decision === "SELLER" ? "seller" : "buyer"}
      </Text>

      {decision === "SELLER" && (
        <View className="flex-row items-center gap-3 mb-5 ">
          {avatar ? (
            <ExpoImage
              source={{ uri: avatar as ImageSourcePropType }}
              className="w-[60px] h-[60px] rounded-full"
            />
          ) : (
            <TouchableOpacity
              className={
                "w-[60px] h-[60px] rounded-full bg-purple-3 items-center justify-center "
              }
              onPress={handleImageUpload}
            >
              <Ionicons name={"image"} />
            </TouchableOpacity>
          )}

          <Text className="font-normal text-xs text-grey-6 text-center ">
            Add a profile picture or your business logo
          </Text>
        </View>
      )}

      <Formik
        onSubmit={onSubmit}
        initialValues={{
          role: decision,
          referrerCode: "",
        }}
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
            {registerFields.map((field, index) => {
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
                onPress={() => handleSubmit()}
                text={
                  loading ? <Loader size="small" color="white" /> : "Continue"
                }
                customStyles="bg-purple rounded-lg w-full   w-full py-2.5 rounded-md"
                customTextStyles="text-white font-semibold text-base"
              />

              <Link href={"/login"}>
                <Text className="font-normal text-small text-grey-6 text-center mx-auto">
                  Already have an account?{" "}
                  <Text className="text-purple text-small">Login</Text>
                </Text>
              </Link>

              <View className="flex-row items-center gap-[10px]">
                <View className="flex-1 h-0.5 bg-grey-4" />
                <Text className="font-normal text-grey-6">Or login with</Text>
                <View className="flex-1 h-0.5 bg-grey-4" />
              </View>

              <ButtonSecondary
                text={
                  loadingSocialAuth ? (
                    <Loader size="small" color={colors.purple} />
                  ) : (
                    "Sign up with Google"
                  )
                }
                customStyles="bg-white rounded-lg w-full py-2.5 rounded-md gap-2"
                customTextStyles="text-purple font-semibold text-base"
                iconSrc={loadingSocialAuth ? "" : images.googleIcon}
                onPress={handleSocialAuth}
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
