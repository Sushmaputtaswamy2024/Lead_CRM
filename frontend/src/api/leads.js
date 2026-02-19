import axios from "axios";


/* =======================
   LEADS
======================= */

export const fetchLeads = (user, showJunk = false) =>
  axios.get(`/leads`, {
    params: {
      role: user?.role,
      email: user?.email,
      junk: showJunk ? "true" : undefined
    }
  });


export const fetchLeadById = (id) => axios.get(`/leads/${id}`);

export const addLead = (data) => axios.post(`/leads`, data);

export const updateLead = (id, data) => axios.put(`/leads/${id}`, data);

/* =======================
   FOLLOW UPS (GLOBAL)
======================= */

export const fetchTodayFollowUps = () => axios.get(`/followups/today`);

export const fetchPendingFollowUps = () =>
  axios.get(`/followups/pending`);

/* =======================
   FOLLOW UPS (BY LEAD)
======================= */

export const fetchFollowUpsByLead = (leadId) =>
  axios.get(`/leads/${leadId}/followups`);

/* =======================
   TIMELINE
======================= */

export const fetchLeadTimeline = (leadId) =>
  axios.get(`/leads/${leadId}/timeline`);
