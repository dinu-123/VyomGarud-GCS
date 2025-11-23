// // src/pages/DashboardPage.tsx
// import React, { useEffect, useRef, useState } from "react";
// import "./DashboardPage.css";
// import BatterySparkline from "../components/BatterySparkline";

// import LiveMap from "../components/LiveMap";

// type Telemetry = {
//   lat: number;
//   lon: number;
//   alt: number;
//   battery: number;
//   h_speed?: number;
//   v_speed?: number;
//   mode?: string;
//   ts?: number;
// };

// type Toast = {
//   id: number;
//   type: "info" | "warning";
//   message: string;
// };

// // fallback WS URL if env not set
// const WS_URL =
//   (import.meta as any).env.VITE_WS_URL ?? "ws://127.0.0.1:8000/ws/telemetry";

// const DashboardPage: React.FC = () => {
//   const [telemetry, setTelemetry] = useState<Telemetry>({
//     lat: 12.9716,
//     lon: 77.5946,
//     alt: 0,
//     battery: 98,
//     h_speed: 0,
//     v_speed: 0,
//     mode: "IDLE",
//     ts: Date.now() / 1000,
//   });

//   const [wsStatus, setWsStatus] = useState<
//     "connecting" | "connected" | "disconnected" | "error"
//   >("connecting");

//   const [batteryHistory, setBatteryHistory] = useState<SparkPoint[]>([]);
//   const [toasts, setToasts] = useState<Toast[]>([]);

//   const lastModeRef = useRef<string | undefined>(telemetry.mode);
//   const lastBatteryRef = useRef<number | undefined>(telemetry.battery);
//   const toastIdRef = useRef(1);

//   const showToast = (type: Toast["type"], message: string) => {
//     const id = toastIdRef.current++;
//     const toast: Toast = { id, type, message };
//     setToasts((prev) => [...prev, toast]);
//     setTimeout(() => {
//       setToasts((prev) => prev.filter((t) => t.id !== id));
//     }, 5000);
//   };

//   useEffect(() => {
//     let ws: WebSocket | null = null;
//     let reconnectTimer: number | null = null;
//     let mounted = true;

//     const connect = () => {
//       setWsStatus("connecting");
//       try {
//         ws = new WebSocket(WS_URL);
//       } catch (e) {
//         console.error("WS create failed", e);
//         setWsStatus("error");
//         return;
//       }

//       ws.onopen = () => {
//         if (!mounted) return;
//         setWsStatus("connected");
//         ws?.send("ping");
//       };

//       ws.onmessage = (event) => {
//         if (!mounted) return;
//         let raw: any;
//         try {
//           raw = JSON.parse(event.data);
//         } catch {
//           try {
//             const fixed = ("" + event.data).replace(/'/g, '"');
//             raw = JSON.parse(fixed);
//           } catch {
//             console.warn("Telemetry parse failed:", event.data);
//             return;
//           }
//         }

//         const updated: Telemetry = {
//           lat: Number(raw.lat ?? telemetry.lat),
//           lon: Number(raw.lon ?? telemetry.lon),
//           alt: Number(raw.alt ?? telemetry.alt),
//           battery: Number(raw.battery ?? telemetry.battery),
//           h_speed: Number(raw.h_speed ?? telemetry.h_speed ?? 0),
//           v_speed: Number(raw.v_speed ?? telemetry.v_speed ?? 0),
//           mode: String(raw.mode ?? telemetry.mode ?? "UNKNOWN"),
//           ts: Number(raw.ts ?? Date.now() / 1000),
//         };

//         setTelemetry(updated);

//         setBatteryHistory((prev) => {
//           const next: SparkPoint[] = [
//             ...prev,
//             { ts: updated.ts || Date.now() / 1000, value: updated.battery },
//           ];
//           return next.slice(-60);
//         });

//         if (
//           lastModeRef.current &&
//           updated.mode &&
//           updated.mode !== lastModeRef.current
//         ) {
//           showToast("info", `Mode changed to ${updated.mode}`);
//         }
//         lastModeRef.current = updated.mode;

//         if (
//           typeof lastBatteryRef.current === "number" &&
//           updated.battery <= 20 &&
//           lastBatteryRef.current > 20
//         ) {
//           showToast(
//             "warning",
//             `Warning: Battery low (${updated.battery.toFixed(1)}%)`,
//           );
//         }
//         lastBatteryRef.current = updated.battery;
//       };

//       ws.onerror = () => {
//         if (!mounted) return;
//         setWsStatus("error");
//       };

//       ws.onclose = () => {
//         if (!mounted) return;
//         setWsStatus("disconnected");
//         reconnectTimer = window.setTimeout(connect, 2000);
//       };
//     };

//     connect();

//     return () => {
//       mounted = false;
//       if (reconnectTimer !== null) {
//         window.clearTimeout(reconnectTimer);
//       }
//       if (ws && ws.readyState === WebSocket.OPEN) {
//         ws.close();
//       }
//     };
//   }, []);

//   const altDisplay = `${telemetry.alt.toFixed(1)} m`;
//   const battDisplay = `${telemetry.battery.toFixed(1)} %`;
//   const hSpeedDisplay = `${(telemetry.h_speed ?? 0).toFixed(1)} m/s`;
//   const modeDisplay = telemetry.mode ?? "UNKNOWN";

//   return (
//     <div className="dashboard-page">
//       {toasts.length > 0 && (
//         <div className="dashboard-toasts">
//           {toasts.map((t) => (
//             <div key={t.id} className={`toast toast-${t.type}`}>
//               {t.message}
//             </div>
//           ))}
//         </div>
//       )}

//       <header className="dashboard-header">
//         <div>
//           <h1 className="dashboard-title">Dashboard</h1>
//           <div className="dashboard-subtitle">
//             VyomGarud • Fleet overview &amp; live telemetry
//           </div>
//           <div className="dashboard-pill">Live telemetry</div>
//         </div>

//         <div className="dashboard-header-right">
//           <div className="ws-status-pill">
//             <span className={`ws-dot ws-${wsStatus}`} />
//             <span className="ws-text">
//               {wsStatus === "connecting" && "Connecting…"}
//               {wsStatus === "connected" && "Live telemetry"}
//               {wsStatus === "disconnected" && "Disconnected"}
//               {wsStatus === "error" && "Error"}
//             </span>
//           </div>
//         </div>
//       </header>

//       <main className="dashboard-main">
//         <section className="dashboard-top-row">
//           <div className="summary-grid">
//             <div className="summary-card">
//               <div className="summary-label">Active Drone</div>
//               <div className="summary-value">VyomGarud Demo</div>
//               <div className="summary-meta">Mode: {modeDisplay}</div>
//             </div>
//             <div className="summary-card">
//               <div className="summary-label">Altitude</div>
//               <div className="summary-value">{altDisplay}</div>
//               <div className="summary-meta">
//                 Vertical: {(telemetry.v_speed ?? 0).toFixed(1)} m/s
//               </div>
//             </div>
//             <div className="summary-card">
//               <div className="summary-label">Battery</div>
//               <div className="summary-value">{battDisplay}</div>
//               <div className="summary-meta">
//                 Horizontal: {hSpeedDisplay}
//               </div>
//             </div>
//             <div className="summary-card">
//               <div className="summary-label">Location</div>
//               <div className="summary-value">
//                 {telemetry.lat.toFixed(5)}, {telemetry.lon.toFixed(5)}
//               </div>
//               <div className="summary-meta">
//                 Last update:{" "}
//                 {telemetry.ts
//                   ? new Date(telemetry.ts * 1000).toLocaleTimeString()
//                   : "-"}
//               </div>
//             </div>
//           </div>

//           <div className="telemetry-panel">
//             <div className="telemetry-header">
//               <span>Battery trend (last ~60 samples)</span>
//             </div>
//             <BatterySparkline data={batteryHistory} min={0} max={100} />
//           </div>
//         </section>

//         <section className="dashboard-lower-row">
//           <div className="dashboard-card dashboard-map-card">
//             <div className="card-header">
//               <span>Live map</span>
//               <span className="card-tag">Telemetry-linked</span>
//             </div>
//             <div className="map-wrapper">
//               <LiveMap
//                 lat={telemetry.lat}
//                 lon={telemetry.lon}
//                 follow={true}
//               />
//             </div>
//           </div>

//           <div className="dashboard-card dashboard-side-card">
//             <div className="card-header">
//               <span>Mission status (demo)</span>
//             </div>
//             <ul className="mission-list">
//               <li>
//                 <span className="dot dot-green" />
//                 <div>
//                   <div className="mission-title">Current leg</div>
//                   <div className="mission-sub">
//                     Heading to next waypoint · {hSpeedDisplay}
//                   </div>
//                 </div>
//               </li>
//               <li>
//                 <span className="dot dot-amber" />
//                 <div>
//                   <div className="mission-title">Battery reserve</div>
//                   <div className="mission-sub">
//                     {telemetry.battery < 25
//                       ? "Return to home recommended"
//                       : "Within safe limits"}
//                   </div>
//                 </div>
//               </li>
//               <li>
//                 <span className="dot dot-blue" />
//                 <div>
//                   <div className="mission-title">Link</div>
//                   <div className="mission-sub">
//                     WebSocket:{" "}
//                     {wsStatus === "connected" ? "Healthy" : wsStatus}
//                   </div>
//                 </div>
//               </li>
//             </ul>
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// };

// export default DashboardPage;



// // // src/pages/DashboardPage.tsx
// import React, { useState } from "react";
// import "./DashboardPage.css";
// import LiveMap from "../components/LiveMap";

// type Telemetry = {
//   lat: number;
//   lon: number;
//   alt: number;
//   battery: number;
//   hSpeed: number;
//   vSpeed: number;
//   mode: string;
// };

// const DashboardPage: React.FC = () => {
//   // Just demo data for now – real values will come from telemetry later.
//   const [telemetry] = useState<Telemetry>({
//     lat: 12.9716,
//     lon: 77.5946,
//     alt: 120.4,
//     battery: 69.3,
//     hSpeed: 7.8,
//     vSpeed: 0.0,
//     mode: "AUTO.MISSION",
//   });

//   return (
//     <div className="dashboard-page">
//       {/* Top title row */}
//       <div className="dashboard-header-row">
//         <div>
//           <h1 className="dashboard-title">Dashboard</h1>
//           <p className="dashboard-subtitle">
//             VyomGarud • Fleet overview &amp; live telemetry
//           </p>
//         </div>

//         <div className="dashboard-header-right">
//           <span className="pill org-pill">Demo Org</span>
//           <span className="pill live-pill">
//             <span className="pill-dot" />
//             Live telemetry
//           </span>
//         </div>
//       </div>

//       {/* MAP + DRONE TABS */}
//       <section className="dashboard-map-section">
//         {/* Tabs above the map – like your reference UI */}
//         <div className="drone-tabs-row">
//           <div className="drone-tabs">
//             <button className="drone-tab active">View All</button>
//             <button className="drone-tab">Hawk Demo</button>
//             <button className="drone-tab">Divyanshu SITL</button>
//             <button className="drone-tab">Internal Testing Raven 2</button>
//             <button className="drone-tab">Secure Drone</button>
//           </div>
//         </div>

//         {/* Map card */}
//         <div className="map-card">
//           <div className="map-card-header">
//             <div>
//               <div className="map-card-title">Live map</div>
//               <div className="map-card-subtitle">
//                 Real-time drone positions &amp; mission paths
//               </div>
//             </div>
//             <span className="pill small-pill">Telemetry-linked</span>
//           </div>

//           <div className="map-frame">
//             {/* Leaflet map */}
//             <LiveMap lat={telemetry.lat} lon={telemetry.lon} follow />

//             {/* Right-side overlay telemetry panel (like your screenshot) */}
//             <div className="map-overlay-panel">
//               <div className="overlay-section">
//                 <div className="overlay-label">Active drone</div>
//                 <div className="overlay-value">VyomGarud Demo</div>
//               </div>

//               <div className="overlay-grid">
//                 <div className="overlay-item">
//                   <div className="overlay-label">Mode</div>
//                   <div className="overlay-value-small">{telemetry.mode}</div>
//                 </div>
//                 <div className="overlay-item">
//                   <div className="overlay-label">Altitude</div>
//                   <div className="overlay-value-small">
//                     {telemetry.alt.toFixed(1)} m
//                   </div>
//                 </div>
//                 <div className="overlay-item">
//                   <div className="overlay-label">H speed</div>
//                   <div className="overlay-value-small">
//                     {telemetry.hSpeed.toFixed(1)} m/s
//                   </div>
//                 </div>
//                 <div className="overlay-item">
//                   <div className="overlay-label">V speed</div>
//                   <div className="overlay-value-small">
//                     {telemetry.vSpeed.toFixed(1)} m/s
//                   </div>
//                 </div>
//                 <div className="overlay-item">
//                   <div className="overlay-label">Battery</div>
//                   <div className="overlay-value-small">
//                     {telemetry.battery.toFixed(1)} %
//                   </div>
//                 </div>
//                 <div className="overlay-item">
//                   <div className="overlay-label">Lat / Lon</div>
//                   <div className="overlay-value-small">
//                     {telemetry.lat.toFixed(5)}, {telemetry.lon.toFixed(5)}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ORGANISATION INSIGHTS – row of cards under map */}
//       <section className="dashboard-insights-section">
//         <h2 className="insights-title">Organisation insights</h2>

//         <div className="insights-grid">
//           <div className="insight-card">
//             <div className="insight-label">Flight Distance</div>
//             <div className="insight-value">1k km</div>
//             <div className="insight-chart-bar">
//               <span className="insight-bar-fill" />
//             </div>
//           </div>

//           <div className="insight-card">
//             <div className="insight-label">Flight Time</div>
//             <div className="insight-value">682 hr</div>
//             <div className="insight-chart-bar">
//               <span className="insight-bar-fill" />
//             </div>
//           </div>

//           <div className="insight-card">
//             <div className="insight-label">Flights</div>
//             <div className="insight-value">1216</div>
//             <div className="insight-chart-bar">
//               <span className="insight-bar-fill" />
//             </div>
//           </div>

//           <div className="insight-card">
//             <div className="insight-label">Online Drones</div>
//             <div className="insight-value">1 / 26</div>
//             <div className="insight-ring">
//               <span className="insight-ring-inner" />
//             </div>
//           </div>

//           <div className="insight-card">
//             <div className="insight-label">Pilots</div>
//             <div className="insight-value">19</div>
//             <div className="insight-icon-placeholder" />
//           </div>

//           <div className="insight-card">
//             <div className="insight-label">Reports</div>
//             <div className="insight-value">0</div>
//             <div className="insight-icon-placeholder" />
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default DashboardPage;




// // src/pages/DashboardPage.tsx
// import React, { useEffect, useRef, useState } from "react";
// import "./DashboardPage.css";
// import BatterySparkline from "../components/BatterySparkline";
// import LiveMap from "../components/LiveMap";

// type Telemetry = {
//   lat: number;
//   lon: number;
//   alt: number;
//   battery: number;
//   h_speed?: number;
//   v_speed?: number;
//   mode?: string;
//   ts?: number;
// };

// type Toast = {
//   id: number;
//   type: "info" | "warning";
//   message: string;
// };

// type DroneTabId = "hawk-demo" | "divyanshu-sitl" | "raven-2" | "secure-drone";

// type DroneTab = {
//   id: DroneTabId;
//   label: string;
//   // static meta just for UI – telemetry numbers will override where needed
//   homeLat: number;
//   homeLon: number;
// };

// const DRONE_TABS: DroneTab[] = [
//   {
//     id: "hawk-demo",
//     label: "Hawk Demo",
//     homeLat: 12.9716,
//     homeLon: 77.5946,
//   },
//   {
//     id: "divyanshu-sitl",
//     label: "Divyanshu SITL",
//     homeLat: 12.9721,
//     homeLon: 77.5949,
//   },
//   {
//     id: "raven-2",
//     label: "Internal Testing Raven 2",
//     homeLat: 12.973,
//     homeLon: 77.596,
//   },
//   {
//     id: "secure-drone",
//     label: "Secure Drone",
//     homeLat: 12.97,
//     homeLon: 77.59,
//   },
// ];

// // fallback WS URL if env not set
// const WS_URL =
//   (import.meta as any).env.VITE_WS_URL ?? "ws://127.0.0.1:8000/ws/telemetry";

// const DashboardPage: React.FC = () => {
//   const [telemetry, setTelemetry] = useState<Telemetry>({
//     lat: 12.9716,
//     lon: 77.5946,
//     alt: 0,
//     battery: 98,
//     h_speed: 0,
//     v_speed: 0,
//     mode: "IDLE",
//     ts: Date.now() / 1000,
//   });

//   const [wsStatus, setWsStatus] = useState<
//     "connecting" | "connected" | "disconnected" | "error"
//   >("connecting");

//   const [batteryHistory, setBatteryHistory] = useState<SparkPoint[]>([]);
//   const [toasts, setToasts] = useState<Toast[]>([]);

//   const [activeDroneId, setActiveDroneId] = useState<DroneTabId | null>(null);

//   const lastModeRef = useRef<string | undefined>(telemetry.mode);
//   const lastBatteryRef = useRef<number | undefined>(telemetry.battery);
//   const toastIdRef = useRef(1);

//   const showToast = (type: Toast["type"], message: string) => {
//     const id = toastIdRef.current++;
//     const toast: Toast = { id, type, message };
//     setToasts((prev) => [...prev, toast]);
//     setTimeout(() => {
//       setToasts((prev) => prev.filter((t) => t.id !== id));
//     }, 5000);
//   };

//   // WebSocket + telemetry handling
//   useEffect(() => {
//     let ws: WebSocket | null = null;
//     let reconnectTimer: number | null = null;
//     let mounted = true;

//     const connect = () => {
//       setWsStatus("connecting");
//       try {
//         ws = new WebSocket(WS_URL);
//       } catch (e) {
//         console.error("WS create failed", e);
//         setWsStatus("error");
//         return;
//       }

//       ws.onopen = () => {
//         if (!mounted) return;
//         setWsStatus("connected");
//         ws?.send("ping");
//       };

//       ws.onmessage = (event) => {
//         if (!mounted) return;
//         let raw: any;
//         try {
//           raw = JSON.parse(event.data);
//         } catch {
//           try {
//             const fixed = ("" + event.data).replace(/'/g, '"');
//             raw = JSON.parse(fixed);
//           } catch {
//             console.warn("Telemetry parse failed:", event.data);
//             return;
//           }
//         }

//         const updated: Telemetry = {
//           lat: Number(raw.lat ?? telemetry.lat),
//           lon: Number(raw.lon ?? telemetry.lon),
//           alt: Number(raw.alt ?? telemetry.alt),
//           battery: Number(raw.battery ?? telemetry.battery),
//           h_speed: Number(raw.h_speed ?? telemetry.h_speed ?? 0),
//           v_speed: Number(raw.v_speed ?? telemetry.v_speed ?? 0),
//           mode: String(raw.mode ?? telemetry.mode ?? "UNKNOWN"),
//           ts: Number(raw.ts ?? Date.now() / 1000),
//         };

