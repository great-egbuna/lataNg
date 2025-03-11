import Constants from "expo-constants";

const { prodApi, devApi } =
  (Constants.manifest2?.extra as { prodApi: string; devApi: string }) || {};

const { ENV } = process.env;

let base_url: string;

if (ENV === "production") {
  base_url = prodApi;
} else {
  base_url = devApi;
}

export { base_url };
