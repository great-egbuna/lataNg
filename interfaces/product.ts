import { ImageSourcePropType } from "react-native";

interface Meta {
  selectedImage: string | ImageSourcePropType;
  planName: string;
}

export interface ICreateProduct {
  id: string;
  name: string;
  price: number;
  state: string;
  city: string;
  file: Blob;
  discount: string | number;
  productType?: string;
  description: string;
  meta?: Meta;
  user: any;
  userId: string;
}
