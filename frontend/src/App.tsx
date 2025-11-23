// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import DronesPage from "./pages/DronesPage";
import FlightsPage from "./pages/FlightsPage";
import PilotsPage from "./pages/PilotsPage";
import ProjectsPage from "./pages/ProjectsPage";
import OperationCalendarPage from "./pages/OperationCalendarPage";
import InspectionPage from "./pages/InspectionPage";
import IncidentsPage from "./pages/IncidentsPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import DroneDetailPage from "./pages/DroneDetailPage";
import FlightDetailPage from "./pages/FlightDetailPage";



function App() {
  return (
    <Routes>
      {/* default redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* login */}
      <Route path="/login" element={<LoginPage />} />

      {/* console shell */}
      <Route path="/console" element={<MainLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="drones" element={<DronesPage />} />
        <Route path="drones/:droneId" element={<DroneDetailPage />} />
        <Route
  path="/console/drones/:droneId/flights/:flightId"
  element={<FlightDetailPage />}
/>


        <Route path="flights" element={<FlightsPage />} />
        <Route path="pilots" element={<PilotsPage />} />

        <Route path="projects" element={<ProjectsPage />} />
        <Route path="operation-calendar" element={<OperationCalendarPage />} />
        <Route path="inspection" element={<InspectionPage />} />
        <Route path="incidents" element={<IncidentsPage />} />
        <Route path="reports" element={<ReportsPage />} />


        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* 404 – send back to dashboard */}
      <Route path="*" element={<Navigate to="/console/dashboard" replace />} />
    </Routes>
  );
}

export default App;

