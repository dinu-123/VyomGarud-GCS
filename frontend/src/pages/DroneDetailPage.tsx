// // src/pages/DroneDetailPage.tsx
// import React, { useMemo } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import "./DroneDetailPage.css";

// type FlightLogRow = {
//   id: string;
//   pilot: string;
//   date: string;
//   startTime: string;
//   duration: string;
//   distance: string;
//   mission: string;
//   status: "Complete" | "No Info" | "Unknown";
// };

// const demoFlightHistory: FlightLogRow[] = [
//   {
//     id: "path-1",
//     pilot: "Divyanshu",
//     date: "Dec 20, 2022",
//     startTime: "03:58 PM",
//     duration: "No Info",
//     distance: "0 km",
//     mission: "Manual • Recon",
//     status: "No Info",
//   },
//   {
//     id: "path-2",
//     pilot: "Anish Kumar",
//     date: "Dec 20, 2022",
//     startTime: "03:41 PM",
//     duration: "15 min",
//     distance: "0.23 km",
//     mission: "Manual • Recon",
//     status: "Complete",
//   },
//   {
//     id: "path-3",
//     pilot: "Ajay Karthik",
//     date: "Dec 20, 2022",
//     startTime: "03:39 PM",
//     duration: "34 sec",
//     distance: "0 km",
//     mission: "Manual • Recon",
//     status: "Complete",
//   },
//   // add as many rows as you want…
// ];

// const DroneDetailPage: React.FC = () => {
//   const { droneId } = useParams<{ droneId: string }>();
//   const navigate = useNavigate();

//   const droneName = useMemo(() => {
//     if (droneId === "divyanshu-sitl") return "Divyanshu SITL";
//     if (droneId === "hawk-demo") return "Hawk Demo";
//     return "Drone";
//   }, [droneId]);

//   return (
//     <div className="page-root">
//       <header className="detail-header">
//         <div className="detail-title-block">
//           <button
//             className="back-link"
//             onClick={() => navigate("/console/drones")}
//           >
//             ← Back to Drones
//           </button>
//           <h1 className="page-title">{droneName}</h1>
//           <p className="page-subtitle">Hawk Base • Flight log history</p>
//         </div>

//         <button
//           className="primary-btn"
//           onClick={() => navigate("/console/dashboard")}
//         >
//           Live Track
//         </button>
//       </header>

//       {/* tabs (Flights / Settings / Info) – only Flights implemented for now */}
//       <div className="detail-tabs">
//         <button className="detail-tab detail-tab-active">Flights</button>
//         <button className="detail-tab" disabled>
//           Settings
//         </button>
//         <button className="detail-tab" disabled>
//           Info
//         </button>
//       </div>

//       <section className="detail-card">
//         <div className="detail-card-header">
//           <h2 className="detail-card-title">Flight Log History</h2>
//           <p className="detail-card-subtitle">
//             You can view all completed flights of this drone here.
//           </p>
//         </div>

//         <div className="flight-table">
//           <div className="flight-header-row">
//             <span className="col-path">Path</span>
//             <span className="col-pilot">Pilot</span>
//             <span className="col-date">Date</span>
//             <span className="col-time">Start Time</span>
//             <span className="col-small">Duration</span>
//             <span className="col-small">Distance</span>
//             <span className="col-mission">Mission</span>
//             <span className="col-status">Status</span>
//           </div>

//           {demoFlightHistory.map((f) => (
//             <div key={f.id} className="flight-row">
//               <span className="col-path">
//                 <span className="path-icon" />
//               </span>
//               <span className="col-pilot">{f.pilot}</span>
//               <span className="col-date">{f.date}</span>
//               <span className="col-time">{f.startTime}</span>
//               <span className="col-small">{f.duration}</span>
//               <span className="col-small">{f.distance}</span>
//               <span className="col-mission">{f.mission}</span>
//               <span className="col-status">
//                 <span
//                   className={
//                     f.status === "Complete"
//                       ? "status-pill status-complete"
//                       : "status-pill status-noinfo"
//                   }
//                 >
//                   {f.status}
//                 </span>
//               </span>
//             </div>
//           ))}
//         </div>
//       </section>
//     </div>
//   );
// };

// export default DroneDetailPage;



// import React from "react";
// import { useParams } from "react-router-dom";
// import "./DroneDetailPage.css";

// interface FlightLogRow {
//   id: number;
//   pilot: string;
//   date: string;
//   startTime: string;
//   duration: string;
//   distance: string;
//   mission: string;
//   status: string;
// }

