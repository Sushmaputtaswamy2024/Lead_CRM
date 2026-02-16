const db = require("../config/db");
const XLSX = require("xlsx");
const path = require("path");
const pdfParse = require("pdf-parse");
const fs = require("fs");

/* =========================
   CREATE LEAD
========================= */
const createLead = (req, res) => {
  const {
    name,
    phone,
    whatsapp,
    email,
    city,
    source,
    status,
    call_status,
    building_type,
    floors,
    measurement,
    sqft,
    budget,
    assigned_to,
    quotation_sent,
    project_start,
    snooze_until,
    description,
    date_and_time,
    search_category,
    area,
  } = req.body;

  if (!name || !phone) {
    return res.status(400).json({
      success: false,
      message: "Name and phone are required",
    });
  }

  const sql = `
    INSERT INTO leads (
      name,
      phone,
      whatsapp,
      email,
      city,
      source,
      status,
      call_status,
      building_type,
      floors,
      measurement,
      sqft,
      budget,
      assigned_to,
      quotation_sent,
      project_start,
      snooze_until,
      description,
      date_and_time,
      search_category,
      area
    )
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    name,
    phone,
    whatsapp || phone,
    email || null,
    city || null,
    source || "manual",
    status || "New",
    call_status || null,
    building_type || null,
    floors || null,
    measurement || null,
    sqft || null,
    budget || null,
    assigned_to || null,
    quotation_sent || null,
    project_start || null,
    snooze_until || null,
    description || null,
    date_and_time || null,
    search_category || null,
    area || null,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Create lead error:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to create lead",
      });
    }

    res.json({
      success: true,
      leadId: result.insertId,
    });
  });
};

/* =========================
   GET ALL LEADS
========================= */
const getAllLeads = (req, res) => {
  const { role, email } = req.query;

  let sql = `
    SELECT * FROM leads
    WHERE deleted_by_admin = 0
  `;

  // BDA1 or BDA2
  if (role === "bda1" || role === "bda2") {
    sql += ` 
    AND (assigned_to = '${email}' OR assigned_to IS NULL)
    AND status != 'JUNK_REQUESTED'
  `;
  }

  // Admin sees everything except permanently deleted
  if (role === "admin") {
    // no extra filter
  }

  sql += " ORDER BY created_at DESC";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Fetch leads error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json({ leads: results });
  });
};

/* =========================
   GET LEAD BY ID
========================= */
const getLeadById = (req, res) => {
  const { id } = req.params;

  db.query("SELECT * FROM leads WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: "DB error" });
    if (results.length === 0)
      return res.status(404).json({ error: "Lead not found" });

    res.json({ lead: results[0] });
  });
};

/* =========================
   UPDATE LEAD
========================= */
const updateLead = (req, res) => {
  const { id } = req.params;

  const {
    email,
    city,
    source,
    status,
    call_status,
    building_type,
    floors,
    measurement,
    sqft,
    budget,
    assigned_to,
    quotation_sent,
    project_start,
    snooze_until,
    description,
    date_and_time,
    search_category,
    area,
  } = req.body;

  const sql = `
    UPDATE leads SET
      email=?,
      city=?,
      source=?,
      status=?,
      call_status=?,
      building_type=?,
      floors=?,
      measurement=?,
      sqft=?,
      budget=?,
      assigned_to=?,
      quotation_sent=?,
      project_start=?,
      snooze_until=?,
      description=?,
      date_and_time=?,
      search_category=?,
      area=?
    WHERE id=?
  `;

  db.query(
    sql,
    [
      email || null,
      city || null,
      source || null,
      status || null,
      call_status || null,
      building_type || null,
      floors || null,
      measurement || null,
      sqft || null,
      budget || null,
      assigned_to || null,
      quotation_sent || null,
      project_start || null,
      snooze_until || null,
      description || null,
      date_and_time || null,
      search_category || null,
      area || null,

      id,
    ],
    (err) => {
      if (err) {
        console.error("Update failed:", err);
        return res.status(500).json({ error: "Update failed" });
      }

      res.json({ success: true });
    },
  );
};

/* =========================
   FOLLOW UPS
========================= */
const addFollowUp = (req, res) => {
  const { leadId } = req.params;
  const { note, status, nextFollowUp } = req.body;

  if (!note) {
    return res.status(400).json({ error: "Note required" });
  }

  db.query(
    `INSERT INTO followups (lead_id, note, status, next_followup)
     VALUES (?, ?, ?, ?)`,
    [leadId, note, status, nextFollowUp],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "DB error" });
      }

      if (status) {
        db.query("UPDATE leads SET status=? WHERE id=?", [status, leadId]);
      }

      res.json({ success: true });
    },
  );
};

const getFollowUps = (req, res) => {
  const { leadId } = req.params;

  db.query(
    "SELECT * FROM followups WHERE lead_id=? ORDER BY created_at DESC",
    [leadId],
    (err, results) => {
      if (err) return res.status(500).json({ error: "DB error" });
      res.json({ followUps: results });
    },
  );
};

/* =========================
   REPORTS
========================= */
const getTodaysFollowUps = (req, res) => {
  db.query(
    `SELECT f.*, l.name, l.phone 
     FROM followups f 
     JOIN leads l ON f.lead_id = l.id
     WHERE f.next_followup = CURDATE()`,
    (err, results) => {
      if (err) return res.status(500).json({ error: "DB error" });
      res.json({ todayFollowUps: results });
    },
  );
};

const getPendingFollowUps = (req, res) => {
  db.query(
    `SELECT f.*, l.name, l.phone 
     FROM followups f 
     JOIN leads l ON f.lead_id = l.id
     WHERE f.next_followup < CURDATE()`,
    (err, results) => {
      if (err) return res.status(500).json({ error: "DB error" });
      res.json({ pendingFollowUps: results });
    },
  );
};

/* =========================
   EXCEL IMPORT / EXPORT
========================= */
const importLeadsFromExcel = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const workbook = XLSX.readFile(req.file.path);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet);

  if (!rows.length) {
    return res.status(400).json({ error: "Excel file is empty" });
  }

  const values = rows
    .map((r) => {
      const keys = Object.keys(r).reduce((acc, key) => {
        acc[key.toLowerCase().trim()] = r[key];
        return acc;
      }, {});

      const name = keys["name"];
      const phone = keys["phone"];

      if (!name || !phone) return null;

      return [
        String(name).trim(),
        String(phone).trim(),
        String(phone).trim(),
        keys["email"] || null,
        keys["city"] || null,
        keys["source"] || "Excel",
        keys["status"] || "New",
        keys["call_status"] || null,
        keys["building_type"] || null,
        keys["floors"] || null,
        keys["measurement"] || null,
        keys["sqft"] || null,
        keys["budget"] || null,
        keys["assigned_to"] || null,
        keys["quotation_sent"] || null,
        keys["project_start"] || null,
        keys["snooze_until"] || null,
        keys["description"] || null,
        keys["date_and_time"] || null,
        keys["search_category"] || null,
        keys["area"] || null,
      ];
    })
    .filter(Boolean);

  if (!values.length) {
    return res.status(400).json({
      error: "No valid rows found in Excel",
    });
  }

  const sql = `
    INSERT INTO leads (
      name,
      phone,
      whatsapp,
      email,
      city,
      source,
      status,
      call_status,
      building_type,
      floors,
      measurement,
      sqft,
      budget,
      assigned_to,
      quotation_sent,
      project_start,
      snooze_until,
      description,
      date_and_time,
      search_category,
      area
    )
    VALUES ?
    ON DUPLICATE KEY UPDATE
      email = VALUES(email),
      city = VALUES(city),
      status = VALUES(status),
      source = VALUES(source),
      budget = VALUES(budget),
      date_and_time = VALUES(date_and_time),
      search_category = VALUES(search_category),
      area = VALUES(area),
      assigned_to = VALUES(assigned_to)
  `;

  db.query(sql, [values], (err, result) => {
    if (err) {
      console.error("Import failed:", err);
      return res.status(500).json({ error: "Import failed" });
    }

    res.json({ success: true, affectedRows: result.affectedRows });
  });
};

const exportLeadsToExcel = (req, res) => {
  const { status, assigned_to } = req.query;

  let sql = "SELECT * FROM leads WHERE 1=1";

  if (status) sql += ` AND status='${status}'`;
  if (assigned_to) sql += ` AND assigned_to='${assigned_to}'`;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "DB error" });

    const ws = XLSX.utils.json_to_sheet(results);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Leads");

    const filePath = path.join(__dirname, "../leads.xlsx");
    XLSX.writeFile(wb, filePath);

    res.download(filePath);
  });
};

/* =========================
   LEAD TIMELINE
========================= */
const getLeadTimeline = (req, res) => {
  const { leadId } = req.params;

  db.query(
    `SELECT type, description, time
     FROM lead_timeline
     WHERE lead_id = ?
     ORDER BY time DESC`,
    [leadId],
    (err, results) => {
      if (err) {
        console.error("Timeline error:", err);
        return res.status(500).json({ message: "Failed to fetch timeline" });
      }

      res.json({ timeline: results });
    },
  );
};

const logLeadActivity = (db, { leadId, user, action, startTime, endTime }) => {
  const duration =
    startTime && endTime
      ? Math.floor(
          (new Date(endTime).getTime() - new Date(startTime).getTime()) / 60000,
        )
      : null;

  db.query(
    `INSERT INTO lead_activity_log
     (lead_id, user_email, user_role, action, start_time, end_time, duration_minutes)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [leadId, user.email, user.role, action, startTime, endTime, duration],
  );
};

