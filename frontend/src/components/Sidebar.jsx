import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png.jpeg";
import "./Sidebar.css";

export default function Sidebar({ open, setOpen }) {
  const { user, logout } = useAuth();

  return (
    <>
      
      {/* OVERLAY */}
      {open && <div className="overlay" onClick={() => setOpen(false)} />}

      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="logo-section">
          <img src={logo} alt="Company Logo" />
          <h2>Lead System</h2>
        </div>

        <ul className="menu">
          <li><Link onClick={() => setOpen(false)} to="/">Dashboard</Link></li>
          <li><Link onClick={() => setOpen(false)} to="/leads">Leads</Link></li>
          <li><Link onClick={() => setOpen(false)} to="/add-lead">Add Lead</Link></li>
          <li><Link onClick={() => setOpen(false)} to="/follow-ups">Follow Ups</Link></li>

          {user?.role === "admin" && (
            <li><Link onClick={() => setOpen(false)} to="/reports">Reports</Link></li>
          )}
        </ul>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </aside>
    </>
  );
}