// // Simple demo data like the reference screenshot
// const DEMO_FLIGHTS: FlightLogRow[] = [
//   {
//     id: 1,
//     pilot: "Divyanshu",
//     date: "Dec 20, 2022",
//     startTime: "03:58 PM",
//     duration: "No Info",
//     distance: "0 km",
//     mission: "Manual / Recon",
//     status: "No Info",
//   },
//   {
//     id: 2,
//     pilot: "Anish Kumar",
//     date: "Dec 20, 2022",
//     startTime: "03:41 PM",
//     duration: "15 min",
//     distance: "0.23 km",
//     mission: "Manual / Recon",
//     status: "Complete",
//   },
//   {
//     id: 3,
//     pilot: "Ajay Karthik",
//     date: "Dec 20, 2022",
//     startTime: "03:39 PM",
//     duration: "34 sec",
//     distance: "0 km",
//     mission: "Manual / Recon",
//     status: "Complete",
//   },
//   {
//     id: 4,
//     pilot: "Prabhu Aluri",
//     date: "Dec 20, 2022",
//     startTime: "03:29 PM",
//     duration: "37 sec",
//     distance: "0 km",
//     mission: "Manual / Recon",
//     status: "Complete",
//   },
// ];

// const DroneDetailPage: React.FC = () => {
//   const { droneId } = useParams<{ droneId: string }>();

//   // Map the id to a nice name – later you can fetch from API
//   const droneNameMap: Record<string, string> = {
//     "hawk-demo": "Hawk Demo",
//     "divyanshu-sitl": "Divyanshu SITL",
//     "raven-2": "Internal Testing Raven 2",
//     "cube-hawk-2": "CUBE Hawk 2",
//   };

//   const droneName = droneId && droneNameMap[droneId] ? droneNameMap[droneId] : "Drone";

//   return (
//     <div className="drone-detail-page">
//       <header className="drone-detail-header">
//         <div>
//           <div className="drone-detail-title">{droneName}</div>
//           <div className="drone-detail-subtitle">Hawk Base</div>
//         </div>

//         <button className="live-track-button">Live Track</button>
//       </header>

//       <section className="drone-detail-tabs">
//         <button className="tab tab-active">Flights</button>
//         <button className="tab">Settings</button>
//         <button className="tab">Info</button>
//       </section>

//       <section className="drone-detail-content">
//         <h2 className="section-title">Flight Log History</h2>
//         <p className="section-subtitle">
//           You can view all completed flights of the drone here
//         </p>

//         <div className="flight-log-card">
//           <table className="flight-log-table">
//             <thead>
//               <tr>
//                 <th>Path</th>
//                 <th>Pilot</th>
//                 <th>Date</th>
//                 <th>Start Time</th>
//                 <th>Duration</th>
//                 <th>Distance</th>
//                 <th>Mission</th>
//                 <th>Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {DEMO_FLIGHTS.map((log) => (
//                 <tr key={log.id}>
//                   <td>
//                     {/* Just a placeholder folder icon block */}
//                     <div className="path-cell" />
//                   </td>
//                   <td>{log.pilot}</td>
//                   <td>{log.date}</td>
//                   <td>{log.startTime}</td>
//                   <td>{log.duration}</td>
//                   <td>{log.distance}</td>
//                   <td>{log.mission}</td>
//                   <td className="status-complete">{log.status}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default DroneDetailPage;




// // src/pages/DroneDetailPage.tsx
// import React, { useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import "./DroneDetailPage.css";

// type DroneStatus = "online" | "offline";

// interface DroneOverview {
//   id: string;
//   name: string;
//   model: string;
//   base: string;
//   status: DroneStatus;
// }

// const DEMO_DRONES: Record<string, DroneOverview> = {
//   "hawk-demo": {
//     id: "hawk-demo",
//     name: "Hawk Demo",
//     model: "Hawk",
//     base: "Hawk Base",
//     status: "online",
//   },
//   "divyanshu-sitl": {
//     id: "divyanshu-sitl",
//     name: "Divyanshu SITL",
//     model: "Blue Jay",
//     base: "Virtual Field",
//     status: "offline",
//   },
// };

// interface FlightLogRow {
//   id: number;
//   pathLabel: string;
//   pilot: string;
//   date: string;
//   startTime: string;
//   duration: string;
//   distance: string;
//   mission: string;
//   status: string;
// }

