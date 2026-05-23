import axios from "axios";
import { API_BASE_URL } from "@/src/configs/environment.config";

export function createAxiosInstance(isFormData: boolean = false) {
  return axios.create({
    baseURL: API_BASE_URL,
    headers: isFormData ? {} : { 'Content-Type': 'application/json' },
  });
}
