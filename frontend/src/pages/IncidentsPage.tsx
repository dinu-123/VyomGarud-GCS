// // src/pages/IncidentsPage.tsx
// import React from "react";
// import "./IncidentsPage.css";

// type IncidentSeverity = "Critical" | "Major" | "Minor" | "Info";
// type IncidentStatus = "Open" | "Investigating" | "Resolved" | "Dismissed";

// interface IncidentItem {
//   id: string;
//   title: string;
//   drone: string;
//   pilot: string;
//   location: string;
//   openedAt: string;
//   type: string;
//   severity: IncidentSeverity;
//   status: IncidentStatus;
// }

// const incidents: IncidentItem[] = [
//   {
//     id: "INC-204",
//     title: "Link loss during BVLOS leg",
//     drone: "VG-001 VyomGarud Demo",
//     pilot: "Amit Sharma",
//     location: "Bengaluru, KA",
//     openedAt: "2025-11-21 · 10:42",
//     type: "Communication",
//     severity: "Critical",
//     status: "Investigating",
//   },
//   {
//     id: "INC-203",
//     title: "Battery voltage low at RTH",
//     drone: "VG-003 Inspection Drone X2",
//     pilot: "Priya Verma",
//     location: "Pune, MH",
//     openedAt: "2025-11-20 · 16:05",
//     type: "Power",
//     severity: "Major",
//     status: "Open",
//   },
//   {
//     id: "INC-202",
//     title: "Geofence boundary alert",
//     drone: "VG-004 Hawk Demo",
//     pilot: "Rohit Singh",
//     location: "Hyderabad, TS",
//     openedAt: "2025-11-19 · 09:18",
//     type: "Geofence",
//     severity: "Minor",
//     status: "Resolved",
//   },
//   {
//     id: "INC-201",
//     title: "IMU calibration warning",
//     drone: "VG-002 Survey Drone Alpha",
//     pilot: "System Pilot",
//     location: "Ahmedabad, GJ",
//     openedAt: "2025-11-18 · 11:32",
//     type: "Health",
//     severity: "Info",
//     status: "Dismissed",
//   },
// ];

// const severityPillClass = (severity: IncidentSeverity) => {
//   switch (severity) {
//     case "Critical":
//       return "pill pill-critical";
//     case "Major":
//       return "pill pill-major";
//     case "Minor":
//       return "pill pill-minor";
//     case "Info":
//       return "pill pill-info";
//     default:
//       return "pill";
//   }
// };

// const statusPillClass = (status: IncidentStatus) => {
//   switch (status) {
//     case "Open":
//       return "pill pill-open";
//     case "Investigating":
//       return "pill pill-investigating";
//     case "Resolved":
//       return "pill pill-resolved";
//     case "Dismissed":
//       return "pill pill-dismissed";
//     default:
//       return "pill";
//   }
// };

// const IncidentsPage: React.FC = () => {
//   return (
//     <div className="inc-page">
//       {/* Header */}
//       <div className="inc-header">
//         <div>
//           <h1>Incidents</h1>
//           <p className="inc-subtitle">
//             Track safety events, system warnings and operational anomalies.
//           </p>
//         </div>

//         <div className="inc-header-actions">
//           <button className="btn-outline">Export</button>
//           <button className="btn-primary">Log manual incident</button>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="inc-filters">
//         <div className="filter-group">
//           <label>Severity</label>
//           <div className="filter-chips">
//             <button className="chip chip-active">All</button>
//             <button className="chip">Critical</button>
//             <button className="chip">Major</button>
//             <button className="chip">Minor</button>
//             <button className="chip">Info</button>
//           </div>
//         </div>

//         <div className="filter-group filter-group-right">
//           <label>Search</label>
//           <div className="search-box">
//             <span className="search-icon">🔍</span>
//             <input
//               type="text"
//               placeholder="Search by ID, drone, pilot, location..."
//             />
//           </div>
//         </div>
//       </div>

//       {/* Content layout */}
//       <div className="inc-content">
//         {/* Table */}
//         <div className="inc-table-card">
//           <div className="inc-table-header">
//             <span className="table-title">Recent incidents</span>
//             <span className="table-meta">
//               Showing {incidents.length} records
//             </span>
//           </div>

