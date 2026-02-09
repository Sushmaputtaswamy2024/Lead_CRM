import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const fetchLeads = () => API.get("/leads");
export const addLead = (data) => API.post("/leads", data);
export const fetchLeadById = (id) => API.get(`/leads/${id}`);
export const updateLead = (id, data) =>
  API.put(`/leads/${id}`, data);

export const addFollowUp = (leadId, data) =>
  API.post(`/leads/${leadId}/followup`, data);

export const fetchFollowUps = (leadId) =>
  API.get(`/leads/${leadId}/followups`);

export const fetchTodayFollowUps = () =>
  API.get("/leads/reports/today-followups");

export const fetchPendingFollowUps = () =>
  API.get("/leads/reports/pending-followups");

export const fetchLeadTimeline = (id) =>
  API.get(`/leads/${id}/timeline`);


export default API;
