require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cron = require("node-cron");
const XLSX = require("xlsx");
const db = require("./config/db");   // ✅ IMPORTANT FIX
const routes = require("./routes");

const app = express();

// ================= BACKUP CRON JOB =================
cron.schedule("0 0 * * *", () => {
  db.query("SELECT * FROM leads", (err, results) => {
    if (err) {
      console.error("Backup error:", err);
      return;
    }

    const ws = XLSX.utils.json_to_sheet(results);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Backup");

    const filePath = `backup-${Date.now()}.xlsx`;
    XLSX.writeFile(wb, filePath);

    console.log("Daily backup created:", filePath);
  });
});

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= ROUTES =================
app.use("/api", routes);

const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);

// ================= SERVER START =================
const PORT = 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
