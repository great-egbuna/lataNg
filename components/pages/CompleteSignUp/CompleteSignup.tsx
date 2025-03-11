import React, { useEffect, useState } from "react";
import Input from "@/components/general/Input";
import { Formik, FormikProps } from "formik";
import {
  Image,
  ImageSourcePropType,
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
import { Image as ExpoImage } from "expo-image";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { IAUTH } from "@/interfaces/context/auth";
import { save } from "@/store/storage";
import { AppContextProps, ISocialUser, useApp } from "@/context/AppContext";

const phoneNumberValidation = yup
  .string()
  .trim()
  .required("Phone number is required")
  .matches(/^\+?[0-9]{10,15}$/, "Phone number is not valid")
  .min(10, "Phone number must be at least 10 digits")
  .max(15, "Phone number must be at most 15 digits");

const schemaValidation = yup.object().shape({
  name: yup.string().trim().required("Business name is required"),

  email: yup
    .string()
    .email("Must be a valid email")
    .required("Email is required"),

  phoneNumber: phoneNumberValidation,

  role: yup.mixed().oneOf(["BUYER", "SELLER", "ADMIN", "STAFF"]),

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

const registerFields = [
  {
    placeholder: "Enter  business name",
    name: "name",
  },

  {
    placeholder: "Enter  email",
    name: "email",
  },
  {
    placeholder: "Enter business location",
    name: "address",
  },
  {
    placeholder: "Enter phone number",
    name: "phoneNumber",
  },
  {
    placeholder: "About business",
    name: "aboutBusiness",
  },

  {
    placeholder: "Referrer ID (optiona)",
    name: "referrerCode",
  },
];

export default function CompleteSignUpComponent() {
  const { checkAuth } = useAuth() as IAUTH;
  const { socialUser } = useApp() as AppContextProps;
  const { name, shouldCompleteProfile, ...newSocailUser } =
    socialUser as ISocialUser;

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);

  const onSubmit = async (
    values: any,
    { resetForm }: { resetForm: () => void }
  ) => {
    setLoading(true);

    if (avatar) values.avatar = avatar;

    values.googleIntegration = values.email;

    const res = await authService.completeRegisteration(values);

    if (res instanceof Error) {
      showToast({
        type: "error",
        text1: "Error",
        text2: res.message,
      });
      setLoading(false);
      return;
    }

    await save("lataPubToken", res?.publicToken);

    showToast({
      type: "success",
      text1: "Success",
      text2: res.message,
    });

    resetForm();
    setLoading(false);

    checkAuth();

    router.push("/");
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

  return (
    <View className=" mt-12 pb-10">
      <Image source={images.lataLogoSmall} />
      <Text className="font-medium text-xl text-grey-9 mt-3 mb-5">
        Complete Your Profile
      </Text>

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

      <Formik
        onSubmit={onSubmit}
        initialValues={{
          name: name,
          referrerCode: "",
          password: "CompleteUserRegistration123$",
          /*   shouldCompleteProfile: `${shouldCompleteProfile}`, */
          ...newSocailUser,
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
                    editable={!(field.name === "email" && socialUser?.email)}
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
                  loading ? (
                    <Loader size="small" color="white" />
                  ) : (
                    "Complete sign up"
                  )
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
