import api from "./client";

/* =======================
   LEADS
======================= */

export const fetchLeads = (user, showJunk = false) =>
  api.get("/leads", {
    params: {
      role: user?.role,
      email: user?.email,
      junk: showJunk ? "true" : undefined,
    },
  });

export const fetchLeadById = (id) =>
  api.get(`/leads/${id}`);

export const addLead = (data) =>
  api.post("/leads", data);

export const updateLead = (id, data) =>
  api.put(`/leads/${id}`, data);

export const deleteLead = (id) =>
  api.delete(`/leads/${id}`);


/* =======================
   FOLLOW UPS (GLOBAL)
======================= */

export const fetchTodayFollowUps = () =>
  api.get("/leads/followups/today");

export const fetchPendingFollowUps = () =>
  api.get("/leads/followups/pending");


/* =======================
   FOLLOW UPS (BY LEAD)
======================= */

export const fetchFollowUpsByLead = (leadId) =>
  api.get(`/leads/${leadId}/followups`);

export const addFollowUp = (leadId, data) =>
  api.post(`/leads/${leadId}/followups`, data);


/* =======================
   TIMELINE
======================= */

export const fetchLeadTimeline = (leadId) =>
  api.get(`/leads/${leadId}/timeline`);


/* =======================
   DASHBOARD
======================= */

export const fetchDashboardSummary = () =>
  api.get("/leads/dashboard-summary");