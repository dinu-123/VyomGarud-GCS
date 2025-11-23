import React from "react";
import "./FlightsPage.css";

type FlightStatus = "completed" | "in-flight" | "planned" | "aborted";

interface FlightRow {
  id: string;
  drone: string;
  mission: string;
  pilot: string;
  date: string;
  duration: string;
  location: string;
  status: FlightStatus;
}

const demoFlights: FlightRow[] = [
  {
    id: "VG-FL-001",
    drone: "VyomGarud Demo Drone",
    mission: "Demo Survey",
    pilot: "Amit Sharma",
    date: "2025-11-18",
    duration: "18 min",
    location: "Bengaluru, IN",
    status: "completed",
  },
  {
    id: "VG-FL-002",
    drone: "Survey Drone Alpha",
    mission: "Powerline Inspection",
    pilot: "Priya Verma",
    date: "2025-11-17",
    duration: "24 min",
    location: "Pune, IN",
    status: "completed",
  },
  {
    id: "VG-FL-003",
    drone: "Inspection Drone X2",
    mission: "Bridge Scan",
    pilot: "Rohit Singh",
    date: "2025-11-18",
    duration: "08 min",
    location: "Ahmedabad, IN",
    status: "in-flight",
  },
  {
    id: "VG-FL-004",
    drone: "Hawk Demo",
    mission: "Test Mission",
    pilot: "System",
    date: "2025-11-16",
    duration: "—",
    location: "N/A",
    status: "planned",
  },
];

function FlightsPage() {
  return (
    <div className="flights-page">
      {/* Header */}
      <header className="flights-header">
        <div>
          <h1 className="flights-title">Flights</h1>
          <p className="flights-subtitle">
            View recent and scheduled flights for all VyomGarud drones.
          </p>
        </div>

        <div className="flights-header-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={() =>
              alert("In the real app this will open filters for flights.")
            }
          >
            Filters
          </button>
          <button
            type="button"
            className="primary-button"
            onClick={() =>
              alert("In the real app this will start a new flight / mission.")
            }
          >
            New Flight
          </button>
        </div>
      </header>

      {/* Main card */}
      <section className="flights-card">
        {demoFlights.length === 0 ? (
          <div className="flights-empty">
            <p className="flights-empty-title">No flights to show</p>
            <p className="flights-empty-text">
              Once missions are executed, they will appear here with telemetry
              and status.
            </p>
          </div>
        ) : (
          <div className="flights-table-wrapper">
            <table className="flights-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Drone</th>
                  <th>Mission</th>
                  <th>Pilot</th>
                  <th>Date</th>
                  <th>Duration</th>
                  <th>Location</th>
                  <th className="col-status">Status</th>
                </tr>
              </thead>
              <tbody>
                {demoFlights.map((flight) => (
                  <tr
                    key={flight.id}
                    className="flights-row"
                    onClick={() =>
                      alert(
                        `In the real app this opens the flight log & telemetry for ${flight.id}.`
                      )
                    }
                  >
                    <td>{flight.id}</td>
                    <td>{flight.drone}</td>
                    <td>{flight.mission}</td>
                    <td>{flight.pilot}</td>
                    <td>{flight.date}</td>
                    <td>{flight.duration}</td>
                    <td>{flight.location}</td>
                    <td className="col-status">
                      <span className={`flight-status flight-status--${flight.status}`}>
                        {flight.status === "completed"
                          ? "Completed"
                          : flight.status === "in-flight"
                          ? "In-flight"
                          : flight.status === "planned"
                          ? "Planned"
                          : "Aborted"}
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

export default FlightsPage;
