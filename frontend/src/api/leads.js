import axios from "axios";

const API = "http://localhost:5000/api";

/* =======================
   LEADS
======================= */

export const fetchLeads = () =>
  axios.get(`${API}/leads`);

export const fetchLeadById = (id) =>
  axios.get(`${API}/leads/${id}`);

export const addLead = (data) =>
  axios.post(`${API}/leads`, data);

export const updateLead = (id, data) =>
  axios.put(`${API}/leads/${id}`, data);

/* =======================
   FOLLOW UPS (GLOBAL)
======================= */

export const fetchTodayFollowUps = () =>
  axios.get(`${API}/leads/reports/today-followups`);

export const fetchPendingFollowUps = () =>
  axios.get(`${API}/leads/reports/pending-followups`);

/* =======================
   FOLLOW UPS (BY LEAD)
======================= */

export const fetchFollowUpsByLead = (leadId) =>
  axios.get(`${API}/leads/${leadId}/followups`);

/* =======================
   TIMELINE
======================= */

export const fetchLeadTimeline = (leadId) =>
  axios.get(`${API}/leads/${leadId}/timeline`);
