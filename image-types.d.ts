// This file provides TypeScript declarations for various image formats
// so they can be imported directly without using require()

import { ImageSourcePropType } from "react-native";

declare module "*.svg" {
  const content: ImageSourcePropType;
  export default content;
}

declare module "*.webp" {
  const content: ImageSourcePropType;
  export default content;
}

declare module "*.png" {
  const content: ImageSourcePropType;
  export default content;
}

declare module "*.jpg" {
  const content: ImageSourcePropType;
  export default content;
}

declare module "*.jpeg" {
  const content: ImageSourcePropType;
  export default content;
}