//         setTelemetry(updated);

//         setBatteryHistory((prev) => {
//           const next: SparkPoint[] = [
//             ...prev,
//             { ts: updated.ts || Date.now() / 1000, value: updated.battery },
//           ];
//           return next.slice(-60);
//         });

//         if (
//           lastModeRef.current &&
//           updated.mode &&
//           updated.mode !== lastModeRef.current
//         ) {
//           showToast("info", `Mode changed to ${updated.mode}`);
//         }
//         lastModeRef.current = updated.mode;

//         if (
//           typeof lastBatteryRef.current === "number" &&
//           updated.battery <= 20 &&
//           lastBatteryRef.current > 20
//         ) {
//           showToast(
//             "warning",
//             `Warning: Battery low (${updated.battery.toFixed(1)}%)`,
//           );
//         }
//         lastBatteryRef.current = updated.battery;
//       };

//       ws.onerror = () => {
//         if (!mounted) return;
//         setWsStatus("error");
//       };

//       ws.onclose = () => {
//         if (!mounted) return;
//         setWsStatus("disconnected");
//         reconnectTimer = window.setTimeout(connect, 2000);
//       };
//     };

//     connect();

//     return () => {
//       mounted = false;
//       if (reconnectTimer !== null) {
//         window.clearTimeout(reconnectTimer);
//       }
//       if (ws && ws.readyState === WebSocket.OPEN) {
//         ws.close();
//       }
//     };
//   }, []);

//   const altDisplay = `${telemetry.alt.toFixed(1)} m`;
//   const battDisplay = `${telemetry.battery.toFixed(1)} %`;
//   const hSpeedDisplay = `${(telemetry.h_speed ?? 0).toFixed(1)} m/s`;
//   const vSpeedDisplay = `${(telemetry.v_speed ?? 0).toFixed(1)} m/s`;
//   const modeDisplay = telemetry.mode ?? "UNKNOWN";

//   const activeDrone = activeDroneId
//     ? DRONE_TABS.find((d) => d.id === activeDroneId) ?? null
//     : null;

//   // when switching to a specific drone, center map roughly to its "home"
//   const mapLat = activeDrone ? activeDrone.homeLat : telemetry.lat;
//   const mapLon = activeDrone ? activeDrone.homeLon : telemetry.lon;

//   return (
//     <div className="dashboard-page">
//       {/* Toasts */}
//       {toasts.length > 0 && (
//         <div className="dashboard-toasts">
//           {toasts.map((t) => (
//             <div key={t.id} className={`toast toast-${t.type}`}>
//               {t.message}
//             </div>
//           ))}
//         </div>
//       )}

//       <header className="dashboard-header">
//         <div>
//           <h1 className="dashboard-title">Dashboard</h1>
//           <div className="dashboard-subtitle">
//             VyomGarud • Fleet overview &amp; live telemetry
//           </div>
//         </div>
//         <div className="dashboard-header-right">
//           <div className="ws-status-pill">
//             <span className={`ws-dot ws-${wsStatus}`} />
//             <span className="ws-text">
//               {wsStatus === "connecting" && "Connecting…"}
//               {wsStatus === "connected" && "Live telemetry"}
//               {wsStatus === "disconnected" && "Disconnected"}
//               {wsStatus === "error" && "Error"}
//             </span>
//           </div>
//         </div>
//       </header>

//       <main className="dashboard-main">
//         {/* LIVE MAP CARD */}
//         <section className="dashboard-card dashboard-map-card">
//           <div className="map-card-header">
//             <div className="map-tabs">
//               <button
//                 type="button"
//                 className={`map-tab ${activeDroneId === null ? "is-active" : ""}`}
//                 onClick={() => setActiveDroneId(null)}
//               >
//                 View All
//               </button>
//               {DRONE_TABS.map((drone) => (
//                 <button
//                   key={drone.id}
//                   type="button"
//                   className={`map-tab ${
//                     activeDroneId === drone.id ? "is-active" : ""
//                   }`}
//                   onClick={() => setActiveDroneId(drone.id)}
//                 >
//                   {drone.label}
//                 </button>
//               ))}
//             </div>
//             <span className="map-telemetry-pill">Telemetry-linked</span>
//           </div>

//           <div className="map-wrapper">
//             {/* Live Leaflet map */}
//             <LiveMap lat={mapLat} lon={mapLon} follow />

//             {/* ACTIVE DRONE CARD – now only when a drone tab is selected */}
//             {activeDrone && (
//               <div className="active-drone-card">
//                 <div className="active-drone-title">ACTIVE DRONE</div>
//                 <div className="active-drone-name">VyomGarud Demo</div>

//                 <div className="active-drone-grid">
//                   <div>
//                     <div className="label">MODE</div>
//                     <div className="value">{modeDisplay}</div>
//                   </div>
//                   <div>
//                     <div className="label">ALTITUDE</div>
//                     <div className="value">{altDisplay}</div>
//                   </div>
//                   <div>
//                     <div className="label">H SPEED</div>
//                     <div className="value">{hSpeedDisplay}</div>
//                   </div>
//                   <div>
//                     <div className="label">V SPEED</div>
//                     <div className="value">{vSpeedDisplay}</div>
//                   </div>
//                   <div>
//                     <div className="label">BATTERY</div>
//                     <div className="value">{battDisplay}</div>
//                   </div>
//                   <div>
//                     <div className="label">LAT / LON</div>
//                     <div className="value">
//                       {telemetry.lat.toFixed(5)}, {telemetry.lon.toFixed(5)}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </section>

//         {/* ORGANISATION INSIGHTS / BOTTOM CARDS */}
//         <section className="organisation-insights">
//           <h2 className="section-title">Organisation insights</h2>
//           <div className="summary-grid">
//             <div className="summary-card">
//               <div className="summary-label">Flight Distance</div>
//               <div className="summary-value">1k km</div>
//               <BatterySparkline data={batteryHistory} min={0} max={100} />
//             </div>
//             <div className="summary-card">
//               <div className="summary-label">Flight Time</div>
//               <div className="summary-value">682 hr</div>
//               <BatterySparkline data={batteryHistory} min={0} max={100} />
//             </div>
//             <div className="summary-card">
//               <div className="summary-label">Flights</div>
//               <div className="summary-value">1216</div>
//               <BatterySparkline data={batteryHistory} min={0} max={100} />
//             </div>
//             <div className="summary-card">
//               <div className="summary-label">Online Drones</div>
//               <div className="summary-value">1 / 26</div>
//               <BatterySparkline data={batteryHistory} min={0} max={100} />
//             </div>
//             <div className="summary-card">
//               <div className="summary-label">Pilots</div>
//               <div className="summary-value">19</div>
//               <BatterySparkline data={batteryHistory} min={0} max={100} />
//             </div>
//             <div className="summary-card">
//               <div className="summary-label">Reports</div>
//               <div className="summary-value">0</div>
//               <BatterySparkline data={batteryHistory} min={0} max={100} />
//             </div>
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// };

// export default DashboardPage;




// // src/pages/DashboardPage.tsx
// import React, { useEffect, useRef, useState } from "react";
// import "./DashboardPage.css";
// import BatterySparkline, { SparkPoint } from "../components/BatterySparkline";
// import LiveMap from "../components/LiveMap";

// type Telemetry = {
//   lat: number;
//   lon: number;
//   alt: number;
//   battery: number;
//   hSpeed: number;
//   vSpeed: number;
//   mode: string;
//   ts: number;
// };

// type Toast = {
//   id: number;
//   type: "info" | "warning";
//   message: string;
// };

// type DroneId = "all" | "hawk" | "divyanshu" | "raven" | "secure";

// // Fallback WebSocket URL
// const WS_URL =
//   (import.meta as any).env.VITE_WS_URL ?? "ws://127.0.0.1:8000/ws/telemetry";

// const initialTelemetry: Telemetry = {
//   lat: 12.9716,
//   lon: 77.5946,
//   alt: 0,
//   battery: 69.3,
//   hSpeed: 7.8,
//   vSpeed: 0,
//   mode: "AUTO.MISSION",
//   ts: Date.now() / 1000,
// };

// const DashboardPage: React.FC = () => {
//   const [selectedDrone, setSelectedDrone] = useState<DroneId>("all");
//   const [telemetry, setTelemetry] = useState<Telemetry>(initialTelemetry);
//   const [batteryHistory, setBatteryHistory] = useState<SparkPoint[]>([]);
//   const [track, setTrack] = useState<{ lat: number; lon: number }[]>([
//     { lat: initialTelemetry.lat, lon: initialTelemetry.lon },
//   ]);
//   const [wsStatus, setWsStatus] = useState<
//     "connecting" | "connected" | "disconnected" | "error"
//   >("connecting");
//   const [toasts, setToasts] = useState<Toast[]>([]);

//   const toastIdRef = useRef(1);
//   const lastModeRef = useRef(initialTelemetry.mode);
//   const lastBatteryRef = useRef(initialTelemetry.battery);

//   const showToast = (type: Toast["type"], message: string) => {
//     const id = toastIdRef.current++;
//     setToasts((prev) => [...prev, { id, type, message }]);
//     setTimeout(() => {
//       setToasts((prev) => prev.filter((t) => t.id !== id));
//     }, 4000);
//   };

//   // WebSocket telemetry
//   useEffect(() => {
//     let ws: WebSocket | null = null;
//     let reconnectTimer: number | null = null;
//     let mounted = true;

//     const connect = () => {
//       if (!mounted) return;

//       try {
//         setWsStatus("connecting");
//         ws = new WebSocket(WS_URL);
//       } catch (err) {
//         console.error("WS create failed", err);
//         setWsStatus("error");
//         return;
//       }

//       ws.onopen = () => {
//         if (!mounted) return;
//         setWsStatus("connected");
//         ws?.send("ping");
//       };

//       ws.onmessage = (event) => {
//         if (!mounted) return;

//         let raw: any;
//         try {
//           raw = JSON.parse(event.data);
//         } catch {
//           try {
//             raw = JSON.parse(String(event.data).replace(/'/g, '"'));
//           } catch {
//             console.warn("Telemetry parse failed:", event.data);
//             return;
//           }
//         }

//         const updated: Telemetry = {
//           lat: Number(raw.lat ?? telemetry.lat),
//           lon: Number(raw.lon ?? telemetry.lon),
//           alt: Number(raw.alt ?? telemetry.alt),
//           battery: Number(raw.battery ?? telemetry.battery),
//           hSpeed: Number(raw.h_speed ?? telemetry.hSpeed ?? 0),
//           vSpeed: Number(raw.v_speed ?? telemetry.vSpeed ?? 0),
//           mode: String(raw.mode ?? telemetry.mode ?? "UNKNOWN"),
//           ts: Number(raw.ts ?? Date.now() / 1000),
//         };

//         setTelemetry(updated);
//         setBatteryHistory((prev) => {
//           const next: SparkPoint[] = [
//             ...prev,
//             { ts: updated.ts, value: updated.battery },
//           ];
//           return next.slice(-120);
//         });
//         setTrack((prev) => [...prev, { lat: updated.lat, lon: updated.lon }]);

//         if (updated.mode !== lastModeRef.current) {
//           showToast("info", `Mode changed to ${updated.mode}`);
//           lastModeRef.current = updated.mode;
//         }

//         if (updated.battery <= 20 && lastBatteryRef.current > 20) {
//           showToast(
//             "warning",
//             `Warning: Battery low (${updated.battery.toFixed(1)}%)`
//           );
//         }
//         lastBatteryRef.current = updated.battery;
//       };

//       ws.onerror = () => {
//         if (!mounted) return;
//         setWsStatus("error");
//       };

//       ws.onclose = () => {
//         if (!mounted) return;
//         setWsStatus("disconnected");
//         reconnectTimer = window.setTimeout(connect, 3000);
//       };
//     };

//     connect();

//     return () => {
//       mounted = false;
//       if (reconnectTimer) window.clearTimeout(reconnectTimer);
//       if (ws && ws.readyState === WebSocket.OPEN) ws.close();
//     };
//   }, []); // run once

//   const formattedAlt = `${telemetry.alt.toFixed(1)} m`;
//   const formattedBattery = `${telemetry.battery.toFixed(1)} %`;
//   const formattedHSpeed = `${telemetry.hSpeed.toFixed(1)} m/s`;

//   const droneTabs: { id: DroneId; label: string }[] = [
//     { id: "all", label: "View All" },
//     { id: "hawk", label: "Hawk Demo" },
//     { id: "divyanshu", label: "Divyanshu SITL" },
//     { id: "raven", label: "Internal Testing Raven 2" },
//     { id: "secure", label: "Secure Drone" },
//   ];

//   return (
//     <div className="dashboard-page">
//       {/* Toasts */}
//       {toasts.length > 0 && (
//         <div className="dashboard-toasts">
//           {toasts.map((t) => (
//             <div key={t.id} className={`toast toast-${t.type}`}>
//               {t.message}
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Header */}
//       <header className="dashboard-header">
//         <div>
//           <h1 className="dashboard-title">Dashboard</h1>
//           <p className="dashboard-subtitle">
//             VyomGarud • Fleet overview &amp; live telemetry
//           </p>
//         </div>
//         <div className="header-right">
//           <div className={`ws-pill ws-${wsStatus}`}>
//             <span className="ws-dot" />
//             <span>
//               {wsStatus === "connected" && "Live telemetry"}
//               {wsStatus === "connecting" && "Connecting…"}
//               {wsStatus === "disconnected" && "Disconnected"}
//               {wsStatus === "error" && "Error"}
//             </span>
//           </div>
//         </div>
//       </header>

//       <main className="dashboard-main">
//         {/* Live map big card */}
//         <section className="live-map-section">
//           <div className="drone-tabs">
//             {droneTabs.map((tab) => (
//               <button
//                 key={tab.id}
//                 className={
//                   selectedDrone === tab.id ? "drone-tab active" : "drone-tab"
//                 }
//                 onClick={() => setSelectedDrone(tab.id)}
//               >
//                 {tab.label}
//               </button>
//             ))}
//           </div>

//           <div className="live-map-card">
//             <div className="live-map-card-header">
//               <div>
//                 <h2>Live map</h2>
//                 <p>Real-time drone positions &amp; mission paths</p>
//               </div>
//               <div className="telemetry-pill">
//                 <span className="telemetry-dot" />
//                 Telemetry-linked
//               </div>
//             </div>

//             <div className="live-map-layout">
//               <div className="live-map-viewport">
//                 <LiveMap
//                   lat={telemetry.lat}
//                   lon={telemetry.lon}
//                   track={track}
//                   follow={selectedDrone !== "all"}
//                 />
//               </div>

//               {/* This card only appears when a specific drone is selected */}
//               {selectedDrone !== "all" && (
//                 <aside className="active-drone-card">
//                   <div className="active-label">ACTIVE DRONE</div>
//                   <div className="active-name">VyomGarud Demo</div>

//                   <div className="active-row">
//                     <span className="label">MODE</span>
//                     <span className="value">{telemetry.mode}</span>
//                   </div>
//                   <div className="active-row">
//                     <span className="label">ALTITUDE</span>
//                     <span className="value">{formattedAlt}</span>
//                   </div>
//                   <div className="active-row">
//                     <span className="label">H SPEED</span>
//                     <span className="value">{formattedHSpeed}</span>
//                   </div>
//                   <div className="active-row">
//                     <span className="label">BATTERY</span>
//                     <span className="value">{formattedBattery}</span>
//                   </div>
//                   <div className="active-row">
//                     <span className="label">LAT / LON</span>
//                     <span className="value">
//                       {telemetry.lat.toFixed(5)}, {telemetry.lon.toFixed(5)}
//                     </span>
//                   </div>

//                   <div className="battery-trend-label">Battery trend</div>
//                   <BatterySparkline data={batteryHistory} min={0} max={100} />
//                 </aside>
//               )}
//             </div>
//           </div>
//         </section>

//         {/* Organisation insights row */}
//         <section className="org-insights">
//           <h2 className="section-title">Organisation insights</h2>
//           <div className="org-cards-row">
//             <div className="org-card">
//               <div className="org-label">Flight Distance</div>
//               <div className="org-value">1k km</div>
//               <div className="org-bar" />
//             </div>
//             <div className="org-card">
//               <div className="org-label">Flight Time</div>
//               <div className="org-value">682 hr</div>
//               <div className="org-bar" />
//             </div>
//             <div className="org-card">
//               <div className="org-label">Flights</div>
//               <div className="org-value">1216</div>
//               <div className="org-bar" />
//             </div>
//             <div className="org-card">
//               <div className="org-label">Online Drones</div>
//               <div className="org-value">1 / 26</div>
//               <div className="org-bar circle" />
//             </div>
//             <div className="org-card">
//               <div className="org-label">Pilots</div>
//               <div className="org-value">19</div>
//               <div className="org-bar" />
//             </div>
//             <div className="org-card">
//               <div className="org-label">Reports</div>
//               <div className="org-value">0</div>
//               <div className="org-bar" />
//             </div>
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// };

// export default DashboardPage;



// // src/pages/DashboardPage.tsx
// import React, { useEffect, useMemo, useState } from "react";
// import "./DashboardPage.css";
// import BatterySparkline from "../components/BatterySparkline";
// import LiveMap from "../components/LiveMap";

// type Telemetry = {
//   lat: number;
//   lon: number;
//   alt: number;
//   battery: number;
//   h_speed?: number;
//   v_speed?: number;
//   mode?: string;
// };

// type DroneId = "view-all" | "hawk" | "divyanshu" | "raven" | "secure";

// const WS_URL =
//   (import.meta as any).env.VITE_WS_URL ?? "ws://127.0.0.1:8000/ws/telemetry";

// const DashboardPage: React.FC = () => {
//   // which drone tab is active
//   const [activeDrone, setActiveDrone] = useState<DroneId>("view-all");

//   // latest telemetry (from WS or fallback)
//   const [telemetry, setTelemetry] = useState<Telemetry>({
//     lat: 12.9716,
//     lon: 77.5946,
//     alt: 0,
//     battery: 69.3,
//     h_speed: 0,
//     v_speed: 0,
//     mode: "IDLE",
//   });

//   // simple battery history for the sparkline – we don't use SparkPoint type
//   const [batteryHistory, setBatteryHistory] = useState<{ ts: number; value: number }[]>([]);

//   const [wsStatus, setWsStatus] = useState<
//     "connecting" | "connected" | "disconnected" | "error"
//   >("connecting");

//   // track of positions for the map polyline
//   const [track, setTrack] = useState<[number, number][]>([]);

//   // ---- WebSocket hook ----
//   useEffect(() => {
//     let ws: WebSocket | null = null;
//     let reconnectTimer: number | null = null;
//     let mounted = true;

//     const connect = () => {
//       setWsStatus("connecting");
//       try {
//         ws = new WebSocket(WS_URL);
//       } catch (e) {
//         console.error("WS create failed", e);
//         setWsStatus("error");
//         return;
//       }

