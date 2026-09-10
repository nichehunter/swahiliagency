import axios from "axios";
import { useAuthStore } from "@/stores/authStore";

const authApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AUTH_API_URL,

  headers: {
    "Content-Type": "application/json",
  },
});

export default authApi;