const getDashboardSummary = (req, res) => {
  const summary = {};

  // Total leads
  db.query("SELECT COUNT(*) AS total FROM leads", (err, totalResult) => {
    if (err) return res.status(500).json({ error: "DB error" });
    summary.totalLeads = totalResult[0].total;

    // Today leads
    db.query(
      "SELECT COUNT(*) AS today FROM leads WHERE DATE(created_at) = CURDATE()",
      (err, todayResult) => {
        if (err) return res.status(500).json({ error: "DB error" });
        summary.todayLeads = todayResult[0].today;

        // Interested
        db.query(
          "SELECT COUNT(*) AS interested FROM leads WHERE LOWER(status) = 'interested'",
          (err, interestedResult) => {
            if (err) return res.status(500).json({ error: "DB error" });
            summary.interested = interestedResult[0].interested;

            // Converted
            db.query(
              "SELECT COUNT(*) AS converted FROM leads WHERE LOWER(status) = 'converted'",
              (err, convertedResult) => {
                if (err) return res.status(500).json({ error: "DB error" });
                summary.converted = convertedResult[0].converted;

                // Today Followups
                db.query(
                  "SELECT COUNT(*) AS todayFollowUps FROM followups WHERE DATE(next_followup) = CURDATE()",
                  (err, todayFU) => {
                    if (err) return res.status(500).json({ error: "DB error" });
                    summary.todayFollowUps = todayFU[0].todayFollowUps;

                    // Pending Followups
                    db.query(
                      "SELECT COUNT(*) AS pendingFollowUps FROM followups WHERE DATE(next_followup) < CURDATE()",
                      (err, pendingFU) => {
                        if (err)
                          return res.status(500).json({ error: "DB error" });
                        summary.pendingFollowUps =
                          pendingFU[0].pendingFollowUps;

                        res.json(summary);
                      },
                    );
                  },
                );
              },
            );
          },
        );
      },
    );
  });
};

