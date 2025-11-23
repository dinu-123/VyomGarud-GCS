import React from "react";
import "./InspectionPage.css";

type InspectionStatus = "ok" | "warning" | "critical";

interface InspectionRecord {
  id: string;
  project: string;
  site: string;
  city: string;
  drone: string;
  pilot: string;
  date: string; // "2025-11-21"
  time: string; // "10:30"
  type: string; // "Thermal", "RGB", etc.
  findings: string;
  status: InspectionStatus;
}

const inspections: InspectionRecord[] = [
  {
    id: "INSP-2301",
    project: "Solar Farm – String Inspection",
    site: "Helios Solar Park",
    city: "Ahmedabad",
    drone: "VyomGarud Demo Drone",
    pilot: "Amit Sharma",
    date: "2025-11-19",
    time: "09:35",
    type: "Thermal + RGB",
    findings: "12 hotspots detected across three strings.",
    status: "warning",
  },
  {
    id: "INSP-2298",
    project: "Highway Corridor Mapping",
    site: "NH 48 – Sector B",
    city: "Bengaluru",
    drone: "Survey Drone Alpha",
    pilot: "Priya Verma",
    date: "2025-11-18",
    time: "16:10",
    type: "RGB Mapping",
    findings: "No anomalies detected in pavement or side slopes.",
    status: "ok",
  },
  {
    id: "INSP-2291",
    project: "Bridge Structural Inspection",
    site: "Kaveri Bridge",
    city: "Mysuru",
    drone: "Inspection Drone X2",
    pilot: "Rohit Singh",
    date: "2025-11-16",
    time: "08:20",
    type: "Thermal + RGB",
    findings: "Hairline crack patterns on north pillar – flagged.",
    status: "critical",
  },
  {
    id: "INSP-2285",
    project: "Factory Roof Thermal Audit",
    site: "BlueSteel Plant",
    city: "Pune",
    drone: "VyomGarud Demo Drone",
    pilot: "Sneha Iyer",
    date: "2025-11-15",
    time: "11:05",
    type: "Thermal",
    findings: "Minor insulation loss zones detected on north-west corner.",
    status: "warning",
  },
];

function statusLabel(status: InspectionStatus) {
  switch (status) {
    case "ok":
      return "Normal";
    case "warning":
      return "Needs review";
    case "critical":
      return "Critical";
    default:
      return status;
  }
}

