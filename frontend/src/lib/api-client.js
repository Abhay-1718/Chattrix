import axios from 'axios';
import { HOST } from "../utils/constant.js";

const apiClient = axios.create({
    baseURL: HOST,
    withCredentials: true, // Include credentials for cookie-based auth
});

export default apiClient;
