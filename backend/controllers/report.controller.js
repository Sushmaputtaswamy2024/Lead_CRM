const db = require("../config/db");
const path = require("path");

/**
 * ===============================
 * TIME SPENT PER LEAD
 * ===============================
 * Shows how much total time is spent on each lead
 */
exports.timeSpentPerLead = (req, res) => {
  const sql = `
    SELECT 
      l.id AS lead_id,
      l.name,
      l.phone,
      SUM(a.duration_minutes) AS total_minutes
    FROM lead_activity_log a
    JOIN leads l ON l.id = a.lead_id
    GROUP BY a.lead_id
    ORDER BY total_minutes DESC
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      console.error("Time per lead error:", err);
      return res.status(500).json({ message: "Failed to fetch report" });
    }

    res.json({ data: rows });
  });
};

/**
 * ===============================
 * USER PERFORMANCE REPORT
 * ===============================
 * Shows how each user is performing
 */
exports.userPerformance = (req, res) => {
  const sql = `
    SELECT 
      user_email,
      user_role,
      COUNT(DISTINCT lead_id) AS leads_handled,
      SUM(duration_minutes) AS total_minutes
    FROM lead_activity_log
    GROUP BY user_email, user_role
    ORDER BY total_minutes DESC
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      console.error("User performance error:", err);
      return res.status(500).json({ message: "Failed to fetch report" });
    }

    res.json({ data: rows });
  });
};

exports.logLeadActivity = (req, res) => {
  const { lead_id, user_email, user_role, duration_minutes } = req.body;

  if (!lead_id || !user_email || !duration_minutes) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const sql = `
    INSERT INTO lead_activity_log
    (lead_id, user_email, user_role, duration_minutes)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [lead_id, user_email, user_role, duration_minutes],
    (err) => {
      if (err) {
        console.error("logLeadActivity error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      res.json({ success: true });
    }
  );
};

exports.startSession = (req, res) => {
  const { lead_id, user_email, user_role } = req.body;

  if (!lead_id || !user_email) {
    return res.status(400).json({ error: "Missing fields" });
  }

  // 🔍 Check if already active session exists
  const checkSql = `
    SELECT id FROM lead_activity_log
    WHERE lead_id = ?
    AND user_email = ?
    AND end_time IS NULL
    LIMIT 1
  `;

  db.query(checkSql, [lead_id, user_email], (err, rows) => {
    if (err) return res.status(500).json({ error: "DB error" });

    // ✅ If session already exists → return it
    if (rows.length > 0) {
      return res.json({ sessionId: rows[0].id });
    }

    // ✅ Else create new session
    const insertSql = `
      INSERT INTO lead_activity_log
      (lead_id, user_email, user_role, action, start_time)
      VALUES (?, ?, ?, 'view', NOW())
    `;

    db.query(insertSql, [lead_id, user_email, user_role], (err, result) => {
      if (err) return res.status(500).json({ error: "DB error" });

      res.json({ sessionId: result.insertId });
    });
  });
};

exports.endSession = (req, res) => {
  const { session_id } = req.body;

  if (!session_id) {
    return res.status(400).json({ error: "Session id required" });
  }

  const sql = `
    UPDATE lead_activity_log
    SET end_time = NOW(),
        duration_minutes = TIMESTAMPDIFF(MINUTE, start_time, NOW())
    WHERE id = ?
    AND end_time IS NULL
  `;

  db.query(sql, [session_id], (err) => {
    if (err) return res.status(500).json({ error: "DB error" });

    res.json({ success: true });
  });
};


exports.reportOverview = (req, res) => {
  db.query("SELECT COUNT(*) AS total FROM leads", (err, total) => {
    if (err) return res.status(500).json({ error: "DB error" });

    db.query(
      "SELECT COUNT(*) AS converted FROM leads WHERE status='Converted'",
      (err, converted) => {
        if (err) return res.status(500).json({ error: "DB error" });

        res.json({
          totalLeads: total[0].total,
          convertedLeads: converted[0].converted
        });
      }
    );
  });
};

exports.getActivityLogs = (req, res) => {
  const sql = `
    SELECT 
      l.name,
      a.user_email,
      a.user_role,
      a.start_time,
      a.end_time,
      a.duration_minutes
    FROM lead_activity_log a
    JOIN leads l ON l.id = a.lead_id
    ORDER BY a.created_at DESC
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      console.error("Activity log error:", err);
      return res.status(500).json({ message: "Failed to fetch logs" });
    }

    res.json({ data: rows });
  });
};

const XLSX = require("xlsx");

exports.exportReports = (_req, res) => {
  const sql = `
    SELECT 
      l.name,
      l.phone,
      a.user_email,
      a.user_role,
      a.start_time,
      a.end_time,
      a.duration_minutes
    FROM lead_activity_log a
    JOIN leads l ON l.id = a.lead_id
    ORDER BY a.created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Report export error:", err);
      return res.status(500).json({ error: "Report export failed" });
    }

    const ws = XLSX.utils.json_to_sheet(results);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Full Report");

    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=full-report.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.send(buffer);
  });
};
