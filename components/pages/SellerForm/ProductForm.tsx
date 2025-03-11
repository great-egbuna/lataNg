import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { Formik, FormikProps } from "formik";
import Input from "@/components/general/Input";
import * as ImagePicker from "expo-image-picker";
import Ionicons from "@expo/vector-icons/Ionicons";
import DropdownInput from "@/components/general/Dropdown";

interface ProductFormProps {
  setSelectedImage?: (imgSource: string) => void;
}

export default function ProductForm({ setSelectedImage }: ProductFormProps) {


  
  const handleImageUpload = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage!(result.assets[0].uri);
    } else {
      alert("You did not select any image");
    }
  };

  return (
    <Formik onSubmit={() => {}} initialValues={{}}>
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
      }: FormikProps<any>) => (
        <View className={"bg-white my-3"}>
          <View className={"p-3 border-grey-1 border rounded-lg gap-3"}>
            <Text className={"text-grey-7 font-normal text-small"}>
              Add at least one photo of your product
            </Text>

            <TouchableOpacity
              className={
                "w-[60px] h-[52px] rounded-md bg-purple-3 items-center justify-center"
              }
            >
              <Ionicons name={"image"} />
            </TouchableOpacity>

            <Text className={"text-grey-8 font-normal text-tiny"}>
              Each picture must not exceed 5MB
            </Text>

            <Text className={"text-grey-8 font-normal text-tiny "}>
              Supported formats are JPEG and PNG
            </Text>
          </View>

          <View className={"flex-row gap-2.5"}>
            <Input
              onChangeText={handleChange("productName")}
              onBlur={() => handleBlur("productName")}
              value={values.email}
              placeholder={"Product name"}
              customInputStyles={
                "rounded-md bg-white border border-grey-5  px-3 py-3"
              }
            />

            <Input
              onChangeText={handleChange("price")}
              onBlur={() => handleBlur("price")}
              value={values.email}
              placeholder={"Price"}
              customInputStyles={
                "rounded-md bg-white border border-grey-5  px-3 py-3"
              }
            />
          </View>

          <View className={"flex-row gap-2.5 my-3"}>
            <DropdownInput
              placeholder={"Select category"}
              onSelect={() => {}}
              data={["opt1", "Opt2"]}
            />

            <DropdownInput
              placeholder={"Select sub category"}
              onSelect={() => {}}
              data={["opt1", "Opt2"]}
            />
          </View>

          <View className={"flex-row gap-2.5 mb-3"}>
            <DropdownInput
              placeholder={"Product type"}
              onSelect={() => {}}
              data={["opt1", "Opt2"]}
            />

            <DropdownInput
              placeholder={"Select state"}
              onSelect={() => {}}
              data={["opt1", "Opt2"]}
            />
          </View>

          <DropdownInput
            placeholder={"Select city"}
            onSelect={() => {}}
            data={["opt1", "Opt2"]}
          />

          <DropdownInput
            placeholder={"Give discount"}
            onSelect={() => {}}
            data={["opt1", "Opt2"]}
            className={"mt-3"}
          />

          <Input
            onChangeText={handleChange("productDescription")}
            onBlur={() => handleBlur("productDescription")}
            value={values.productDescription}
            placeholder={"Product description"}
            customInputStyles={
              "rounded-md bg-white border border-grey-5 px-3 py-3 min-h-[100px] flex  items-start justify-start mt-3"
            }
            multiline={true}
          />

          <TouchableOpacity
            className={"bg-purple  p-3 rounded-xl flex items-center mt-3"}
          >
            <Text className={" text-white font-semibold "}>Create Product</Text>
          </TouchableOpacity>
        </View>
      )}
    </Formik>
  );
}
