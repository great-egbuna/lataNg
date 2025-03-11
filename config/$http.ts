import { base_url } from "@/constants/env";
import axios from "axios";

const $http = axios.create({
  /* baseURL: "https://lata-main-backend.azurewebsites.net/v1", */
  baseURL: " https://881d-102-89-22-194.ngrok-free.app/v1",
  headers: {
    requestSession: JSON.stringify({
      processId: Date.now(),
      userSystemId: Date.now().toString(),
    }),
  },
});

/* axios.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
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
); */

export { $http };