// const DEMO_FLIGHTS: FlightLogRow[] = [
//   {
//     id: 1,
//     pathLabel: "D",
//     pilot: "Divyanshu",
//     date: "Dec 20, 2022",
//     startTime: "03:58 PM",
//     duration: "No info",
//     distance: "0 km",
//     mission: "Manual / Recon",
//     status: "No Info",
//   },
//   {
//     id: 2,
//     pathLabel: "A",
//     pilot: "Anish Kumar",
//     date: "Dec 20, 2022",
//     startTime: "03:41 PM",
//     duration: "15 min",
//     distance: "0.23 km",
//     mission: "Manual / Recon",
//     status: "Complete",
//   },
//   {
//     id: 3,
//     pathLabel: "J",
//     pilot: "Ajay Karthik",
//     date: "Dec 20, 2022",
//     startTime: "03:39 PM",
//     duration: "34 sec",
//     distance: "0 km",
//     mission: "Manual / Recon",
//     status: "Complete",
//   },
//   {
//     id: 4,
//     pathLabel: "P",
//     pilot: "Prabhu Aluri",
//     date: "Dec 20, 2022",
//     startTime: "03:29 PM",
//     duration: "37 sec",
//     distance: "0 km",
//     mission: "Manual / Recon",
//     status: "Complete",
//   },
// ];

// type TabKey = "flights" | "settings" | "info";

// const DroneDetailPage: React.FC = () => {
//   const { id } = useParams<{ id: string }>();

//   const drone =
//     (id && DEMO_DRONES[id.toLowerCase()]) ??
//     DEMO_DRONES["hawk-demo"];

//   const [activeTab, setActiveTab] = useState<TabKey>("flights");

//   return (
//     <div className="drone-detail-page">
//       <div className="drone-detail-header-row">
//         <div className="drone-detail-main">
//           <div className="drone-avatar">
//             <span className="drone-avatar-icon">🛩️</span>
//           </div>
//           <div className="drone-title-block">
//             <h1 className="drone-name">{drone.name}</h1>
//             <div className="drone-meta">
//               <span className="drone-model">{drone.model}</span>
//               <span className="meta-dot">•</span>
//               <span className="drone-base">{drone.base}</span>
//             </div>
//           </div>
//           <span
//             className={`drone-status-pill ${
//               drone.status === "online" ? "online" : "offline"
//             }`}
//           >
//             {drone.status === "online" ? "Online" : "Offline"}
//           </span>
//         </div>

//         <div className="drone-detail-actions">
//           {/* Link back to your dashboard live-track view */}
//           <Link
//             to={`/console/dashboard?drone=${drone.id}&live=1`}
//             className="live-track-button"
//           >
//             Live Track
//           </Link>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="drone-detail-tabs">
//         <button
//           className={`drone-detail-tab ${
//             activeTab === "flights" ? "active" : ""
//           }`}
//           onClick={() => setActiveTab("flights")}
//         >
//           Flights
//         </button>
//         <button
//           className={`drone-detail-tab ${
//             activeTab === "settings" ? "active" : ""
//           }`}
//           onClick={() => setActiveTab("settings")}
//         >
//           Settings
//         </button>
//         <button
//           className={`drone-detail-tab ${
//             activeTab === "info" ? "active" : ""
//           }`}
//           onClick={() => setActiveTab("info")}
//         >
//           Info
//         </button>
//       </div>

//       {/* Content */}
//       <div className="drone-detail-card">
//         {activeTab === "flights" && (
//           <>
//             <div className="drone-detail-card-header">
//               <div>
//                 <h2 className="section-title">Flight Log History</h2>
//                 <p className="section-subtitle">
//                   You can view all completed flights of the drone here.
//                 </p>
//               </div>
//             </div>

//             <div className="flight-table-wrapper">
//               <table className="flight-table">
//                 <thead>
//                   <tr>
//                     <th>Path</th>
//                     <th>Pilot</th>
//                     <th>Date</th>
//                     <th>Start Time</th>
//                     <th>Duration</th>
//                     <th>Distance</th>
//                     <th>Mission</th>
//                     <th>Status</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {DEMO_FLIGHTS.map((flight) => (
//                     <tr key={flight.id}>
//                       <td>
//                         <span className="path-icon">
//                           {flight.pathLabel}
//                         </span>
//                       </td>
//                       <td>{flight.pilot}</td>
//                       <td>{flight.date}</td>
//                       <td>{flight.startTime}</td>
//                       <td>{flight.duration}</td>
//                       <td>{flight.distance}</td>
//                       <td>{flight.mission}</td>
//                       <td>
//                         <span
//                           className={`status-pill ${
//                             flight.status === "Complete"
//                               ? "status-complete"
//                               : "status-info"
//                           }`}
//                         >
//                           {flight.status}
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </>
//         )}

//         {activeTab === "settings" && (
//           <div className="placeholder-tab">
//             <h2 className="section-title">Settings</h2>
//             <p className="section-subtitle">
//               Drone configuration options will appear here later.
//             </p>
//           </div>
//         )}

//         {activeTab === "info" && (
//           <div className="placeholder-tab">
//             <h2 className="section-title">Info</h2>
//             <p className="section-subtitle">
//               General information about <strong>{drone.name}</strong> will
//               appear here later.
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DroneDetailPage;





