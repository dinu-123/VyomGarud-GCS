// // src/pages/FlightDetailPage.tsx
// import React from "react";
// import { useParams, Link } from "react-router-dom";
// import { MapContainer, TileLayer, Polyline, Marker } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import "./FlightDetailPage.css";

// import { DEMO_FLIGHTS, FlightRow } from "./DroneDetailPage";

// // Demo paths (fake GPS points) for each flight id
// type LatLng = [number, number];

// const DEMO_PATHS: Record<number, LatLng[]> = {
//   1: [
//     [12.9716, 77.5946],
//     [12.9720, 77.5950],
//     [12.9724, 77.5954],
//   ],
//   2: [
//     [12.9716, 77.5946],
//     [12.9719, 77.5953],
//     [12.9723, 77.5957],
//   ],
//   3: [
//     [12.9716, 77.5946],
//     [12.9714, 77.5950],
//     [12.9712, 77.5954],
//   ],
//   4: [
//     [12.9716, 77.5946],
//     [12.9721, 77.5949],
//     [12.9727, 77.5953],
//   ],
// };

// const FlightDetailPage: React.FC = () => {
//   const { droneId, flightId } = useParams<{ droneId: string; flightId: string }>();

//   const idNum = Number(flightId);
//   const flight: FlightRow | undefined = DEMO_FLIGHTS.find((f) => f.id === idNum);

//   // Fallback if something is wrong
//   if (!flight) {
//     return (
//       <div className="flight-detail-page">
//         <div className="flight-detail-topbar">
//           <h1>Flight not found</h1>
//           <Link to={`/console/drones/${droneId ?? "hawk-demo"}`} className="back-link">
//             ← Back to drone
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   const path = DEMO_PATHS[idNum] ?? DEMO_PATHS[1];
//   const center = path[0];

//   const droneNameMap: Record<string, string> = {
//     "hawk-demo": "Hawk Demo",
//     "divyanshu-sitl": "Divyanshu SITL",
//     "internal-testing-raven-2": "Internal Testing Raven 2",
//     "cube-hawk-2": "CUBE Hawk 2",
//   };

//   const droneName = droneNameMap[droneId ?? ""] ?? "Hawk Demo";

//   return (
//     <div className="flight-detail-page">
//       {/* Breadcrumb + header */}
//       <div className="flight-detail-topbar">
//         <div className="breadcrumbs">
//           <Link to="/console/drones">Drones</Link>
//           <span>/</span>
//           <Link to={`/console/drones/${droneId ?? "hawk-demo"}`}>{droneName}</Link>
//           <span>/</span>
//           <span>Flight details</span>
//         </div>

//         <div className="topbar-right">
//           <span className={`flight-status-chip ${flight.status === "COMPLETE" ? "ok" : "warn"}`}>
//             {flight.status}
//           </span>
//         </div>
//       </div>

//       {/* Summary cards */}
//       <section className="flight-summary-grid">
//         <div className="summary-card">
//           <div className="label">Pilot</div>
//           <div className="value">{flight.pilot}</div>
//         </div>
//         <div className="summary-card">
//           <div className="label">Date</div>
//           <div className="value">{flight.date}</div>
//         </div>
//         <div className="summary-card">
//           <div className="label">Start / End</div>
//           <div className="value">
//             {flight.startTime} – {/* simple fake end time */}
//             {flight.status === "COMPLETE" ? "04:00 PM" : "—"}
//           </div>
//         </div>
//         <div className="summary-card">
//           <div className="label">Duration</div>
//           <div className="value">{flight.duration}</div>
//         </div>
//         <div className="summary-card">
//           <div className="label">Distance</div>
//           <div className="value">{flight.distance}</div>
//         </div>
//         <div className="summary-card">
//           <div className="label">Mission</div>
//           <div className="value">{flight.mission}</div>
//         </div>
//       </section>

//       {/* Map card */}
//       <section className="flight-map-card">
//         <div className="card-header">
//           <h2>Drone Path Map</h2>
//           <div className="card-header-actions">
//             <label className="checkbox-inline">
//               <input type="checkbox" defaultChecked /> Show path
//             </label>
//             <label className="checkbox-inline">
//               <input type="checkbox" /> Show planned path
//             </label>
//             <label className="checkbox-inline">
//               <input type="checkbox" /> Camera capture
//             </label>
//           </div>
//         </div>

//         <div className="map-wrapper">
//           <MapContainer
//             center={center}
//             zoom={16}
//             scrollWheelZoom={false}
//             className="flight-map"
//           >
//             <TileLayer
//               attribution='&copy; OpenStreetMap contributors'
//               url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             />
//             <Polyline positions={path} />
//             <Marker position={path[path.length - 1]} />
//           </MapContainer>
//         </div>
//       </section>

//       {/* You can later add charts here for battery, altitude, etc. */}
//     </div>
//   );
// };

// export default FlightDetailPage;




// // src/pages/FlightDetailPage.tsx
// import React from "react";
// import { useParams, Link } from "react-router-dom";
// import { MapContainer, TileLayer, Polyline, Marker } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import "./FlightDetailPage.css";

// // ✅ Runtime value import
// import { DEMO_FLIGHTS } from "./DroneDetailPage";
// // ✅ Type-only import (removed at build time, so no runtime error)
// import type { FlightRow } from "./DroneDetailPage";

// // Demo paths (fake GPS points) for each flight id
// type LatLng = [number, number];

// const DEMO_PATHS: Record<number, LatLng[]> = {
//   1: [
//     [12.9716, 77.5946],
//     [12.9720, 77.5950],
//     [12.9724, 77.5954],
//   ],
//   2: [
//     [12.9716, 77.5946],
//     [12.9719, 77.5953],
//     [12.9723, 77.5957],
//   ],
//   3: [
//     [12.9716, 77.5946],
//     [12.9714, 77.5950],
//     [12.9712, 77.5954],
//   ],
//   4: [
//     [12.9716, 77.5946],
//     [12.9721, 77.5949],
//     [12.9727, 77.5953],
//   ],
// };

// const FlightDetailPage: React.FC = () => {
//   const { droneId, flightId } = useParams<{ droneId: string; flightId: string }>();

//   const idNum = Number(flightId);
//   const flight: FlightRow | undefined = DEMO_FLIGHTS.find((f) => f.id === idNum);

//   // Fallback if something is wrong
//   if (!flight) {
//     return (
//       <div className="flight-detail-page">
//         <div className="flight-detail-topbar">
//           <h1>Flight not found</h1>
//           <Link to={`/console/drones/${droneId ?? "hawk-demo"}`} className="back-link">
//             ← Back to drone
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   const path = DEMO_PATHS[idNum] ?? DEMO_PATHS[1];
//   const center = path[0];

//   const droneNameMap: Record<string, string> = {
//     "hawk-demo": "Hawk Demo",
//     "divyanshu-sitl": "Divyanshu SITL",
//     "internal-testing-raven-2": "Internal Testing Raven 2",
//     "cube-hawk-2": "CUBE Hawk 2",
//   };

