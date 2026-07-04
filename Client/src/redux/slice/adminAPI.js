import axios from "axios";

const adminAPI = axios.create({
    // baseURL: "http://localhost:5000/api",
    baseURL: "/api",
});

adminAPI.interceptors.request.use((config) => {
    const token = localStorage.getItem("adminToken");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default adminAPI;