// // src/pages/DroneDetailPage.tsx
// import React from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import "./DroneDetailPage.css";
// import hawkDemoImage from "../assets/hawk-demo-drone.png"; // adjust path if needed



// type DroneStatus = "online" | "offline";

// export interface FlightRow {
//   id: number;
//   path: string;
//   pilot: string;
//   date: string;
//   startTime: string;
//   duration: string;
//   distance: string;
//   mission: string;
//   status: "NO INFO" | "COMPLETE";
// }

// export const DEMO_FLIGHTS: FlightRow[] = [
//   {
//     id: 1,
//     path: "D",
//     pilot: "Divyanshu",
//     date: "Dec 20, 2022",
//     startTime: "03:58 PM",
//     duration: "No info",
//     distance: "0 km",
//     mission: "Manual / Recon",
//     status: "NO INFO",
//   },
//   {
//     id: 2,
//     path: "A",
//     pilot: "Anish Kumar",
//     date: "Dec 20, 2022",
//     startTime: "03:41 PM",
//     duration: "15 min",
//     distance: "0.23 km",
//     mission: "Manual / Recon",
//     status: "COMPLETE",
//   },
//   {
//     id: 3,
//     path: "J",
//     pilot: "Ajay Karthik",
//     date: "Dec 20, 2022",
//     startTime: "03:39 PM",
//     duration: "34 sec",
//     distance: "0 km",
//     mission: "Manual / Recon",
//     status: "COMPLETE",
//   },
//   {
//     id: 4,
//     path: "P",
//     pilot: "Prabhu Aluri",
//     date: "Dec 20, 2022",
//     startTime: "03:29 PM",
//     duration: "37 sec",
//     distance: "0 km",
//     mission: "Manual / Recon",
//     status: "COMPLETE",
//   },
// ];

// const DRONE_DISPLAY_NAME: Record<string, string> = {
//   "hawk-demo": "Hawk Demo",
//   "divyanshu-sitl": "Divyanshu SITL",
//   "internal-testing-raven-2": "Internal Testing Raven 2",
//   "cube-hawk-2": "CUBE Hawk 2",
// };

// const DRONE_MODEL: Record<string, string> = {
//   "hawk-demo": "Hawk • Hawk Base",
//   "divyanshu-sitl": "Blue Jay • Test Field",
//   "internal-testing-raven-2": "Raven • Internal Testing",
//   "cube-hawk-2": "Hawk • Field Unit",
// };

// const DroneDetailPage: React.FC = () => {
//   const { droneId } = useParams<{ droneId: string }>();
//   const navigate = useNavigate();


//   const name = DRONE_DISPLAY_NAME[droneId ?? ""] ?? "Hawk Demo";
//   const model = DRONE_MODEL[droneId ?? ""] ?? "Hawk • Hawk Base";
//   const status: DroneStatus = droneId === "hawk-demo" ? "online" : "offline";

//   const initials = name
//     .split(" ")
//     .map((p) => p[0])
//     .join("")
//     .toUpperCase()
//     .slice(0, 2);

//   return (
//     <div className="drone-detail-page">
//       {/* Header card */}
//       <section className="drone-detail-header-card">
//         <div className="drone-detail-header-left">
//           <div className="drone-avatar">
//   <img
//     src={hawkDemoImage}
//     alt={name}
//     className="drone-avatar-image"
//   />
// </div>

//           <div className="drone-header-text">
//             <div className="drone-header-title-row">
//               <h1 className="drone-title">{name}</h1>
//               <span
//                 className={`drone-status-pill ${
//                   status === "online" ? "drone-status-online" : "drone-status-offline"
//                 }`}
//               >
//                 {status.toUpperCase()}
//               </span>
//             </div>
//             <p className="drone-subtitle">{model}</p>

//             <div className="drone-tabs">
//               <button className="drone-tab drone-tab-active">Flights</button>
//               <button className="drone-tab" type="button">
//                 Settings
//               </button>
//               <button className="drone-tab" type="button">
//                 Info
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="drone-detail-header-right">
//           <button
//             type="button"
//             className="live-track-button"
//             onClick={() => {
//               // In real app, this would navigate to live track for this drone.
//               // Keeping simple for now so we don't break anything.
//               console.log("Live track clicked for", name);
//             }}
//           >
//             Live Track
//           </button>
//         </div>
//       </section>

//       {/* Flight log card */}
//       <section className="flight-log-card">
//         <div className="flight-log-header">
//           <h2 className="flight-log-title">Flight Log History</h2>
//           <p className="flight-log-subtitle">
//             You can view all completed flights of the drone here.
//           </p>
//         </div>