const importJustDialPDF = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const fileExt = path.extname(req.file.originalname).toLowerCase();

  /* ================= XLSX IMPORT ================= */
 if (fileExt === ".xlsx" || fileExt === ".xls") {
  const workbook = XLSX.readFile(req.file.path);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet);

  if (!rows.length) {
    return res.status(400).json({ message: "Empty file" });
  }

  const values = rows
    .map((r) => {
      const keys = Object.keys(r).reduce((acc, key) => {
        acc[key.toLowerCase().trim()] = r[key];
        return acc;
      }, {});

      const name =
        keys["customer name"] ||
        keys["user name"] ||
        keys["name"] ||
        null;

      const phone =
        keys["user number"] ||
        keys["mobile no"] ||
        keys["mobile"] ||
        keys["phone"] ||
        null;

      if (!name || !phone) return null;

      // ✅ Convert date format
      let formattedDate = null;
      const rawDate =
        keys["date and time"] ||
        keys["date & time"] ||
        keys["date_and_time"];

      if (rawDate) {
        const cleaned = rawDate.replace(",", "").trim(); 
        // "16/02/2026 10:19"

        const [datePart, timePart] = cleaned.split(" ");
        if (datePart && timePart) {
          const [day, month, year] = datePart.split("/");
          formattedDate = `${year}-${month}-${day} ${timePart}:00`;
        }
      }

      return [
        String(name).trim(),
        String(phone).trim(),
        String(phone).trim(),
        keys["user email"] || keys["email"] || null,
        keys["city"] || null,
        "JustDial",
        "New",
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        formattedDate,
        keys["search category"] || null,
        keys["area"] || null,
      ];
    })
    .filter(Boolean);

  if (!values.length) {
    return res.status(400).json({
      error: "No valid rows found in JustDial Excel",
    });
  }

  const sql = `
    INSERT INTO leads (
      name,
      phone,
      whatsapp,
      email,
      city,
      source,
      status,
      call_status,
      building_type,
      floors,
      measurement,
      sqft,
      budget,
      assigned_to,
      quotation_sent,
      project_start,
      snooze_until,
      description,
      date_and_time,
      search_category,
      area
    )
    VALUES ?
  `;

  db.query(sql, [values], (err) => {
    if (err) {
      console.error("JustDial import error:", err);
      return res.status(500).json({ error: "Import failed" });
    }

    res.json({ success: true });
  });
}


  /* ================= PDF IMPORT ================= */
  else if (fileExt === ".pdf") {
    const dataBuffer = fs.readFileSync(req.file.path);

    pdfParse(dataBuffer).then((data) => {
      const lines = data.text.split("\n").filter((l) => l.trim() !== "");

      const values = lines
        .map((line) => {
          const parts = line.split(" ");

          if (!parts[0] || !parts[1]) return null;

          return [
            parts[0],
            parts[1],
            parts[1],
            null,
            null,
            "JustDial",
            "New",
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
          ];
        })
        .filter(Boolean);

      if (!values.length) {
        return res.status(400).json({
          error: "No valid rows found in PDF",
        });
      }

      const sql = `
        INSERT INTO leads (
          name,
          phone,
          whatsapp,
          email,
          city,
          source,
          status,
          call_status,
          building_type,
          floors,
          measurement,
          sqft,
          budget,
          assigned_to,
          quotation_sent,
          project_start,
          snooze_until,
          description,
          date_and_time,
          search_category,
          area
        )
        VALUES ?
      `;

      db.query(sql, [values], (err) => {
        if (err) {
          console.error("PDF import error:", err);
          return res.status(500).json({ error: "PDF Import failed" });
        }

        res.json({ success: true });
      });
    });
  }

  else {
    res.status(400).json({ message: "Unsupported file type" });
  }
};


  // ================= PDF IMPORT =================
  
