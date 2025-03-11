import Toast from "react-native-toast-message";

interface Prop {
  type: string;
  text1: string;
  text2: string;
}

export const showToast = ({ type, text1, text2 }: Prop) => {
  Toast.show({
    type,
    text1,
    text2,
  });
};