//         <div className="flight-log-table-wrapper">
//           <table className="flight-log-table">
//             <thead>
//               <tr>
//                 <th className="col-path">Path</th>
//                 <th className="col-pilot">Pilot</th>
//                 <th className="col-date">Date</th>
//                 <th className="col-start">Start Time</th>
//                 <th className="col-duration">Duration</th>
//                 <th className="col-distance">Distance</th>
//                 <th className="col-mission">Mission</th>
//                 <th className="col-status">Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {DEMO_FLIGHTS.map((flight) => (
//                 <tr key={flight.id}>
//                   <td>
//                     <span className="path-badge">{flight.path}</span>
//                   </td>
//                   <td>{flight.pilot}</td>
//                   <td>{flight.date}</td>
//                   <td>{flight.startTime}</td>
//                   <td>{flight.duration}</td>
//                   <td>{flight.distance}</td>
//                   <td>{flight.mission}</td>
//                   <td>
//                     <span
//                       className={
//                         flight.status === "NO INFO"
//                           ? "status-pill status-pill-warning"
//                           : "status-pill status-pill-success"
//                       }
//                     >
//                       {flight.status}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default DroneDetailPage;





// // src/pages/DroneDetailPage.tsx
// import React from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import "./DroneDetailPage.css";
// import hawkDemoImage from "../assets/hawk-demo-drone.png"; // adjust path if needed

// // ----------------- Types & Demo Data -----------------

// export type DroneStatus = "online" | "offline";

// export interface FlightRow {
//   id: number;
//   path: string;
//   pilot: string;
//   date: string;
//   startTime: string;
//   duration: string;
//   distance: string;
//   mission: string;
//   status: "NO INFO" | "COMPLETE";
// }

// export const DEMO_FLIGHTS: FlightRow[] = [
//   {
//     id: 1,
//     path: "D",
//     pilot: "Divyanshu",
//     date: "Dec 20, 2022",
//     startTime: "03:58 PM",
//     duration: "No info",
//     distance: "0 km",
//     mission: "Manual / Recon",
//     status: "NO INFO",
//   },
//   {
//     id: 2,
//     path: "A",
//     pilot: "Anish Kumar",
//     date: "Dec 20, 2022",
//     startTime: "03:41 PM",
//     duration: "15 min",
//     distance: "0.23 km",
//     mission: "Manual / Recon",
//     status: "COMPLETE",
//   },
//   {
//     id: 3,
//     path: "J",
//     pilot: "Ajay Karthik",
//     date: "Dec 20, 2022",
//     startTime: "03:39 PM",
//     duration: "34 sec",
//     distance: "0 km",
//     mission: "Manual / Recon",
//     status: "COMPLETE",
//   },
//   {
//     id: 4,
//     path: "P",
//     pilot: "Prabhu Aluri",
//     date: "Dec 20, 2022",
//     startTime: "03:29 PM",
//     duration: "37 sec",
//     distance: "0 km",
//     mission: "Manual / Recon",
//     status: "COMPLETE",
//   },
// ];

// const DRONE_DISPLAY_NAME: Record<string, string> = {
//   "hawk-demo": "Hawk Demo",
//   "divyanshu-sitl": "Divyanshu SITL",
//   "internal-testing-raven-2": "Internal Testing Raven 2",
//   "cube-hawk-2": "CUBE Hawk 2",
// };

// const DRONE_MODEL: Record<string, string> = {
//   "hawk-demo": "Hawk • Hawk Base",
//   "divyanshu-sitl": "Blue Jay • Test Field",
//   "internal-testing-raven-2": "Raven • Internal Testing",
//   "cube-hawk-2": "Hawk • Field Unit",
// };

// // ----------------- Component -----------------

// const DroneDetailPage: React.FC = () => {
//   const { droneId = "hawk-demo" } = useParams<{ droneId: string }>();
//   const navigate = useNavigate();

//   const name = DRONE_DISPLAY_NAME[droneId] ?? "Hawk Demo";
//   const model = DRONE_MODEL[droneId] ?? "Hawk • Hawk Base";
//   const status: DroneStatus = droneId === "hawk-demo" ? "online" : "offline";

//   const handleRowClick = (flightId: number) => {
//     // Navigate to the flight details page
//     navigate(`/console/drones/${droneId}/flights/${flightId}`);
//   };

//   return (
//     <div className="drone-detail-page">
//       {/* Header card */}
//       <section className="drone-detail-header-card">
//         <div className="drone-detail-header-left">
//           <div className="drone-avatar">
//             <img
//               src={hawkDemoImage}
//               alt={name}
//               className="drone-avatar-image"
//             />
//           </div>

