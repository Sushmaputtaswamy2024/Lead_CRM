const express = require("express");
const router = express.Router();

const leadRoutes = require("./lead.routes");
const reportRoutes = require("./report.routes");

router.use("/leads", leadRoutes);
router.use("/reports", reportRoutes);

module.exports = router;
