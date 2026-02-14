import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

/* =======================
   LEADS
======================= */

export const fetchLeads = (user, showJunk = false) =>
  axios.get(`${BASE_URL}/leads`, {
    params: {
      role: user?.role,
      email: user?.email,
      junk: showJunk ? "true" : undefined
    }
  });


export const fetchLeadById = (id) => axios.get(`${BASE_URL}/leads/${id}`);

export const addLead = (data) => axios.post(`${BASE_URL}/leads`, data);

export const updateLead = (id, data) => axios.put(`${BASE_URL}/leads/${id}`, data);

/* =======================
   FOLLOW UPS (GLOBAL)
======================= */

export const fetchTodayFollowUps = () => axios.get(`${BASE_URL}/followups/today`);

export const fetchPendingFollowUps = () =>
  axios.get(`${BASE_URL}/followups/pending`);

/* =======================
   FOLLOW UPS (BY LEAD)
======================= */

export const fetchFollowUpsByLead = (leadId) =>
  axios.get(`${BASE_URL}/leads/${leadId}/followups`);

/* =======================
   TIMELINE
======================= */

export const fetchLeadTimeline = (leadId) =>
  axios.get(`${BASE_URL}/leads/${leadId}/timeline`);
