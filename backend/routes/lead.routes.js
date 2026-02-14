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
  getDashboardSummary,
  importJustDialPDF,
  requestJunk,
  reassignLead,
  permanentDeleteLead

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


router.post("/upload-justdial", upload.single("file"),importJustDialPDF);

// =========================
// DYNAMIC ROUTES LAST
router.get("/:id", getLeadById);
router.put("/:id", updateLead);

// =========================
// JUNK / ADMIN ACTIONS
router.put("/:id/request-junk", requestJunk);
router.put("/:id/reassign", reassignLead);
router.put("/:id/permanent-delete", permanentDeleteLead);


module.exports = router;
