import { base_url } from "@/constants/env";
import { getValueFor } from "@/store/storage";
import axios from "axios";

const $http = axios.create({
  baseURL: "https://lata-main-backend.azurewebsites.net/v1",
  /*   baseURL: "https://3596-105-113-32-72.ngrok-free.app/v1", */
  headers: {
    requestSession: JSON.stringify({
      processId: Date.now(),
      userSystemId: Date.now().toString(),
    }),
  },
});

$http.interceptors.request.use(
  async function (config) {
    const token = await getValueFor("lataAuthToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  function (error) {
    console.log("req error", error);
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export { $http };