//   const droneName = droneNameMap[droneId ?? ""] ?? "Hawk Demo";

//   return (
//     <div className="flight-detail-page">
//       {/* Breadcrumb + header */}
//       <div className="flight-detail-topbar">
//         <div className="breadcrumbs">
//           <Link to="/console/drones">Drones</Link>
//           <span>/</span>
//           <Link to={`/console/drones/${droneId ?? "hawk-demo"}`}>{droneName}</Link>
//           <span>/</span>
//           <span>Flight details</span>
//         </div>

//         <div className="topbar-right">
//           <span className={`flight-status-chip ${flight.status === "COMPLETE" ? "ok" : "warn"}`}>
//             {flight.status}
//           </span>
//         </div>
//       </div>

//       {/* Summary cards */}
//       <section className="flight-summary-grid">
//         <div className="summary-card">
//           <div className="label">Pilot</div>
//           <div className="value">{flight.pilot}</div>
//         </div>
//         <div className="summary-card">
//           <div className="label">Date</div>
//           <div className="value">{flight.date}</div>
//         </div>
//         <div className="summary-card">
//           <div className="label">Start / End</div>
//           <div className="value">
//             {flight.startTime} – {flight.status === "COMPLETE" ? "04:00 PM" : "—"}
//           </div>
//         </div>
//         <div className="summary-card">
//           <div className="label">Duration</div>
//           <div className="value">{flight.duration}</div>
//         </div>
//         <div className="summary-card">
//           <div className="label">Distance</div>
//           <div className="value">{flight.distance}</div>
//         </div>
//         <div className="summary-card">
//           <div className="label">Mission</div>
//           <div className="value">{flight.mission}</div>
//         </div>
//       </section>

//       {/* Map card */}
//       <section className="flight-map-card">
//         <div className="card-header">
//           <h2>Drone Path Map</h2>
//           <div className="card-header-actions">
//             <label className="checkbox-inline">
//               <input type="checkbox" defaultChecked /> Show path
//             </label>
//             <label className="checkbox-inline">
//               <input type="checkbox" /> Show planned path
//             </label>
//             <label className="checkbox-inline">
//               <input type="checkbox" /> Camera capture
//             </label>
//           </div>
//         </div>

//         <div className="map-wrapper">
//           <MapContainer
//             center={center}
//             zoom={16}
//             scrollWheelZoom={false}
//             className="flight-map"
//           >
//             <TileLayer
//               attribution='&copy; OpenStreetMap contributors'
//               url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             />
//             <Polyline positions={path} />
//             <Marker position={path[path.length - 1]} />
//           </MapContainer>
//         </div>
//       </section>

//       {/* Later you can add charts for battery, altitude, etc. */}
//     </div>
//   );
// };

// export default FlightDetailPage;




// // src/pages/FlightDetailPage.tsx
// import React from "react";
// import { useParams, Link } from "react-router-dom";
// import { MapContainer, TileLayer, Polyline, Marker } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import "./FlightDetailPage.css";

// import { DEMO_FLIGHTS, FlightRow } from "./DroneDetailPage";

// // Demo paths (fake GPS points) for each flight id
// type LatLng = [number, number];

// const DEMO_PATHS: Record<number, LatLng[]> = {
//   1: [
//     [12.9716, 77.5946],
//     [12.972, 77.595],
//     [12.9724, 77.5954],
//   ],
//   2: [
//     [12.9716, 77.5946],
//     [12.9719, 77.5953],
//     [12.9723, 77.5957],
//   ],
//   3: [
//     [12.9716, 77.5946],
//     [12.9714, 77.595],
//     [12.9712, 77.5954],
//   ],
//   4: [
//     [12.9716, 77.5946],
//     [12.9721, 77.5949],
//     [12.9727, 77.5953],
//   ],
// };

// const FlightDetailPage: React.FC = () => {
//   const { droneId, flightId } = useParams<{ droneId: string; flightId: string }>();

//   const idNum = Number(flightId);
//   const flight: FlightRow | undefined = DEMO_FLIGHTS.find((f) => f.id === idNum);

//   // Fallback if something is wrong
//   if (!flight) {
//     return (
//       <div className="flight-detail-page">
//         <div className="flight-detail-inner">
//           <div className="flight-detail-topbar">
//             <h1>Flight not found</h1>
//             <Link
//               to={`/console/drones/${droneId ?? "hawk-demo"}`}
//               className="back-link"
//             >
//               ← Back to drone
//             </Link>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const path = DEMO_PATHS[idNum] ?? DEMO_PATHS[1];
//   const center = path[0];

//   const droneNameMap: Record<string, string> = {
//     "hawk-demo": "Hawk Demo",
//     "divyanshu-sitl": "Divyanshu SITL",
//     "internal-testing-raven-2": "Internal Testing Raven 2",
//     "cube-hawk-2": "CUBE Hawk 2",
//   };

//   const droneName = droneNameMap[droneId ?? ""] ?? "Hawk Demo";

//   // You can replace this later with a real mission name from API
//   const missionName = "Electronics City Phase 2 (West)";

//   const isComplete = flight.status === "COMPLETE";

//   return (
//     <div className="flight-detail-page">
//       <div className="flight-detail-inner">
//         {/* Top breadcrumb bar */}
//         <div className="flight-detail-topbar">
//           <div className="breadcrumbs">
//             <Link to="/console/drones">Drones</Link>
//             <span>/</span>
//             <Link to={`/console/drones/${droneId ?? "hawk-demo"}`}>{droneName}</Link>
//             <span>/</span>
//             <span className="crumb-current">Flight details</span>
//           </div>

