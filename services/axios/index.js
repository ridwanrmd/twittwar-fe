import axios from "axios";

const axiosInstance = axios.create({ baseURL: "http://localhost:6969" });

export default axiosInstance;
