import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div
      style={{
        width: "200px",
        background: "#1f2937",
        color: "#fff",
        height: "100vh",
        padding: "20px"
      }}
    >
      <h2 style={{ marginBottom: "30px" }}>Lead System</h2>

      <ul style={{ listStyle: "none", padding: 0, lineHeight: "2.2" }}>
        <li>
          <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>
            Dashboard
          </Link>
        </li>

        <li>
          <Link to="/leads" style={{ color: "#fff", textDecoration: "none" }}>
            Leads
          </Link>
        </li>

        <li>
          <Link to="/add-lead" style={{ color: "#fff", textDecoration: "none" }}>
            Add Lead
          </Link>
        </li>

        <li>
          <Link to="/follow-ups" style={{ color: "#fff", textDecoration: "none" }}>
            Follow Ups
          </Link>
        </li>

        <li>
          <Link to="/reports" style={{ color: "#fff", textDecoration: "none" }}>
            Reports
          </Link>
        </li>
      </ul>
    </div>
    
  );
}
