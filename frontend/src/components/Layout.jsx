import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        width: "100vw",
        overflow: "hidden",
        background: "#f3f4f6",
      }}
    >
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <main
        style={{
          flex: 1,
          padding: "24px",
          overflowY: "auto",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}
