import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // Change in production
  withCredentials: true,
});

export default API;