//       ws.onopen = () => {
//         if (!mounted) return;
//         setWsStatus("connected");
//       };

//       ws.onmessage = (event) => {
//         if (!mounted) return;

//         let raw: any;
//         try {
//           raw = JSON.parse(event.data);
//         } catch {
//           try {
//             const fixed = ("" + event.data).replace(/'/g, '"');
//             raw = JSON.parse(fixed);
//           } catch {
//             console.warn("Telemetry parse failed:", event.data);
//             return;
//           }
//         }

//         const next: Telemetry = {
//           lat: Number(raw.lat ?? telemetry.lat),
//           lon: Number(raw.lon ?? telemetry.lon),
//           alt: Number(raw.alt ?? telemetry.alt),
//           battery: Number(raw.battery ?? telemetry.battery),
//           h_speed: Number(raw.h_speed ?? telemetry.h_speed ?? 0),
//           v_speed: Number(raw.v_speed ?? telemetry.v_speed ?? 0),
//           mode: String(raw.mode ?? telemetry.mode ?? "UNKNOWN"),
//         };

//         setTelemetry(next);
//         setBatteryHistory((prev) =>
//           [...prev, { ts: Date.now() / 1000, value: next.battery }].slice(-120)
//         );
//         setTrack((prev) => [...prev, [next.lat, next.lon]].slice(-500));
//       };

//       ws.onerror = () => {
//         if (!mounted) return;
//         setWsStatus("error");
//       };

//       ws.onclose = () => {
//         if (!mounted) return;
//         setWsStatus("disconnected");
//         reconnectTimer = window.setTimeout(connect, 2000);
//       };
//     };

//     connect();

//     return () => {
//       mounted = false;
//       if (reconnectTimer !== null) window.clearTimeout(reconnectTimer);
//       if (ws && ws.readyState === WebSocket.OPEN) ws.close();
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // derived values for display
//   const wsLabel = useMemo(() => {
//     switch (wsStatus) {
//       case "connecting":
//         return "Connecting…";
//       case "connected":
//         return "Live telemetry";
//       case "disconnected":
//         return "Disconnected";
//       case "error":
//         return "Error";
//       default:
//         return "";
//     }
//   }, [wsStatus]);

//   const formattedLat = telemetry.lat.toFixed(5);
//   const formattedLon = telemetry.lon.toFixed(5);

//   // card data for each drone tab (demo values)
//   const droneCards: Record<
//     Exclude<DroneId, "view-all">,
//     {
//       name: string;
//       mission: string;
//       home: string;
//     }
//   > = {
//     hawk: {
//       name: "Hawk Demo",
//       mission: "Recon",
//       home: "Hawk Base",
//     },
//     divyanshu: {
//       name: "Divyanshu SITL",
//       mission: "Simulation",
//       home: "Virtual Field",
//     },
//     raven: {
//       name: "Internal Testing Raven 2",
//       mission: "Test Flight",
//       home: "Raven Pad",
//     },
//     secure: {
//       name: "Secure Drone",
//       mission: "Perimeter Patrol",
//       home: "HQ Roof",
//     },
//   };

//   const showDroneCard = activeDrone !== "view-all";
//   const activeCard =
//     activeDrone !== "view-all" ? droneCards[activeDrone] : undefined;

//   return (
//     <div className="dash-root">
//       {/* Top header */}
//       <header className="dash-header">
//         <div>
//           <h1 className="dash-title">Dashboard</h1>
//           <div className="dash-subtitle">
//             VyomGarud • Fleet overview &amp; live telemetry
//           </div>
//         </div>

//         <div className="dash-header-right">
//           <div className={`ws-pill ws-${wsStatus}`}>
//             <span className="ws-dot" />
//             <span className="ws-label">{wsLabel}</span>
//           </div>
//         </div>
//       </header>

//       {/* Live map section */}
//       <section className="dash-map-section">
//         {/* Drone tabs row */}
//         <div className="drone-tabs">
//           <button
//             className={
//               activeDrone === "view-all"
//                 ? "drone-tab drone-tab-active"
//                 : "drone-tab"
//             }
//             onClick={() => setActiveDrone("view-all")}
//           >
//             View All
//           </button>
//           <button
//             className={
//               activeDrone === "hawk" ? "drone-tab drone-tab-active" : "drone-tab"
//             }
//             onClick={() => setActiveDrone("hawk")}
//           >
//             Hawk Demo
//           </button>
//           <button
//             className={
//               activeDrone === "divyanshu"
//                 ? "drone-tab drone-tab-active"
//                 : "drone-tab"
//             }
//             onClick={() => setActiveDrone("divyanshu")}
//           >
//             Divyanshu SITL
//           </button>
//           <button
//             className={
//               activeDrone === "raven"
//                 ? "drone-tab drone-tab-active"
//                 : "drone-tab"
//             }
//             onClick={() => setActiveDrone("raven")}
//           >
//             Internal Testing Raven 2
//           </button>
//           <button
//             className={
//               activeDrone === "secure"
//                 ? "drone-tab drone-tab-active"
//                 : "drone-tab"
//             }
//             onClick={() => setActiveDrone("secure")}
//           >
//             Secure Drone
//           </button>
//         </div>

//         {/* Map card */}
//         <div className="map-card">
//           <div className="map-card-header">
//             <div>
//               <div className="map-title">Live map</div>
//               <div className="map-subtitle">
//                 Real-time drone positions &amp; mission paths
//               </div>
//             </div>
//             <div className="map-tag">Telemetry-linked</div>
//           </div>

//           <div className="map-card-body">
//             <div className="map-container-shell">
//               <LiveMap
//                 center={[telemetry.lat, telemetry.lon]}
//                 track={track}
//               />
//             </div>

//             {showDroneCard && activeCard && (
//               <div className="active-drone-card">
//                 <div className="adc-title">Active drone</div>
//                 <div className="adc-name">{activeCard.name}</div>

//                 <div className="adc-row">
//                   <span className="adc-label">Mode</span>
//                   <span className="adc-value">{telemetry.mode ?? "—"}</span>
//                 </div>
//                 <div className="adc-row">
//                   <span className="adc-label">Altitude</span>
//                   <span className="adc-value">
//                     {telemetry.alt.toFixed(1)} m
//                   </span>
//                 </div>
//                 <div className="adc-row">
//                   <span className="adc-label">H-speed</span>
//                   <span className="adc-value">
//                     {(telemetry.h_speed ?? 0).toFixed(1)} m/s
//                   </span>
//                 </div>
//                 <div className="adc-row">
//                   <span className="adc-label">V-speed</span>
//                   <span className="adc-value">
//                     {(telemetry.v_speed ?? 0).toFixed(1)} m/s
//                   </span>
//                 </div>
//                 <div className="adc-row">
//                   <span className="adc-label">Battery</span>
//                   <span className="adc-value">
//                     {telemetry.battery.toFixed(1)}%
//                   </span>
//                 </div>
//                 <div className="adc-row">
//                   <span className="adc-label">Home</span>
//                   <span className="adc-value">{activeCard.home}</span>
//                 </div>
//                 <div className="adc-row">
//                   <span className="adc-label">Lat / Lon</span>
//                   <span className="adc-value">
//                     {formattedLat}, {formattedLon}
//                   </span>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* battery trend in a thin strip below map, like “Live Track” area */}
//           <div className="battery-strip">
//             <div className="battery-strip-header">
//               <span>Battery trend (last ~120 samples)</span>
//               <span className="battery-strip-value">
//                 {telemetry.battery.toFixed(1)}%
//               </span>
//             </div>
//             <div className="battery-strip-body">
//               {/* we don't use SparkPoint type here, just plain data */}
//               <BatterySparkline data={batteryHistory} />
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Organisation insights blocks */}
//       <section className="insights-section">
//         <h2 className="insights-title">Organisation Insights</h2>
//         <div className="insights-grid">
//           <div className="insight-card">
//             <div className="insight-label">Flight Distance</div>
//             <div className="insight-value">1k km</div>
//             <div className="insight-mini-bar" />
//           </div>
//           <div className="insight-card">
//             <div className="insight-label">Flight Time</div>
//             <div className="insight-value">682 hr</div>
//             <div className="insight-mini-bar" />
//           </div>
//           <div className="insight-card">
//             <div className="insight-label">Flights</div>
//             <div className="insight-value">1216</div>
//             <div className="insight-mini-bar" />
//           </div>
//           <div className="insight-card">
//             <div className="insight-label">Online Drones</div>
//             <div className="insight-value">1 / 26</div>
//             <div className="insight-circle" />
//           </div>
//           <div className="insight-card">
//             <div className="insight-label">Pilots</div>
//             <div className="insight-value">19</div>
//             <div className="insight-avatar" />
//           </div>
//           <div className="insight-card">
//             <div className="insight-label">Reports</div>
//             <div className="insight-value">0</div>
//             <div className="insight-doc" />
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default DashboardPage;





// // src/pages/DashboardPage.tsx
// import React, { useEffect, useMemo, useState } from "react";
// import "./DashboardPage.css";
// import BatterySparkline from "../components/BatterySparkline";
// import LiveMap from "../components/LiveMap";

// type Telemetry = {
//   lat: number;
//   lon: number;
//   alt: number;
//   battery: number;
//   h_speed?: number;
//   v_speed?: number;
//   mode?: string;
// };

// type DroneId = "view-all" | "hawk" | "divyanshu" | "raven" | "secure";

// const WS_URL =
//   (import.meta as any).env.VITE_WS_URL ?? "ws://127.0.0.1:8000/ws/telemetry";

// const DashboardPage: React.FC = () => {
//   // which drone tab is active
//   const [activeDrone, setActiveDrone] = useState<DroneId>("view-all");

//   // latest telemetry (from WS or fallback)
//   const [telemetry, setTelemetry] = useState<Telemetry>({
//     lat: 12.9716,
//     lon: 77.5946,
//     alt: 0,
//     battery: 69.3,
//     h_speed: 0,
//     v_speed: 0,
//     mode: "IDLE",
//   });

//   // simple battery history for the sparkline
//   const [batteryHistory, setBatteryHistory] = useState<
//     { ts: number; value: number }[]
//   >([]);

//   const [wsStatus, setWsStatus] = useState<
//     "connecting" | "connected" | "disconnected" | "error"
//   >("connecting");

//   // track of positions for the map polyline
//   const [track, setTrack] = useState<[number, number][]>([]);

//   // ---- WebSocket hook ----
//   useEffect(() => {
//     let ws: WebSocket | null = null;
//     let reconnectTimer: number | null = null;
//     let mounted = true;

//     const connect = () => {
//       setWsStatus("connecting");
//       try {
//         ws = new WebSocket(WS_URL);
//       } catch (e) {
//         console.error("WS create failed", e);
//         setWsStatus("error");
//         return;
//       }

//       ws.onopen = () => {
//         if (!mounted) return;
//         setWsStatus("connected");
//       };

//       ws.onmessage = (event) => {
//         if (!mounted) return;

//         let raw: any;
//         try {
//           raw = JSON.parse(event.data);
//         } catch {
//           try {
//             const fixed = ("" + event.data).replace(/'/g, '"');
//             raw = JSON.parse(fixed);
//           } catch {
//             console.warn("Telemetry parse failed:", event.data);
//             return;
//           }
//         }

//         const next: Telemetry = {
//           lat: Number(raw.lat ?? telemetry.lat),
//           lon: Number(raw.lon ?? telemetry.lon),
//           alt: Number(raw.alt ?? telemetry.alt),
//           battery: Number(raw.battery ?? telemetry.battery),
//           h_speed: Number(raw.h_speed ?? telemetry.h_speed ?? 0),
//           v_speed: Number(raw.v_speed ?? telemetry.v_speed ?? 0),
//           mode: String(raw.mode ?? telemetry.mode ?? "UNKNOWN"),
//         };

//         setTelemetry(next);
//         setBatteryHistory((prev) =>
//           [...prev, { ts: Date.now() / 1000, value: next.battery }].slice(-120)
//         );
//         setTrack((prev) => [...prev, [next.lat, next.lon]].slice(-500));
//       };

//       ws.onerror = () => {
//         if (!mounted) return;
//         setWsStatus("error");
//       };

//       ws.onclose = () => {
//         if (!mounted) return;
//         setWsStatus("disconnected");
//         reconnectTimer = window.setTimeout(connect, 2000);
//       };
//     };

//     connect();

//     return () => {
//       mounted = false;
//       if (reconnectTimer !== null) window.clearTimeout(reconnectTimer);
//       if (ws && ws.readyState === WebSocket.OPEN) ws.close();
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // derived values for display
//   const wsLabel = useMemo(() => {
//     switch (wsStatus) {
//       case "connecting":
//         return "Connecting…";
//       case "connected":
//         return "Live telemetry";
//       case "disconnected":
//         return "Disconnected";
//       case "error":
//         return "Error";
//       default:
//         return "";
//     }
//   }, [wsStatus]);

//   const formattedLat = telemetry.lat.toFixed(5);
//   const formattedLon = telemetry.lon.toFixed(5);

//   // card data for each drone tab (demo values)
//   type DroneCardMeta = {
//     name: string;
//     mission: string;
//     home: string;
//     liveTrackUrl?: string;
//   };

//   const droneCards: Record<Exclude<DroneId, "view-all">, DroneCardMeta> = {
//     hawk: {
//       name: "Hawk Demo",
//       mission: "Recon",
//       home: "Hawk Base",
//       liveTrackUrl: "/console/flights?drone=hawk",
//     },
//     divyanshu: {
//       name: "Divyanshu SITL",
//       mission: "Simulation",
//       home: "Virtual Field",
//       liveTrackUrl: "/console/flights?drone=divyanshu",
//     },
//     raven: {
//       name: "Internal Testing Raven 2",
//       mission: "Test Flight",
//       home: "Raven Pad",
//       liveTrackUrl: "/console/flights?drone=raven",
//     },
//     secure: {
//       name: "Secure Drone",
//       mission: "Perimeter Patrol",
//       home: "HQ Roof",
//       liveTrackUrl: "/console/flights?drone=secure",
//     },
//   };

//   const activeDroneKey: Exclude<DroneId, "view-all"> | null =
//     activeDrone === "view-all" ? null : activeDrone;

//   const showDroneCard = activeDroneKey !== null;
//   const activeCard = activeDroneKey ? droneCards[activeDroneKey] : undefined;

//   // Live Track click handler
//   const handleLiveTrackClick = (droneId: Exclude<DroneId, "view-all">) => {
//     const card = droneCards[droneId];
//     if (card.liveTrackUrl) {
//       // open target live track page in new tab (you can change this URL later)
//       window.open(card.liveTrackUrl, "_blank");
//     } else {
//       // fallback if url not configured
//       alert(`Live track for ${card.name} coming soon.`);
//     }
//   };

//   return (
//     <div className="dash-root">
//       {/* Top header */}
//       <header className="dash-header">
//         <div>
//           <h1 className="dash-title">Dashboard</h1>
//           <div className="dash-subtitle">
//             VyomGarud • Fleet overview &amp; live telemetry
//           </div>
//         </div>

//         <div className="dash-header-right">
//           <div className={`ws-pill ws-${wsStatus}`}>
//             <span className="ws-dot" />
//             <span className="ws-label">{wsLabel}</span>
//           </div>
//         </div>
//       </header>

//       {/* Live map section */}
//       <section className="dash-map-section">
//         {/* Drone tabs row */}
//         <div className="drone-tabs">
//           <button
//             className={
//               activeDrone === "view-all"
//                 ? "drone-tab drone-tab-active"
//                 : "drone-tab"
//             }
//             onClick={() => setActiveDrone("view-all")}
//           >
//             View All
//           </button>
//           <button
//             className={
//               activeDrone === "hawk" ? "drone-tab drone-tab-active" : "drone-tab"
//             }
//             onClick={() => setActiveDrone("hawk")}
//           >
//             Hawk Demo
//           </button>
//           <button
//             className={
//               activeDrone === "divyanshu"
//                 ? "drone-tab drone-tab-active"
//                 : "drone-tab"
//             }
//             onClick={() => setActiveDrone("divyanshu")}
//           >
//             Divyanshu SITL
//           </button>
//           <button
//             className={
//               activeDrone === "raven"
//                 ? "drone-tab drone-tab-active"
//                 : "drone-tab"
//             }
//             onClick={() => setActiveDrone("raven")}
//           >
//             Internal Testing Raven 2
//           </button>
//           <button
//             className={
//               activeDrone === "secure"
//                 ? "drone-tab drone-tab-active"
//                 : "drone-tab"
//             }
//             onClick={() => setActiveDrone("secure")}
//           >
//             Secure Drone
//           </button>
//         </div>

//         {/* Map card */}
//         <div className="map-card">
//           <div className="map-card-header">
//             <div>
//               <div className="map-title">Live map</div>
//               <div className="map-subtitle">
//                 Real-time drone positions &amp; mission paths
//               </div>
//             </div>
//             <div className="map-tag">Telemetry-linked</div>
//           </div>

//           <div className="map-card-body">
//             <div className="map-container-shell">
//               <LiveMap center={[telemetry.lat, telemetry.lon]} track={track} />
//             </div>

//             {showDroneCard && activeDroneKey && activeCard && (
//               <div className="active-drone-card">
//                 <div className="adc-title">Active drone</div>
//                 <div className="adc-name">{activeCard.name}</div>

//                 <div className="adc-row">
//                   <span className="adc-label">Mode</span>
//                   <span className="adc-value">{telemetry.mode ?? "—"}</span>
//                 </div>
//                 <div className="adc-row">
//                   <span className="adc-label">Altitude</span>
//                   <span className="adc-value">
//                     {telemetry.alt.toFixed(1)} m
//                   </span>
//                 </div>
//                 <div className="adc-row">
//                   <span className="adc-label">H-speed</span>
//                   <span className="adc-value">
//                     {(telemetry.h_speed ?? 0).toFixed(1)} m/s
//                   </span>
//                 </div>
//                 <div className="adc-row">
//                   <span className="adc-label">V-speed</span>
//                   <span className="adc-value">
//                     {(telemetry.v_speed ?? 0).toFixed(1)} m/s
//                   </span>
//                 </div>
//                 <div className="adc-row">
//                   <span className="adc-label">Battery</span>
//                   <span className="adc-value">
//                     {telemetry.battery.toFixed(1)}%
//                   </span>
//                 </div>
//                 <div className="adc-row">
//                   <span className="adc-label">Home</span>
//                   <span className="adc-value">{activeCard.home}</span>
//                 </div>
//                 <div className="adc-row">
//                   <span className="adc-label">Lat / Lon</span>
//                   <span className="adc-value">
//                     {formattedLat}, {formattedLon}
//                   </span>
//                 </div>