//           <div className="inc-table-wrapper">
//             <table className="inc-table">
//               <thead>
//                 <tr>
//                   <th>ID</th>
//                   <th>Incident</th>
//                   <th>Drone</th>
//                   <th>Pilot</th>
//                   <th>Location</th>
//                   <th>Opened</th>
//                   <th>Type</th>
//                   <th>Severity</th>
//                   <th>Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {incidents.map((inc) => (
//                   <tr key={inc.id}>
//                     <td className="col-id">{inc.id}</td>
//                     <td className="col-title">
//                       <div className="primary-text">{inc.title}</div>
//                     </td>
//                     <td className="col-drone">
//                       <div className="secondary-text">{inc.drone}</div>
//                     </td>
//                     <td className="col-pilot">
//                       <div className="secondary-text">{inc.pilot}</div>
//                     </td>
//                     <td className="col-location">
//                       <div className="secondary-text">{inc.location}</div>
//                     </td>
//                     <td className="col-opened">
//                       <div className="primary-text">{inc.openedAt}</div>
//                     </td>
//                     <td className="col-type">
//                       <div className="secondary-text">{inc.type}</div>
//                     </td>
//                     <td className="col-severity">
//                       <span className={severityPillClass(inc.severity)}>
//                         {inc.severity}
//                       </span>
//                     </td>
//                     <td className="col-status">
//                       <span className={statusPillClass(inc.status)}>
//                         {inc.status}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Side panel */}
//         <aside className="inc-side-panel">
//           <div className="side-card">
//             <h2>Safety snapshot</h2>
//             <p className="side-muted">
//               This panel can later show safety KPIs like MTBF, incident rate
//               per flight hour and top recurring categories.
//             </p>

//             <div className="side-metrics">
//               <div className="metric">
//                 <span className="metric-label">Open incidents</span>
//                 <span className="metric-value">02</span>
//               </div>
//               <div className="metric">
//                 <span className="metric-label">Critical (last 7 days)</span>
//                 <span className="metric-value metric-value-critical">01</span>
//               </div>
//               <div className="metric">
//                 <span className="metric-label">Resolution rate</span>
//                 <span className="metric-value">88%</span>
//               </div>
//             </div>
//           </div>

//           <div className="side-card side-card-secondary">
//             <h3>Playbooks</h3>
//             <ul>
//               <li>🛰 Link loss procedure</li>
//               <li>⚡ Battery & power anomaly checklist</li>
//               <li>🗺 Geofence violation triage</li>
//             </ul>
//           </div>
//         </aside>
//       </div>
//     </div>
//   );
// };

// export default IncidentsPage;



// src/pages/IncidentsPage.tsx
import React from "react";
import "./IncidentsPage.css";

type IncidentSeverity = "Critical" | "Major" | "Minor" | "Info";
type IncidentStatus = "Open" | "Investigating" | "Resolved" | "Dismissed";

interface IncidentItem {
  id: string;
  title: string;
  drone: string;
  pilot: string;
  location: string;
  openedAt: string;
  type: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
}

const incidents: IncidentItem[] = [
  {
    id: "INC-204",
    title: "Link loss during BVLOS leg",
    drone: "VG-001 VyomGarud Demo",
    pilot: "Amit Sharma",
    location: "Bengaluru, KA",
    openedAt: "2025-11-21 · 10:42",
    type: "Communication",
    severity: "Critical",
    status: "Investigating",
  },
  {
    id: "INC-203",
    title: "Battery voltage low at RTH",
    drone: "VG-003 Inspection Drone X2",
    pilot: "Priya Verma",
    location: "Pune, MH",
    openedAt: "2025-11-20 · 16:05",
    type: "Power",
    severity: "Major",
    status: "Open",
  },
  {
    id: "INC-202",
    title: "Geofence boundary alert",
    drone: "VG-004 Hawk Demo",
    pilot: "Rohit Singh",
    location: "Hyderabad, TS",
    openedAt: "2025-11-19 · 09:18",
    type: "Geofence",
    severity: "Minor",
    status: "Resolved",
  },
  {
    id: "INC-201",
    title: "IMU calibration warning",
    drone: "VG-002 Survey Drone Alpha",
    pilot: "System Pilot",
    location: "Ahmedabad, GJ",
    openedAt: "2025-11-18 · 11:32",
    type: "Health",
    severity: "Info",
    status: "Dismissed",
  },
];

const severityPillClass = (severity: IncidentSeverity) => {
  switch (severity) {
    case "Critical":
      return "pill pill-critical";
    case "Major":
      return "pill pill-major";
    case "Minor":
      return "pill pill-minor";
    case "Info":
      return "pill pill-info";
    default:
      return "pill";
  }
};

const statusPillClass = (status: IncidentStatus) => {
  switch (status) {
    case "Open":
      return "pill pill-open";
    case "Investigating":
      return "pill pill-investigating";
    case "Resolved":
      return "pill pill-resolved";
    case "Dismissed":
      return "pill pill-dismissed";
    default:
      return "pill";
  }
};

