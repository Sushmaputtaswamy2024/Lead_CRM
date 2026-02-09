const express = require("express");
const router = express.Router();
const metaController = require("../controllers/meta.controller");

// verification (GET)
router.get("/webhook", metaController.verifyMetaWebhook);

// lead receive (POST)
router.post("/webhook", metaController.receiveMetaLead);

module.exports = router;