//                 {/* Live Track button like in reference UI */}
//                 <button
//                   className="live-track-button"
//                   onClick={() => handleLiveTrackClick(activeDroneKey)}
//                 >
//                   Live Track
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* battery trend in a thin strip below map */}
//           <div className="battery-strip">
//             <div className="battery-strip-header">
//               <span>Battery trend (last ~120 samples)</span>
//               <span className="battery-strip-value">
//                 {telemetry.battery.toFixed(1)}%
//               </span>
//             </div>
//             <div className="battery-strip-body">
//               <BatterySparkline data={batteryHistory} />
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Organisation insights blocks */}
//       <section className="insights-section">
//         <h2 className="insights-title">Organisation Insights</h2>
//         <div className="insights-grid">
//           <div className="insight-card">
//             <div className="insight-label">Flight Distance</div>
//             <div className="insight-value">1k km</div>
//             <div className="insight-mini-bar" />
//           </div>
//           <div className="insight-card">
//             <div className="insight-label">Flight Time</div>
//             <div className="insight-value">682 hr</div>
//             <div className="insight-mini-bar" />
//           </div>
//           <div className="insight-card">
//             <div className="insight-label">Flights</div>
//             <div className="insight-value">1216</div>
//             <div className="insight-mini-bar" />
//           </div>
//           <div className="insight-card">
//             <div className="insight-label">Online Drones</div>
//             <div className="insight-value">1 / 26</div>
//             <div className="insight-circle" />
//           </div>
//           <div className="insight-card">
//             <div className="insight-label">Pilots</div>
//             <div className="insight-value">19</div>
//             <div className="insight-avatar" />
//           </div>
//           <div className="insight-card">
//             <div className="insight-label">Reports</div>
//             <div className="insight-value">0</div>
//             <div className="insight-doc" />
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default DashboardPage;



// // src/pages/DashboardPage.tsx
// import React, { useEffect, useMemo, useState } from "react";
// import "./DashboardPage.css";
// import BatterySparkline from "../components/BatterySparkline";
// import LiveMap from "../components/LiveMap";

// type Telemetry = {
//   lat: number;
//   lon: number;
//   alt: number;
//   battery: number;
//   h_speed?: number;
//   v_speed?: number;
//   mode?: string;
// };

// type DroneId = "view-all" | "hawk" | "divyanshu" | "raven" | "secure";

// const WS_URL =
//   (import.meta as any).env.VITE_WS_URL ?? "ws://127.0.0.1:8000/ws/telemetry";

// const DashboardPage: React.FC = () => {
//   // which drone tab is active
//   const [activeDrone, setActiveDrone] = useState<DroneId>("view-all");

//   // live-track overlay state
//   const [isLiveTrackOpen, setIsLiveTrackOpen] = useState(false);

//   // latest telemetry (from WS or fallback)
//   const [telemetry, setTelemetry] = useState<Telemetry>({
//     lat: 12.9716,
//     lon: 77.5946,
//     alt: 0,
//     battery: 69.3,
//     h_speed: 0,
//     v_speed: 0,
//     mode: "IDLE",
//   });

//   // simple battery history for the sparkline – we don't use SparkPoint type
//   const [batteryHistory, setBatteryHistory] = useState<
//     { ts: number; value: number }[]
//   >([]);

//   const [wsStatus, setWsStatus] = useState<
//     "connecting" | "connected" | "disconnected" | "error"
//   >("connecting");

//   // track of positions for the map polyline
//   const [track, setTrack] = useState<[number, number][]>([]);

//   // ---- WebSocket hook ----
//   useEffect(() => {
//     let ws: WebSocket | null = null;
//     let reconnectTimer: number | null = null;
//     let mounted = true;

//     const connect = () => {
//       setWsStatus("connecting");
//       try {
//         ws = new WebSocket(WS_URL);
//       } catch (e) {
//         console.error("WS create failed", e);
//         setWsStatus("error");
//         return;
//       }

//       ws.onopen = () => {
//         if (!mounted) return;
//         setWsStatus("connected");
//       };

//       ws.onmessage = (event) => {
//         if (!mounted) return;

//         let raw: any;
//         try {
//           raw = JSON.parse(event.data);
//         } catch {
//           try {
//             const fixed = ("" + event.data).replace(/'/g, '"');
//             raw = JSON.parse(fixed);
//           } catch {
//             console.warn("Telemetry parse failed:", event.data);
//             return;
//           }
//         }

//         setTelemetry((prev) => {
//           const next: Telemetry = {
//             lat: Number(raw.lat ?? prev.lat),
//             lon: Number(raw.lon ?? prev.lon),
//             alt: Number(raw.alt ?? prev.alt),
//             battery: Number(raw.battery ?? prev.battery),
//             h_speed: Number(raw.h_speed ?? prev.h_speed ?? 0),
//             v_speed: Number(raw.v_speed ?? prev.v_speed ?? 0),
//             mode: String(raw.mode ?? prev.mode ?? "UNKNOWN"),
//           };

//           // battery history
//           setBatteryHistory((old) =>
//             [...old, { ts: Date.now() / 1000, value: next.battery }].slice(-120)
//           );

//           // track history
//           setTrack((old) => [...old, [next.lat, next.lon]].slice(-500));

//           return next;
//         });
//       };

//       ws.onerror = () => {
//         if (!mounted) return;
//         setWsStatus("error");
//       };

//       ws.onclose = () => {
//         if (!mounted) return;
//         setWsStatus("disconnected");
//         reconnectTimer = window.setTimeout(connect, 2000);
//       };
//     };

//     connect();

//     return () => {
//       mounted = false;
//       if (reconnectTimer !== null) window.clearTimeout(reconnectTimer);
//       if (ws && ws.readyState === WebSocket.OPEN) ws.close();
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // derived values for display
//   const wsLabel = useMemo(() => {
//     switch (wsStatus) {
//       case "connecting":
//         return "Connecting…";
//       case "connected":
//         return "Live telemetry";
//       case "disconnected":
//         return "Disconnected";
//       case "error":
//         return "Error";
//       default:
//         return "";
//     }
//   }, [wsStatus]);

//   const formattedLat = telemetry.lat.toFixed(5);
//   const formattedLon = telemetry.lon.toFixed(5);

//   // card data for each drone tab (demo values)
//   const droneCards: Record<
//     Exclude<DroneId, "view-all">,
//     {
//       name: string;
//       mission: string;
//       home: string;
//     }
//   > = {
//     hawk: {
//       name: "Hawk Demo",
//       mission: "Recon",
//       home: "Hawk Base",
//     },
//     divyanshu: {
//       name: "Divyanshu SITL",
//       mission: "Simulation",
//       home: "Virtual Field",
//     },
//     raven: {
//       name: "Internal Testing Raven 2",
//       mission: "Test Flight",
//       home: "Raven Pad",
//     },
//     secure: {
//       name: "Secure Drone",
//       mission: "Perimeter Patrol",
//       home: "HQ Roof",
//     },
//   };

//   const showDroneCard = activeDrone !== "view-all";
//   const activeCard =
//     activeDrone !== "view-all" ? droneCards[activeDrone] : undefined;

//   const handleLiveTrackClick = () => {
//     if (activeDrone === "view-all") return;
//     setIsLiveTrackOpen(true);
//   };

//   const handleCloseLiveTrack = () => setIsLiveTrackOpen(false);

//   return (
//     <div className="dash-root">
//       {/* Top header */}
//       <header className="dash-header">
//         <div>
//           <h1 className="dash-title">Dashboard</h1>
//           <div className="dash-subtitle">
//             VyomGarud • Fleet overview &amp; live telemetry
//           </div>
//         </div>

//         <div className="dash-header-right">
//           <div className={`ws-pill ws-${wsStatus}`}>
//             <span className="ws-dot" />
//             <span className="ws-label">{wsLabel}</span>
//           </div>
//         </div>
//       </header>

//       {/* Live map section */}
//       <section className="dash-map-section">
//         {/* Drone tabs row */}
//         <div className="drone-tabs">
//           <button
//             className={
//               activeDrone === "view-all"
//                 ? "drone-tab drone-tab-active"
//                 : "drone-tab"
//             }
//             onClick={() => setActiveDrone("view-all")}
//           >
//             View All
//           </button>
//           <button
//             className={
//               activeDrone === "hawk" ? "drone-tab drone-tab-active" : "drone-tab"
//             }
//             onClick={() => setActiveDrone("hawk")}
//           >
//             Hawk Demo
//           </button>
//           <button
//             className={
//               activeDrone === "divyanshu"
//                 ? "drone-tab drone-tab-active"
//                 : "drone-tab"
//             }
//             onClick={() => setActiveDrone("divyanshu")}
//           >
//             Divyanshu SITL
//           </button>
//           <button
//             className={
//               activeDrone === "raven"
//                 ? "drone-tab drone-tab-active"
//                 : "drone-tab"
//             }
//             onClick={() => setActiveDrone("raven")}
//           >
//             Internal Testing Raven 2
//           </button>
//           <button
//             className={
//               activeDrone === "secure"
//                 ? "drone-tab drone-tab-active"
//                 : "drone-tab"
//             }
//             onClick={() => setActiveDrone("secure")}
//           >
//             Secure Drone
//           </button>
//         </div>

//         {/* Map card */}
//         <div className="map-card">
//           <div className="map-card-header">
//             <div>
//               <div className="map-title">Live map</div>
//               <div className="map-subtitle">
//                 Real-time drone positions &amp; mission paths
//               </div>
//             </div>
//             <div className="map-tag">Telemetry-linked</div>
//           </div>

//           <div className="map-card-body">
//             <div className="map-container-shell">
//               <LiveMap center={[telemetry.lat, telemetry.lon]} track={track} />
//             </div>

//             {showDroneCard && activeCard && (
//               <div className="active-drone-card">
//                 <div className="adc-title">Active drone</div>
//                 <div className="adc-name">{activeCard.name}</div>

//                 <div className="adc-row">
//                   <span className="adc-label">Mode</span>
//                   <span className="adc-value">{telemetry.mode ?? "—"}</span>
//                 </div>
//                 <div className="adc-row">
//                   <span className="adc-label">Altitude</span>
//                   <span className="adc-value">
//                     {telemetry.alt.toFixed(1)} m
//                   </span>
//                 </div>
//                 <div className="adc-row">
//                   <span className="adc-label">H-speed</span>
//                   <span className="adc-value">
//                     {(telemetry.h_speed ?? 0).toFixed(1)} m/s
//                   </span>
//                 </div>
//                 <div className="adc-row">
//                   <span className="adc-label">V-speed</span>
//                   <span className="adc-value">
//                     {(telemetry.v_speed ?? 0).toFixed(1)} m/s
//                   </span>
//                 </div>
//                 <div className="adc-row">
//                   <span className="adc-label">Battery</span>
//                   <span className="adc-value">
//                     {telemetry.battery.toFixed(1)}%
//                   </span>
//                 </div>
//                 <div className="adc-row">
//                   <span className="adc-label">Home</span>
//                   <span className="adc-value">{activeCard.home}</span>
//                 </div>
//                 <div className="adc-row">
//                   <span className="adc-label">Lat / Lon</span>
//                   <span className="adc-value">
//                     {formattedLat}, {formattedLon}
//                   </span>
//                 </div>

//                 {/* Live Track button */}
//                 <button 
//                   className="adc-live-track-btn"
//                   onClick={handleLiveTrackClick}
//                 >
//                   Live Track
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* battery trend in a thin strip below map, like “Live Track” area */}
//           <div className="battery-strip">
//             <div className="battery-strip-header">
//               <span>Battery trend (last ~120 samples)</span>
//               <span className="battery-strip-value">
//                 {telemetry.battery.toFixed(1)}%
//               </span>
//             </div>
//             <div className="battery-strip-body">
//               <BatterySparkline data={batteryHistory} />
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Organisation insights blocks */}
//       <section className="insights-section">
//         <h2 className="insights-title">Organisation Insights</h2>
//         <div className="insights-grid">
//           <div className="insight-card">
//             <div className="insight-label">Flight Distance</div>
//             <div className="insight-value">1k km</div>
//             <div className="insight-mini-bar" />
//           </div>
//           <div className="insight-card">
//             <div className="insight-label">Flight Time</div>
//             <div className="insight-value">682 hr</div>
//             <div className="insight-mini-bar" />
//           </div>
//           <div className="insight-card">
//             <div className="insight-label">Flights</div>
//             <div className="insight-value">1216</div>
//             <div className="insight-mini-bar" />
//           </div>
//           <div className="insight-card">
//             <div className="insight-label">Online Drones</div>
//             <div className="insight-value">1 / 26</div>
//             <div className="insight-circle" />
//           </div>
//           <div className="insight-card">
//             <div className="insight-label">Pilots</div>
//             <div className="insight-value">19</div>
//             <div className="insight-avatar" />
//           </div>
//           <div className="insight-card">
//             <div className="insight-label">Reports</div>
//             <div className="insight-value">0</div>
//             <div className="insight-doc" />
//           </div>
//         </div>
//       </section>

//       {/* Live Track full-screen overlay */}
//       {showDroneCard && activeCard && isLiveTrackOpen && (
//         <LiveTrackOverlay
//           droneId={activeDrone as Exclude<DroneId, "view-all">}
//           telemetry={telemetry}
//           track={track}
//           onClose={handleCloseLiveTrack}
//         />
//       )}
//     </div>
//   );
// };

// /* ------------ Live Track Overlay ------------- */

// type LiveTrackOverlayProps = {
//   droneId: Exclude<DroneId, "view-all">;
//   telemetry: Telemetry;
//   track: [number, number][];
//   onClose: () => void;
// };

// const LiveTrackOverlay: React.FC<LiveTrackOverlayProps> = ({
//   droneId,
//   telemetry,
//   track,
//   onClose,
// }) => {
//   const metaByDrone: Record<
//     Exclude<DroneId, "view-all">,
//     { name: string; base: string }
//   > = {
//     hawk: { name: "Hawk Demo", base: "Hawk Base" },
//     divyanshu: { name: "Divyanshu SITL", base: "Virtual Field" },
//     raven: { name: "Internal Testing Raven 2", base: "Raven Pad" },
//     secure: { name: "Secure Drone", base: "HQ Roof" },
//   };

//   const meta = metaByDrone[droneId];

//   return (
//     <div className="live-track-backdrop">
//       <div className="live-track-shell">
//         <button className="live-track-close" onClick={onClose}>
//           ✕
//         </button>

//         <div className="live-track-main">
//           {/* Main video area */}
//           <div className="live-track-video">
//             {/* TODO: Replace this placeholder with your real video player / HLS / WebRTC */}
//             <div className="live-track-placeholder">
//               <div className="live-track-message">
//                 Stream will start playing automatically
//                 <br />
//                 when it is live
//               </div>
//             </div>

//             {/* Drone HUD on top-right of video */}
//             <div className="live-track-hud">
//               <div className="lt-hud-header">
//                 <div className="lt-drone-icon">🛸</div>
//                 <div className="lt-drone-meta">
//                   <div className="lt-drone-name">{meta.name}</div>
//                   <div className="lt-drone-base">{meta.base}</div>
//                 </div>
//               </div>

//               <div className="lt-hud-status-row">
//                 <span className="lt-status-pill lt-status-online">
//                   <span className="lt-status-dot" />
//                   Online
//                 </span>
//                 <span className="lt-status-pill">Not Armed</span>
//                 <span className="lt-status-pill">On Ground</span>
//               </div>

//               <div className="lt-hud-actions">
//                 <button className="lt-action-btn">Takeoff</button>
//                 <button className="lt-action-btn">RTL</button>
//               </div>
//             </div>

//             {/* Mini-map bottom right */}
//             <div className="live-track-mini-map">
//               <LiveMap center={[telemetry.lat, telemetry.lon]} track={track} />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardPage;



// // src/pages/DashboardPage.tsx
// import React, {
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from "react";
// import "./DashboardPage.css";

// import BatterySparkline from "../components/BatterySparkline";
// import LiveMap from "../components/LiveMap";
// import LiveTrackModal from "../components/LiveTrackModal";

// type Telemetry = {
//   lat: number;
//   lon: number;
//   alt: number;
//   battery: number;
//   h_speed?: number;
//   v_speed?: number;
//   mode?: string;
// };

// type DroneId = "view-all" | "hawk" | "divyanshu" | "raven" | "secure";

// const WS_URL =
//   (import.meta as any).env.VITE_WS_URL ?? "ws://127.0.0.1:8000/ws/telemetry";

// const DashboardPage: React.FC = () => {
//   // which drone tab is active
//   const [activeDrone, setActiveDrone] = useState<DroneId>("view-all");

//   // latest telemetry (from WS or fallback)
//   const [telemetry, setTelemetry] = useState<Telemetry>({
//     lat: 12.9716,
//     lon: 77.5946,
//     alt: 0,
//     battery: 69.3,
//     h_speed: 0,
//     v_speed: 0,
//     mode: "IDLE",
//   });

//   // keep a ref in sync so WS fallback doesn't use stale telemetry
//   const telemetryRef = useRef<Telemetry>(telemetry);
//   useEffect(() => {
//     telemetryRef.current = telemetry;
//   }, [telemetry]);

//   // simple battery history for the sparkline
//   const [batteryHistory, setBatteryHistory] = useState<
//     { ts: number; value: number }[]
//   >([]);

//   const [wsStatus, setWsStatus] = useState<
//     "connecting" | "connected" | "disconnected" | "error"
//   >("connecting");

//   // track of positions for the map polyline
//   const [track, setTrack] = useState<[number, number][]>([]);

//   // live track modal open/close
//   const [isLiveTrackOpen, setIsLiveTrackOpen] = useState(false);

//   // ---- WebSocket hook ----
//   useEffect(() => {
//     let ws: WebSocket | null = null;
//     let reconnectTimer: number | null = null;
//     let mounted = true;

//     const connect = () => {
//       setWsStatus("connecting");
//       try {
//         ws = new WebSocket(WS_URL);
//       } catch (e) {
//         console.error("WS create failed", e);
//         setWsStatus("error");
//         return;
//       }

//       ws.onopen = () => {
//         if (!mounted) return;
//         setWsStatus("connected");
//       };

//       ws.onmessage = (event) => {
//         if (!mounted) return;

//         let raw: any;
//         try {
//           raw = JSON.parse(event.data);
//         } catch {
//           try {
//             const fixed = ("" + event.data).replace(/'/g, '"');
//             raw = JSON.parse(fixed);
//           } catch {
//             console.warn("Telemetry parse failed:", event.data);
//             return;
//           }
//         }

//         const last = telemetryRef.current;

//         const next: Telemetry = {
//           lat: Number(raw.lat ?? last.lat),
//           lon: Number(raw.lon ?? last.lon),
//           alt: Number(raw.alt ?? last.alt),
//           battery: Number(raw.battery ?? last.battery),
//           h_speed: Number(raw.h_speed ?? last.h_speed ?? 0),
//           v_speed: Number(raw.v_speed ?? last.v_speed ?? 0),
//           mode: String(raw.mode ?? last.mode ?? "UNKNOWN"),
//         };

//         setTelemetry(next);
//         setBatteryHistory((prev) =>
//           [...prev, { ts: Date.now() / 1000, value: next.battery }].slice(-120)
//         );
//         setTrack((prev) => [...prev, [next.lat, next.lon]].slice(-500));
//       };