const IncidentsPage: React.FC = () => {
  // ---------- handlers for pop-ups ----------

  const handleExportClick = () => {
    window.alert(
      "⬇️ Export incidents\n\nIn real VyomGarud GCS this will download a CSV / PDF export. For now this is a demo action."
    );
  };

  const handleLogManualClick = () => {
    window.alert(
      "📝 Log manual incident\n\nHere you will later get a form to log a safety event manually (pilot report, field issue, etc.)."
    );
  };

  const handleSeverityChipClick = (label: string) => {
    window.alert(
      `🎛 Filter by severity: ${label}\n\nIn the final version this will filter the incident list based on selected severity.`
    );
  };

  const handleRowClick = (inc: IncidentItem) => {
    window.alert(
      [
        "ℹ️ Incident details (demo)",
        "",
        `ID: ${inc.id}`,
        `Title: ${inc.title}`,
        `Drone: ${inc.drone}`,
        `Pilot: ${inc.pilot}`,
        `Location: ${inc.location}`,
        `Opened: ${inc.openedAt}`,
        `Severity: ${inc.severity}`,
        `Status: ${inc.status}`,
        "",
        "In the real app this will open a detailed incident drawer with timeline, logs and actions."
      ].join("\n")
    );
  };

  // -----------------------------------------

  return (
    <div className="inc-page">
      {/* Header */}
      <div className="inc-header">
        <div>
          <h1>Incidents</h1>
          <p className="inc-subtitle">
            Track safety events, system warnings and operational anomalies.
          </p>
        </div>

        <div className="inc-header-actions">
          <button className="btn-outline" onClick={handleExportClick}>
            Export
          </button>
          <button className="btn-primary" onClick={handleLogManualClick}>
            Log manual incident
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="inc-filters">
        <div className="filter-group">
          <label>Severity</label>
          <div className="filter-chips">
            <button
              className="chip chip-active"
              onClick={() => handleSeverityChipClick("All")}
            >
              All
            </button>
            <button
              className="chip"
              onClick={() => handleSeverityChipClick("Critical")}
            >
              Critical
            </button>
            <button
              className="chip"
              onClick={() => handleSeverityChipClick("Major")}
            >
              Major
            </button>
            <button
              className="chip"
              onClick={() => handleSeverityChipClick("Minor")}
            >
              Minor
            </button>
            <button
              className="chip"
              onClick={() => handleSeverityChipClick("Info")}
            >
              Info
            </button>
          </div>
        </div>

        <div className="filter-group filter-group-right">
          <label>Search</label>
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by ID, drone, pilot, location..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  window.alert(
                    `🔎 Search: "${(e.target as HTMLInputElement).value}"\n\nLater this will filter the incidents table.`
                  );
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Content layout */}
      <div className="inc-content">
        {/* Table */}
        <div className="inc-table-card">
          <div className="inc-table-header">
            <span className="table-title">Recent incidents</span>
            <span className="table-meta">
              Showing {incidents.length} records
            </span>
          </div>

          <div className="inc-table-wrapper">
            <table className="inc-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Incident</th>
                  <th>Drone</th>
                  <th>Pilot</th>
                  <th>Location</th>
                  <th>Opened</th>
                  <th>Type</th>
                  <th>Severity</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {incidents.map((inc) => (
                  <tr key={inc.id} onClick={() => handleRowClick(inc)}>
                    <td className="col-id">{inc.id}</td>
                    <td className="col-title">
                      <div className="primary-text">{inc.title}</div>
                    </td>
                    <td className="col-drone">
                      <div className="secondary-text">{inc.drone}</div>
                    </td>
                    <td className="col-pilot">
                      <div className="secondary-text">{inc.pilot}</div>
                    </td>
                    <td className="col-location">
                      <div className="secondary-text">{inc.location}</div>
                    </td>
                    <td className="col-opened">
                      <div className="primary-text">{inc.openedAt}</div>
                    </td>
                    <td className="col-type">
                      <div className="secondary-text">{inc.type}</div>
                    </td>
                    <td className="col-severity">
                      <span className={severityPillClass(inc.severity)}>
                        {inc.severity}
                      </span>
                    </td>
                    <td className="col-status">
                      <span className={statusPillClass(inc.status)}>
                        {inc.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Side panel */}
        <aside className="inc-side-panel">
          <div className="side-card">
            <h2>Safety snapshot</h2>
            <p className="side-muted">
              This panel will later show safety KPIs like MTBF, incident rate
              per flight hour and top recurring categories.
            </p>

            <div className="side-metrics">
              <div className="metric">
                <span className="metric-label">Open incidents</span>
                <span className="metric-value">02</span>
              </div>
              <div className="metric">
                <span className="metric-label">Critical (last 7 days)</span>
                <span className="metric-value metric-value-critical">01</span>
              </div>
              <div className="metric">
                <span className="metric-label">Resolution rate</span>
                <span className="metric-value">88%</span>
              </div>
            </div>
          </div>

          <div className="side-card side-card-secondary">
            <h3>Playbooks</h3>
            <ul>
              <li>🛰 Link loss procedure</li>
              <li>⚡ Battery &amp; power anomaly checklist</li>
              <li>🗺 Geofence violation triage</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default IncidentsPage;
