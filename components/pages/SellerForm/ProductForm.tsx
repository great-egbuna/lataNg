import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Formik, FormikProps, FormikValues } from "formik";
import Input from "@/components/general/Input";
import * as ImagePicker from "expo-image-picker";
import Ionicons from "@expo/vector-icons/Ionicons";
import DropdownInput, {
  DropdownInputView,
} from "@/components/general/Dropdown";
import { useState } from "react";
import { objectToFormData } from "@/utils/utils";
import { productService } from "@/services/product.service";

import Loader from "@/components/general/Loader";
import { showToast } from "@/components/general/Toast";
import { useAuth } from "@/context/AuthContext";
import { IAUTH } from "@/interfaces/context/auth";
import { Link, useRouter } from "expo-router";
import { AppContextProps, useApp } from "@/context/AppContext";
import { OtherImages } from "../MyProducts/EditProduct";

interface ProductFormProps {
  setSelectedImage?: (imgSource: string) => void;
  productFiles: any[];
  setShowOverlay: (value: boolean) => void;
  setSelectedImg: (value: string) => void;
  setProductFiles: (value: any[]) => void;
  setProductName: (value: string) => void;
  setProductPrice: (value: string) => void;
}

export default function ProductForm({
  setSelectedImage,
  productFiles,
  setProductFiles,
  setShowOverlay,
  setSelectedImg,
  ...props
}: ProductFormProps) {
  const router = useRouter();
  const { user } = useAuth() as IAUTH;
  const { states, categories } = useApp() as AppContextProps;

  const [files, setFiles] = useState<any>([]);
  const [uploading, setUploading] = useState(false);
  const [payload, setPayload] = useState({
    categoryId: "",
    subCategoryId: "",
    productType: "",
    state: "",
    city: "",
    discount: "",
    description: "",
  });
  const [selectedSubCategory, setSelectedSubCategory] = useState<any>(null);
  const [selectedCity, setSelectedCity] = useState<any>(null);

  const handleImageUpload = async () => {
    setUploading(true);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 1,
      base64: false,
    });

    if (!result.canceled) {
      setSelectedImage!(result.assets[0].uri);
      setProductFiles([
        ...productFiles,
        { image: { url: result.assets[0].uri } },
      ]);
      setFiles([...files, ...result?.assets]);
      console.log("here");
      setUploading(false);
    } else {
      alert("You did not select any image");
      setUploading(false);
    }
  };

  const onSubmit = async (values: FormikValues) => {
    values.userId = user?.id;
    values.categoryId = payload.categoryId;
    values.subCategoryId = payload.subCategoryId;
    values.productType = payload.productType;
    values.state = payload.state;
    values.city = payload.city;
    values.price = Number(values.price);

    if (payload.discount) {
      values.discount = Number(payload.discount);
    }

    const formData = objectToFormData(values);

    if (files.length > 0) {
      for (let i = 0; i < files?.length; i++)
        formData.append(`files`, {
          uri: files[i].uri,
          type: files[i].mimeType,
          name: files[i].fileName,
        });
    }
    const res = await productService.store(formData as any);

    if (res instanceof Error) {
      showToast({
        type: "error",
        text1: "failed",
        text2: res.message,
      });

      return;
    }

    showToast({
      type: "success",
      text1: "Product created successfully",
      text2: res.message,
    });

    router.push("/shop");
  };

  const handleNameChange = async (value: string, handleChange: any) => {
    props.setProductName(value);
    handleChange("name")(value);
  };

  const handlePriceChange = async (value: string, handleChange: any) => {
    props.setProductName(value);

    handleChange("price")(value);
  };

  return (
    <Formik
      onSubmit={onSubmit}
      initialValues={{}}
      /*    validationSchema={createProductValidator} */
      enableReinitialize
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        isSubmitting,
      }: FormikProps<any>) => (
        <View className={"bg-white my-3 h-full "}>
          <View className={"p-3 border-grey-1 border rounded-lg gap-3 mb-3"}>
            <Text className={"text-grey-7 font-normal text-sbase"}>
              Add at least one photo of your product
            </Text>

            <View className="flex-row gap-2">
              <TouchableOpacity
                className={
                  "w-[60px] h-[52px] rounded-md bg-purple-3 items-center justify-center"
                }
                onPress={handleImageUpload}
              >
                {uploading ? (
                  <Loader color="white" size="small" />
                ) : (
                  <Ionicons name={"image"} />
                )}
              </TouchableOpacity>
              <OtherImages
                images={productFiles}
                onClickTrash={(item) => {
                  setShowOverlay(true);
                  setSelectedImg(item);
                }}
              />
            </View>

            <Text className={"text-grey-8 font-normal text-base"}>
              Each picture must not exceed 5MB
            </Text>

            <Text className={"text-grey-8 font-normal text-base "}>
              Supported formats are JPEG and PNG
            </Text>
          </View>

          <View className={"flex-row gap-2.5 px-2 items-start"}>
            <View className="flex-1">
              <Input
                onChangeText={(text) => handleNameChange(text, handleChange)}
                onBlur={() => handleBlur("name")}
                value={values.name}
                placeholder={"Product name"}
                customInputStyles={
                  "rounded-md bg-white border border-grey-5  px-3 py-3 "
                }
                multiline
              />

              <Text
                className={` ${
                  errors["name"] ? "visible" : "invisible"
                } text-danger  text-small mt-1`}
              >
                {errors["name"] as any}
              </Text>
            </View>

            <View className="flex-1 ">
              <Input
                onChangeText={(text) => handlePriceChange(text, handleChange)}
                onBlur={() => handleBlur("price")}
                value={values.price?.toLocaleString()}
                placeholder={"Price"}
                customInputStyles={
                  "rounded-md bg-white border border-grey-5  px-3 py-3 "
                }
                multiline
              />

              <Text
                className={` ${
                  errors["name"] ? "visible" : "invisible"
                } text-danger  text-small mt-1`}
              >
                {errors["price"] as any}
              </Text>
            </View>
          </View>

          <View className="gap-6">
            <View className={"flex-row gap-2.5  px-2 "}>
              <DropdownInputView
                placeholder={"Select category"}
                onSelect={(value) => {
                  setSelectedSubCategory(value?.subcategories);
                  setPayload({ ...payload, categoryId: value.id });
                }}
                data={categories}
                className="relative flex-1 "
                btnClassName="py-3"
              />

              <DropdownInputView
                placeholder={"Select sub category "}
                onSelect={(value) =>
                  setPayload({ ...payload, subCategoryId: value.id })
                }
                data={selectedSubCategory}
                className="relative flex-1"
                btnClassName="py-3"
              />
            </View>

            <View className={"flex-row gap-2.5  px-2 items-start"}>
              <DropdownInputView
                placeholder={"Product type"}
                onSelect={(value) =>
                  setPayload({ ...payload, productType: "" })
                }
                data={["New", "Used"]}
                className="relative flex-1 "
                btnClassName="py-3"
              />

              <DropdownInputView
                placeholder={"Select state"}
                onSelect={(value) => {
                  setPayload({ ...payload, state: value.id });
                  setSelectedCity(value.cities);
                }}
                data={states}
                className="relative flex-1 "
                btnClassName="py-3"
              />
            </View>

            <View className="px-2 gap-6">
              <DropdownInputView
                placeholder={"Select city"}
                onSelect={(value) => setPayload({ ...payload, city: value.id })}
                data={selectedCity}
                className="relative"
                btnClassName="py-3"
              />

              <DropdownInputView
                placeholder={"Select Discount (%)"}
                onSelect={(value) => {
                  console.log("value-discount:", value);
                  setPayload({ ...payload, discount: value.id });
                }}
                data={[...Array(101)].map((_, i) => ({
                  id: i,
                  name: `${i}`,
                }))}
                className="relative"
                btnClassName="py-3"
              />

              <Input
                onChangeText={handleChange("description")}
                onBlur={() => handleBlur("description")}
                value={values.description}
                placeholder={"Product description"}
                customInputStyles={
                  "rounded-md bg-white border border-grey-5 px-3 py-3 min-h-[100px] flex  items-start justify-start "
                }
                multiline={true}
              />
              {(errors["description"] as any) && (
                <Text className="text-danger  text-small mt-2">
                  {errors["decsription"] as any}
                </Text>
              )}
              <TouchableOpacity
                className={"bg-purple  p-3 rounded-xl flex items-center"}
                onPress={() => handleSubmit()}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader color="white" size="small" />
                ) : (
                  <Text className={" text-white font-semibold "}>
                    Create Product
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </Formik>
  );
}
