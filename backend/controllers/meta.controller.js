// backend/controllers/meta.controller.js
const db = require("../config/db");

// 1️⃣ Verification (GET)
exports.verifyMetaWebhook = (req, res) => {
  const VERIFY_TOKEN = "vindia_meta_verify"; // you choose this

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Meta webhook verified");
    return res.status(200).send(challenge);
  }

  return res.status(403).send("Verification failed");
};

// 2️⃣ Receive lead (POST)
exports.receiveMetaLead = async (req, res) => {
  try {
    console.log("📥 Meta Lead Payload:", JSON.stringify(req.body, null, 2));

    // Meta sends entries in array
    const entry = req.body.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;

    if (!value || !value.leadgen_id) {
      return res.status(200).json({ success: true });
    }

    // For now we just store basic info
    const leadData = {
      name: "Meta Lead",
      phone: value.leadgen_id, // temporary
      email: null,
      source: "Meta Ads",
      status: "New",
      assigned_to: "Unassigned"
    };

    await db.query(
      `INSERT INTO leads (name, phone, email, source, status, assigned_to)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        leadData.name,
        leadData.phone,
        leadData.email || "",
        leadData.source,
        leadData.status,
        leadData.assigned_to
      ]
    );

    console.log("✅ Meta lead saved");

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Meta webhook error:", error);
    return res.status(500).json({ success: false });
  }
};
