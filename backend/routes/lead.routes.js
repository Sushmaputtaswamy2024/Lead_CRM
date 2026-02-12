const express = require("express");
const router = express.Router();
const upload = require("../config/upload");

const {
  createLead,
  getAllLeads,
  getLeadById,
  updateLead,
  addFollowUp,
  getFollowUps,
  getTodaysFollowUps,
  getPendingFollowUps,
  importLeadsFromExcel,
  exportLeadsToExcel,
  getDashboardSummary
} = require("../controllers/lead.controller");

// =========================
// DASHBOARD SUMMARY
router.get("/dashboard-summary", getDashboardSummary);

// =========================
// FOLLOWUP SUMMARY
router.get("/followups/today", getTodaysFollowUps);
router.get("/followups/pending", getPendingFollowUps);

// =========================
// EXCEL
router.post("/import", upload.single("file"), importLeadsFromExcel);
router.get("/export", exportLeadsToExcel);

// =========================
// LEADS
router.post("/", createLead);
router.get("/", getAllLeads);

// FOLLOWUPS
router.post("/:leadId/followups", addFollowUp);
router.get("/:leadId/followups", getFollowUps);

// =========================
// DYNAMIC ROUTES LAST
router.get("/:id", getLeadById);
router.put("/:id", updateLead);

module.exports = router;