//           <div className="topbar-right">
//             <span
//               className={`flight-status-chip ${isComplete ? "ok" : "warn"}`}
//             >
//               {flight.status}
//             </span>
//             {isComplete && (
//               <button className="generate-report-btn" type="button">
//                 Generate Report
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Main header card like reference UI */}
//         <section className="flight-header-card">
//           <div className="flight-header-top">
//             <div className="flight-header-left">
//               <h1 className="flight-mission-title">{missionName}</h1>
//               <p className="flight-mission-date">{flight.date}</p>
//             </div>
//             <div className="flight-header-right">
//               <span className="flight-time-range-label">Start / End</span>
//               <div className="time-slider-row">
//                 <span className="time-text">{flight.startTime}</span>
//                 <div className="time-slider-track">
//                   <div className="time-slider-thumb" />
//                 </div>
//                 <span className="time-text">
//                   {isComplete ? "04:00 PM" : "—"}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Summary grid like their top stats row */}
//           <div className="flight-summary-grid">
//             <div className="summary-card">
//               <div className="summary-label">Pilot Details</div>
//               <div className="summary-value">{flight.pilot}</div>
//             </div>
//             <div className="summary-card">
//               <div className="summary-label">Drone Details</div>
//               <div className="summary-value">{droneName}</div>
//             </div>
//             <div className="summary-card">
//               <div className="summary-label">Mission Type</div>
//               <div className="summary-value">Manual</div>
//             </div>
//             <div className="summary-card">
//               <div className="summary-label">Mission Subtype</div>
//               <div className="summary-value">Recon</div>
//             </div>
//             <div className="summary-card">
//               <div className="summary-label">Set Speed</div>
//               <div className="summary-value dimmed">Not set</div>
//             </div>
//             <div className="summary-card">
//               <div className="summary-label">Set Altitude</div>
//               <div className="summary-value dimmed">Not set</div>
//             </div>
//             <div className="summary-card">
//               <div className="summary-label">Duration</div>
//               <div className="summary-value">
//                 {isComplete ? "2 min" : flight.duration}
//               </div>
//             </div>
//             <div className="summary-card">
//               <div className="summary-label">Flight Length</div>
//               <div className="summary-value">{isComplete ? "260 m" : flight.distance}</div>
//             </div>
//             <div className="summary-card">
//               <div className="summary-label">Images Captured</div>
//               <div className="summary-value">0</div>
//             </div>
//             <div className="summary-card">
//               <div className="summary-label">Camera Angle</div>
//               <div className="summary-value dimmed">Not set</div>
//             </div>
//             <div className="summary-card">
//               <div className="summary-label">Side Overlap</div>
//               <div className="summary-value">0</div>
//             </div>
//           </div>
//         </section>

//         {/* Map card */}
//         <section className="flight-map-card">
//           <div className="card-header">
//             <h2>Drone Path Map</h2>
//             <div className="card-header-actions">
//               <label className="checkbox-inline">
//                 <input type="checkbox" defaultChecked /> Show path
//               </label>
//               <label className="checkbox-inline">
//                 <input type="checkbox" /> Show planned path
//               </label>
//               <label className="checkbox-inline">
//                 <input type="checkbox" /> Camera capture
//               </label>
//             </div>
//           </div>

//           <div className="map-wrapper">
//             <MapContainer
//               center={center}
//               zoom={16}
//               scrollWheelZoom={false}
//               className="flight-map"
//             >
//               <TileLayer
//                 attribution='&copy; OpenStreetMap contributors'
//                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//               />
//               <Polyline positions={path} />
//               <Marker position={path[path.length - 1]} />
//             </MapContainer>
//           </div>
//         </section>

//         {/* Charts row – structured like the reference, content can be added later */}
//         <section className="flight-charts-row">
//           <div className="chart-card">
//             <div className="chart-header">
//               <span>Battery Percentage (%)</span>
//               <select>
//                 <option>Linear</option>
//               </select>
//             </div>
//             <div className="chart-placeholder">Chart coming soon</div>
//           </div>

//           <div className="chart-card">
//             <div className="chart-header">
//               <span>Battery Voltage (V)</span>
//               <select>
//                 <option>Linear</option>
//               </select>
//             </div>
//             <div className="chart-placeholder">Chart coming soon</div>
//           </div>

//           <div className="chart-card">
//             <div className="chart-header">
//               <span>Absolute Altitude (m)</span>
//               <select>
//                 <option>Linear</option>
//               </select>
//             </div>
//             <div className="chart-placeholder">Chart coming soon</div>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// };

// export default FlightDetailPage;





// // src/pages/FlightDetailPage.tsx
// import React from "react";
// import { useParams, Link } from "react-router-dom";
// import { MapContainer, TileLayer, Polyline, Marker } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import "./FlightDetailPage.css";

// import { DEMO_FLIGHTS } from "./DroneDetailPage";
// import type { FlightRow } from "./DroneDetailPage";

// // Demo paths (fake GPS points) for each flight id
// type LatLng = [number, number];

// const DEMO_PATHS: Record<number, LatLng[]> = {
//   1: [
//     [12.9716, 77.5946],
//     [12.972, 77.595],
//     [12.9724, 77.5954],
//   ],
//   2: [
//     [12.9716, 77.5946],
//     [12.9719, 77.5953],
//     [12.9723, 77.5957],
//   ],
//   3: [
//     [12.9716, 77.5946],
//     [12.9714, 77.595],
//     [12.9712, 77.5954],
//   ],
//   4: [
//     [12.9716, 77.5946],
//     [12.9721, 77.5949],
//     [12.9727, 77.5953],
//   ],
// };

// const droneNameMap: Record<string, string> = {
//   "hawk-demo": "Hawk Demo",
//   "divyanshu-sitl": "Divyanshu SITL",
//   "internal-testing-raven-2": "Internal Testing Raven 2",
//   "cube-hawk-2": "CUBE Hawk 2",
// };

// const FlightDetailPage: React.FC = () => {
//   const { droneId, flightId } = useParams<{ droneId: string; flightId: string }>();

//   const idNum = Number(flightId);
//   const flight: FlightRow | undefined = DEMO_FLIGHTS.find((f) => f.id === idNum);

//   // Fallback if invalid id
//   if (!flight) {
//     const fallbackDroneId = droneId ?? "hawk-demo";
//     return (
//       <div className="flight-detail-page">
//         <div className="flight-detail-topbar">
//           <div className="breadcrumbs">
//             <Link to="/console/drones">Drones</Link>
//             <span>/</span>
//             <Link to={`/console/drones/${fallbackDroneId}`}>
//               {droneNameMap[fallbackDroneId] ?? "Hawk Demo"}
//             </Link>
//             <span>/</span>
//             <span>Flight details</span>
//           </div>

//           <Link to={`/console/drones/${fallbackDroneId}`} className="back-link">
//             ← Back to drone
//           </Link>
//         </div>

//         <div className="flight-not-found-card">
//           <h1>Flight not found</h1>
//           <p>Please go back and select a valid flight.</p>
//         </div>
//       </div>
//     );
//   }

//   const path = DEMO_PATHS[idNum] ?? DEMO_PATHS[1];
//   const center = path[0];
//   const resolvedDroneId = droneId ?? "hawk-demo";
//   const droneName = droneNameMap[resolvedDroneId] ?? "Hawk Demo";

//   return (
//     <div className="flight-detail-page">
//       {/* Breadcrumb + top bar */}
//       <div className="flight-detail-topbar">
//         <div className="breadcrumbs">
//           <Link to="/console/drones">Drones</Link>
//           <span>/</span>
//           <Link to={`/console/drones/${resolvedDroneId}`}>{droneName}</Link>
//           <span>/</span>
//           <span>Flight details</span>
//         </div>

//         <div className="topbar-right">
//           <span
//             className={`flight-status-chip ${
//               flight.status === "COMPLETE" ? "chip-ok" : "chip-warn"
//             }`}
//           >
//             {flight.status}
//           </span>
//         </div>
//       </div>

