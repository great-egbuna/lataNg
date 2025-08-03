import React, { useEffect, useState } from "react";
import Input from "@/components/general/Input";
import { Formik, FormikProps } from "formik";
import {
  Image,
  ImageSourcePropType,
  Pressable,
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
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { IAUTH } from "@/interfaces/context/auth";
import { save } from "@/store/storage";
import { AppContextProps, ISocialUser, useApp } from "@/context/AppContext";
import * as Linking from "expo-linking";
import { ErrorType, getErrorMessage, objectToFormData } from "@/utils/utils";

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
    placeholder: "Enter Business Name",
    name: "name",
    textarea: false,
  },

  {
    placeholder: "Enter Email",
    name: "email",
    textarea: false,
  },

  {
    placeholder: "Enter Business Location",
    name: "address",
    textarea: false,
  },
  {
    placeholder: "Enter Phone Number",
    name: "phoneNumber",
    textarea: false,
  },

  {
    placeholder: "Referrer ID (optional)",
    name: "referrerCode",
    textarea: false,
  },
  {
    placeholder: "About Business",
    name: "aboutBusiness",
    textarea: true,
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
  const [file, setFile] = useState<ImagePicker.ImagePickerAsset | null>(null);

  const onSubmit = async (
    values: any,
    { resetForm }: { resetForm: () => void }
  ) => {
    setLoading(true);

    const formData = objectToFormData(values);
    if (file)
      // @ts-expect-error
      formData.append("file", {
        uri: file.uri,
        name: file.fileName,
        type: file.mimeType,
      });

    // values.googleIntegration = values.email;

    const res = await authService.completeRegisteration(formData);

    if (res instanceof Error) {
      showToast({
        type: "error",
        text1: "Error",
        text2: res?.message,
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

    checkAuth!();

    router.push("/");
  };

  const handleImageUpload = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar!(result.assets[0].uri);
      setFile(result.assets[0]);
    } else {
      alert("You did not select any image");
    }
  };

  const handleTermsAndConditions = () =>
    Linking.openURL("https://lata.ng/terms-and-conditions");

  return (
    <View className=" mt-12 pb-10">
      <Image source={images.lataLogoSmall} />
      <Text className="font-medium text-xl text-grey-9 mt-3 mb-5">
        Complete Your Profile
      </Text>

      <View className="flex items-center gap-1 mb-5 ">
        {avatar ? (
          <Image
            source={{ uri: avatar }}
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

        <Text className="font-light text-lg text-grey-6 text-center tracking-[-0.72px]">
          Add a profile picture or your business logo
        </Text>
      </View>

      <Formik
        onSubmit={onSubmit}
        initialValues={{
          name: name,
          referrerCode: "",
          /*    password: "CompleteUserRegistration123$", */
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
          <View className="gap-2 min-h-full ">
            {registerFields.map((field, index) => {
              return (
                <View key={index} className="gap-0 ">
                  <Input
                    placeholder={field.placeholder}
                    onChangeText={handleChange(field.name)}
                    onBlur={handleBlur(field.name)}
                    value={values[field.name]}
                    customStyles="bg-white"
                    customInputStyles={`${
                      field.name !== "email" && "bg-white "
                    } border rounded-md border-grey-12 py-2 px-3 ${
                      field.textarea ? "min-h-[120px]" : "min-h-[40px]"
                    } ${field.textarea ? "max-h-[150px]" : "max-h-[40px]"}`}
                    editable={!(field.name === "email" && socialUser?.email)}
                    multiline={field.textarea}
                  />

                  <Text className="text-danger  text-sm ">
                    {errors[field.name] as any}
                  </Text>
                </View>
              );
            })}

            <View className="gap-6">
              <ButtonSecondary
                onPress={() => handleSubmit()}
                text={loading ? "Please wait..." : "Complete sign up"}
                customStyles="bg-purple rounded-lg w-full   w-full py-2.5 rounded-md"
                customTextStyles="text-white font-semibold text-base"
              />

              <Pressable onPress={handleTermsAndConditions}>
                <Text className="font-normal text-base text-grey-6 text-center mx-auto">
                  By creating an account, you agree to the{" "}
                  <Text className="text-purple">Terms and Conditions</Text> and{" "}
                  <Text className="text-purple">Privacy Policy</Text>
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
}
