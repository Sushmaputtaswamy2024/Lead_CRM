import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import "./Layout.css";

export default function Layout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="layout">
      <Sidebar open={open} setOpen={setOpen} />

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