//       {/* Summary section (similar to reference UI) */}
//       <section className="flight-summary-grid">
//         <div className="summary-card">
//           <div className="summary-label">Pilot Details</div>
//           <div className="summary-value">{flight.pilot}</div>
//         </div>
//         <div className="summary-card">
//           <div className="summary-label">Drone Details</div>
//           <div className="summary-value">{droneName}</div>
//         </div>
//         <div className="summary-card">
//           <div className="summary-label">Date</div>
//           <div className="summary-value">{flight.date}</div>
//         </div>
//         <div className="summary-card">
//           <div className="summary-label">Start / End</div>
//           <div className="summary-value">
//             {flight.startTime} – {flight.status === "COMPLETE" ? "04:00 PM" : "—"}
//           </div>
//         </div>
//         <div className="summary-card">
//           <div className="summary-label">Duration</div>
//           <div className="summary-value">{flight.duration}</div>
//         </div>
//         <div className="summary-card">
//           <div className="summary-label">Distance</div>
//           <div className="summary-value">{flight.distance}</div>
//         </div>
//         <div className="summary-card">
//           <div className="summary-label">Mission Type</div>
//           <div className="summary-value">Manual</div>
//         </div>
//         <div className="summary-card">
//           <div className="summary-label">Mission Subtype</div>
//           <div className="summary-value">{flight.mission.replace("Manual / ", "")}</div>
//         </div>
//       </section>

//       {/* Map card */}
//       <section className="flight-map-card">
//         <div className="card-header">
//           <h2>Drone Path Map</h2>
//           <div className="card-header-actions">
//             <label className="checkbox-inline">
//               <input type="checkbox" defaultChecked /> Show path
//             </label>
//             <label className="checkbox-inline">
//               <input type="checkbox" /> Show planned path
//             </label>
//             <label className="checkbox-inline">
//               <input type="checkbox" /> Camera capture
//             </label>
//           </div>
//         </div>

//         <div className="map-wrapper">
//           <MapContainer
//             center={center}
//             zoom={16}
//             scrollWheelZoom={false}
//             className="flight-map"
//           >
//             <TileLayer
//               attribution='&copy; OpenStreetMap contributors'
//               url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             />
//             <Polyline positions={path} />
//             <Marker position={path[path.length - 1]} />
//           </MapContainer>
//         </div>
//       </section>

//       {/* Later you can add charts for battery, altitude, etc. below this */}
//     </div>
//   );
// };

// export default FlightDetailPage;




// // src/pages/FlightDetailPage.tsx
// import React from "react";
// import { useParams, Link } from "react-router-dom";
// import { MapContainer, TileLayer, Polyline, Marker } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import "./FlightDetailPage.css";

// import { DEMO_FLIGHTS } from "./DroneDetailPage";
// import type { FlightRow } from "./DroneDetailPage";


// // Demo paths (fake GPS points) for each flight id
// type LatLng = [number, number];

// const DEMO_PATHS: Record<number, LatLng[]> = {
//   1: [
//     [12.9716, 77.5946],
//     [12.972, 77.595],
//     [12.9724, 77.5954],
//   ],
//   2: [
//     [12.9716, 77.5946],
//     [12.9719, 77.5953],
//     [12.9723, 77.5957],
//   ],
//   3: [
//     [12.9716, 77.5946],
//     [12.9714, 77.595],
//     [12.9712, 77.5954],
//   ],
//   4: [
//     [12.9716, 77.5946],
//     [12.9721, 77.5949],
//     [12.9727, 77.5953],
//   ],
// };

// const droneNameMap: Record<string, string> = {
//   "hawk-demo": "Hawk Demo",
//   "divyanshu-sitl": "Divyanshu SITL",
//   "internal-testing-raven-2": "Internal Testing Raven 2",
//   "cube-hawk-2": "CUBE Hawk 2",
// };

// const FlightDetailPage: React.FC = () => {
//   const { droneId, flightId } = useParams<{ droneId: string; flightId: string }>();

//   const idNum = Number(flightId);
//   const flight: FlightRow | undefined = DEMO_FLIGHTS.find((f) => f.id === idNum);

//   const droneName = droneNameMap[droneId ?? ""] ?? "Hawk Demo";

//   // Fallback if something is wrong
//   if (!flight) {
//     return (
//       <div className="flight-detail-page">
//         <div className="flight-detail-inner">
//           <div className="flight-header-row">
//             <div className="breadcrumbs">
//               <Link to="/console/drones">Drones</Link>
//               <span>/</span>
//               <span>{droneName}</span>
//               <span>/</span>
//               <span>Flight details</span>
//             </div>
//           </div>
//           <div className="empty-state-card">
//             <h2>Flight not found</h2>
//             <p>This flight id does not exist in the demo data.</p>
//             <Link
//               to={`/console/drones/${droneId ?? "hawk-demo"}`}
//               className="back-link-button"
//             >
//               ← Back to drone
//             </Link>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const path = DEMO_PATHS[idNum] ?? DEMO_PATHS[1];
//   const center = path[0];

//   const isComplete = flight.status === "COMPLETE";

//   return (
//     <div className="flight-detail-page">
//       <div className="flight-detail-inner">
//         {/* Top bar: breadcrumbs + status */}
//         <div className="flight-header-row">
//           <div className="breadcrumbs">
//             <Link to="/console/drones">Drones</Link>
//             <span>/</span>
//             <Link to={`/console/drones/${droneId ?? "hawk-demo"}`}>{droneName}</Link>
//             <span>/</span>
//             <span>Flight details</span>
//           </div>

//           <span
//             className={`flight-status-pill ${
//               isComplete ? "flight-status-complete" : "flight-status-noinfo"
//             }`}
//           >
//             {flight.status}
//           </span>
//         </div>

//         {/* Main summary strip – similar to your reference layout */}
//         <section className="flight-summary-strip">
//           <div className="summary-main">
//             <div className="location-row">
//               <div className="location-title">
//                 Electronics City Phase 2 (West) {/* demo text */}
//               </div>
//               <div className="location-date">{flight.date}</div>
//             </div>

//             <div className="time-slider-row">
//               <div className="time-label">{flight.startTime}</div>
//               <div className="time-slider-bar">
//                 <div className="time-slider-knob" />
//               </div>
//               <div className="time-label">{isComplete ? "04:00 PM" : "—"}</div>
//             </div>
//           </div>

//           <div className="summary-side-grid">
//             <div className="summary-side-card">
//               <div className="label">Mission Type</div>
//               <div className="value">{flight.mission.split("/")[0].trim()}</div>
//             </div>
//             <div className="summary-side-card">
//               <div className="label">Mission Subtype</div>
//               <div className="value">
//                 {flight.mission.split("/")[1]?.trim() || "Recon"}
//               </div>
//             </div>
//             <div className="summary-side-card">
//               <div className="label">Duration</div>
//               <div className="value">{flight.duration}</div>
//             </div>
//             <div className="summary-side-card">
//               <div className="label">Distance</div>
//               <div className="value">{flight.distance}</div>
//             </div>
//           </div>
//         </section>

