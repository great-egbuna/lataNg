import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";

interface Prop {
  type: string;
  text1: string;
  text2: string;
}

export const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "green" }}
      text1Style={{
        fontSize: 18, // increase text1 font size
        fontWeight: "bold",
      }}
      text2Style={{
        fontSize: 16, // increase text2 font size
      }}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: 18,
        fontWeight: "bold",
      }}
      text2Style={{
        fontSize: 16,
      }}
    />
  ),
};
// ... existing code ...

export const showToast = ({ type, text1, text2 }: Prop) => {
  Toast.show({
    type,
    text1,
    text2,
  });
};
