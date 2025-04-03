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
import DropdownInput from "@/components/general/Dropdown";
import { useState } from "react";
import { objectToFormData } from "@/utils/utils";
import { productService } from "@/services/product.service";
import { createProductValidator } from "@/validators/createProduct";
import { ICreateProduct } from "@/interfaces/product";
import Loader from "@/components/general/Loader";
import { showToast } from "@/components/general/Toast";
import { useAuth } from "@/context/AuthContext";
import { IAUTH } from "@/interfaces/context/auth";
import { Link, useRouter } from "expo-router";
import { AppContextProps, useApp } from "@/context/AppContext";

interface ProductFormProps {
  setSelectedImage?: (imgSource: string) => void;
}

export default function ProductForm({ setSelectedImage }: ProductFormProps) {
  const router = useRouter();
  const { user } = useAuth() as IAUTH;
  const { cities, states, categories, subCategories } =
    useApp() as AppContextProps;

  const [file, setFile] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [payload, setPayload] = useState({
    categoryId: "",
    subCategoryId: "",
    productType: "",
    state: "",
    city: "",
  });

  const handleImageUpload = async () => {
    setUploading(true);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
      base64: false,
    });

    if (!result.canceled) {
      setSelectedImage!(result.assets[0].uri);
      setFile(result.assets[0]);
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

    if (values.discount) {
      values.discount = Number(values.discount);
    }

    const formData = objectToFormData(values);

    if (file) {
      formData.append(`files`, {
        uri: file.uri,
        type: file.mimeType,
        name: file.fileName,
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

    router.push("/");
  };

  return (
    <Formik
      onSubmit={onSubmit}
      initialValues={{}}
      validationSchema={createProductValidator}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        isSubmitting,
      }: FormikProps<any>) => (
        <ScrollView className={"bg-white my-3 h-full "}>
          <View className={"p-3 border-grey-1 border rounded-lg gap-3 mb-3"}>
            <Text className={"text-grey-7 font-normal text-small"}>
              Add at least one photo of your product
            </Text>

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

            <Text className={"text-grey-8 font-normal text-tiny"}>
              Each picture must not exceed 5MB
            </Text>

            <Text className={"text-grey-8 font-normal text-tiny "}>
              Supported formats are JPEG and PNG
            </Text>
          </View>

          <View className={"flex-row gap-2.5 px-2 items-start"}>
            <View className="flex-1">
              <Input
                onChangeText={handleChange("name")}
                onBlur={() => handleBlur("name")}
                value={values.email}
                placeholder={"Product name"}
                customInputStyles={
                  "rounded-md bg-white border border-grey-5  px-3 py-3 max-h-[40px]"
                }
              />

              {(errors["name"] as any) && (
                <Text className="text-danger  text-small mt-2">
                  {errors["name"] as any}
                </Text>
              )}
            </View>

            <View className="flex-1">
              <Input
                onChangeText={handleChange("price")}
                onBlur={() => handleBlur("price")}
                value={values.price}
                placeholder={"Price"}
                customInputStyles={
                  "rounded-md bg-white border border-grey-5  px-3 py-3 max-h-[40px]"
                }
              />

              {(errors["price"] as any) && (
                <Text className="text-danger  text-small mt-2">
                  {errors["price"] as any}
                </Text>
              )}
            </View>
          </View>

          <View className={"flex-row gap-2.5 my-3 px-2"}>
            <DropdownInput
              placeholder={"Select category"}
              onSelect={(value) =>
                setPayload({ ...payload, categoryId: value.id })
              }
              data={categories}
            />

            <DropdownInput
              placeholder={"Select sub category"}
              onSelect={(value) =>
                setPayload({ ...payload, subCategoryId: value.id })
              }
              data={subCategories}
            />
          </View>

          <View className={"flex-row gap-2.5 mb-3 px-2"}>
            <DropdownInput
              placeholder={"Product type"}
              onSelect={(value) => setPayload({ ...payload, productType: "" })}
              data={["New", "Used"]}
            />

            <DropdownInput
              placeholder={"Select state"}
              onSelect={(value) => setPayload({ ...payload, state: value.id })}
              data={states}
            />
          </View>

          <View className="px-2 gap-2.5">
            <DropdownInput
              placeholder={"Select city"}
              onSelect={(value) => setPayload({ ...payload, city: value.id })}
              data={cities}
            />

            <Input
              onChangeText={handleChange("discount")}
              onBlur={() => handleBlur("discount")}
              value={values.discount}
              placeholder={"discount"}
              customInputStyles={
                "rounded-md bg-white border border-grey-5  px-3"
              }
            />

            <Input
              onChangeText={handleChange("description")}
              onBlur={() => handleBlur("description")}
              value={values.desccription}
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
        </ScrollView>
      )}
    </Formik>
  );
}