//         {/* Info cards row (Pilot / Drone / Date / Start-End) */}
//         <section className="flight-info-grid">
//           <div className="info-card">
//             <div className="label">Pilot Details</div>
//             <div className="value">{flight.pilot}</div>
//           </div>
//           <div className="info-card">
//             <div className="label">Drone Details</div>
//             <div className="value">{droneName}</div>
//           </div>
//           <div className="info-card">
//             <div className="label">Date</div>
//             <div className="value">{flight.date}</div>
//           </div>
//           <div className="info-card">
//             <div className="label">Start / End</div>
//             <div className="value">
//               {flight.startTime} {isComplete ? "– 04:00 PM" : "– —"}
//             </div>
//           </div>
//         </section>

//         {/* Map card */}
//         <section className="flight-map-card">
//           <div className="map-card-header">
//             <h2>Drone Path Map</h2>
//             <div className="map-toggles">
//               <label>
//                 <input type="checkbox" defaultChecked /> Show path
//               </label>
//               <label>
//                 <input type="checkbox" /> Show planned path
//               </label>
//               <label>
//                 <input type="checkbox" /> Camera capture
//               </label>
//             </div>
//           </div>

//           <div className="map-card-body">
//             <MapContainer
//               center={center}
//               zoom={16}
//               scrollWheelZoom={false}
//               className="flight-map"
//             >
//               <TileLayer
//                 attribution='&copy; OpenStreetMap contributors'
//                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//               />
//               <Polyline positions={path} />
//               <Marker position={path[path.length - 1]} />
//             </MapContainer>
//           </div>
//         </section>

//         {/* Placeholder section for future charts (battery, altitude, etc.) */}
//         <section className="flight-charts-placeholder">
//           <div className="charts-row">
//             <div className="chart-card">
//               <div className="label">Battery Percentage (%)</div>
//               <div className="chart-placeholder">Chart placeholder</div>
//             </div>
//             <div className="chart-card">
//               <div className="label">Battery Voltage (V)</div>
//               <div className="chart-placeholder">Chart placeholder</div>
//             </div>
//             <div className="chart-card">
//               <div className="label">Absolute Altitude (m)</div>
//               <div className="chart-placeholder">Chart placeholder</div>
//             </div>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// };

// export default FlightDetailPage;


// // src/pages/FlightDetailPage.tsx
// import React from "react";
// import { useParams, Link } from "react-router-dom";
// import { MapContainer, TileLayer, Polyline, Marker } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import "./FlightDetailPage.css";

// import { DEMO_FLIGHTS } from "./DroneDetailPage";
// import type { FlightRow } from "./DroneDetailPage";


// import {
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
// } from "recharts";

// // ====== Demo GPS paths (fake) for each flight id ======
// type LatLng = [number, number];

// const DEMO_PATHS: Record<number, LatLng[]> = {
//   1: [
//     [12.9716, 77.5946],
//     [12.972, 77.595],
//     [12.9724, 77.5954],
//   ],
//   2: [
//     [12.9716, 77.5946],
//     [12.9719, 77.5953],
//     [12.9723, 77.5957],
//   ],
//   3: [
//     [12.9716, 77.5946],
//     [12.9714, 77.595],
//     [12.9712, 77.5954],
//   ],
//   4: [
//     [12.9716, 77.5946],
//     [12.9721, 77.5949],
//     [12.9727, 77.5953],
//   ],
// };

// // ====== Demo telemetry data for charts ======
// type MetricPoint = { t: number; v: number }; // t = time (s), v = value

// // You can later replace these with real API data per flight id
// const BATTERY_PERCENT: Record<number, MetricPoint[]> = {
//   1: [
//     { t: 0, v: 50 },
//     { t: 20, v: 49 },
//     { t: 40, v: 48 },
//     { t: 60, v: 47 },
//     { t: 80, v: 46 },
//     { t: 100, v: 45 },
//     { t: 120, v: 44 },
//     { t: 140, v: 43 },
//   ],
//   2: [
//     { t: 0, v: 60 },
//     { t: 20, v: 59 },
//     { t: 40, v: 58 },
//     { t: 60, v: 57 },
//     { t: 80, v: 56 },
//     { t: 100, v: 55 },
//     { t: 120, v: 54 },
//     { t: 140, v: 53 },
//   ],
// };

// const BATTERY_VOLTAGE: Record<number, MetricPoint[]> = {
//   1: [
//     { t: 0, v: 25.5 },
//     { t: 20, v: 24.5 },
//     { t: 40, v: 24.1 },
//     { t: 60, v: 23.8 },
//     { t: 80, v: 23.6 },
//     { t: 100, v: 23.4 },
//     { t: 120, v: 23.3 },
//     { t: 140, v: 23.2 },
//   ],
// };

// const ABS_ALTITUDE: Record<number, MetricPoint[]> = {
//   1: [
//     { t: 0, v: 930 },
//     { t: 20, v: 960 },
//     { t: 40, v: 970 },
//     { t: 60, v: 971 },
//     { t: 80, v: 970 },
//     { t: 100, v: 960 },
//     { t: 120, v: 940 },
//     { t: 140, v: 930 },
//   ],
// };

// const REL_ALTITUDE: Record<number, MetricPoint[]> = {
//   1: [
//     { t: 0, v: 0 },
//     { t: 20, v: 20 },
//     { t: 40, v: 40 },
//     { t: 60, v: 41 },
//     { t: 80, v: 40 },
//     { t: 100, v: 30 },
//     { t: 120, v: 10 },
//     { t: 140, v: 0 },
//   ],
// };

// const H_SPEED: Record<number, MetricPoint[]> = {
//   1: [
//     { t: 0, v: 0 },
//     { t: 20, v: 5 },
//     { t: 40, v: 10 },
//     { t: 60, v: 7 },
//     { t: 80, v: 9 },
//     { t: 100, v: 4 },
//     { t: 120, v: 2 },
//     { t: 140, v: 0 },
//   ],
// };

// const DOWN_VELOCITY: Record<number, MetricPoint[]> = {
//   1: [
//     { t: 0, v: 0 },
//     { t: 20, v: 1.5 },
//     { t: 40, v: 3 },
//     { t: 60, v: 1 },
//     { t: 80, v: 0 },
//     { t: 100, v: -0.5 },
//     { t: 120, v: -1 },
//     { t: 140, v: 0 },
//   ],
// };

// const FlightDetailPage: React.FC = () => {
//   const { droneId, flightId } = useParams<{ droneId: string; flightId: string }>();

//   const idNum = Number(flightId);
//   const flight: FlightRow | undefined = DEMO_FLIGHTS.find((f) => f.id === idNum);

