import axios from "axios";
import { useAuthStore } from "@/stores/authStore";

const agentApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SWAHILI_API_URL,

  headers: {
    "Content-Type": "application/json",
  },
});

export default agentApi;
