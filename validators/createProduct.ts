import * as Yup from "yup";

export const createProductValidator = Yup.object().shape({
  name: Yup.string().trim().required("Please input a buisness name"),
  price: Yup.string().trim().required("Please input price"),
  description: Yup.string().trim().required("Please input a decription"),
  discount: Yup.string().trim().optional(),
  status: Yup.string().oneOf(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
  productType: Yup.string().trim().optional(),
  selectedImage: Yup.string().optional(),
  selectedCategory: Yup.string().optional(),
});