//           <div className="drone-header-text">
//             <div className="drone-header-title-row">
//               <h1 className="drone-title">{name}</h1>
//               <span
//                 className={`drone-status-pill ${
//                   status === "online"
//                     ? "drone-status-online"
//                     : "drone-status-offline"
//                 }`}
//               >
//                 {status.toUpperCase()}
//               </span>
//             </div>
//             <p className="drone-subtitle">{model}</p>

//             <div className="drone-tabs">
//               <button className="drone-tab drone-tab-active" type="button">
//                 Flights
//               </button>
//               <button className="drone-tab" type="button">
//                 Settings
//               </button>
//               <button className="drone-tab" type="button">
//                 Info
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="drone-detail-header-right">
//           <button
//             type="button"
//             className="live-track-button"
//             onClick={() => {
//               console.log("Live track clicked for", name);
//               // Later you can navigate to live track page from here
//             }}
//           >
//             Live Track
//           </button>
//         </div>
//       </section>

//       {/* Flight log card */}
//       <section className="flight-log-card">
//         <div className="flight-log-header">
//           <h2 className="flight-log-title">Flight Log History</h2>
//           <p className="flight-log-subtitle">
//             You can view all completed flights of the drone here.
//           </p>
//         </div>

//         <div className="flight-log-table-wrapper">
//           <table className="flight-log-table">
//             <thead>
//               <tr>
//                 <th className="col-path">Path</th>
//                 <th className="col-pilot">Pilot</th>
//                 <th className="col-date">Date</th>
//                 <th className="col-start">Start Time</th>
//                 <th className="col-duration">Duration</th>
//                 <th className="col-distance">Distance</th>
//                 <th className="col-mission">Mission</th>
//                 <th className="col-status">Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {DEMO_FLIGHTS.map((flight) => (
//                 <tr
//                   key={flight.id}
//                   className="flight-row-clickable"
//                   onClick={() => handleRowClick(flight.id)}
//                   role="button"
//                   tabIndex={0}
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter" || e.key === " ") {
//                       handleRowClick(flight.id);
//                     }
//                   }}
//                 >
//                   <td>
//                     <span className="path-badge">{flight.path}</span>
//                   </td>
//                   <td>{flight.pilot}</td>
//                   <td>{flight.date}</td>
//                   <td>{flight.startTime}</td>
//                   <td>{flight.duration}</td>
//                   <td>{flight.distance}</td>
//                   <td>{flight.mission}</td>
//                   <td>
//                     <span
//                       className={
//                         flight.status === "NO INFO"
//                           ? "status-pill status-pill-warning"
//                           : "status-pill status-pill-success"
//                       }
//                     >
//                       {flight.status}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default DroneDetailPage;




// // src/pages/DroneDetailPage.tsx
// import React from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import "./DroneDetailPage.css";
// import hawkDemoImage from "../assets/hawk-demo-drone.png"; // make sure this path is correct

// type DroneStatus = "online" | "offline";
// export type FlightStatus = "NO INFO" | "COMPLETE";

// export interface FlightRow {
//   id: number;
//   path: string;
//   pilot: string;
//   date: string;
//   startTime: string;
//   duration: string;
//   distance: string;
//   mission: string;
//   status: FlightStatus;
// }

// // Demo flight data (shared with FlightDetailPage)
// export const DEMO_FLIGHTS: FlightRow[] = [
//   {
//     id: 1,
//     path: "D",
//     pilot: "Divyanshu",
//     date: "Dec 20, 2022",
//     startTime: "03:58 PM",
//     duration: "No info",
//     distance: "0 km",
//     mission: "Manual / Recon",
//     status: "NO INFO",
//   },
//   {
//     id: 2,
//     path: "A",
//     pilot: "Anish Kumar",
//     date: "Dec 20, 2022",
//     startTime: "03:41 PM",
//     duration: "15 min",
//     distance: "0.23 km",
//     mission: "Manual / Recon",
//     status: "COMPLETE",
//   },
//   {
//     id: 3,
//     path: "J",
//     pilot: "Ajay Karthik",
//     date: "Dec 20, 2022",
//     startTime: "03:39 PM",
//     duration: "34 sec",
//     distance: "0 km",
//     mission: "Manual / Recon",
//     status: "COMPLETE",
//   },
//   {
//     id: 4,
//     path: "P",
//     pilot: "Prabhu Aluri",
//     date: "Dec 20, 2022",
//     startTime: "03:29 PM",
//     duration: "37 sec",
//     distance: "0 km",
//     mission: "Manual / Recon",
//     status: "COMPLETE",
//   },
// ];

// const DRONE_DISPLAY_NAME: Record<string, string> = {
//   "hawk-demo": "Hawk Demo",
//   "divyanshu-sitl": "Divyanshu SITL",
//   "internal-testing-raven-2": "Internal Testing Raven 2",
//   "cube-hawk-2": "CUBE Hawk 2",
// };