//   // Fallback if something is wrong
//   if (!flight) {
//     return (
//       <div className="flight-detail-page">
//         <div className="flight-detail-topbar">
//           <h1>Flight not found</h1>
//           <Link to={`/console/drones/${droneId ?? "hawk-demo"}`} className="back-link">
//             ← Back to drone
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   const path = DEMO_PATHS[idNum] ?? DEMO_PATHS[1];
//   const center = path[0];

//   const droneNameMap: Record<string, string> = {
//     "hawk-demo": "Hawk Demo",
//     "divyanshu-sitl": "Divyanshu SITL",
//     "internal-testing-raven-2": "Internal Testing Raven 2",
//     "cube-hawk-2": "CUBE Hawk 2",
//   };
//   const droneName = droneNameMap[droneId ?? ""] ?? "Hawk Demo";

//   const isComplete = flight.status === "COMPLETE";

//   // Helper to pick telemetry per flight id
//   const pickData = (store: Record<number, MetricPoint[]>) =>
//     store[idNum] ?? store[1];

//   return (
//     <div className="flight-detail-page">
//       {/* Breadcrumb + status tag */}
//       <div className="flight-detail-topbar">
//         <div className="breadcrumbs">
//           <Link to="/console/drones">Drones</Link>
//           <span>/</span>
//           <Link to={`/console/drones/${droneId ?? "hawk-demo"}`}>{droneName}</Link>
//           <span>/</span>
//           <span>Flight details</span>
//         </div>

//         <span className={`flight-status-chip ${isComplete ? "ok" : "warn"}`}>
//           {flight.status}
//         </span>
//       </div>

//       {/* Timeline card */}
//       <section className="flight-timeline-card">
//         <div className="timeline-left">
//           <h2 className="flight-location">Electronics City Phase 2 (West)</h2>
//           <div className="timeline-bar">
//             <span className="timeline-time">{flight.startTime}</span>
//             <div className="timeline-track">
//               <div className="timeline-progress" />
//             </div>
//             <span className="timeline-time">
//               {isComplete ? "04:00 PM" : "— —"}
//             </span>
//           </div>
//         </div>

//         <div className="timeline-right">
//           <div className="timeline-summary">
//             <div className="summary-label">MISSION TYPE</div>
//             <div className="summary-value">{flight.mission.split("/")[0].trim()}</div>
//           </div>
//           <div className="timeline-summary">
//             <div className="summary-label">MISSION SUBTYPE</div>
//             <div className="summary-value">
//               {flight.mission.split("/")[1]?.trim() ?? "Recon"}
//             </div>
//           </div>
//           <div className="timeline-summary">
//             <div className="summary-label">DURATION</div>
//             <div className="summary-value">{flight.duration}</div>
//           </div>
//           <div className="timeline-summary">
//             <div className="summary-label">DISTANCE</div>
//             <div className="summary-value">{flight.distance}</div>
//           </div>
//         </div>

//         <div
//           className={`flight-status-pill ${isComplete ? "pill-complete" : "pill-noinfo"}`}
//         >
//           {flight.status}
//         </div>
//       </section>

//       {/* Small summary cards row */}
//       <section className="flight-summary-row">
//         <div className="summary-card">
//           <div className="label">Pilot details</div>
//           <div className="value">{flight.pilot}</div>
//         </div>
//         <div className="summary-card">
//           <div className="label">Drone details</div>
//           <div className="value">{droneName}</div>
//         </div>
//         <div className="summary-card">
//           <div className="label">Date</div>
//           <div className="value">{flight.date}</div>
//         </div>
//         <div className="summary-card">
//           <div className="label">Start / End</div>
//           <div className="value">
//             {flight.startTime} – {isComplete ? "04:00 PM" : "— —"}
//           </div>
//         </div>
//       </section>

//       {/* Map card */}
//       <section className="flight-map-card">
//         <div className="card-header">
//           <h2>Drone Path Map</h2>
//           <div className="card-header-actions">
//             <label className="checkbox-inline">
//               <input type="checkbox" defaultChecked /> Show path
//             </label>
//             <label className="checkbox-inline">
//               <input type="checkbox" /> Show planned path
//             </label>
//             <label className="checkbox-inline">
//               <input type="checkbox" /> Camera capture
//             </label>
//           </div>
//         </div>

//         <div className="map-wrapper">
//           <MapContainer
//             center={center}
//             zoom={16}
//             scrollWheelZoom={false}
//             className="flight-map"
//           >
//             <TileLayer
//               attribution='&copy; OpenStreetMap contributors'
//               url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             />
//             <Polyline positions={path} />
//             <Marker position={path[path.length - 1]} />
//           </MapContainer>
//         </div>
//       </section>

//       {/* Telemetry charts – BELOW THE MAP */}
//       <section className="flight-metrics-section">
//         <h2 className="metrics-title">Automatic data logging for each flight</h2>

