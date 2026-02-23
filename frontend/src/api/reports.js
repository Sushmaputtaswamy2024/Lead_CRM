import api from "./client";

const API = "/api/reports";

export const fetchTimePerLead = () =>
  api.get(`${API}/time-per-lead`);

export const fetchUserPerformance = () =>
  api.get(`${API}/user-performance`);