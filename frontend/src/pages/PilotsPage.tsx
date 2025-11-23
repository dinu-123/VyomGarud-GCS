import React from "react";
import "./PilotsPage.css";

type PilotStatus = "active" | "on-leave" | "inactive";

interface PilotRow {
  id: string;
  name: string;
  callsign: string;
  role: string;
  totalFlights: number;
  totalHours: number;
  lastFlight: string;
  status: PilotStatus;
}

const demoPilots: PilotRow[] = [
  {
    id: "VG-PL-001",
    name: "Amit Sharma",
    callsign: "Raven 1",
    role: "Chief Pilot",
    totalFlights: 326,
    totalHours: 682,
    lastFlight: "2025-11-18 • 18 min",
    status: "active",
  },
  {
    id: "VG-PL-002",
    name: "Priya Verma",
    callsign: "Falcon 3",
    role: "Survey Specialist",
    totalFlights: 214,
    totalHours: 412,
    lastFlight: "2025-11-17 • 24 min",
    status: "active",
  },
  {
    id: "VG-PL-003",
    name: "Rohit Singh",
    callsign: "Hawk 2",
    role: "Inspection Pilot",
    totalFlights: 145,
    totalHours: 231,
    lastFlight: "2025-11-18 • 08 min",
    status: "active",
  },
  {
    id: "VG-PL-004",
    name: "Sneha Iyer",
    callsign: "Skyfox",
    role: "Trainee Pilot",
    totalFlights: 18,
    totalHours: 26,
    lastFlight: "2025-11-10 • 12 min",
    status: "on-leave",
  },
  {
    id: "VG-PL-005",
    name: "System Account",
    callsign: "AutoPilot",
    role: "Automated Missions",
    totalFlights: 54,
    totalHours: 90,
    lastFlight: "2025-11-12 • 20 min",
    status: "inactive",
  },
];

function PilotsPage() {
  const totalPilots = demoPilots.length;
  const activePilots = demoPilots.filter((p) => p.status === "active").length;
  const totalFlights = demoPilots.reduce(
    (sum, p) => sum + p.totalFlights,
    0
  );
  const totalHours = demoPilots.reduce((sum, p) => sum + p.totalHours, 0);

  return (
    <div className="pilots-page">
      {/* Header */}
      <header className="pilots-header">
        <div>
          <h1 className="pilots-title">Pilots</h1>
          <p className="pilots-subtitle">
            Manage VyomGarud pilots, credentials and fleet flight experience.
          </p>
        </div>

        <div className="pilots-header-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={() =>
              alert("In the real app this will open pilot filters / search.")
            }
          >
            Filters
          </button>
          <button
            type="button"
            className="primary-button"
            onClick={() =>
              alert("In the real app this will open the add-new-pilot form.")
            }
          >
            Add Pilot
          </button>
        </div>
      </header>

      {/* Summary cards */}
      <section className="pilots-summary">
        <div className="pilot-card">
          <p className="pilot-card-label">Total pilots</p>
          <p className="pilot-card-value">{totalPilots}</p>
          <p className="pilot-card-footnote">Across this organisation</p>
        </div>

        <div className="pilot-card">
          <p className="pilot-card-label">Active today</p>
          <p className="pilot-card-value">{activePilots}</p>
          <p className="pilot-card-footnote">
            Ready to fly & receive missions
          </p>
        </div>

        <div className="pilot-card">
          <p className="pilot-card-label">Fleet flights (pilot-logged)</p>
          <p className="pilot-card-value">{totalFlights}</p>
          <p className="pilot-card-footnote">Telemetry-logged flights</p>
        </div>

        <div className="pilot-card">
          <p className="pilot-card-label">Total pilot hours</p>
          <p className="pilot-card-value">{totalHours} hr</p>
          <p className="pilot-card-footnote">Combined logged airtime</p>
        </div>
      </section>

      {/* Main table card */}
      <section className="pilots-card">
        {demoPilots.length === 0 ? (
          <div className="pilots-empty">
            <p className="pilots-empty-title">No pilots added yet</p>
            <p className="pilots-empty-text">
              Use &ldquo;Add Pilot&rdquo; to register your first remote pilot in
              the console.
            </p>
          </div>
        ) : (
          <div className="pilots-table-wrapper">
            <table className="pilots-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Pilot</th>
                  <th>Callsign</th>
                  <th>Role</th>
                  <th>Flights</th>
                  <th>Hours</th>
                  <th>Last flight</th>
                  <th className="col-status">Status</th>
                </tr>
              </thead>
              <tbody>
                {demoPilots.map((pilot) => (
                  <tr
                    key={pilot.id}
                    className="pilots-row"
                    onClick={() =>
                      alert(
                        `In the real app this opens the profile for ${pilot.name}.`
                      )
                    }
                  >
                    <td>{pilot.id}</td>
                    <td>{pilot.name}</td>
                    <td>{pilot.callsign}</td>
                    <td>{pilot.role}</td>
                    <td>{pilot.totalFlights}</td>
                    <td>{pilot.totalHours}</td>
                    <td>{pilot.lastFlight}</td>
                    <td className="col-status">
                      <span
                        className={`pilot-status pilot-status--${pilot.status}`}
                      >
                        {pilot.status === "active"
                          ? "Active"
                          : pilot.status === "on-leave"
                          ? "On leave"
                          : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default PilotsPage;
