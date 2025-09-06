import { getValueFor } from "@/store/storage";
import axios from "axios";

const $http = axios.create({
  /*  baseURL: "https://lata-main-backend.azurewebsites.net/v1", */
  /*  baseURL: "https://lata-dev-backend.azurewebsites.net" */
  baseURL: "https://lata-api.go2.ng/v1",
  /*   baseURL: "https://6e7fe1f13596.ngrok-free.app/v1", */

  headers: {
    requestSession: JSON.stringify({
      processId: Date.now(),
      userSystemId: Date.now().toString(),
    }),
    "ngrok-skip-browser-warning": true,
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
