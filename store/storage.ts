import * as SecureStore from "expo-secure-store";

async function save(key: string, value: any) {
  await SecureStore.setItemAsync(key, value);
}

async function getValueFor(key: string) {
  let result = await SecureStore.getItemAsync(key);

  return result;
}

export { save, getValueFor };