//       ws.onerror = () => {
//         if (!mounted) return;
//         setWsStatus("error");
//       };

//       ws.onclose = () => {
//         if (!mounted) return;
//         setWsStatus("disconnected");
//         reconnectTimer = window.setTimeout(connect, 2000);
//       };
//     };

//     connect();

//     return () => {
//       mounted = false;
//       if (reconnectTimer !== null) window.clearTimeout(reconnectTimer);
//       if (ws && ws.readyState === WebSocket.OPEN) ws.close();
//     };
//   }, []);

//   // derived values for display
//   const wsLabel = useMemo(() => {
//     switch (wsStatus) {
//       case "connecting":
//         return "Connecting…";
//       case "connected":
//         return "Live telemetry";
//       case "disconnected":
//         return "Disconnected";
//       case "error":
//         return "Error";
//       default:
//         return "";
//     }
//   }, [wsStatus]);

//   const formattedLat = telemetry.lat.toFixed(5);
//   const formattedLon = telemetry.lon.toFixed(5);

//   // card data for each drone tab (demo values)
//   const droneCards: Record<
//     Exclude<DroneId, "view-all">,
//     {
//       name: string;
//       mission: string;
//       home: string;
//     }
//   > = {
//     hawk: {
//       name: "Hawk Demo",
//       mission: "Recon",
//       home: "Hawk Base",
//     },
//     divyanshu: {
//       name: "Divyanshu SITL",
//       mission: "Simulation",
//       home: "Virtual Field",
//     },
//     raven: {
//       name: "Internal Testing Raven 2",
//       mission: "Test Flight",
//       home: "Raven Pad",
//     },
//     secure: {
//       name: "Secure Drone",
//       mission: "Perimeter Patrol",
//       home: "HQ Roof",
//     },
//   };

//   const showDroneCard = activeDrone !== "view-all";
//   const activeCard =
//     activeDrone !== "view-all" ? droneCards[activeDrone] : undefined;

//   return (
//     <div className="dash-root">
//       {/* Top header */}
//       <header className="dash-header">
//         <div>
//           <h1 className="dash-title">Dashboard</h1>
//           <div className="dash-subtitle">
//             VyomGarud • Fleet overview &amp; live telemetry
//           </div>
//         </div>

//         <div className="dash-header-right">
//           <div className={`ws-pill ws-${wsStatus}`}>
//             <span className="ws-dot" />
//             <span className="ws-label">{wsLabel}</span>
//           </div>
//         </div>
//       </header>

//       {/* Live map section */}
//       <section className="dash-map-section">
//         {/* Drone tabs row */}
//         <div className="drone-tabs">
//           <button
//             className={
//               activeDrone === "view-all"
//                 ? "drone-tab drone-tab-active"
//                 : "drone-tab"
//             }
//             onClick={() => setActiveDrone("view-all")}
//           >
//             View All
//           </button>
//           <button
//             className={
//               activeDrone === "hawk" ? "drone-tab drone-tab-active" : "drone-tab"
//             }
//             onClick={() => setActiveDrone("hawk")}
//           >
//             Hawk Demo
//           </button>
//           <button
//             className={
//               activeDrone === "divyanshu"
//                 ? "drone-tab drone-tab-active"
//                 : "drone-tab"
//             }
//             onClick={() => setActiveDrone("divyanshu")}
//           >
//             Divyanshu SITL
//           </button>
//           <button
//             className={
//               activeDrone === "raven"
//                 ? "drone-tab drone-tab-active"
//                 : "drone-tab"
//             }
//             onClick={() => setActiveDrone("raven")}
//           >
//             Internal Testing Raven 2
//           </button>
//           <button
//             className={
//               activeDrone === "secure"
//                 ? "drone-tab drone-tab-active"
//                 : "drone-tab"
//             }
//             onClick={() => setActiveDrone("secure")}
//           >
//             Secure Drone
//           </button>
//         </div>

//         {/* Map card */}
//         <div className="map-card">
//           <div className="map-card-header">
//             <div>
//               <div className="map-title">Live map</div>
//               <div className="map-subtitle">
//                 Real-time drone positions &amp; mission paths
//               </div>
//             </div>
//             <div className="map-tag">Telemetry-linked</div>
//           </div>

//           <div className="map-card-body">
//             <div className="map-container-shell">
//               <LiveMap center={[telemetry.lat, telemetry.lon]} track={track} />
//             </div>

//             {showDroneCard && activeCard && (
//               <div className="active-drone-card">
//                 <div className="adc-title">Active drone</div>
//                 <div className="adc-name">{activeCard.name}</div>

//                 <div className="adc-row">
//                   <span className="adc-label">Mode</span>
//                   <span className="adc-value">{telemetry.mode ?? "—"}</span>
//                 </div>
//                 <div className="adc-row">
//                   <span className="adc-label">Altitude</span>
//                   <span className="adc-value">
//                     {telemetry.alt.toFixed(1)} m
//                   </span>
//                 </div>
//                 <div className="adc-row">
//                   <span className="adc-label">H-speed</span>
//                   <span className="adc-value">
//                     {(telemetry.h_speed ?? 0).toFixed(1)} m/s
//                   </span>
//                 </div>
//                 <div className="adc-row">
//                   <span className="adc-label">V-speed</span>
//                   <span className="adc-value">
//                     {(telemetry.v_speed ?? 0).toFixed(1)} m/s
//                   </span>
//                 </div>
//                 <div className="adc-row">
//                   <span className="adc-label">Battery</span>
//                   <span className="adc-value">
//                     {telemetry.battery.toFixed(1)}%
//                   </span>
//                 </div>
//                 <div className="adc-row">
//                   <span className="adc-label">Home</span>
//                   <span className="adc-value">{activeCard.home}</span>
//                 </div>
//                 <div className="adc-row">
//                   <span className="adc-label">Lat / Lon</span>
//                   <span className="adc-value">
//                     {formattedLat}, {formattedLon}
//                   </span>
//                 </div>

//                 {/* Live Track button */}
//                 <button
//                   className="adc-live-track-btn"
//                   onClick={() => setIsLiveTrackOpen(true)}
//                 >
//                   Live Track
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* battery trend in a thin strip below map */}
//           <div className="battery-strip">
//             <div className="battery-strip-header">
//               <span>Battery trend (last ~120 samples)</span>
//               <span className="battery-strip-value">
//                 {telemetry.battery.toFixed(1)}%
//               </span>
//             </div>
//             <div className="battery-strip-body">
//               <BatterySparkline data={batteryHistory} />
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Organisation insights blocks */}
//       <section className="insights-section">
//         <h2 className="insights-title">Organisation Insights</h2>
//         <div className="insights-grid">
//           <div className="insight-card">
//             <div className="insight-label">Flight Distance</div>
//             <div className="insight-value">1k km</div>
//             <div className="insight-mini-bar" />
//           </div>
//           <div className="insight-card">
//             <div className="insight-label">Flight Time</div>
//             <div className="insight-value">682 hr</div>
//             <div className="insight-mini-bar" />
//           </div>
//           <div className="insight-card">
//             <div className="insight-label">Flights</div>
//             <div className="insight-value">1216</div>
//             <div className="insight-mini-bar" />
//           </div>
//           <div className="insight-card">
//             <div className="insight-label">Online Drones</div>
//             <div className="insight-value">1 / 26</div>
//             <div className="insight-circle" />
//           </div>
//           <div className="insight-card">
//             <div className="insight-label">Pilots</div>
//             <div className="insight-value">19</div>
//             <div className="insight-avatar" />
//           </div>
//           <div className="insight-card">
//             <div className="insight-label">Reports</div>
//             <div className="insight-value">0</div>
//             <div className="insight-doc" />
//           </div>
//         </div>
//       </section>

//       {/* Live Track full-screen modal */}
//       <LiveTrackModal
//         isOpen={isLiveTrackOpen}
//         onClose={() => setIsLiveTrackOpen(false)}
//         droneName={activeCard?.name ?? "VyomGarud Demo"}
//         homeLabel={activeCard?.home ?? "Demo Pad"}
//         center={[telemetry.lat, telemetry.lon]}
//         track={track}
//       />
//     </div>
//   );
// };

// export default DashboardPage;




// // src/pages/DashboardPage.tsx
// import React, { useEffect, useMemo, useState } from "react";
// import "./DashboardPage.css";
// import BatterySparkline from "../components/BatterySparkline";
// import LiveMap from "../components/LiveMap";
// import LiveTrackOverlay from "../components/LiveTrackOverlay";

// type Telemetry = {
//   lat: number;
//   lon: number;
//   alt: number;
//   battery: number;
//   h_speed?: number;
//   v_speed?: number;
//   mode?: string;
// };

// type DroneId = "view-all" | "hawk" | "divyanshu" | "raven" | "secure";

// const WS_URL =
//   (import.meta as any).env.VITE_WS_URL ?? "ws://127.0.0.1:8000/ws/telemetry";

// // fill these with your real stream URLs / viewer URLs
// const LIVE_STREAM_URLS: Record<Exclude<DroneId, "view-all">, string> = {
//   hawk:
//     (import.meta as any).env.VITE_HAWK_STREAM_URL ??
//     "https://example.com/streams/hawk-demo.m3u8",
//   divyanshu:
//     (import.meta as any).env.VITE_DIVYANSHU_STREAM_URL ??
//     "https://example.com/streams/divyanshu-sitl.m3u8",
//   raven:
//     (import.meta as any).env.VITE_RAVEN_STREAM_URL ??
//     "https://example.com/streams/raven-2.m3u8",
//   secure:
//     (import.meta as any).env.VITE_SECURE_STREAM_URL ??
//     "https://example.com/streams/secure-drone.m3u8",
// };

// const DashboardPage: React.FC = () => {
//   const [activeDrone, setActiveDrone] = useState<DroneId>("view-all");

//   const [telemetry, setTelemetry] = useState<Telemetry>({
//     lat: 12.9716,
//     lon: 77.5946,
//     alt: 0,
//     battery: 69.3,
//     h_speed: 0,
//     v_speed: 0,
//     mode: "IDLE",
//   });

//   const [batteryHistory, setBatteryHistory] = useState<
//     { ts: number; value: number }[]
//   >([]);

//   const [wsStatus, setWsStatus] = useState<
//     "connecting" | "connected" | "disconnected" | "error"
//   >("connecting");

//   const [track, setTrack] = useState<[number, number][]>([]);

//   // which drone is currently in "Live Track" full-screen view
//   const [liveTrackDrone, setLiveTrackDrone] =
//     useState<Exclude<DroneId, "view-all"> | null>(null);

//   // --- WebSocket telemetry ---
//   useEffect(() => {
//     let ws: WebSocket | null = null;
//     let reconnectTimer: number | null = null;
//     let mounted = true;

//     const connect = () => {
//       setWsStatus("connecting");
//       try {
//         ws = new WebSocket(WS_URL);
//       } catch (e) {
//         console.error("WS create failed", e);
//         setWsStatus("error");
//         return;
//       }

//       ws.onopen = () => {
//         if (!mounted) return;
//         setWsStatus("connected");
//       };

//       ws.onmessage = (event) => {
//         if (!mounted) return;

//         let raw: any;
//         try {
//           raw = JSON.parse(event.data);
//         } catch {
//           try {
//             const fixed = ("" + event.data).replace(/'/g, '"');
//             raw = JSON.parse(fixed);
//           } catch {
//             console.warn("Telemetry parse failed:", event.data);
//             return;
//           }
//         }

//         setTelemetry((prev) => {
//           const next: Telemetry = {
//             lat: Number(raw.lat ?? prev.lat),
//             lon: Number(raw.lon ?? prev.lon),
//             alt: Number(raw.alt ?? prev.alt),
//             battery: Number(raw.battery ?? prev.battery),
//             h_speed: Number(raw.h_speed ?? prev.h_speed ?? 0),
//             v_speed: Number(raw.v_speed ?? prev.v_speed ?? 0),
//             mode: String(raw.mode ?? prev.mode ?? "UNKNOWN"),
//           };

//           setBatteryHistory((hist) =>
//             [...hist, { ts: Date.now() / 1000, value: next.battery }].slice(-120)
//           );
//           setTrack((oldTrack) =>
//             [...oldTrack, [next.lat, next.lon] as [number, number]].slice(-500)
//           );

//           return next;
//         });
//       };

//       ws.onerror = () => {
//         if (!mounted) return;
//         setWsStatus("error");
//       };

//       ws.onclose = () => {
//         if (!mounted) return;
//         setWsStatus("disconnected");
//         reconnectTimer = window.setTimeout(connect, 2000);
//       };
//     };

//     connect();

//     return () => {
//       mounted = false;
//       if (reconnectTimer !== null) window.clearTimeout(reconnectTimer);
//       if (ws && ws.readyState === WebSocket.OPEN) ws.close();
//     };
//   }, []);

//   const wsLabel = useMemo(() => {
//     switch (wsStatus) {
//       case "connecting":
//         return "Connecting…";
//       case "connected":
//         return "Live telemetry";
//       case "disconnected":
//         return "Disconnected";
//       case "error":
//         return "Error";
//       default:
//         return "";
//     }
//   }, [wsStatus]);

//   const formattedLat = telemetry.lat.toFixed(5);
//   const formattedLon = telemetry.lon.toFixed(5);

//   const droneCards: Record<
//     Exclude<DroneId, "view-all">,
//     {
//       name: string;
//       mission: string;
//       home: string;
//     }
//   > = {
//     hawk: {
//       name: "Hawk Demo",
//       mission: "Recon",
//       home: "Hawk Base",
//     },
//     divyanshu: {
//       name: "Divyanshu SITL",
//       mission: "Simulation",
//       home: "Virtual Field",
//     },
//     raven: {
//       name: "Internal Testing Raven 2",
//       mission: "Test Flight",
//       home: "Raven Pad",
//     },
//     secure: {
//       name: "Secure Drone",
//       mission: "Perimeter Patrol",
//       home: "HQ Roof",
//     },
//   };

//   const showDroneCard = activeDrone !== "view-all";
//   const activeCard =
//     activeDrone !== "view-all" ? droneCards[activeDrone] : undefined;

//   const handleLiveTrackClick = () => {
//     if (activeDrone === "view-all") return;
//     setLiveTrackDrone(activeDrone);
//   };

//   return (
//     <div className="dash-root">
//       {/* HEADER */}
//       <header className="dash-header">
//         <div>
//           <h1 className="dash-title">Dashboard</h1>
//           <div className="dash-subtitle">
//             VyomGarud • Fleet overview &amp; live telemetry
//           </div>
//         </div>

//         <div className="dash-header-right">
//           <div className={`ws-pill ws-${wsStatus}`}>
//             <span className="ws-dot" />
//             <span className="ws-label">{wsLabel}</span>
//           </div>
//         </div>
//       </header>

//       {/* LIVE MAP CARD */}
//       <section className="dash-map-section">
//         {/* Tabs */}
//         <div className="drone-tabs">
//           <button
//             className={
//               activeDrone === "view-all"
//                 ? "drone-tab drone-tab-active"
//                 : "drone-tab"
//             }
//             onClick={() => setActiveDrone("view-all")}
//           >
//             View All
//           </button>
//           <button
//             className={
//               activeDrone === "hawk" ? "drone-tab drone-tab-active" : "drone-tab"
//             }
//             onClick={() => setActiveDrone("hawk")}
//           >
//             Hawk Demo
//           </button>
//           <button
//             className={
//               activeDrone === "divyanshu"
//                 ? "drone-tab drone-tab-active"
//                 : "drone-tab"
//             }
//             onClick={() => setActiveDrone("divyanshu")}
//           >
//             Divyanshu SITL
//           </button>
//           <button
//             className={
//               activeDrone === "raven"
//                 ? "drone-tab drone-tab-active"
//                 : "drone-tab"
//             }
//             onClick={() => setActiveDrone("raven")}
//           >
//             Internal Testing Raven 2
//           </button>
//           <button
//             className={
//               activeDrone === "secure"
//                 ? "drone-tab drone-tab-active"
//                 : "drone-tab"
//             }
//             onClick={() => setActiveDrone("secure")}
//           >
//             Secure Drone
//           </button>
//         </div>

//         {/* Map + Active drone card */}
//         <div className="map-card">
//           <div className="map-card-header">
//             <div>
//               <div className="map-title">Live map</div>
//               <div className="map-subtitle">
//                 Real-time drone positions &amp; mission paths
//               </div>
//             </div>
//             <div className="map-tag">Telemetry-linked</div>
//           </div>

//           <div className="map-card-body">
//             <div className="map-container-shell">
//               <LiveMap center={[telemetry.lat, telemetry.lon]} track={track} />
//             </div>

//             {showDroneCard && activeCard && (
//               <div className="active-drone-card">
//                 <div className="adc-title">Active drone</div>
//                 <div className="adc-name">{activeCard.name}</div>

//                 <div className="adc-row">
//                   <span className="adc-label">Mode</span>
//                   <span className="adc-value">{telemetry.mode ?? "—"}</span>
//                 </div>
//                 <div className="adc-row">
//                   <span className="adc-label">Altitude</span>
//                   <span className="adc-value">
//                     {telemetry.alt.toFixed(1)} m
//                   </span>
//                 </div>
//                 <div className="adc-row">
//                   <span className="adc-label">H-speed</span>
//                   <span className="adc-value">
//                     {(telemetry.h_speed ?? 0).toFixed(1)} m/s
//                   </span>
//                 </div>
//                 <div className="adc-row">
//                   <span className="adc-label">V-speed</span>
//                   <span className="adc-value">
//                     {(telemetry.v_speed ?? 0).toFixed(1)} m/s
//                   </span>
//                 </div>
//                 <div className="adc-row">
//                   <span className="adc-label">Battery</span>
//                   <span className="adc-value">
//                     {telemetry.battery.toFixed(1)}%
//                   </span>
//                 </div>
//                 <div className="adc-row">
//                   <span className="adc-label">Home</span>
//                   <span className="adc-value">{activeCard.home}</span>
//                 </div>
//                 <div className="adc-row">
//                   <span className="adc-label">Lat / Lon</span>
//                   <span className="adc-value">
//                     {formattedLat}, {formattedLon}
//                   </span>
//                 </div>

//                 <button
//                   className="live-track-btn"
//                   onClick={handleLiveTrackClick}
//                 >
//                   Live Track
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Battery strip */}
//           <div className="battery-strip">
//             <div className="battery-strip-header">
//               <span>Battery trend (last ~120 samples)</span>
//               <span className="battery-strip-value">
//                 {telemetry.battery.toFixed(1)}%
//               </span>
//             </div>
//             <div className="battery-strip-body">
//               <BatterySparkline data={batteryHistory} />
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ORG INSIGHTS */}
//       <section className="insights-section">
//         <h2 className="insights-title">Organisation Insights</h2>
//         <div className="insights-grid">
//           <div className="insight-card">
//             <div className="insight-label">Flight Distance</div>
//             <div className="insight-value">1k km</div>
//             <div className="insight-mini-bar" />
//           </div>
//           <div className="insight-card">
//             <div className="insight-label">Flight Time</div>
//             <div className="insight-value">682 hr</div>
//             <div className="insight-mini-bar" />
//           </div>
//           <div className="insight-card">
//             <div className="insight-label">Flights</div>
//             <div className="insight-value">1216</div>
//             <div className="insight-mini-bar" />
//           </div>
//           <div className="insight-card">
//             <div className="insight-label">Online Drones</div>
//             <div className="insight-value">1 / 26</div>
//             <div className="insight-circle" />
//           </div>
//           <div className="insight-card">
//             <div className="insight-label">Pilots</div>
//             <div className="insight-value">19</div>
//             <div className="insight-avatar" />
//           </div>
//           <div className="insight-card">
//             <div className="insight-label">Reports</div>
//             <div className="insight-value">0</div>
//             <div className="insight-doc" />
//           </div>
//         </div>
//       </section>

