const express = require("express");
const router = express.Router();

// const leadRoutes = require("./lead.routes");

// all APIs start with /api
router.use("/api/leads", require("./lead.routes"));
router.use("/meta", require("./meta.routes"));

// test route
router.get("/", (req, res) => {
  res.send("API routes working");
});

module.exports = router;
