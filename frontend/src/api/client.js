import axios from "axios";

const api = axios.create({
  baseURL: "http://13.211.131.150:5000/api",
});

export default api;