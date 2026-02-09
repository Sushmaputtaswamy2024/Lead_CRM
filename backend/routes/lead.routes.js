const express = require("express");
const router = express.Router();

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
  getLeadTimeline
} = require("../controllers/lead.controller");

// =======================
// LEADS CRUD
// =======================
router.post("/", createLead);
router.get("/", getAllLeads);
router.get("/:id", getLeadById);
router.put("/:id", updateLead);

// =======================
// FOLLOW UPS
// =======================
router.post("/:leadId/followup", addFollowUp);
router.get("/:leadId/followups", getFollowUps);

// =======================
// REPORTS
// =======================
router.get("/reports/today-followups", getTodaysFollowUps);
router.get("/reports/pending-followups", getPendingFollowUps);

// =======================
// EXCEL IMPORT / EXPORT
// =======================
router.post("/import", importLeadsFromExcel);
router.get("/export", exportLeadsToExcel);
router.get("/:leadId/timeline", getLeadTimeline);

  

module.exports = router;
