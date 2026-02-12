const db = require("../config/db");
const XLSX = require("xlsx");
const path = require("path");

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
    description
  } = req.body;

  if (!name || !phone) {
    return res.status(400).json({
      success: false,
      message: "Name and phone are required"
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
      description
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
    description || null
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Create lead error:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to create lead"
      });
    }

    res.json({
      success: true,
      leadId: result.insertId
    });
  });
};

/* =========================
   GET ALL LEADS
========================= */
const getAllLeads = (req, res) => {
  db.query(
    "SELECT * FROM leads ORDER BY created_at DESC",
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json({ leads: results });
    }
  );
};

/* =========================
   GET LEAD BY ID
========================= */
const getLeadById = (req, res) => {
  const { id } = req.params;

  db.query(
    "SELECT * FROM leads WHERE id = ?",
    [id],
    (err, results) => {
      if (err) return res.status(500).json({ error: "DB error" });
      if (results.length === 0)
        return res.status(404).json({ error: "Lead not found" });

      res.json({ lead: results[0] });
    }
  );
};

/* =========================
   UPDATE LEAD
========================= */
const updateLead = (req, res) => {
  const { id } = req.params;
  const { name, phone, email, source, status } = req.body;

  db.query(
    `UPDATE leads 
     SET name=?, phone=?, email=?, source=?, status=?
     WHERE id=?`,
    [name, phone, email, source, status, id],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Update failed" });
      }
      res.json({ success: true });
    }
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
        db.query("UPDATE leads SET status=? WHERE id=?", [
          status,
          leadId,
        ]);
      }

      res.json({ success: true });
    }
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
    }
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
    }
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
    }
  );
};

/* =========================
   EXCEL IMPORT / EXPORT
========================= */
const importLeadsFromExcel = (req, res) => {
  const workbook = XLSX.readFile(req.file.path);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet);

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
      description
    )
    VALUES ?
    ON DUPLICATE KEY UPDATE
      name = VALUES(name),
      email = VALUES(email),
      city = VALUES(city),
      status = VALUES(status),
      source = VALUES(source),
      budget = VALUES(budget),
      assigned_to = VALUES(assigned_to)
  `;

  const values = rows.map(r => [
    r.name,
    r.phone,
    r.whatsapp || r.phone,
    r.email || null,
    r.city || null,
    r.source || "Excel",
    r.status || "New",
    r.call_status || null,
    r.building_type || null,
    r.floors || null,
    r.measurement || null,
    r.sqft || null,
    r.budget || null,
    r.assigned_to || null,
    r.quotation_sent || null,
    r.project_start || null,
    r.snooze_until || null,
    r.description || null
  ]);

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
    }
  );
};

const logLeadActivity = (db, {
  leadId,
  user,
  action,
  startTime,
  endTime
}) => {
  const duration =
    startTime && endTime
      ? Math.floor((endTime - startTime) / 60000)
      : null;

  db.query(
    `INSERT INTO lead_activity_log
     (lead_id, user_email, user_role, action, start_time, end_time, duration_minutes)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      leadId,
      user.email,
      user.role,
      action,
      startTime,
      endTime,
      duration
    ]
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
                        if (err) return res.status(500).json({ error: "DB error" });
                        summary.pendingFollowUps = pendingFU[0].pendingFollowUps;

                        res.json(summary);
                      }
                    );
                  }
                );
              }
            );
          }
        );
      }
    );
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
  getDashboardSummary
};
