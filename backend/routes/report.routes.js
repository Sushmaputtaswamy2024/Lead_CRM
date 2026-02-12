const express = require("express");
const router = express.Router();

const {
  timeSpentPerLead,
  userPerformance,
  logLeadActivity,
  startSession,
  endSession,
  reportOverview,
  getActivityLogs,
  exportReports
  
} = require("../controllers/report.controller");

router.post("/log-activity", logLeadActivity);
router.get("/time-per-lead", timeSpentPerLead);
router.get("/user-performance", userPerformance);
router.get("/overview", reportOverview);
router.post("/start-session", startSession);
router.post("/end-session", endSession);
router.get("/activity-logs", getActivityLogs);
router.get("/export",exportReports);

module.exports = router;
