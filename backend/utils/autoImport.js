const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");
const db = require("../config/db");

module.exports = function autoImport() {
  const filePath = path.join(__dirname, "../auto-import.xlsx");

  if (!fs.existsSync(filePath)) return;

  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet);

  const values = rows.map(r => [
    r.name,
    r.phone,
    r.email || null,
    r.source || "Excel",
    r.status || "New"
  ]);

  db.query(
    "INSERT INTO leads (name, phone, email, source, status) VALUES ? ON DUPLICATE KEY UPDATE name=VALUES(name), email=VALUES(email)",
    [values],
    () => {
      fs.unlinkSync(filePath);
      console.log("Auto Excel imported successfully");
    }
  );
};
