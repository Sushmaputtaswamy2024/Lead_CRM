import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Layout from "./components/Layout";
import Login from "./pages/Login";

import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import AddLead from "./pages/AddLead";
import FollowUps from "./pages/FollowUps";
import Reports from "./pages/Reports";
import LeadDetails from "./pages/LeadDetails";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="leads" element={<Leads />} />
            <Route path="leads/:id" element={<LeadDetails />} />
            <Route path="add-lead" element={<AddLead />} />
            <Route path="follow-ups" element={<FollowUps />} />

            {/* ADMIN ONLY */}
            <Route
              path="reports"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <Reports />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