//       {/* FULL SCREEN LIVE TRACK OVERLAY */}
//       <LiveTrackOverlay
//         open={liveTrackDrone !== null}
//         onClose={() => setLiveTrackDrone(null)}
//         droneInfo={
//           liveTrackDrone ? droneCards[liveTrackDrone] : undefined
//         }
//         streamUrl={liveTrackDrone ? LIVE_STREAM_URLS[liveTrackDrone] : ""}
//         telemetry={telemetry}
//         track={track}
//       />
//     </div>
//   );
// };

// export default DashboardPage;




// // src/pages/DashboardPage.tsx
// import React, { useEffect, useMemo, useState } from "react";
// import "./DashboardPage.css";
// import BatterySparkline from "../components/BatterySparkline";
// import LiveMap from "../components/LiveMap";

// type Telemetry = {
//   lat: number;
//   lon: number;
//   alt: number;
//   battery: number;
//   h_speed?: number;
//   v_speed?: number;
//   mode?: string;
// };

// type DroneId = "view-all" | "hawk" | "divyanshu" | "raven" | "secure";

// const WS_URL =
//   (import.meta as any).env.VITE_WS_URL ?? "ws://127.0.0.1:8000/ws/telemetry";

// const DashboardPage: React.FC = () => {
//   // which drone tab is active
//   const [activeDrone, setActiveDrone] = useState<DroneId>("view-all");

//   // latest telemetry
//   const [telemetry, setTelemetry] = useState<Telemetry>({
//     lat: 12.9716,
//     lon: 77.5946,
//     alt: 0,
//     battery: 69.3,
//     h_speed: 0,
//     v_speed: 0,
//     mode: "IDLE",
//   });

//   // simple battery history for the sparkline
//   const [batteryHistory, setBatteryHistory] = useState<
//     { ts: number; value: number }[]
//   >([]);

//   const [wsStatus, setWsStatus] = useState<
//     "connecting" | "connected" | "disconnected" | "error"
//   >("connecting");

//   // track of positions for the map polyline
//   const [track, setTrack] = useState<[number, number][]>([]);

//   // ---------- Live Track overlay state ----------
//   const [isLiveTrackOpen, setIsLiveTrackOpen] = useState(false);
//   const [liveTrackDrone, setLiveTrackDrone] =
//     useState<Exclude<DroneId, "view-all"> | null>(null);

//   // intro phase: first show text screen, then close-up view
//   const [isLiveTrackIntro, setIsLiveTrackIntro] = useState(false);

//   // ---------- WebSocket hook ----------
//   useEffect(() => {
//     let ws: WebSocket | null = null;
//     let reconnectTimer: number | null = null;
//     let mounted = true;

//     const connect = () => {
//       setWsStatus("connecting");
//       try {
//         ws = new WebSocket(WS_URL);
//       } catch (e) {
//         console.error("WS create failed", e);
//         setWsStatus("error");
//         return;
//       }

//       ws.onopen = () => {
//         if (!mounted) return;
//         setWsStatus("connected");
//       };

//       ws.onmessage = (event) => {
//         if (!mounted) return;

//         let raw: any;
//         try {
//           raw = JSON.parse(event.data);
//         } catch {
//           try {
//             const fixed = ("" + event.data).replace(/'/g, '"');
//             raw = JSON.parse(fixed);
//           } catch {
//             console.warn("Telemetry parse failed:", event.data);
//             return;
//           }
//         }

//         setTelemetry((prev) => {
//           const next: Telemetry = {
//             lat: Number(raw.lat ?? prev.lat),
//             lon: Number(raw.lon ?? prev.lon),
//             alt: Number(raw.alt ?? prev.alt),
//             battery: Number(raw.battery ?? prev.battery),
//             h_speed: Number(raw.h_speed ?? prev.h_speed ?? 0),
//             v_speed: Number(raw.v_speed ?? prev.v_speed ?? 0),
//             mode: String(raw.mode ?? prev.mode ?? "UNKNOWN"),
//           };

//           setBatteryHistory((hist) =>
//             [...hist, { ts: Date.now() / 1000, value: next.battery }].slice(
//               -120
//             )
//           );
//           setTrack((t) => [...t, [next.lat, next.lon]].slice(-500));

//           return next;
//         });
//       };

//       ws.onerror = () => {
//         if (!mounted) return;
//         setWsStatus("error");
//       };

//       ws.onclose = () => {
//         if (!mounted) return;
//         setWsStatus("disconnected");
//         reconnectTimer = window.setTimeout(connect, 2000);
//       };
//     };

//     connect();

//     return () => {
//       mounted = false;
//       if (reconnectTimer !== null) window.clearTimeout(reconnectTimer);
//       if (ws && ws.readyState === WebSocket.OPEN) ws.close();
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // derived values for display
//   const wsLabel = useMemo(() => {
//     switch (wsStatus) {
//       case "connecting":
//         return "Connecting…";
//       case "connected":
//         return "Live telemetry";
//       case "disconnected":
//         return "Disconnected";
//       case "error":
//         return "Error";
//       default:
//         return "";
//     }
//   }, [wsStatus]);

//   const formattedLat = telemetry.lat.toFixed(5);
//   const formattedLon = telemetry.lon.toFixed(5);

//   // card + livetrack config for each drone tab (demo values)
//   const droneCards: Record<
//     Exclude<DroneId, "view-all">,
//     {
//       name: string;
//       mission: string;
//       home: string;
//       // you can plug real stream URLs / preview frames here later
//       streamUrl?: string;
//       previewImage?: string;
//     }
//   > = {
//     hawk: {
//       name: "Hawk Demo",
//       mission: "Recon",
//       home: "Hawk Base",
//       streamUrl: "", // put real live URL here when you have it
//       previewImage: "/demo-hawk-frame.jpg", // drop an image in public/ with this name
//     },
//     divyanshu: {
//       name: "Divyanshu SITL",
//       mission: "Simulation",
//       home: "Virtual Field",
//       streamUrl: "",
//       previewImage: "/demo-divyanshu-frame.jpg",
//     },
//     raven: {
//       name: "Internal Testing Raven 2",
//       mission: "Test Flight",
//       home: "Raven Pad",
//       streamUrl: "",
//       previewImage: "/demo-raven-frame.jpg",
//     },
//     secure: {
//       name: "Secure Drone",
//       mission: "Perimeter Patrol",
//       home: "HQ Roof",
//       streamUrl: "",
//       previewImage: "/demo-secure-frame.jpg",
//     },
//   };

//   const showDroneCard = activeDrone !== "view-all";
//   const activeCard =
//     activeDrone !== "view-all" ? droneCards[activeDrone] : undefined;

//   // when Live Track button is clicked
//   const openLiveTrack = () => {
//     if (activeDrone === "view-all") return;
//     setLiveTrackDrone(activeDrone);
//     setIsLiveTrackOpen(true);
//     setIsLiveTrackIntro(true); // first show text screen
//   };

//   const closeLiveTrack = () => {
//     setIsLiveTrackOpen(false);
//     setIsLiveTrackIntro(false);
//     setLiveTrackDrone(null);
//   };

//   // timer to switch from intro text -> close-up view
//   useEffect(() => {
//     if (!isLiveTrackOpen || !isLiveTrackIntro) return;

//     const id = window.setTimeout(() => {
//       setIsLiveTrackIntro(false);
//     }, 2000); // ~2 seconds of "Stream will start..." like original UI

//     return () => window.clearTimeout(id);
//   }, [isLiveTrackOpen, isLiveTrackIntro]);

//   // helper for live-track overlay
//   const liveDrone =
//     liveTrackDrone != null ? droneCards[liveTrackDrone] : null;

//   return (
//     <div className="dash-root">
//       {/* Top header */}
//       <header className="dash-header">
//         <div>
//           <h1 className="dash-title">Dashboard</h1>
//           <div className="dash-subtitle">
//             VyomGarud • Fleet overview &amp; live telemetry
//           </div>
//         </div>

//         <div className="dash-header-right">
//           <div className={`ws-pill ws-${wsStatus}`}>
//             <span className="ws-dot" />
//             <span className="ws-label">{wsLabel}</span>
//           </div>
//         </div>
//       </header>

//       {/* Live map section */}
//       <section className="dash-map-section">
//         {/* Drone tabs row */}
//         <div className="drone-tabs">
//           <button
//             className={
//               activeDrone === "view-all"
//                 ? "drone-tab drone-tab-active"
//                 : "drone-tab"
//             }
//             onClick={() => setActiveDrone("view-all")}
//           >
//             View All
//           </button>
//           <button
//             className={
//               activeDrone === "hawk" ? "drone-tab drone-tab-active" : "drone-tab"
//             }
//             onClick={() => setActiveDrone("hawk")}
//           >
//             Hawk Demo
//           </button>
//           <button
//             className={
//               activeDrone === "divyanshu"
//                 ? "drone-tab drone-tab-active"
//                 : "drone-tab"
//             }
//             onClick={() => setActiveDrone("divyanshu")}
//           >
//             Divyanshu SITL
//           </button>
//           <button
//             className={
//               activeDrone === "raven"
//                 ? "drone-tab drone-tab-active"
//                 : "drone-tab"
//             }
//             onClick={() => setActiveDrone("raven")}
//           >
//             Internal Testing Raven 2
//           </button>
//           <button
//             className={
//               activeDrone === "secure"
//                 ? "drone-tab drone-tab-active"
//                 : "drone-tab"
//             }
//             onClick={() => setActiveDrone("secure")}
//           >
//             Secure Drone
//           </button>
//         </div>

//         {/* Map card */}
//         <div className="map-card">
//           <div className="map-card-header">
//             <div>
//               <div className="map-title">Live map</div>
//               <div className="map-subtitle">
//                 Real-time drone positions &amp; mission paths
//               </div>
//             </div>
//             <div className="map-tag">Telemetry-linked</div>
//           </div>

//           <div className="map-card-body">
//             <div className="map-container-shell">
//               <LiveMap center={[telemetry.lat, telemetry.lon]} track={track} />
//             </div>

//             {showDroneCard && activeCard && (
//               <div className="active-drone-card">
//                 <div className="adc-title">Active drone</div>
//                 <div className="adc-name">{activeCard.name}</div>

//                 <div className="adc-row">
//                   <span className="adc-label">Mode</span>
//                   <span className="adc-value">{telemetry.mode ?? "—"}</span>
//                 </div>
//                 <div className="adc-row">
//                   <span className="adc-label">Altitude</span>
//                   <span className="adc-value">
//                     {telemetry.alt.toFixed(1)} m
//                   </span>
//                 </div>
//                 <div className="adc-row">
//                   <span className="adc-label">H-speed</span>
//                   <span className="adc-value">
//                     {(telemetry.h_speed ?? 0).toFixed(1)} m/s
//                   </span>
//                 </div>
//                 <div className="adc-row">
//                   <span className="adc-label">V-speed</span>
//                   <span className="adc-value">
//                     {(telemetry.v_speed ?? 0).toFixed(1)} m/s
//                   </span>
//                 </div>
//                 <div className="adc-row">
//                   <span className="adc-label">Battery</span>
//                   <span className="adc-value">
//                     {telemetry.battery.toFixed(1)}%
//                   </span>
//                 </div>
//                 <div className="adc-row">
//                   <span className="adc-label">Home</span>
//                   <span className="adc-value">{activeCard.home}</span>
//                 </div>
//                 <div className="adc-row">
//                   <span className="adc-label">Lat / Lon</span>
//                   <span className="adc-value">
//                     {formattedLat}, {formattedLon}
//                   </span>
//                 </div>

//                 <button className="adc-live-track-btn" onClick={openLiveTrack}>
//                   Live Track
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* battery trend in a thin strip below map */}
//           <div className="battery-strip">
//             <div className="battery-strip-header">
//               <span>Battery trend (last ~120 samples)</span>
//               <span className="battery-strip-value">
//                 {telemetry.battery.toFixed(1)}%
//               </span>
//             </div>
//             <div className="battery-strip-body">
//               <BatterySparkline data={batteryHistory} />
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Organisation insights blocks */}
//       <section className="insights-section">
//         <h2 className="insights-title">Organisation Insights</h2>
//         <div className="insights-grid">
//           <div className="insight-card">
//             <div className="insight-label">Flight Distance</div>
//             <div className="insight-value">1k km</div>
//             <div className="insight-mini-bar" />
//           </div>
//           <div className="insight-card">
//             <div className="insight-label">Flight Time</div>
//             <div className="insight-value">682 hr</div>
//             <div className="insight-mini-bar" />
//           </div>
//           <div className="insight-card">
//             <div className="insight-label">Flights</div>
//             <div className="insight-value">1216</div>
//             <div className="insight-mini-bar" />
//           </div>
//           <div className="insight-card">
//             <div className="insight-label">Online Drones</div>
//             <div className="insight-value">1 / 26</div>
//             <div className="insight-circle" />
//           </div>
//           <div className="insight-card">
//             <div className="insight-label">Pilots</div>
//             <div className="insight-value">19</div>
//             <div className="insight-avatar" />
//           </div>
//           <div className="insight-card">
//             <div className="insight-label">Reports</div>
//             <div className="insight-value">0</div>
//             <div className="insight-doc" />
//           </div>
//         </div>
//       </section>

//       {/* -------- Live Track full-screen overlay -------- */}
//       {isLiveTrackOpen && liveDrone && (
//         <div className="live-track-overlay">
//           <div className="live-track-top-bar">
//             <div className="live-track-title">{liveDrone.name}</div>
//             <div className="live-track-status">
//               <span className="live-track-dot" />
//               <span>Online</span>
//               <button
//                 className="live-track-close-btn"
//                 onClick={closeLiveTrack}
//                 aria-label="Close live track"
//               >
//                 ✕
//               </button>
//             </div>
//           </div>

//           <div className="live-track-main">
//             {isLiveTrackIntro ? (
//               // FIRST SCREEN: only text (like your 3rd image)
//               <div className="live-track-intro-message">
//                 <p>Stream will start playing automatically</p>
//                 <p>when it is live</p>
//               </div>
//             ) : (
//               // SECOND SCREEN: close-up view (video or placeholder frame)
//               <div className="live-track-video-wrapper">
//                 {liveDrone.previewImage ? (
//                   <img
//                     src={liveDrone.previewImage}
//                     alt="Live drone view"
//                     className="live-track-video"
//                   />
//                 ) : (
//                   <div className="live-track-video live-track-video-placeholder" />
//                 )}

//                 <div className="live-track-mini-map">
//                   <LiveMap center={[telemetry.lat, telemetry.lon]} track={track} />
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DashboardPage;


// // src/pages/DashboardPage.tsx
// import React, { useEffect, useMemo, useState } from "react";
// import "./DashboardPage.css";
// import BatterySparkline from "../components/BatterySparkline";
// import LiveMap from "../components/LiveMap";

// type Telemetry = {
//   lat: number;
//   lon: number;
//   alt: number;
//   battery: number;
//   h_speed?: number;
//   v_speed?: number;
//   mode?: string;
// };

// type DroneId = "view-all" | "hawk" | "divyanshu" | "raven" | "secure";

// const WS_URL =
//   (import.meta as any).env.VITE_WS_URL ?? "ws://127.0.0.1:8000/ws/telemetry";

// const DashboardPage: React.FC = () => {
//   // which drone tab is active
//   const [activeDrone, setActiveDrone] = useState<DroneId>("view-all");

//   // latest telemetry (from WS or fallback)
//   const [telemetry, setTelemetry] = useState<Telemetry>({
//     lat: 12.9716,
//     lon: 77.5946,
//     alt: 0,
//     battery: 69.3,
//     h_speed: 0,
//     v_speed: 0,
//     mode: "IDLE",
//   });

//   // simple battery history for the sparkline
//   const [batteryHistory, setBatteryHistory] = useState<
//     { ts: number; value: number }[]
//   >([]);

//   const [wsStatus, setWsStatus] = useState<
//     "connecting" | "connected" | "disconnected" | "error"
//   >("connecting");

//   // track of positions for the map polyline
//   const [track, setTrack] = useState<[number, number][]>([]);

//   // ---- WebSocket hook ----
//   useEffect(() => {
//     let ws: WebSocket | null = null;
//     let reconnectTimer: number | null = null;
//     let mounted = true;

//     const connect = () => {
//       setWsStatus("connecting");
//       try {
//         ws = new WebSocket(WS_URL);
//       } catch (e) {
//         console.error("WS create failed", e);
//         setWsStatus("error");
//         return;
//       }

//       ws.onopen = () => {
//         if (!mounted) return;
//         setWsStatus("connected");
//       };

//       ws.onmessage = (event) => {
//         if (!mounted) return;

//         let raw: any;
//         try {
//           raw = JSON.parse(event.data);
//         } catch {
//           try {
//             const fixed = ("" + event.data).replace(/'/g, '"');
//             raw = JSON.parse(fixed);
//           } catch {
//             console.warn("Telemetry parse failed:", event.data);
//             return;
//           }
//         }

//         setTelemetry((prev) => {
//           const next: Telemetry = {
//             lat: Number(raw.lat ?? prev.lat),
//             lon: Number(raw.lon ?? prev.lon),
//             alt: Number(raw.alt ?? prev.alt),
//             battery: Number(raw.battery ?? prev.battery),
//             h_speed: Number(raw.h_speed ?? prev.h_speed ?? 0),
//             v_speed: Number(raw.v_speed ?? prev.v_speed ?? 0),
//             mode: String(raw.mode ?? prev.mode ?? "UNKNOWN"),
//           };

//           // history & track use the *new* values
//           setBatteryHistory((history) =>
//             [...history, { ts: Date.now() / 1000, value: next.battery }].slice(
//               -120
//             )
//           );
//           setTrack((prevTrack) =>
//             [...prevTrack, [next.lat, next.lon] as [number, number]].slice(-500)
//           );

//           return next;
//         });
//       };

//       ws.onerror = () => {
//         if (!mounted) return;
//         setWsStatus("error");
//       };

//       ws.onclose = () => {
//         if (!mounted) return;
//         setWsStatus("disconnected");
//         reconnectTimer = window.setTimeout(connect, 2000);
//       };
//     };

//     connect();

