import axios from "axios";

const api = axios.create({
    baseURL: "https://inventory-system-backend.up.railway.app/api/", // Your Django API base URL
});

export default api;