// const DRONE_MODEL: Record<string, string> = {
//   "hawk-demo": "Hawk • Hawk Base",
//   "divyanshu-sitl": "Blue Jay • Test Field",
//   "internal-testing-raven-2": "Raven • Internal Testing",
//   "cube-hawk-2": "Hawk • Field Unit",
// };

// const DroneDetailPage: React.FC = () => {
//   const { droneId } = useParams<{ droneId: string }>();
//   const navigate = useNavigate();

//   const resolvedDroneId = droneId ?? "hawk-demo";
//   const name = DRONE_DISPLAY_NAME[resolvedDroneId] ?? "Hawk Demo";
//   const model = DRONE_MODEL[resolvedDroneId] ?? "Hawk • Hawk Base";
//   const status: DroneStatus = resolvedDroneId === "hawk-demo" ? "online" : "offline";

//   return (
//     <div className="drone-detail-page">
//       {/* Header card */}
//       <section className="drone-detail-header-card">
//         <div className="drone-detail-header-left">
//           <div className="drone-avatar">
//             <img src={hawkDemoImage} alt={name} className="drone-avatar-image" />
//           </div>

//           <div className="drone-header-text">
//             <div className="drone-header-title-row">
//               <h1 className="drone-title">{name}</h1>
//               <span
//                 className={`drone-status-pill ${
//                   status === "online" ? "drone-status-online" : "drone-status-offline"
//                 }`}
//               >
//                 {status.toUpperCase()}
//               </span>
//             </div>

//             <p className="drone-subtitle">{model}</p>

//             <div className="drone-tabs">
//               <button type="button" className="drone-tab drone-tab-active">
//                 Flights
//               </button>
//               <button type="button" className="drone-tab">
//                 Settings
//               </button>
//               <button type="button" className="drone-tab">
//                 Info
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="drone-detail-header-right">
//           <button
//             type="button"
//             className="live-track-button"
//             onClick={() => {
//               // Hook this up to your Live Track page later
//               console.log("Live track clicked for", name);
//             }}
//           >
//             Live Track
//           </button>
//         </div>
//       </section>

//       {/* Flight log card */}
//       <section className="flight-log-card">
//         <div className="flight-log-header">
//           <h2 className="flight-log-title">Flight Log History</h2>
//           <p className="flight-log-subtitle">
//             You can view all completed flights of the drone here.
//           </p>
//         </div>

//         <div className="flight-log-table-wrapper">
//           <table className="flight-log-table">
//             <thead>
//               <tr>
//                 <th className="col-path">Path</th>
//                 <th className="col-pilot">Pilot</th>
//                 <th className="col-date">Date</th>
//                 <th className="col-start">Start Time</th>
//                 <th className="col-duration">Duration</th>
//                 <th className="col-distance">Distance</th>
//                 <th className="col-mission">Mission</th>
//                 <th className="col-status">Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {DEMO_FLIGHTS.map((flight) => (
//                 <tr
//                   key={flight.id}
//                   className="flight-row"
//                   onClick={() =>
//                     navigate(`/console/drones/${resolvedDroneId}/flights/${flight.id}`)
//                   }
//                   style={{ cursor: "pointer" }}
//                 >
//                   <td>
//                     <span className="path-badge">{flight.path}</span>
//                   </td>
//                   <td>{flight.pilot}</td>
//                   <td>{flight.date}</td>
//                   <td>{flight.startTime}</td>
//                   <td>{flight.duration}</td>
//                   <td>{flight.distance}</td>
//                   <td>{flight.mission}</td>
//                   <td>
//                     <span
//                       className={
//                         flight.status === "NO INFO"
//                           ? "status-pill status-pill-warning"
//                           : "status-pill status-pill-success"
//                       }
//                     >
//                       {flight.status}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default DroneDetailPage;



// src/pages/DroneDetailPage.tsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./DroneDetailPage.css";
import hawkDemoImage from "../assets/hawk-demo-drone.png";

// ----- TYPES & DEMO DATA (exported so FlightDetailPage can use them) -----

export type DroneStatus = "online" | "offline";

export interface FlightRow {
  id: number;
  path: string;
  pilot: string;
  date: string;
  startTime: string;
  duration: string;
  distance: string;
  mission: string;
  status: "NO INFO" | "COMPLETE";
}

