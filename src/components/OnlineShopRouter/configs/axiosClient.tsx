import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://batch-33-nodejs-user.vercel.app",
  // baseURL: "http://localhost:9000",
  timeout: 30000,
});

export default axiosClient;
