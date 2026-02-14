import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./Layout.css";

export default function Layout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar open={open} setOpen={setOpen} />

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
