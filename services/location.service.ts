import { $http } from "@/config/$http";
import { prodApi } from "@/constants/backend_api";

class LocationService {
  public async getStates() {
    try {
      const res = await $http.get(`${prodApi}/states`);

      return res?.data.data;
    } catch (error: any) {
      console.log("error", error?.response.data);
    }
  }

  public async getCities() {
    try {
      const res = await $http.get(`${prodApi}/cities`);

      return res?.data.data;
    } catch (error: any) {
      console.log("error", error?.response.data);
    }
  }
}

export const locationService = new LocationService();