function InspectionsPage() {
  const [selectedId, setSelectedId] = React.useState<string | null>(
    inspections[0]?.id ?? null
  );

  const selected = inspections.find((i) => i.id === selectedId) ?? inspections[0];

  const handleRowClick = (id: string) => {
    setSelectedId(id);
  };

  const handleExport = () => {
    alert("In the real app this will export filtered inspections as CSV/PDF.");
  };

  const handleViewReport = () => {
    if (!selected) return;
    alert(
      `In the real app this will open full report for ${selected.id} – ${selected.project}.`
    );
  };

  return (
    <div className="inspections-page">
      {/* Header */}
      <header className="inspections-header">
        <div>
          <h1 className="inspections-title">Inspections & analytics</h1>
          <p className="inspections-subtitle">
            Review all mission outcomes, anomalies and quality metrics in one place.
          </p>
        </div>
        <div className="inspections-header-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={handleExport}
          >
            Export data
          </button>
          <button
            type="button"
            className="primary-button"
            onClick={handleViewReport}
          >
            View full report
          </button>
        </div>
      </header>

      {/* Filters */}
      <section className="inspections-filters-row">
        <div className="inspections-filter-group">
          <div className="filter-label">Date range</div>
          <div className="filter-pill">
            <span>Last 7 days</span>
            <span className="filter-pill-shortcut">⌵</span>
          </div>
        </div>
        <div className="inspections-filter-group">
          <div className="filter-label">Project</div>
          <div className="filter-pill">
            <span>All projects</span>
            <span className="filter-pill-shortcut">⌵</span>
          </div>
        </div>
        <div className="inspections-filter-group">
          <div className="filter-label">Drone</div>
          <div className="filter-pill">
            <span>All drones</span>
            <span className="filter-pill-shortcut">⌵</span>
          </div>
        </div>
        <div className="inspections-filter-group">
          <div className="filter-label">Status</div>
          <div className="filter-pill">
            <span>All statuses</span>
            <span className="filter-pill-shortcut">⌵</span>
          </div>
        </div>
      </section>

      <div className="inspections-layout">
        {/* Left: table list */}
        <section className="inspections-table-card">
          <div className="inspections-table-header">
            <div>
              <h2>Inspection history</h2>
              <p>Chronological list of completed and in-progress inspections.</p>
            </div>
            <div className="inspections-chip-row">
              <button type="button" className="chip chip--active">
                All
              </button>
              <button
                type="button"
                className="chip"
                onClick={() =>
                  alert("In the real app this would filter only critical inspections.")
                }
              >
                Critical only
              </button>
              <button
                type="button"
                className="chip"
                onClick={() =>
                  alert("In the real app this would filter by VyomGarud Demo Drone.")
                }
              >
                VyomGarud Demo Drone
              </button>
            </div>
          </div>

          <div className="inspections-table-wrapper">
            <table className="inspections-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Project</th>
                  <th>Site</th>
                  <th>Drone</th>
                  <th>Pilot</th>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {inspections.map((insp) => (
                  <tr
                    key={insp.id}
                    className={
                      selectedId === insp.id
                        ? "inspections-row inspections-row--active"
                        : "inspections-row"
                    }
                    onClick={() => handleRowClick(insp.id)}
                  >
                    <td>{insp.id}</td>
                    <td>{insp.project}</td>
                    <td>
                      <span className="inspections-site">
                        {insp.site}
                      </span>
                      <span className="inspections-city">
                        {insp.city}
                      </span>
                    </td>
                    <td>{insp.drone}</td>
                    <td>{insp.pilot}</td>
                    <td>
                      {insp.date}{" "}
                      <span className="inspections-time">{insp.time}</span>
                    </td>
                    <td>{insp.type}</td>
                    <td>
                      <span
                        className={`status-pill status-pill--${insp.status}`}
                      >
                        {statusLabel(insp.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Right: detail + analytics card */}
        <aside className="inspections-detail-card">
          <div className="inspections-detail-header">
            <h2>Inspection summary</h2>
            <p>
              Snapshot of the selected inspection with anomaly and quality metrics.
            </p>
          </div>

          {selected && (
            <>
              <div className="inspections-detail-top">
                <div>
                  <div className="inspections-detail-id">
                    {selected.id}
                    <span
                      className={`status-pill status-pill--${selected.status} status-pill--inline`}
                    >
                      {statusLabel(selected.status)}
                    </span>
                  </div>
                  <div className="inspections-detail-project">
                    {selected.project}
                  </div>
                  <div className="inspections-detail-meta">
                    <span>
                      {selected.site}, {selected.city}
                    </span>
                    <span>
                      {selected.date} · {selected.time}
                    </span>
                  </div>
                </div>
              </div>

              {/* Metric badges */}
              <div className="inspections-metrics-row">
                <div className="metric-card">
                  <div className="metric-label">Anomalies</div>
                  <div className="metric-value">
                    {selected.status === "ok"
                      ? "0"
                      : selected.status === "warning"
                      ? "5 – 15"
                      : "20+"}
                  </div>
                  <div className="metric-footnote">Auto-tagged from mission data</div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">Coverage quality</div>
                  <div className="metric-value">
                    {selected.status === "critical" ? "82%" : "96%"}
                  </div>
                  <div className="metric-footnote">Based on overlap & GSD</div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">Flight duration</div>
                  <div className="metric-value">18 – 24 min</div>
                  <div className="metric-footnote">Approximate from logs</div>
                </div>
              </div>

              {/* Tiny “fake chart” strip – just visual */}
              <div className="inspections-chart-card">
                <div className="inspections-chart-header">
                  <span>Battery & altitude profile</span>
                  <span className="inspections-chart-legend">
                    <span className="legend-dot legend-dot--battery" />
                    Battery&nbsp;&nbsp;
                    <span className="legend-dot legend-dot--altitude" />
                    Altitude
                  </span>
                </div>
                <div className="inspections-chart-strip">
                  <div className="chart-bar chart-bar--battery" />
                  <div className="chart-bar chart-bar--altitude" />
                  <div className="chart-bar chart-bar--battery" />
                  <div className="chart-bar chart-bar--altitude" />
                  <div className="chart-bar chart-bar--battery" />
                  <div className="chart-bar chart-bar--altitude" />
                  <div className="chart-bar chart-bar--battery" />
                  <div className="chart-bar chart-bar--altitude" />
                </div>
                <div className="inspections-chart-footer">
                  Simplified visual. In the real app we’ll draw actual graphs from
                  flight logs.
                </div>
              </div>

              {/* Findings block */}
              <div className="inspections-findings-card">
                <div className="inspections-findings-header">
                  <h3>Key findings</h3>
                </div>
                <p className="inspections-findings-text">
                  {selected.findings}
                </p>
                <button
                  type="button"
                  className="secondary-button secondary-button--ghost"
                  onClick={handleViewReport}
                >
                  Open detailed report
                </button>
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}

export default InspectionsPage;
