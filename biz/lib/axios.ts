import axios, { AxiosInstance } from "axios";

export const axiosInstance: AxiosInstance = axios.create({
    baseURL: process.env.AXIOS_BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});