//         <div className="flight-metrics-grid">
//           {/* Battery % */}
//           <div className="metric-card">
//             <div className="metric-card-header">
//               <span className="metric-title">Battery Percentage (%)</span>
//               <select className="metric-scale-select" defaultValue="linear">
//                 <option value="linear">linear</option>
//                 <option value="log">log</option>
//               </select>
//             </div>
//             <div className="metric-chart">
//               <ResponsiveContainer width="100%" height={220}>
//                 <LineChart data={pickData(BATTERY_PERCENT)}>
//                   <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
//                   <XAxis dataKey="t" tick={{ fontSize: 10 }} />
//                   <YAxis tick={{ fontSize: 10 }} />
//                   <Tooltip />
//                   <Line
//                     type="monotone"
//                     dataKey="v"
//                     strokeWidth={2}
//                     dot={false}
//                     activeDot={{ r: 4 }}
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           {/* Battery Voltage */}
//           <div className="metric-card">
//             <div className="metric-card-header">
//               <span className="metric-title">Battery Voltage (V)</span>
//               <select className="metric-scale-select" defaultValue="linear">
//                 <option value="linear">linear</option>
//                 <option value="log">log</option>
//               </select>
//             </div>
//             <div className="metric-chart">
//               <ResponsiveContainer width="100%" height={220}>
//                 <LineChart data={pickData(BATTERY_VOLTAGE)}>
//                   <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
//                   <XAxis dataKey="t" tick={{ fontSize: 10 }} />
//                   <YAxis tick={{ fontSize: 10 }} />
//                   <Tooltip />
//                   <Line type="monotone" dataKey="v" strokeWidth={2} dot={false} />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           {/* Absolute Altitude */}
//           <div className="metric-card">
//             <div className="metric-card-header">
//               <span className="metric-title">Absolute Altitude (m)</span>
//               <select className="metric-scale-select" defaultValue="linear">
//                 <option value="linear">linear</option>
//               </select>
//             </div>
//             <div className="metric-chart">
//               <ResponsiveContainer width="100%" height={220}>
//                 <LineChart data={pickData(ABS_ALTITUDE)}>
//                   <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
//                   <XAxis dataKey="t" tick={{ fontSize: 10 }} />
//                   <YAxis tick={{ fontSize: 10 }} />
//                   <Tooltip />
//                   <Line type="monotone" dataKey="v" strokeWidth={2} dot={false} />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           {/* Relative Altitude */}
//           <div className="metric-card">
//             <div className="metric-card-header">
//               <span className="metric-title">Relative Altitude (m)</span>
//               <select className="metric-scale-select" defaultValue="linear">
//                 <option value="linear">linear</option>
//               </select>
//             </div>
//             <div className="metric-chart">
//               <ResponsiveContainer width="100%" height={220}>
//                 <LineChart data={pickData(REL_ALTITUDE)}>
//                   <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
//                   <XAxis dataKey="t" tick={{ fontSize: 10 }} />
//                   <YAxis tick={{ fontSize: 10 }} />
//                   <Tooltip />
//                   <Line type="monotone" dataKey="v" strokeWidth={2} dot={false} />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           {/* Horizontal Speed */}
//           <div className="metric-card">
//             <div className="metric-card-header">
//               <span className="metric-title">Horizontal Speed (m/s)</span>
//               <select className="metric-scale-select" defaultValue="linear">
//                 <option value="linear">linear</option>
//               </select>
//             </div>
//             <div className="metric-chart">
//               <ResponsiveContainer width="100%" height={220}>
//                 <LineChart data={pickData(H_SPEED)}>
//                   <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
//                   <XAxis dataKey="t" tick={{ fontSize: 10 }} />
//                   <YAxis tick={{ fontSize: 10 }} />
//                   <Tooltip />
//                   <Line type="monotone" dataKey="v" strokeWidth={2} dot={false} />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           {/* Down velocity */}
//           <div className="metric-card">
//             <div className="metric-card-header">
//               <span className="metric-title">Down velocity (m/s)</span>
//               <select className="metric-scale-select" defaultValue="linear">
//                 <option value="linear">linear</option>
//               </select>
//             </div>
//             <div className="metric-chart">
//               <ResponsiveContainer width="100%" height={220}>
//                 <LineChart data={pickData(DOWN_VELOCITY)}>
//                   <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
//                   <XAxis dataKey="t" tick={{ fontSize: 10 }} />
//                   <YAxis tick={{ fontSize: 10 }} />
//                   <Tooltip />
//                   <Line type="monotone" dataKey="v" strokeWidth={2} dot={false} />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default FlightDetailPage;





// src/pages/FlightDetailPage.tsx
import React from "react";
import { Link, useParams } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
} from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import "./FlightDetailPage.css";

import { DEMO_FLIGHTS, type FlightRow } from "./DroneDetailPage";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

/* -------------------------------------------------------
   Demo GPS paths for each flight id
------------------------------------------------------- */

type LatLng = [number, number];

const DEMO_PATHS: Record<number, LatLng[]> = {
  1: [
    [12.9716, 77.5946],
    [12.972, 77.595],
    [12.9724, 77.5954],
  ],
  2: [
    [12.9716, 77.5946],
    [12.9719, 77.5953],
    [12.9723, 77.5957],
  ],
  3: [
    [12.9716, 77.5946],
    [12.9714, 77.595],
    [12.9712, 77.5954],
  ],
  4: [
    [12.9716, 77.5946],
    [12.9721, 77.5949],
    [12.9727, 77.5953],
  ],
};

/* -------------------------------------------------------
   Demo telemetry data (for charts)
------------------------------------------------------- */

type MetricPoint = { t: number; v: number };

const BATTERY_PERCENT: Record<number, MetricPoint[]> = {
  1: [
    { t: 0, v: 50 },
    { t: 20, v: 49 },
    { t: 40, v: 48 },
    { t: 60, v: 47 },
    { t: 80, v: 46 },
    { t: 100, v: 45 },
    { t: 120, v: 44 },
    { t: 140, v: 43 },
  ],
  2: [
    { t: 0, v: 60 },
    { t: 20, v: 59 },
    { t: 40, v: 58 },
    { t: 60, v: 57 },
    { t: 80, v: 56 },
    { t: 100, v: 55 },
    { t: 120, v: 54 },
    { t: 140, v: 53 },
  ],
};

const BATTERY_VOLTAGE: Record<number, MetricPoint[]> = {
  1: [
    { t: 0, v: 25.5 },
    { t: 20, v: 24.5 },
    { t: 40, v: 24.1 },
    { t: 60, v: 23.8 },
    { t: 80, v: 23.6 },
    { t: 100, v: 23.4 },
    { t: 120, v: 23.3 },
    { t: 140, v: 23.2 },
  ],
};

const ABS_ALTITUDE: Record<number, MetricPoint[]> = {
  1: [
    { t: 0, v: 930 },
    { t: 20, v: 960 },
    { t: 40, v: 970 },
    { t: 60, v: 971 },
    { t: 80, v: 970 },
    { t: 100, v: 960 },
    { t: 120, v: 940 },
    { t: 140, v: 930 },
  ],
};

const REL_ALTITUDE: Record<number, MetricPoint[]> = {
  1: [
    { t: 0, v: 0 },
    { t: 20, v: 20 },
    { t: 40, v: 40 },
    { t: 60, v: 41 },
    { t: 80, v: 40 },
    { t: 100, v: 30 },
    { t: 120, v: 10 },
    { t: 140, v: 0 },
  ],
};

const H_SPEED: Record<number, MetricPoint[]> = {
  1: [
    { t: 0, v: 0 },
    { t: 20, v: 5 },
    { t: 40, v: 10 },
    { t: 60, v: 7 },
    { t: 80, v: 9 },
    { t: 100, v: 4 },
    { t: 120, v: 2 },
    { t: 140, v: 0 },
  ],
};

const DOWN_VELOCITY: Record<number, MetricPoint[]> = {
  1: [
    { t: 0, v: 0 },
    { t: 20, v: 1.5 },
    { t: 40, v: 3 },
    { t: 60, v: 1 },
    { t: 80, v: 0 },
    { t: 100, v: -0.5 },
    { t: 120, v: -1 },
    { t: 140, v: 0 },
  ],
};

/* -------------------------------------------------------
   Component
------------------------------------------------------- */

