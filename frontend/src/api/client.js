import axios from "axios";

const api = axios.create({
  baseURL: "https://crm.vindiainfrasec.com",

  
});

export default api;