/* =========================
   REQUEST JUNK (BDA)
========================= */
const requestJunk = (req, res) => {
  const { id } = req.params;

  const sql = `
    UPDATE leads
    SET status = 'JUNK_REQUESTED',
        junk_requested_at = NOW()
    WHERE id = ? AND deleted_by_admin = 0
  `;

  db.query(sql, [id], (err) => {
    if (err) {
      console.error("Junk request error:", err);
      return res.status(500).json({ message: "Failed to request junk" });
    }

    res.json({ success: true });
  });
};

/* =========================
   REASSIGN LEAD (ADMIN)
========================= */
const reassignLead = (req, res) => {
  const { id } = req.params;
  const { assigned_to } = req.body;

  const sql = `
    UPDATE leads
    SET assigned_to = ?,
        status = 'New',
        junk_requested_at = NULL
    WHERE id = ? AND deleted_by_admin = 0
  `;

  db.query(sql, [assigned_to, id], (err) => {
    if (err) {
      console.error("Reassign error:", err);
      return res.status(500).json({ message: "Reassign failed" });
    }

    res.json({ success: true });
  });
};

/* =========================
   PERMANENT DELETE (ADMIN)
========================= */
const permanentDeleteLead = (req, res) => {
  const { id } = req.params;

  const sql = `
    UPDATE leads
    SET deleted_by_admin = 1
    WHERE id = ?
  `;

  db.query(sql, [id], (err) => {
    if (err) {
      console.error("Permanent delete error:", err);
      return res.status(500).json({ message: "Delete failed" });
    }

    res.json({ success: true });
  });
};

/* =========================
   EXPORTS
========================= */
module.exports = {
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
  getLeadTimeline,
  logLeadActivity,
  getDashboardSummary,
  importJustDialPDF,
  requestJunk,
  reassignLead,
  permanentDeleteLead,
};