const FlightDetailPage: React.FC = () => {
  const { droneId, flightId } = useParams<{
    droneId: string;
    flightId: string;
  }>();

  const idNum = Number(flightId);
  const flight: FlightRow | undefined = DEMO_FLIGHTS.find(
    (f) => f.id === idNum
  );

  if (!flight) {
    return (
      <div className="flight-detail-page">
        <div className="flight-detail-topbar">
          <h1>Flight not found</h1>
          <Link
            to={`/console/drones/${droneId ?? "hawk-demo"}`}
            className="back-link"
          >
            ← Back to drone
          </Link>
        </div>
      </div>
    );
  }

  const path = DEMO_PATHS[idNum] ?? DEMO_PATHS[1];
  const center = path[0] as LatLngExpression;
  const positions = path as LatLngExpression[];

  const droneNameMap: Record<string, string> = {
    "hawk-demo": "Hawk Demo",
    "divyanshu-sitl": "Divyanshu SITL",
    "internal-testing-raven-2": "Internal Testing Raven 2",
    "cube-hawk-2": "CUBE Hawk 2",
  };
  const droneName = droneNameMap[droneId ?? ""] ?? "Hawk Demo";

  const isComplete = flight.status === "COMPLETE";

  const pickData = (store: Record<number, MetricPoint[]>) =>
    store[idNum] ?? store[1];

  // split "Manual / Recon"
  const [missionType, missionSubtype = "Recon"] = flight.mission
    .split("/")
    .map((s) => s.trim());

  return (
    <div className="flight-detail-page">
      {/* Top breadcrumb + status chip */}
      <div className="flight-detail-topbar">
        <div className="breadcrumbs">
          <Link to="/console/drones">Drones</Link>
          <span>/</span>
          <Link to={`/console/drones/${droneId ?? "hawk-demo"}`}>
            {droneName}
          </Link>
          <span>/</span>
          <span>Flight details</span>
        </div>

        <div
          className={`flight-status-chip ${
            isComplete ? "chip-complete" : "chip-noinfo"
          }`}
        >
          {flight.status}
        </div>
      </div>

      {/* Main header card: location + timeline + stats */}
      <section className="flight-header-card">
        <div className="flight-header-left">
          <div className="header-location-row">
            <h2 className="flight-location">Electronics City Phase 2 (West)</h2>
            <span className="flight-date-label">{flight.date}</span>
          </div>

          <div className="timeline-row">
            <span className="timeline-time">{flight.startTime}</span>
            <div className="timeline-track">
              <div className="timeline-progress" />
              <div className="timeline-thumb" />
            </div>
            <span className="timeline-time">
              {isComplete ? "04:00 PM" : "— —"}
            </span>
          </div>

          <div className="timeline-meta-row">
            <div className="meta-block">
              <div className="meta-label">Pilot details</div>
              <div className="meta-value">{flight.pilot}</div>
            </div>
            <div className="meta-block">
              <div className="meta-label">Drone details</div>
              <div className="meta-value">{droneName}</div>
            </div>
          </div>
        </div>

        <div className="flight-header-right">
          <div className="header-stat">
            <div className="stat-label">MISSION TYPE</div>
            <div className="stat-value">{missionType}</div>
          </div>
          <div className="header-stat">
            <div className="stat-label">MISSION SUBTYPE</div>
            <div className="stat-value">{missionSubtype}</div>
          </div>
          <div className="header-stat">
            <div className="stat-label">DURATION</div>
            <div className="stat-value">{flight.duration}</div>
          </div>
          <div className="header-stat">
            <div className="stat-label">DISTANCE</div>
            <div className="stat-value">{flight.distance}</div>
          </div>
          <div className="header-stat">
            <div className="stat-label">SET SPEED</div>
            <div className="stat-value">Not set</div>
          </div>
          <div className="header-stat">
            <div className="stat-label">SET ALTITUDE</div>
            <div className="stat-value">Not set</div>
          </div>
          <div className="header-stat">
            <div className="stat-label">FLIGHT LENGTH</div>
            <div className="stat-value">
              {flight.distance === "0 km" ? "260 m" : flight.distance}
            </div>
          </div>
          <div className="header-stat">
            <div className="stat-label">SIDE OVERLAP</div>
            <div className="stat-value">0</div>
          </div>
        </div>
      </section>

      {/* Map card */}
      <section className="flight-map-card">
        <div className="card-header">
          <h2>Drone Path Map</h2>
          <div className="card-header-actions">
            <label className="checkbox-inline">
              <input type="checkbox" defaultChecked /> Show path
            </label>
            <label className="checkbox-inline">
              <input type="checkbox" /> Show planned path
            </label>
            <label className="checkbox-inline">
              <input type="checkbox" /> Camera capture
            </label>
          </div>
        </div>

        <div className="map-wrapper">
          <MapContainer
            center={center}
            zoom={16}
            scrollWheelZoom={false}
            className="flight-map"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Polyline positions={positions} />
            <Marker position={positions[positions.length - 1]} />
          </MapContainer>
        </div>
      </section>

      {/* Telemetry section (graphs) */}
      <section className="flight-metrics-section">
        <h2 className="metrics-title">
          Automatic data logging for each and every flight
        </h2>

        <div className="flight-metrics-grid">
          {/* Battery % */}
          <div className="metric-card">
            <div className="metric-card-header">
              <span className="metric-title">Battery Percentage (%)</span>
              <select className="metric-scale-select" defaultValue="linear">
                <option value="linear">linear</option>
                <option value="log">log</option>
              </select>
            </div>
            <div className="metric-chart">
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={pickData(BATTERY_PERCENT)}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="t" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="v"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Battery Voltage */}
          <div className="metric-card">
            <div className="metric-card-header">
              <span className="metric-title">Battery Voltage (V)</span>
              <select className="metric-scale-select" defaultValue="linear">
                <option value="linear">linear</option>
                <option value="log">log</option>
              </select>
            </div>
            <div className="metric-chart">
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={pickData(BATTERY_VOLTAGE)}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="t" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="v" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Absolute Altitude */}
          <div className="metric-card">
            <div className="metric-card-header">
              <span className="metric-title">Absolute Altitude (m)</span>
              <select className="metric-scale-select" defaultValue="linear">
                <option value="linear">linear</option>
              </select>
            </div>
            <div className="metric-chart">
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={pickData(ABS_ALTITUDE)}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="t" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="v" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Relative Altitude */}
          <div className="metric-card">
            <div className="metric-card-header">
              <span className="metric-title">Relative Altitude (m)</span>
              <select className="metric-scale-select" defaultValue="linear">
                <option value="linear">linear</option>
              </select>
            </div>
            <div className="metric-chart">
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={pickData(REL_ALTITUDE)}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="t" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="v" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Horizontal Speed */}
          <div className="metric-card">
            <div className="metric-card-header">
              <span className="metric-title">Horizontal Speed (m/s)</span>
              <select className="metric-scale-select" defaultValue="linear">
                <option value="linear">linear</option>
              </select>
            </div>
            <div className="metric-chart">
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={pickData(H_SPEED)}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="t" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="v" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Down velocity */}
          <div className="metric-card">
            <div className="metric-card-header">
              <span className="metric-title">Down velocity (m/s)</span>
              <select className="metric-scale-select" defaultValue="linear">
                <option value="linear">linear</option>
              </select>
            </div>
            <div className="metric-chart">
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={pickData(DOWN_VELOCITY)}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="t" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="v" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FlightDetailPage;
