import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./Layout.css";

export default function Layout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="app-layout">

      {/* ✅ MOBILE HEADER */}
      <div className="mobile-header">
        <button className="hamburger" onClick={() => setOpen(true)}>
          ☰
        </button>
        <h3>Lead System</h3>
      </div>

      <Sidebar open={open} setOpen={setOpen} />

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
