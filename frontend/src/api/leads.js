import api from "./client";

/* =======================
   LEADS
======================= */

export const fetchLeads = (user, showJunk = false) =>
  api.get("/api/leads", {
    params: {
      role: user?.role,
      email: user?.email,
      junk: showJunk ? "true" : undefined,
    },
  });

export const fetchLeadById = (id) =>
  api.get(`/api/leads/${id}`);

export const addLead = (data) =>
  api.post("/api/leads", data);

export const updateLead = (id, data) =>
  api.put(`/api/leads/${id}`, data);

export const deleteLead = (id) =>
  api.delete(`/api/leads/${id}`);


/* =======================
   FOLLOW UPS (GLOBAL)
======================= */

export const fetchTodayFollowUps = () =>
  api.get("/api/leads/followups/today");

export const fetchPendingFollowUps = () =>
  api.get("/api/leads/followups/pending");


/* =======================
   FOLLOW UPS (BY LEAD)
======================= */

export const fetchFollowUpsByLead = (leadId) =>
  api.get(`/api/leads/${leadId}/followups`);

export const addFollowUp = (leadId, data) =>
  api.post(`/api/leads/${leadId}/followups`, data);


/* =======================
   TIMELINE
======================= */

export const fetchLeadTimeline = (leadId) =>
  api.get(`/api/leads/${leadId}/timeline`);


/* =======================
   DASHBOARD
======================= */

export const fetchDashboardSummary = () =>
  api.get("/api/leads/dashboard-summary");