//     return () => {
//       mounted = false;
//       if (reconnectTimer !== null) window.clearTimeout(reconnectTimer);
//       if (ws && ws.readyState === WebSocket.OPEN) ws.close();
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // derived values for display
//   const wsLabel = useMemo(() => {
//     switch (wsStatus) {
//       case "connecting":
//         return "Connecting…";
//       case "connected":
//         return "Live telemetry";
//       case "disconnected":
//         return "Disconnected";
//       case "error":
//         return "Error";
//       default:
//         return "";
//     }
//   }, [wsStatus]);

//   const formattedLat = telemetry.lat.toFixed(5);
//   const formattedLon = telemetry.lon.toFixed(5);

//   // card data for each drone tab (demo values)
//   const droneCards: Record<
//     Exclude<DroneId, "view-all">,
//     {
//       name: string;
//       mission: string;
//       home: string;
//     }
//   > = {
//     hawk: {
//       name: "Hawk Demo",
//       mission: "Recon",
//       home: "Hawk Base",
//     },
//     divyanshu: {
//       name: "Divyanshu SITL",
//       mission: "Simulation",
//       home: "Virtual Field",
//     },
//     raven: {
//       name: "Internal Testing Raven 2",
//       mission: "Test Flight",
//       home: "Raven Pad",
//     },
//     secure: {
//       name: "Secure Drone",
//       mission: "Perimeter Patrol",
//       home: "HQ Roof",
//     },
//   };

//   const showDroneCard = activeDrone !== "view-all";
//   const activeCard =
//     activeDrone !== "view-all" ? droneCards[activeDrone] : undefined;

//   // ==========================
//   // LIVE-TRACK OVERLAY STATE
//   // ==========================
//   type LiveTrackPhase = "waiting" | "playing";

//   // which drone is currently in live-track (null = overlay closed)
//   const [liveTrackDrone, setLiveTrackDrone] =
//     useState<Exclude<DroneId, "view-all"> | null>(null);

//   // phase inside the overlay (1) waiting text, (2) playing live view
//   const [liveTrackPhase, setLiveTrackPhase] = useState<LiveTrackPhase>(
//     "waiting"
//   );

//   // whenever we open live-track, show the waiting screen first,
//   // then automatically switch to "playing" after ~1.5s
//   useEffect(() => {
//     if (!liveTrackDrone) return;

//     setLiveTrackPhase("waiting");
//     const timer = window.setTimeout(() => {
//       setLiveTrackPhase("playing");
//     }, 1500);

//     return () => window.clearTimeout(timer);
//   }, [liveTrackDrone]);

//   const handleOpenLiveTrack = (id: Exclude<DroneId, "view-all">) => {
//     setLiveTrackDrone(id);
//   };

//   const handleCloseLiveTrack = () => {
//     setLiveTrackDrone(null);
//   };

//   // ==========================
//   // RENDER
//   // ==========================
//   return (
//     <div className="dash-root">
//       {/* Top header */}
//       <header className="dash-header">
//         <div>
//           <h1 className="dash-title">Dashboard</h1>
//           <div className="dash-subtitle">
//             VyomGarud • Fleet overview &amp; live telemetry
//           </div>
//         </div>

//         <div className="dash-header-right">
//           <div className={`ws-pill ws-${wsStatus}`}>
//             <span className="ws-dot" />
//             <span className="ws-label">{wsLabel}</span>
//           </div>
//         </div>
//       </header>

//       {/* Live map section */}
//       <section className="dash-map-section">
//         {/* Drone tabs row */}
//         <div className="drone-tabs">
//           <button
//             className={
//               activeDrone === "view-all"
//                 ? "drone-tab drone-tab-active"
//                 : "drone-tab"
//             }
//             onClick={() => setActiveDrone("view-all")}
//           >
//             View All
//           </button>
//           <button
//             className={
//               activeDrone === "hawk" ? "drone-tab drone-tab-active" : "drone-tab"
//             }
//             onClick={() => setActiveDrone("hawk")}
//           >
//             Hawk Demo
//           </button>
//           <button
//             className={
//               activeDrone === "divyanshu"
//                 ? "drone-tab drone-tab-active"
//                 : "drone-tab"
//             }
//             onClick={() => setActiveDrone("divyanshu")}
//           >
//             Divyanshu SITL
//           </button>
//           <button
//             className={
//               activeDrone === "raven"
//                 ? "drone-tab drone-tab-active"
//                 : "drone-tab"
//             }
//             onClick={() => setActiveDrone("raven")}
//           >
//             Internal Testing Raven 2
//           </button>
//           <button
//             className={
//               activeDrone === "secure"
//                 ? "drone-tab drone-tab-active"
//                 : "drone-tab"
//             }
//             onClick={() => setActiveDrone("secure")}
//           >
//             Secure Drone
//           </button>
//         </div>

//         {/* Map card */}
//         <div className="map-card">
//           <div className="map-card-header">
//             <div>
//               <div className="map-title">Live map</div>
//               <div className="map-subtitle">
//                 Real-time drone positions &amp; mission paths
//               </div>
//             </div>
//             <div className="map-tag">Telemetry-linked</div>
//           </div>

//           <div className="map-card-body">
//             <div className="map-container-shell">
//               <LiveMap center={[telemetry.lat, telemetry.lon]} track={track} />
//             </div>

//             {showDroneCard && activeCard && (
//               <div className="active-drone-card">
//                 <div className="adc-title">Active drone</div>
//                 <div className="adc-name">{activeCard.name}</div>

//                 <div className="adc-row">
//                   <span className="adc-label">Mode</span>
//                   <span className="adc-value">{telemetry.mode ?? "—"}</span>
//                 </div>
//                 <div className="adc-row">
//                   <span className="adc-label">Altitude</span>
//                   <span className="adc-value">
//                     {telemetry.alt.toFixed(1)} m
//                   </span>
//                 </div>
//                 <div className="adc-row">
//                   <span className="adc-label">H-speed</span>
//                   <span className="adc-value">
//                     {(telemetry.h_speed ?? 0).toFixed(1)} m/s
//                   </span>
//                 </div>
//                 <div className="adc-row">
//                   <span className="adc-label">V-speed</span>
//                   <span className="adc-value">
//                     {(telemetry.v_speed ?? 0).toFixed(1)} m/s
//                   </span>
//                 </div>
//                 <div className="adc-row">
//                   <span className="adc-label">Battery</span>
//                   <span className="adc-value">
//                     {telemetry.battery.toFixed(1)}%
//                   </span>
//                 </div>
//                 <div className="adc-row">
//                   <span className="adc-label">Home</span>
//                   <span className="adc-value">{activeCard.home}</span>
//                 </div>
//                 <div className="adc-row">
//                   <span className="adc-label">Lat / Lon</span>
//                   <span className="adc-value">
//                     {formattedLat}, {formattedLon}
//                   </span>
//                 </div>

//                 {/* LIVE TRACK BUTTON */}
//                 <button
//                   className="live-track-button"
//                   onClick={() =>
//                     handleOpenLiveTrack(activeDrone as Exclude<DroneId, "view-all">)
//                   }
//                 >
//                   Live Track
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* battery trend strip */}
//           <div className="battery-strip">
//             <div className="battery-strip-header">
//               <span>Battery trend (last ~120 samples)</span>
//               <span className="battery-strip-value">
//                 {telemetry.battery.toFixed(1)}%
//               </span>
//             </div>
//             <div className="battery-strip-body">
//               <BatterySparkline data={batteryHistory} />
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Organisation insights blocks */}
//       <section className="insights-section">
//         <h2 className="insights-title">Organisation Insights</h2>
//         <div className="insights-grid">
//           <div className="insight-card">
//             <div className="insight-label">Flight Distance</div>
//             <div className="insight-value">1k km</div>
//             <div className="insight-mini-bar" />
//           </div>
//           <div className="insight-card">
//             <div className="insight-label">Flight Time</div>
//             <div className="insight-value">682 hr</div>
//             <div className="insight-mini-bar" />
//           </div>
//           <div className="insight-card">
//             <div className="insight-label">Flights</div>
//             <div className="insight-value">1216</div>
//             <div className="insight-mini-bar" />
//           </div>
//           <div className="insight-card">
//             <div className="insight-label">Online Drones</div>
//             <div className="insight-value">1 / 26</div>
//             <div className="insight-circle" />
//           </div>
//           <div className="insight-card">
//             <div className="insight-label">Pilots</div>
//             <div className="insight-value">19</div>
//             <div className="insight-avatar" />
//           </div>
//           <div className="insight-card">
//             <div className="insight-label">Reports</div>
//             <div className="insight-value">0</div>
//             <div className="insight-doc" />
//           </div>
//         </div>
//       </section>

//       {/* ======================================================
//           FULL-SCREEN LIVE-TRACK OVERLAY
//           (1) waiting screen  ->  (2) live camera layout
//          ====================================================== */}
//       {liveTrackDrone && (
//         <div
//           style={{
//             position: "fixed",
//             inset: 0,
//             zIndex: 9999,
//             backgroundColor: "black",
//             color: "white",
//             fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
//           }}
//         >
//           {/* Top bar: name, status, close */}
//           <div
//             style={{
//               position: "absolute",
//               top: 20,
//               left: 24,
//               right: 24,
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               pointerEvents: "none",
//             }}
//           >
//             <div style={{ pointerEvents: "auto" }}>
//               <div style={{ fontSize: 18, fontWeight: 600 }}>
//                 {droneCards[liveTrackDrone].name}
//               </div>
//               <div style={{ fontSize: 13, opacity: 0.8 }}>Online</div>
//             </div>

//             <button
//               onClick={handleCloseLiveTrack}
//               style={{
//                 pointerEvents: "auto",
//                 border: "none",
//                 borderRadius: 999,
//                 width: 32,
//                 height: 32,
//                 background: "rgba(255,255,255,0.12)",
//                 color: "white",
//                 fontSize: 18,
//                 cursor: "pointer",
//               }}
//             >
//               ×
//             </button>
//           </div>

//           {/* MAIN CONTENT */}
//           {liveTrackPhase === "waiting" ? (
//             // ------- PHASE 1: waiting text in the centre -------
//             <div
//               style={{
//                 height: "100%",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 textAlign: "center",
//                 fontSize: 24,
//                 fontWeight: 500,
//               }}
//             >
//               <div>
//                 <div>Stream will start playing automatically</div>
//                 <div style={{ marginTop: 8 }}>when it is live</div>
//               </div>
//             </div>
//           ) : (
//             // ------- PHASE 2: live camera view -------
//             <div
//               style={{
//                 height: "100%",
//                 display: "flex",
//                 alignItems: "stretch",
//                 justifyContent: "stretch",
//               }}
//             >
//               {/* main "video" area (placeholder – replace with real stream if you have one) */}
//               <div
//                 style={{
//                   flex: 1,
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   paddingInline: 60,
//                 }}
//               >
//                 <div
//                   style={{
//                     width: "100%",
//                     maxWidth: 1400,
//                     aspectRatio: "16 / 9",
//                     backgroundColor: "black",
//                     overflow: "hidden",
//                     borderRadius: 8,
//                     border: "1px solid rgba(255,255,255,0.25)",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                   }}
//                 >
//                   {/* This image is just a placeholder for the live drone camera */}
//                   <img
//                     src="/live-drone-frame.jpg"
//                     alt="Live drone view"
//                     style={{ width: "100%", height: "100%", objectFit: "cover" }}
//                     onError={(e) => {
//                       // fallback: just keep a black frame if image is missing
//                       (e.currentTarget as HTMLImageElement).style.display =
//                         "none";
//                     }}
//                   />
//                 </div>
//               </div>

//               {/* right side telemetry panel */}
//               <div
//                 style={{
//                   width: 280,
//                   paddingTop: 80,
//                   paddingRight: 32,
//                   display: "flex",
//                   flexDirection: "column",
//                   gap: 12,
//                   fontSize: 13,
//                 }}
//               >
//                 <div
//                   style={{
//                     padding: 16,
//                     borderRadius: 12,
//                     background: "rgba(20,20,20,0.9)",
//                     border: "1px solid rgba(255,255,255,0.12)",
//                   }}
//                 >
//                   <div
//                     style={{
//                       fontSize: 14,
//                       fontWeight: 600,
//                       marginBottom: 8,
//                     }}
//                   >
//                     Telemetry
//                   </div>
//                   <div style={{ display: "flex", justifyContent: "space-between" }}>
//                     <span>Mode</span>
//                     <span>{telemetry.mode ?? "—"}</span>
//                   </div>
//                   <div style={{ display: "flex", justifyContent: "space-between" }}>
//                     <span>Altitude</span>
//                     <span>{telemetry.alt.toFixed(1)} m</span>
//                   </div>
//                   <div style={{ display: "flex", justifyContent: "space-between" }}>
//                     <span>H-speed</span>
//                     <span>{(telemetry.h_speed ?? 0).toFixed(1)} m/s</span>
//                   </div>
//                   <div style={{ display: "flex", justifyContent: "space-between" }}>
//                     <span>V-speed</span>
//                     <span>{(telemetry.v_speed ?? 0).toFixed(1)} m/s</span>
//                   </div>
//                   <div style={{ display: "flex", justifyContent: "space-between" }}>
//                     <span>Battery</span>
//                     <span>{telemetry.battery.toFixed(1)}%</span>
//                   </div>
//                   <div style={{ display: "flex", justifyContent: "space-between" }}>
//                     <span>Lat</span>
//                     <span>{formattedLat}</span>
//                   </div>
//                   <div style={{ display: "flex", justifyContent: "space-between" }}>
//                     <span>Lon</span>
//                     <span>{formattedLon}</span>
//                   </div>
//                 </div>
//               </div>

//               {/* bottom-right mini map */}
//               <div
//                 style={{
//                   position: "absolute",
//                   right: 24,
//                   bottom: 24,
//                   width: 260,
//                   height: 180,
//                   borderRadius: 18,
//                   overflow: "hidden",
//                   border: "1px solid rgba(255,255,255,0.4)",
//                 }}
//               >
//                 <LiveMap center={[telemetry.lat, telemetry.lon]} track={track} />
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default DashboardPage;




// // src/pages/DashboardPage.tsx
// import React, { useEffect, useMemo, useState } from "react";
// import "./DashboardPage.css";
// import BatterySparkline from "../components/BatterySparkline";
// import LiveMap from "../components/LiveMap";
// import LiveTrackOverlay from "../components/LiveTrackOverlay";

// type Telemetry = {
//   lat: number;
//   lon: number;
//   alt: number;
//   battery: number;
//   h_speed?: number;
//   v_speed?: number;
//   mode?: string;
// };

// type DroneId = "view-all" | "hawk" | "divyanshu" | "raven" | "secure";

// // WebSocket URL (telemetry)
// const WS_URL =
//   (import.meta as any).env.VITE_WS_URL ?? "ws://127.0.0.1:8000/ws/telemetry";

// // Live video URLs (all can point to local demo video files)
// const LIVE_STREAM_URLS: Record<DroneId, string | undefined> = {
//   "view-all": undefined, // not used for View All
//   hawk:
//     (import.meta as any).env.VITE_HAWK_LIVE_URL || "/assets/hawk-demo.mp4",
//   divyanshu:
//     (import.meta as any).env.VITE_DIVYANSHU_LIVE_URL ||
//     "/assets/divyanshu-demo.mp4",
//   raven:
//     (import.meta as any).env.VITE_RAVEN_LIVE_URL || "/assets/raven-demo.mp4",
//   secure:
//     (import.meta as any).env.VITE_SECURE_LIVE_URL || "/assets/secure-demo.mp4",
// };

// const DashboardPage: React.FC = () => {
//   // which drone tab is active
//   const [activeDrone, setActiveDrone] = useState<DroneId>("view-all");

//   // latest telemetry (from WS or fallback)
//   const [telemetry, setTelemetry] = useState<Telemetry>({
//     lat: 12.9716,
//     lon: 77.5946,
//     alt: 0,
//     battery: 69.3,
//     h_speed: 0,
//     v_speed: 0,
//     mode: "IDLE",
//   });

//   // simple battery history for the sparkline
//   const [batteryHistory, setBatteryHistory] = useState<
//     { ts: number; value: number }[]
//   >([]);

//   const [wsStatus, setWsStatus] = useState<
//     "connecting" | "connected" | "disconnected" | "error"
//   >("connecting");

//   // track of positions for the map polyline
//   const [track, setTrack] = useState<[number, number][]>([]);

//   // Live-track overlay open/close
//   const [liveTrackOpen, setLiveTrackOpen] = useState(false);

//   // ---- WebSocket hook ----
//   useEffect(() => {
//     let ws: WebSocket | null = null;
//     let reconnectTimer: number | null = null;
//     let mounted = true;

//     const connect = () => {
//       setWsStatus("connecting");
//       try {
//         ws = new WebSocket(WS_URL);
//       } catch (e) {
//         console.error("WS create failed", e);
//         setWsStatus("error");
//         return;
//       }

//       ws.onopen = () => {
//         if (!mounted) return;
//         setWsStatus("connected");
//       };

//       ws.onmessage = (event) => {
//         if (!mounted) return;

//         let raw: any;
//         try {
//           raw = JSON.parse(event.data);
//         } catch {
//           try {
//             const fixed = ("" + event.data).replace(/'/g, '"');
//             raw = JSON.parse(fixed);
//           } catch {
//             console.warn("Telemetry parse failed:", event.data);
//             return;
//           }
//         }

//         setTelemetry((prev) => {
//           const next: Telemetry = {
//             lat: Number(raw.lat ?? prev.lat),
//             lon: Number(raw.lon ?? prev.lon),
//             alt: Number(raw.alt ?? prev.alt),
//             battery: Number(raw.battery ?? prev.battery),
//             h_speed: Number(raw.h_speed ?? prev.h_speed ?? 0),
//             v_speed: Number(raw.v_speed ?? prev.v_speed ?? 0),
//             mode: String(raw.mode ?? prev.mode ?? "UNKNOWN"),
//           };

//           // update history + track
//           setBatteryHistory((old) =>
//             [...old, { ts: Date.now() / 1000, value: next.battery }].slice(-120)
//           );
//           setTrack((old) => [...old, [next.lat, next.lon]].slice(-500));

//           return next;
//         });
//       };

//       ws.onerror = () => {
//         if (!mounted) return;
//         setWsStatus("error");
//       };

//       ws.onclose = () => {
//         if (!mounted) return;
//         setWsStatus("disconnected");
//         reconnectTimer = window.setTimeout(connect, 2000);
//       };
//     };

//     connect();

//     return () => {
//       mounted = false;
//       if (reconnectTimer !== null) window.clearTimeout(reconnectTimer);
//       if (ws && ws.readyState === WebSocket.OPEN) ws.close();
//     };
//   }, []);

//   // derived values for display
//   const wsLabel = useMemo(() => {
//     switch (wsStatus) {
//       case "connecting":
//         return "Connecting…";
//       case "connected":
//         return "Live telemetry";
//       case "disconnected":
//         return "Disconnected";
//       case "error":
//         return "Error";
//       default:
//         return "";
//     }
//   }, [wsStatus]);