export const DEMO_FLIGHTS: FlightRow[] = [
  {
    id: 1,
    path: "D",
    pilot: "Divyanshu",
    date: "Dec 20, 2022",
    startTime: "03:58 PM",
    duration: "No info",
    distance: "0 km",
    mission: "Manual / Recon",
    status: "NO INFO",
  },
  {
    id: 2,
    path: "A",
    pilot: "Anish Kumar",
    date: "Dec 20, 2022",
    startTime: "03:41 PM",
    duration: "15 min",
    distance: "0.23 km",
    mission: "Manual / Recon",
    status: "COMPLETE",
  },
  {
    id: 3,
    path: "J",
    pilot: "Ajay Karthik",
    date: "Dec 20, 2022",
    startTime: "03:39 PM",
    duration: "34 sec",
    distance: "0 km",
    mission: "Manual / Recon",
    status: "COMPLETE",
  },
  {
    id: 4,
    path: "P",
    pilot: "Prabhu Aluri",
    date: "Dec 20, 2022",
    startTime: "03:29 PM",
    duration: "37 sec",
    distance: "0 km",
    mission: "Manual / Recon",
    status: "COMPLETE",
  },
];

const DRONE_DISPLAY_NAME: Record<string, string> = {
  "hawk-demo": "Hawk Demo",
  "divyanshu-sitl": "Divyanshu SITL",
  "internal-testing-raven-2": "Internal Testing Raven 2",
  "cube-hawk-2": "CUBE Hawk 2",
};

const DRONE_MODEL: Record<string, string> = {
  "hawk-demo": "Hawk • Hawk Base",
  "divyanshu-sitl": "Blue Jay • Test Field",
  "internal-testing-raven-2": "Raven • Internal Testing",
  "cube-hawk-2": "Hawk • Field Unit",
};

// ----- COMPONENT -----

const DroneDetailPage: React.FC = () => {
  const { droneId } = useParams<{ droneId: string }>();
  const navigate = useNavigate();

  const name = DRONE_DISPLAY_NAME[droneId ?? ""] ?? "Hawk Demo";
  const model = DRONE_MODEL[droneId ?? ""] ?? "Hawk • Hawk Base";
  const status: DroneStatus = droneId === "hawk-demo" ? "online" : "offline";

  return (
    <div className="drone-detail-page">
      {/* Header card */}
      <section className="drone-detail-header-card">
        <div className="drone-detail-header-left">
          <div className="drone-avatar">
            <img src={hawkDemoImage} alt={name} className="drone-avatar-image" />
          </div>

          <div className="drone-header-text">
            <div className="drone-header-title-row">
              <h1 className="drone-title">{name}</h1>
              <span
                className={`drone-status-pill ${
                  status === "online" ? "drone-status-online" : "drone-status-offline"
                }`}
              >
                {status.toUpperCase()}
              </span>
            </div>
            <p className="drone-subtitle">{model}</p>

            <div className="drone-tabs">
              <button className="drone-tab drone-tab-active" type="button">
                Flights
              </button>
              <button className="drone-tab" type="button">
                Settings
              </button>
              <button className="drone-tab" type="button">
                Info
              </button>
            </div>
          </div>
        </div>

        <div className="drone-detail-header-right">
          <button
            type="button"
            className="live-track-button"
            onClick={() => {
              console.log("Live track clicked for", name);
            }}
          >
            Live Track
          </button>
        </div>
      </section>

      {/* Flight log card */}
      <section className="flight-log-card">
        <div className="flight-log-header">
          <h2 className="flight-log-title">Flight Log History</h2>
          <p className="flight-log-subtitle">
            You can view all completed flights of the drone here.
          </p>
        </div>

        <div className="flight-log-table-wrapper">
          <table className="flight-log-table">
            <thead>
              <tr>
                <th className="col-path">Path</th>
                <th className="col-pilot">Pilot</th>
                <th className="col-date">Date</th>
                <th className="col-start">Start Time</th>
                <th className="col-duration">Duration</th>
                <th className="col-distance">Distance</th>
                <th className="col-mission">Mission</th>
                <th className="col-status">Status</th>
              </tr>
            </thead>
            <tbody>
              {DEMO_FLIGHTS.map((flight) => (
                <tr
                  key={flight.id}
                  onClick={() =>
                    navigate(`/console/drones/${droneId ?? "hawk-demo"}/flights/${flight.id}`)
                  }
                  className="clickable-row"
                >
                  <td>
                    <span className="path-badge">{flight.path}</span>
                  </td>
                  <td>{flight.pilot}</td>
                  <td>{flight.date}</td>
                  <td>{flight.startTime}</td>
                  <td>{flight.duration}</td>
                  <td>{flight.distance}</td>
                  <td>{flight.mission}</td>
                  <td>
                    <span
                      className={
                        flight.status === "NO INFO"
                          ? "status-pill status-pill-warning"
                          : "status-pill status-pill-success"
                      }
                    >
                      {flight.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default DroneDetailPage;

