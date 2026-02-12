import axios from "axios";

const API = "http://13.233.XXX.XXX:5000/api/reports";

export const fetchTimePerLead = () =>
  axios.get(`${API}/time-per-lead`);

export const fetchUserPerformance = () =>
  axios.get(`${API}/user-performance`);