//   const formattedLat = telemetry.lat.toFixed(5);
//   const formattedLon = telemetry.lon.toFixed(5);

//   // card data for each drone tab (demo values)
//   const droneCards: Record<
//     Exclude<DroneId, "view-all">,
//     {
//       name: string;
//       mission: string;
//       home: string;
//     }
//   > = {
//     hawk: {
//       name: "Hawk Demo",
//       mission: "Recon",
//       home: "Hawk Base",
//     },
//     divyanshu: {
//       name: "Divyanshu SITL",
//       mission: "Simulation",
//       home: "Virtual Field",
//     },
//     raven: {
//       name: "Internal Testing Raven 2",
//       mission: "Test Flight",
//       home: "Raven Pad",
//     },
//     secure: {
//       name: "Secure Drone",
//       mission: "Perimeter Patrol",
//       home: "HQ Roof",
//     },
//   };

//   const showDroneCard = activeDrone !== "view-all";
//   const activeCard =
//     activeDrone !== "view-all" ? droneCards[activeDrone] : undefined;

//   return (
//     <div className="dash-root">
//       {/* Top header */}
//       <header className="dash-header">
//         <div>
//           <h1 className="dash-title">Dashboard</h1>
//           <div className="dash-subtitle">
//             VyomGarud • Fleet overview &amp; live telemetry
//           </div>
//         </div>

//         <div className="dash-header-right">
//           <div className={`ws-pill ws-${wsStatus}`}>
//             <span className="ws-dot" />
//             <span className="ws-label">{wsLabel}</span>
//           </div>
//         </div>
//       </header>

//       {/* Live map section */}
//       <section className="dash-map-section">
//         {/* Drone tabs row */}
//         <div className="drone-tabs">
//           <button
//             className={
//               activeDrone === "view-all"
//                 ? "drone-tab drone-tab-active"
//                 : "drone-tab"
//             }
//             onClick={() => setActiveDrone("view-all")}
//           >
//             View All
//           </button>
//           <button
//             className={
//               activeDrone === "hawk" ? "drone-tab drone-tab-active" : "drone-tab"
//             }
//             onClick={() => setActiveDrone("hawk")}
//           >
//             Hawk Demo
//           </button>
//           <button
//             className={
//               activeDrone === "divyanshu"
//                 ? "drone-tab drone-tab-active"
//                 : "drone-tab"
//             }
//             onClick={() => setActiveDrone("divyanshu")}
//           >
//             Divyanshu SITL
//           </button>
//           <button
//             className={
//               activeDrone === "raven"
//                 ? "drone-tab drone-tab-active"
//                 : "drone-tab"
//             }
//             onClick={() => setActiveDrone("raven")}
//           >
//             Internal Testing Raven 2
//           </button>
//           <button
//             className={
//               activeDrone === "secure"
//                 ? "drone-tab drone-tab-active"
//                 : "drone-tab"
//             }
//             onClick={() => setActiveDrone("secure")}
//           >
//             Secure Drone
//           </button>
//         </div>

//         {/* Map card */}
//         <div className="map-card">
//           <div className="map-card-header">
//             <div>
//               <div className="map-title">Live map</div>
//               <div className="map-subtitle">
//                 Real-time drone positions &amp; mission paths
//               </div>
//             </div>
//             <div className="map-tag">Telemetry-linked</div>
//           </div>

//           <div className="map-card-body">
//             <div className="map-container-shell">
//               <LiveMap
//                 // key forces Leaflet to re-render on tab change and fixes partial tiles
//                 key={activeDrone}
//                 center={[telemetry.lat, telemetry.lon]}
//                 track={track}
//               />
//             </div>

//             {showDroneCard && activeCard && (
//               <div className="active-drone-card">
//                 <div className="adc-title">Active drone</div>
//                 <div className="adc-name">{activeCard.name}</div>

//                 <div className="adc-row">
//                   <span className="adc-label">Mode</span>
//                   <span className="adc-value">{telemetry.mode ?? "—"}</span>
//                 </div>
//                 <div className="adc-row">
//                   <span className="adc-label">Altitude</span>
//                   <span className="adc-value">
//                     {telemetry.alt.toFixed(1)} m
//                   </span>
//                 </div>
//                 <div className="adc-row">
//                   <span className="adc-label">H-speed</span>
//                   <span className="adc-value">
//                     {(telemetry.h_speed ?? 0).toFixed(1)} m/s
//                   </span>
//                 </div>
//                 <div className="adc-row">
//                   <span className="adc-label">V-speed</span>
//                   <span className="adc-value">
//                     {(telemetry.v_speed ?? 0).toFixed(1)} m/s
//                   </span>
//                 </div>
//                 <div className="adc-row">
//                   <span className="adc-label">Battery</span>
//                   <span className="adc-value">
//                     {telemetry.battery.toFixed(1)}%
//                   </span>
//                 </div>
//                 <div className="adc-row">
//                   <span className="adc-label">Home</span>
//                   <span className="adc-value">{activeCard.home}</span>
//                 </div>
//                 <div className="adc-row">
//                   <span className="adc-label">Lat / Lon</span>
//                   <span className="adc-value">
//                     {formattedLat}, {formattedLon}
//                   </span>
//                 </div>

//                 {/* Live Track button */}
//                 <button
//                   className="adc-live-track-btn"
//                   onClick={() => setLiveTrackOpen(true)}
//                 >
//                   Live Track
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* battery trend in a thin strip below map, like “Live Track” area */}
//           <div className="battery-strip">
//             <div className="battery-strip-header">
//               <span>Battery trend (last ~120 samples)</span>
//               <span className="battery-strip-value">
//                 {telemetry.battery.toFixed(1)}%
//               </span>
//             </div>
//             <div className="battery-strip-body">
//               <BatterySparkline data={batteryHistory} />
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Organisation insights blocks */}
//       <section className="insights-section">
//         <h2 className="insights-title">Organisation Insights</h2>
//         <div className="insights-grid">
//           <div className="insight-card">
//             <div className="insight-label">Flight Distance</div>
//             <div className="insight-value">1k km</div>
//             <div className="insight-mini-bar" />
//           </div>
//           <div className="insight-card">
//             <div className="insight-label">Flight Time</div>
//             <div className="insight-value">682 hr</div>
//             <div className="insight-mini-bar" />
//           </div>
//           <div className="insight-card">
//             <div className="insight-label">Flights</div>
//             <div className="insight-value">1216</div>
//             <div className="insight-mini-bar" />
//           </div>
//           <div className="insight-card">
//             <div className="insight-label">Online Drones</div>
//             <div className="insight-value">1 / 26</div>
//             <div className="insight-circle" />
//           </div>
//           <div className="insight-card">
//             <div className="insight-label">Pilots</div>
//             <div className="insight-value">19</div>
//             <div className="insight-avatar" />
//           </div>
//           <div className="insight-card">
//             <div className="insight-label">Reports</div>
//             <div className="insight-value">0</div>
//             <div className="insight-doc" />
//           </div>
//         </div>
//       </section>

//       {/* Live Track full-screen overlay */}
//       <LiveTrackOverlay
//         open={liveTrackOpen}
//         onClose={() => setLiveTrackOpen(false)}
//         droneName={activeCard?.name ?? "Live Track"}
//         telemetry={{
//           mode: telemetry.mode,
//           alt: telemetry.alt,
//           h_speed: telemetry.h_speed,
//           v_speed: telemetry.v_speed,
//           battery: telemetry.battery,
//           lat: telemetry.lat,
//           lon: telemetry.lon,
//         }}
//         mapCenter={[telemetry.lat, telemetry.lon]}
//         liveStreamUrl={LIVE_STREAM_URLS[activeDrone]}
//       />
//     </div>
//   );
// };

// export default DashboardPage;






// src/pages/DashboardPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import "./DashboardPage.css";
import BatterySparkline from "../components/BatterySparkline";
import LiveMap from "../components/LiveMap";
import LiveTrackOverlay from "../components/LiveTrackOverlay";

export type Telemetry = {
  lat: number;
  lon: number;
  alt: number;
  battery: number;
  h_speed?: number;
  v_speed?: number;
  mode?: string;
};

export type DroneId = "view-all" | "hawk" | "divyanshu" | "raven" | "secure";

const WS_URL =
  (import.meta as any).env.VITE_WS_URL ?? "ws://127.0.0.1:8000/ws/telemetry";

const LIVE_VIDEO_URLS: Record<Exclude<DroneId, "view-all">, string> = {
  hawk: (import.meta as any).env.VITE_HAWK_VIDEO_URL ?? "",
  divyanshu: (import.meta as any).env.VITE_DIVYANSHU_VIDEO_URL ?? "",
  raven: (import.meta as any).env.VITE_RAVEN_VIDEO_URL ?? "",
  secure: (import.meta as any).env.VITE_SECURE_VIDEO_URL ?? "",
};

const DashboardPage: React.FC = () => {
  // which drone tab is active
  const [activeDrone, setActiveDrone] = useState<DroneId>("view-all");

  // which drone is currently opened in full-screen live track
  const [liveTrackDrone, setLiveTrackDrone] =
    useState<Exclude<DroneId, "view-all"> | null>(null);

  // latest telemetry (from WS or fallback)
  const [telemetry, setTelemetry] = useState<Telemetry>({
    lat: 12.9716,
    lon: 77.5946,
    alt: 0,
    battery: 69.3,
    h_speed: 0,
    v_speed: 0,
    mode: "IDLE",
  });

  // battery history for sparkline
  const [batteryHistory, setBatteryHistory] = useState<
    { ts: number; value: number }[]
  >([]);

  const [wsStatus, setWsStatus] = useState<
    "connecting" | "connected" | "disconnected" | "error"
  >("connecting");

  // track of positions for the map polyline
  const [track, setTrack] = useState<[number, number][]>([]);

  // ---- WebSocket hook ----
  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimer: number | null = null;
    let mounted = true;

    const connect = () => {
      setWsStatus("connecting");
      try {
        ws = new WebSocket(WS_URL);
      } catch (e) {
        console.error("WS create failed", e);
        setWsStatus("error");
        return;
      }

      ws.onopen = () => {
        if (!mounted) return;
        setWsStatus("connected");
      };

      ws.onmessage = (event) => {
        if (!mounted) return;

        let raw: any;
        try {
          raw = JSON.parse(event.data);
        } catch {
          try {
            const fixed = ("" + event.data).replace(/'/g, '"');
            raw = JSON.parse(fixed);
          } catch {
            console.warn("Telemetry parse failed:", event.data);
            return;
          }
        }

        setTelemetry((prev) => {
          const next: Telemetry = {
            lat: Number(raw.lat ?? prev.lat),
            lon: Number(raw.lon ?? prev.lon),
            alt: Number(raw.alt ?? prev.alt),
            battery: Number(raw.battery ?? prev.battery),
            h_speed: Number(raw.h_speed ?? prev.h_speed ?? 0),
            v_speed: Number(raw.v_speed ?? prev.v_speed ?? 0),
            mode: String(raw.mode ?? prev.mode ?? "UNKNOWN"),
          };

          setBatteryHistory((history) =>
            [...history, { ts: Date.now() / 1000, value: next.battery }].slice(
              -120
            )
          );
          setTrack((oldTrack) =>
            [...oldTrack, [next.lat, next.lon] as [number, number]].slice(-500)
          );

          return next;
        });
      };

      ws.onerror = () => {
        if (!mounted) return;
        setWsStatus("error");
      };

      ws.onclose = () => {
        if (!mounted) return;
        setWsStatus("disconnected");
        reconnectTimer = window.setTimeout(connect, 2000);
      };
    };

    connect();

    return () => {
      mounted = false;
      if (reconnectTimer !== null) window.clearTimeout(reconnectTimer);
      if (ws && ws.readyState === WebSocket.OPEN) ws.close();
    };
  }, []);

  const wsLabel = useMemo(() => {
    switch (wsStatus) {
      case "connecting":
        return "Connecting…";
      case "connected":
        return "Live telemetry";
      case "disconnected":
        return "Disconnected";
      case "error":
        return "Error";
      default:
        return "";
    }
  }, [wsStatus]);

  const formattedLat = telemetry.lat.toFixed(5);
  const formattedLon = telemetry.lon.toFixed(5);

  // card data for each drone tab (demo values)
  const droneCards: Record<
    Exclude<DroneId, "view-all">,
    {
      name: string;
      mission: string;
      home: string;
    }
  > = {
    hawk: {
      name: "Hawk Demo",
      mission: "Recon",
      home: "Hawk Base",
    },
    divyanshu: {
      name: "Divyanshu SITL",
      mission: "Simulation",
      home: "Virtual Field",
    },
    raven: {
      name: "Internal Testing Raven 2",
      mission: "Test Flight",
      home: "Raven Pad",
    },
    secure: {
      name: "Secure Drone",
      mission: "Perimeter Patrol",
      home: "HQ Roof",
    },
  };

  const showDroneCard = activeDrone !== "view-all";
  const activeCard =
    activeDrone !== "view-all" ? droneCards[activeDrone] : undefined;

  const handleOpenLiveTrack = () => {
    if (activeDrone === "view-all") return;
    setLiveTrackDrone(activeDrone);
  };

  const handleCloseLiveTrack = () => {
    setLiveTrackDrone(null);
  };

  return (
    <>
      <div className="dash-root">
        {/* Top header */}
        <header className="dash-header">
          <div>
            <h1 className="dash-title">Dashboard</h1>
            <div className="dash-subtitle">
              VyomGarud • Fleet overview &amp; live telemetry
            </div>
          </div>

          <div className="dash-header-right">
            <div className={`ws-pill ws-${wsStatus}`}>
              <span className="ws-dot" />
              <span className="ws-label">{wsLabel}</span>
            </div>
          </div>
        </header>

        {/* Live map section */}
        <section className="dash-map-section">
          {/* Drone tabs row */}
          <div className="drone-tabs">
            <button
              className={
                activeDrone === "view-all"
                  ? "drone-tab drone-tab-active"
                  : "drone-tab"
              }
              onClick={() => setActiveDrone("view-all")}
            >
              View All
            </button>
            <button
              className={
                activeDrone === "hawk"
                  ? "drone-tab drone-tab-active"
                  : "drone-tab"
              }
              onClick={() => setActiveDrone("hawk")}
            >
              Hawk Demo
            </button>
            <button
              className={
                activeDrone === "divyanshu"
                  ? "drone-tab drone-tab-active"
                  : "drone-tab"
              }
              onClick={() => setActiveDrone("divyanshu")}
            >
              Divyanshu SITL
            </button>
            <button
              className={
                activeDrone === "raven"
                  ? "drone-tab drone-tab-active"
                  : "drone-tab"
              }
              onClick={() => setActiveDrone("raven")}
            >
              Internal Testing Raven 2
            </button>
            <button
              className={
                activeDrone === "secure"
                  ? "drone-tab drone-tab-active"
                  : "drone-tab"
              }
              onClick={() => setActiveDrone("secure")}
            >
              Secure Drone
            </button>
          </div>

          {/* Map card */}
          <div className="map-card">
            <div className="map-card-header">
              <div>
                <div className="map-title">Live map</div>
                <div className="map-subtitle">
                  Real-time drone positions &amp; mission paths
                </div>
              </div>
              <div className="map-tag">Telemetry-linked</div>
            </div>

            <div className="map-card-body">
              <div className="map-container-shell">
                <LiveMap center={[telemetry.lat, telemetry.lon]} track={track} />
              </div>

              {showDroneCard && activeCard && (
                <div className="active-drone-card">
                  <div className="adc-title">Active drone</div>
                  <div className="adc-name">{activeCard.name}</div>

                  <div className="adc-row">
                    <span className="adc-label">Mode</span>
                    <span className="adc-value">
                      {telemetry.mode ?? "—"}
                    </span>
                  </div>
                  <div className="adc-row">
                    <span className="adc-label">Altitude</span>
                    <span className="adc-value">
                      {telemetry.alt.toFixed(1)} m
                    </span>
                  </div>
                  <div className="adc-row">
                    <span className="adc-label">H-speed</span>
                    <span className="adc-value">
                      {(telemetry.h_speed ?? 0).toFixed(1)} m/s
                    </span>
                  </div>
                  <div className="adc-row">
                    <span className="adc-label">V-speed</span>
                    <span className="adc-value">
                      {(telemetry.v_speed ?? 0).toFixed(1)} m/s
                    </span>
                  </div>
                  <div className="adc-row">
                    <span className="adc-label">Battery</span>
                    <span className="adc-value">
                      {telemetry.battery.toFixed(1)}%
                    </span>
                  </div>
                  <div className="adc-row">
                    <span className="adc-label">Home</span>
                    <span className="adc-value">{activeCard.home}</span>
                  </div>
                  <div className="adc-row">
                    <span className="adc-label">Lat / Lon</span>
                    <span className="adc-value">
                      {formattedLat}, {formattedLon}
                    </span>
                  </div>

                  <button
                    className="adc-live-track-btn"
                    onClick={handleOpenLiveTrack}
                  >
                    Live Track
                  </button>
                </div>
              )}
            </div>

            {/* battery trend strip */}
            <div className="battery-strip">
              <div className="battery-strip-header">
                <span>Battery trend (last ~120 samples)</span>
                <span className="battery-strip-value">
                  {telemetry.battery.toFixed(1)}%
                </span>
              </div>
              <div className="battery-strip-body">
                <BatterySparkline data={batteryHistory} />
              </div>
            </div>
          </div>
        </section>

        {/* Organisation insights blocks */}
        <section className="insights-section">
          <h2 className="insights-title">Organisation Insights</h2>
          <div className="insights-grid">
            <div className="insight-card">
              <div className="insight-label">Flight Distance</div>
              <div className="insight-value">1k km</div>
              <div className="insight-mini-bar" />
            </div>
            <div className="insight-card">
              <div className="insight-label">Flight Time</div>
              <div className="insight-value">682 hr</div>
              <div className="insight-mini-bar" />
            </div>
            <div className="insight-card">
              <div className="insight-label">Flights</div>
              <div className="insight-value">1216</div>
              <div className="insight-mini-bar" />
            </div>
            <div className="insight-card">
              <div className="insight-label">Online Drones</div>
              <div className="insight-value">1 / 26</div>
              <div className="insight-circle" />
            </div>
            <div className="insight-card">
              <div className="insight-label">Pilots</div>
              <div className="insight-value">19</div>
              <div className="insight-avatar" />
            </div>
            <div className="insight-card">
              <div className="insight-label">Reports</div>
              <div className="insight-value">0</div>
              <div className="insight-doc" />
            </div>
          </div>
        </section>
      </div>

      {/* Full-screen live track overlay */}
      {liveTrackDrone && (
        <LiveTrackOverlay
          isOpen={true}
          onClose={handleCloseLiveTrack}
          droneName={droneCards[liveTrackDrone].name}
          telemetry={telemetry}
          videoUrl={LIVE_VIDEO_URLS[liveTrackDrone]}
        />
      )}
    </>
  );
};

export default DashboardPage;
