// // // src/components/LiveTrackModal.tsx
// // import React, { useEffect, useRef, useState } from "react";
// // import "./LiveTrackModal.css";
// // import LiveMap from "./LiveMap";

// // type LiveTrackModalProps = {
// //   isOpen: boolean;
// //   onClose: () => void;
// //   droneName: string;
// //   homeLabel: string;
// //   center: [number, number];           // [lat, lon]
// //   track: [number, number][];          // polyline track for mini-map
// // };

// // const DEMO_VIDEO_URL =
// //   "/video/demo-hawk.mp4"; // ⬅️ REPLACE with your real live stream (HLS/WebRTC etc.)

// // const LiveTrackModal: React.FC<LiveTrackModalProps> = ({
// //   isOpen,
// //   onClose,
// //   droneName,
// //   homeLabel,
// //   center,
// //   track,
// // }) => {
// //   const videoRef = useRef<HTMLVideoElement | null>(null);
// //   const [isBuffering, setIsBuffering] = useState(true);
// //   const [hasError, setHasError] = useState(false);

// //   // Auto-play when modal opens
// //   useEffect(() => {
// //     if (!isOpen) {
// //       setIsBuffering(true);
// //       setHasError(false);
// //       return;
// //     }

// //     const v = videoRef.current;
// //     if (v) {
// //       // try to start playback (might require user gesture on some browsers)
// //       v.play().catch(() => {
// //         // ignore; we still keep waiting text
// //       });
// //     }
// //   }, [isOpen]);

// //   if (!isOpen) return null;

// //   return (
// //     <div className="ltm-overlay">
// //       <div className="ltm-root">
// //         {/* Close button */}
// //         <button className="ltm-close" onClick={onClose} aria-label="Close live track">
// //           ✕
// //         </button>

// //         {/* Top-right drone status header */}
// //         <div className="ltm-status-card">
// //           <div className="ltm-status-name">{droneName}</div>
// //           <div className="ltm-status-home">{homeLabel}</div>
// //           <div className="ltm-status-row">
// //             <span className="ltm-dot-online" />
// //             <span>Online</span>
// //             <span className="ltm-pill">Not Armed</span>
// //             <span className="ltm-pill">On Ground</span>
// //           </div>
// //           <div className="ltm-status-actions">
// //             <button className="ltm-btn ltm-btn-primary">Takeoff</button>
// //             <button className="ltm-btn">RTL</button>
// //           </div>
// //         </div>

// //         {/* Main video area */}
// //         <div className="ltm-video-wrapper">
// //           <video
// //             ref={videoRef}
// //             className="ltm-video"
// //             src={DEMO_VIDEO_URL}
// //             // if you are using HLS / WebRTC, you might instead mount a custom player here
// //             autoPlay
// //             muted
// //             controls
// //             onPlaying={() => {
// //               setIsBuffering(false);
// //               setHasError(false);
// //             }}
// //             onCanPlay={() => {
// //               setIsBuffering(false);
// //               setHasError(false);
// //             }}
// //             onWaiting={() => setIsBuffering(true)}
// //             onError={() => {
// //               setHasError(true);
// //               setIsBuffering(false);
// //             }}
// //           />

// //           {/* Center message while waiting for live stream */}
// //           {isBuffering && !hasError && (
// //             <div className="ltm-overlay-message">
// //               <p>Stream will start playing automatically</p>
// //               <p>when it is live</p>
// //             </div>
// //           )}

// //           {/* Error state (e.g., wrong URL) */}
// //           {hasError && (
// //             <div className="ltm-overlay-message ltm-error">
// //               <p>Unable to load live stream.</p>
// //               <p>Please check the stream URL or server.</p>
// //             </div>
// //           )}

// //           {/* Mini map in the bottom-right corner */}
// //           <div className="ltm-mini-map">
// //             <LiveMap center={center} track={track} />
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default LiveTrackModal;





// // // src/components/LiveTrackModal.tsx
// // import React, { useEffect, useMemo, useState } from "react";
// // import "./LiveTrackModal.css";

// // import {
// //   MapContainer,
// //   TileLayer,
// //   Marker,
// //   Polyline,
// //   ZoomControl,
// // } from "react-leaflet";
// // import type { LatLngExpression } from "leaflet";
// // import "leaflet/dist/leaflet.css";

// // type LiveTrackModalProps = {
// //   /** parent usually passes this, but keep optional so we don’t break anything */
// //   isOpen?: boolean;
// //   onClose?: () => void;
// //   droneName?: string;
// // };

// // type Point = [number, number];

// // const START_POINT: Point = [12.9716, 77.5946];

// // /**
// //  * Very small fake track around the stadium so the marker moves.
// //  * You can replace these with real GPS points later.
// //  */
// // const buildDemoTrack = (): Point[] => {
// //   const points: Point[] = [];
// //   const [baseLat, baseLon] = START_POINT;

// //   for (let i = 0; i < 80; i += 1) {
// //     const angle = (i / 80) * 2 * Math.PI;
// //     const lat = baseLat + 0.0012 * Math.sin(angle);
// //     const lon = baseLon + 0.0012 * Math.cos(angle);
// //     points.push([lat, lon]);
// //   }
// //   return points;
// // };

// // const LiveTrackModal: React.FC<LiveTrackModalProps> = ({
// //   isOpen = true,
// //   onClose,
// //   droneName = "Hawk Demo",
// // }) => {
// //   const track: Point[] = useMemo(buildDemoTrack, []);
// //   const [index, setIndex] = useState(0);

// //   // advance “live” position along the track
// //   useEffect(() => {
// //     if (!isOpen) return;

// //     const id = setInterval(() => {
// //       setIndex((prev) => (prev + 1) % track.length);
// //     }, 800); // every 800ms

// //     return () => clearInterval(id);
// //   }, [isOpen, track]);

// //   if (!isOpen) return null;

// //   const livePosition: LatLngExpression = track[index];

// //   // simple fake telemetry using the index (just to see changing numbers)
// //   const altitude = 5 + (index % 20); // m
// //   const hSpeed = (index % 12) * 0.8; // m/s
// //   const vSpeed = index % 2 === 0 ? 0.0 : -0.2;
// //   const battery = 100 - (index % 50);

// //   return (
// //     <div className="live-track-backdrop">
// //       <div className="live-track-modal">
// //         {/* Close button */}
// //         <button
// //           type="button"
// //           className="live-track-close"
// //           onClick={onClose}
// //           aria-label="Close live view"
// //         >
// //           ✕
// //         </button>

// //         {/* Header */}
// //         <header className="live-track-header">
// //           <div className="live-track-title-block">
// //             <h2 className="live-track-title">{droneName}</h2>
// //             <span className="live-track-status-dot" />
// //             <span className="live-track-status-label">Online</span>
// //           </div>
// //         </header>

// //         {/* Main content area (video + telemetry + mini-map) */}
// //         <div className="live-track-main">
// //           {/* Fake video surface */}
// //           <div className="live-track-video">
// //             <div className="live-pill">LIVE</div>
// //             <div className="video-overlay">
// //               <div className="crosshair-circle" />
// //               <div className="crosshair-line horiz" />
// //               <div className="crosshair-line vert" />
// //             </div>
// //             <div className="video-placeholder-text">
// //               Stream will start playing automatically
// //               <br />
// //               when it is live
// //             </div>
// //           </div>

// //           {/* Telemetry panel */}
// //           <aside className="live-track-telemetry">
// //             <h3 className="telemetry-title">Telemetry</h3>
// //             <div className="telemetry-row">
// //               <span className="telemetry-label">Mode</span>
// //               <span className="telemetry-value">IDLE</span>
// //             </div>
// //             <div className="telemetry-row">
// //               <span className="telemetry-label">Altitude</span>
// //               <span className="telemetry-value">{altitude.toFixed(1)} m</span>
// //             </div>
// //             <div className="telemetry-row">
// //               <span className="telemetry-label">H-speed</span>
// //               <span className="telemetry-value">{hSpeed.toFixed(1)} m/s</span>
// //             </div>
// //             <div className="telemetry-row">
// //               <span className="telemetry-label">V-speed</span>
// //               <span className="telemetry-value">{vSpeed.toFixed(1)} m/s</span>
// //             </div>
// //             <div className="telemetry-row">
// //               <span className="telemetry-label">Battery</span>
// //               <span className="telemetry-value">{battery}%</span>
// //             </div>
// //             <div className="telemetry-row">
// //               <span className="telemetry-label">Lat</span>
// //               <span className="telemetry-value">
// //                 {(livePosition as Point)[0].toFixed(5)}
// //               </span>
// //             </div>
// //             <div className="telemetry-row">
// //               <span className="telemetry-label">Lon</span>
// //               <span className="telemetry-value">
// //                 {(livePosition as Point)[1].toFixed(5)}
// //               </span>
// //             </div>
// //           </aside>

// //           {/* Mini map in bottom-right */}
// //           <div className="live-track-mini-map-wrapper">
// //             <MapContainer
// //               center={livePosition}
// //               zoom={18}
// //               scrollWheelZoom={false}
// //               zoomControl={false}
// //               className="live-track-mini-map"
// //             >
// //               <TileLayer
// //                 url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
// //                 attribution='&copy; Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
// //               />
// //               <ZoomControl position="topright" />
// //               <Marker position={livePosition} />
// //               <Polyline
// //                 positions={track as LatLngExpression[]}
// //                 pathOptions={{ weight: 3 }}
// //               />
// //             </MapContainer>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default LiveTrackModal;



// // src/components/LiveTrackModal.tsx
// import React, {
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
//   type FC,
// } from "react";
// import "./LiveTrackModal.css";

// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Polyline,
//   ZoomControl,
// } from "react-leaflet";
// import type { LatLngExpression } from "leaflet";
// import "leaflet/dist/leaflet.css";

// type LiveTrackModalProps = {
//   /** Parent usually passes this, but keep optional so we don’t break anything */
//   isOpen?: boolean;
//   onClose?: () => void;
//   droneName?: string;
// };

// type Point = [number, number];

// const START_POINT: Point = [12.9716, 77.5946];

// /**
//  * Very small fake track around the stadium so the marker moves.
//  * You can replace these with real GPS points later.
//  */
// const buildDemoTrack = (): Point[] => {
//   const points: Point[] = [];
//   const [baseLat, baseLon] = START_POINT;

//   for (let i = 0; i < 80; i += 1) {
//     const angle = (i / 80) * 2 * Math.PI;
//     const lat = baseLat + 0.0012 * Math.sin(angle);
//     const lon = baseLon + 0.0012 * Math.cos(angle);
//     points.push([lat, lon]);
//   }
//   return points;
// };

// const LiveTrackModal: FC<LiveTrackModalProps> = ({
//   isOpen = true,
//   onClose,
//   droneName = "Hawk Demo",
// }) => {
//   const track: Point[] = useMemo(buildDemoTrack, []);
//   const [index, setIndex] = useState(0);
//   const [isPlaying, setIsPlaying] = useState(true);
//   const [isVideoReady, setIsVideoReady] = useState(false);
//   const videoRef = useRef<HTMLVideoElement | null>(null);

//   // Advance “live” position along the track
//   useEffect(() => {
//     if (!isOpen || !isPlaying) return;

//     const id = window.setInterval(() => {
//       setIndex((prev) => (prev + 1) % track.length);
//     }, 800); // every 800ms

//     return () => window.clearInterval(id);
//   }, [isOpen, isPlaying, track.length]);

//   // Handle video play / pause when modal or state changes
//   useEffect(() => {
//     const video = videoRef.current;
//     if (!video) return;

//     if (!isOpen) {
//       video.pause();
//       video.currentTime = 0;
//       return;
//     }

//     if (isPlaying) {
//       void video
//         .play()
//         .then(() => {
//           // autoplay ok
//         })
//         .catch(() => {
//           // autoplay blocked – user will have to click
//         });
//     } else {
//       video.pause();
//     }
//   }, [isOpen, isPlaying]);

//   if (!isOpen) return null;

//   const livePosition: LatLngExpression = track[index];

//   // simple fake telemetry using the index (just to see changing numbers)
//   const altitude = 5 + (index % 20); // m
//   const hSpeed = (index % 12) * 0.8; // m/s
//   const vSpeed = index % 2 === 0 ? 0.0 : -0.2;
//   const battery = 100 - (index % 50);

//   const handleVideoClick = () => {
//     setIsPlaying((prev) => !prev);
//   };

//   return (
//     <div className="live-track-backdrop">
//       <div className="live-track-modal">
//         {/* Close button */}
//         <button
//           type="button"
//           className="live-track-close"
//           onClick={onClose}
//           aria-label="Close live view"
//         >
//           ✕
//         </button>

//         {/* Header */}
//         <header className="live-track-header">
//           <div className="live-track-title-block">
//             <h2 className="live-track-title">{droneName}</h2>
//             <span className="live-track-status-dot" />
//             <span className="live-track-status-label">Online</span>
//           </div>
//         </header>

//         {/* Main content area (video + telemetry + mini-map) */}
//         <div className="live-track-main">
//           {/* Video surface */}
//           <div className="live-track-video" onClick={handleVideoClick}>
//             {/* LIVE / PAUSED pill */}
//             <div className={`live-pill ${isPlaying ? "on" : "paused"}`}>
//               {isPlaying ? "LIVE" : "PAUSED"}
//             </div>

//             {/* Actual video feed */}
//             <video
//               ref={videoRef}
//               className="live-video-element"
//               src="/demo-flight.mp4"
//               muted
//               loop
//               playsInline
//               onCanPlay={() => setIsVideoReady(true)}
//             >
//               Your browser does not support the video tag.
//             </video>

//             {/* Simple “loading / waiting” text until video is ready */}
//             {!isVideoReady && (
//               <div className="video-placeholder-text">
//                 Stream will start playing automatically
//                 <br />
//                 when it is live
//               </div>
//             )}

//             {/* HUD overlay (crosshair) */}
//             <div className="video-overlay">
//               <div className="crosshair-circle" />
//               <div className="crosshair-line horiz" />
//               <div className="crosshair-line vert" />
//             </div>
//           </div>

//           {/* Telemetry panel */}
//           <aside className="live-track-telemetry">
//             <h3 className="telemetry-title">Telemetry</h3>
//             <div className="telemetry-row">
//               <span className="telemetry-label">Mode</span>
//               <span className="telemetry-value">IDLE</span>
//             </div>
//             <div className="telemetry-row">
//               <span className="telemetry-label">Altitude</span>
//               <span className="telemetry-value">{altitude.toFixed(1)} m</span>
//             </div>
//             <div className="telemetry-row">
//               <span className="telemetry-label">H-speed</span>
//               <span className="telemetry-value">{hSpeed.toFixed(1)} m/s</span>
//             </div>
//             <div className="telemetry-row">
//               <span className="telemetry-label">V-speed</span>
//               <span className="telemetry-value">{vSpeed.toFixed(1)} m/s</span>
//             </div>
//             <div className="telemetry-row">
//               <span className="telemetry-label">Battery</span>
//               <span className="telemetry-value">{battery}%</span>
//             </div>
//             <div className="telemetry-row">
//               <span className="telemetry-label">Lat</span>
//               <span className="telemetry-value">
//                 {(livePosition as Point)[0].toFixed(5)}
//               </span>
//             </div>
//             <div className="telemetry-row">
//               <span className="telemetry-label">Lon</span>
//               <span className="telemetry-value">
//                 {(livePosition as Point)[1].toFixed(5)}
//               </span>
//             </div>
//           </aside>

//           {/* Mini map in bottom-right */}
//           <div className="live-track-mini-map-wrapper">
//             <MapContainer
//               center={livePosition}
//               zoom={18}
//               scrollWheelZoom={false}
//               zoomControl={false}
//               className="live-track-mini-map"
//             >
//               <TileLayer
//                 url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
//                 attribution='&copy; Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
//               />
//               <ZoomControl position="topright" />
//               <Marker position={livePosition} />
//               <Polyline
//                 positions={track as LatLngExpression[]}
//                 pathOptions={{ weight: 3 }}
//               />
//             </MapContainer>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LiveTrackModal;





// // src/components/LiveTrackModal.tsx
// import React, {
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
//   type FC,
// } from "react";
// import "./LiveTrackModal.css";

// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Polyline,
//   ZoomControl,
// } from "react-leaflet";
// import type { LatLngExpression } from "leaflet";
// import "leaflet/dist/leaflet.css";

// type LiveTrackModalProps = {
//   /** Parent usually passes this, but keep optional so we don’t break anything */
//   isOpen?: boolean;
//   onClose?: () => void;
//   droneName?: string;
// };

// type Point = [number, number];

// const START_POINT: Point = [12.9716, 77.5946]; // Bengaluru approx

// /**
//  * Very small fake track around the stadium so the marker moves.
//  * You can replace these with real GPS points later.
//  */
// const buildDemoTrack = (): Point[] => {
//   const points: Point[] = [];
//   const [baseLat, baseLon] = START_POINT;

//   for (let i = 0; i < 80; i += 1) {
//     const angle = (i / 80) * 2 * Math.PI;
//     const lat = baseLat + 0.0012 * Math.sin(angle);
//     const lon = baseLon + 0.0012 * Math.cos(angle);
//     points.push([lat, lon]);
//   }

//   return points;
// };

// const LiveTrackModal: FC<LiveTrackModalProps> = ({
//   isOpen = true,
//   onClose,
//   droneName = "Hawk Demo",
// }) => {
//   const track: Point[] = useMemo(buildDemoTrack, []);
//   const [index, setIndex] = useState(0);
//   const [isPlaying, setIsPlaying] = useState(true);
//   const [isVideoReady, setIsVideoReady] = useState(false);
//   const videoRef = useRef<HTMLVideoElement | null>(null);

//   // Advance “live” position along the track
//   useEffect(() => {
//     if (!isOpen || !isPlaying) return;

//     const id = window.setInterval(() => {
//       setIndex((prev) => (prev + 1) % track.length);
//     }, 800); // every 800ms

//     return () => window.clearInterval(id);
//   }, [isOpen, isPlaying, track.length]);

//   // Handle video play / pause when modal or state changes
//   useEffect(() => {
//     const video = videoRef.current;
//     if (!video) return;

//     if (!isOpen) {
//       video.pause();
//       video.currentTime = 0;
//       setIsPlaying(true);
//       setIsVideoReady(false);
//       return;
//     }

//     if (isPlaying) {
//       void video
//         .play()
//         .then(() => {
//           // autoplay OK
//         })
//         .catch(() => {
//           // autoplay blocked – user may need to click
//         });
//     } else {
//       video.pause();
//     }
//   }, [isOpen, isPlaying]);

//   if (!isOpen) return null;

//   const livePosition: LatLngExpression = track[index];

//   // simple fake telemetry using the index (just to see changing numbers)
//   const altitude = 5 + (index % 20); // m
//   const hSpeed = (index % 12) * 0.8; // m/s
//   const vSpeed = index % 2 === 0 ? 0.0 : -0.2;
//   const battery = 100 - (index % 50);

//   const handleVideoClick = () => {
//     setIsPlaying((prev) => !prev);
//   };

//   return (
//     <div className="live-track-backdrop">
//       <div className="live-track-modal">
//         {/* Close button */}
//         <button
//           type="button"
//           className="live-track-close"
//           onClick={onClose}
//           aria-label="Close live view"
//         >
//           ✕
//         </button>

//         {/* Header */}
//         <header className="live-track-header">
//           <div className="live-track-title-block">
//             <h2 className="live-track-title">{droneName}</h2>
//             <span className="live-track-status-dot" />
//             <span className="live-track-status-label">Online</span>
//           </div>
//         </header>

//         {/* Main content area (video + telemetry + mini-map) */}
//         <div className="live-track-main">
//           {/* Video surface */}
//           <div className="live-track-video" onClick={handleVideoClick}>
//             {/* LIVE / PAUSED pill */}
//             <div className={`live-pill ${isPlaying ? "on" : "paused"}`}>
//               {isPlaying ? "LIVE" : "PAUSED"}
//             </div>

//             {/* Actual video feed (demo file in public/demo-flight.mp4) */}
//             <video
//               ref={videoRef}
//               className="live-video-element"
//               src="/demo-flight.mp4"
//               muted
//               loop
//               autoPlay
//               playsInline
//               onCanPlay={() => setIsVideoReady(true)}
//             >
//               Your browser does not support the video tag.
//             </video>

//             {/* “Waiting for stream” text until video is ready */}
//             {!isVideoReady && (
//               <div className="video-placeholder-text">
//                 Stream will start playing automatically
//                 <br />
//                 when it is live
//               </div>
//             )}

//             {/* HUD overlay (crosshair) */}
//             <div className="video-overlay">
//               <div className="crosshair-circle" />
//               <div className="crosshair-line horiz" />
//               <div className="crosshair-line vert" />
//             </div>
//           </div>

//           {/* Telemetry panel */}
//           <aside className="live-track-telemetry">
//             <h3 className="telemetry-title">Telemetry</h3>
//             <div className="telemetry-row">
//               <span className="telemetry-label">Mode</span>
//               <span className="telemetry-value">IDLE</span>
//             </div>
//             <div className="telemetry-row">
//               <span className="telemetry-label">Altitude</span>
//               <span className="telemetry-value">{altitude.toFixed(1)} m</span>
//             </div>
//             <div className="telemetry-row">
//               <span className="telemetry-label">H-speed</span>
//               <span className="telemetry-value">{hSpeed.toFixed(1)} m/s</span>
//             </div>
//             <div className="telemetry-row">
//               <span className="telemetry-label">V-speed</span>
//               <span className="telemetry-value">{vSpeed.toFixed(1)} m/s</span>
//             </div>
//             <div className="telemetry-row">
//               <span className="telemetry-label">Battery</span>
//               <span className="telemetry-value">{battery}%</span>
//             </div>
//             <div className="telemetry-row">
//               <span className="telemetry-label">Lat</span>
//               <span className="telemetry-value">
//                 {(livePosition as Point)[0].toFixed(5)}
//               </span>
//             </div>
//             <div className="telemetry-row">
//               <span className="telemetry-label">Lon</span>
//               <span className="telemetry-value">
//                 {(livePosition as Point)[1].toFixed(5)}
//               </span>
//             </div>
//           </aside>

//           {/* Mini map in bottom-right */}
//           <div className="live-track-mini-map-wrapper">
//             <MapContainer
//               center={livePosition}
//               zoom={18}
//               scrollWheelZoom={false}
//               zoomControl={false}
//               className="live-track-mini-map"
//             >
//               <TileLayer
//                 url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
//                 attribution='&copy; Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
//               />
//               <ZoomControl position="topright" />
//               <Marker position={livePosition} />
//               <Polyline
//                 positions={track as LatLngExpression[]}
//                 pathOptions={{ weight: 3 }}
//               />
//             </MapContainer>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LiveTrackModal;



// // src/components/LiveTrackModal.tsx
// import React, {
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
//   type FC,
// } from "react";
// import "./LiveTrackModal.css";

// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Polyline,
//   ZoomControl,
// } from "react-leaflet";
// import type { LatLngExpression } from "leaflet";
// import "leaflet/dist/leaflet.css";

// // 👉 import the demo video from src/assets
// import demoFlightVideo from "../assets/demo-flight.mp4";

// type LiveTrackModalProps = {
//   /** Parent usually passes this, but keep optional so we don’t break anything */
//   isOpen?: boolean;
//   onClose?: () => void;
//   droneName?: string;
// };

// type Point = [number, number];

// const START_POINT: Point = [12.9716, 77.5946];

// /**
//  * Very small fake track around the stadium so the marker moves.
//  * You can replace these with real GPS points later.
//  */
// const buildDemoTrack = (): Point[] => {
//   const points: Point[] = [];
//   const [baseLat, baseLon] = START_POINT;

//   for (let i = 0; i < 80; i += 1) {
//     const angle = (i / 80) * 2 * Math.PI;
//     const lat = baseLat + 0.0012 * Math.sin(angle);
//     const lon = baseLon + 0.0012 * Math.cos(angle);
//     points.push([lat, lon]);
//   }
//   return points;
// };

// const LiveTrackModal: FC<LiveTrackModalProps> = ({
//   isOpen = true,
//   onClose,
//   droneName = "Hawk Demo",
// }) => {
//   const track: Point[] = useMemo(() => buildDemoTrack(), []);
//   const [index, setIndex] = useState(0);
//   const [isPlaying, setIsPlaying] = useState(true);
//   const [isVideoReady, setIsVideoReady] = useState(false);
//   const videoRef = useRef<HTMLVideoElement | null>(null);

//   // Advance “live” position along the track
//   useEffect(() => {
//     if (!isOpen || !isPlaying) return;

//     const id = window.setInterval(() => {
//       setIndex((prev) => (prev + 1) % track.length);
//     }, 800); // every 800ms

//     return () => window.clearInterval(id);
//   }, [isOpen, isPlaying, track.length]);

//   // Handle video play / pause when modal or state changes
//   useEffect(() => {
//     const video = videoRef.current;
//     if (!video) return;

//     if (!isOpen) {
//       video.pause();
//       video.currentTime = 0;
//       return;
//     }

//     if (isPlaying) {
//       void video
//         .play()
//         .then(() => {
//           // autoplay ok
//         })
//         .catch(() => {
//           // autoplay might be blocked, user can click to start
//         });
//     } else {
//       video.pause();
//     }
//   }, [isOpen, isPlaying]);

//   if (!isOpen) return null;

//   const livePosition: LatLngExpression = track[index];

//   // simple fake telemetry using the index (just to see changing numbers)
//   const altitude = 5 + (index % 20); // m
//   const hSpeed = (index % 12) * 0.8; // m/s
//   const vSpeed = index % 2 === 0 ? 0.0 : -0.2;
//   const battery = 100 - (index % 50);

//   const handleVideoClick = () => {
//     setIsPlaying((prev) => !prev);
//   };

//   return (
//     <div className="live-track-backdrop">
//       <div className="live-track-modal">
//         {/* Close button */}
//         <button
//           type="button"
//           className="live-track-close"
//           onClick={onClose}
//           aria-label="Close live view"
//         >
//           ✕
//         </button>

//         {/* Header */}
//         <header className="live-track-header">
//           <div className="live-track-title-block">
//             <h2 className="live-track-title">{droneName}</h2>
//             <span className="live-track-status-dot" />
//             <span className="live-track-status-label">Online</span>
//           </div>
//         </header>

//         {/* Main content area (video + telemetry + mini-map) */}
//         <div className="live-track-main">
//           {/* Video surface */}
//           <div className="live-track-video" onClick={handleVideoClick}>
//             {/* LIVE / PAUSED pill */}
//             <div className={`live-pill ${isPlaying ? "on" : "paused"}`}>
//               {isPlaying ? "LIVE" : "PAUSED"}
//             </div>

//             {/* Actual video feed */}
//             <video
//               ref={videoRef}
//               className="live-video-element"
//               src={demoFlightVideo}
//               muted
//               loop
//               playsInline
//               onCanPlay={() => setIsVideoReady(true)}
//             >
//               Your browser does not support the video tag.
//             </video>

//             {/* “waiting” text until video is ready */}
//             {!isVideoReady && (
//               <div className="video-placeholder-text">
//                 Stream will start playing automatically
//                 <br />
//                 when it is live
//               </div>
//             )}

//             {/* HUD overlay (crosshair) */}
//             <div className="video-overlay">
//               <div className="crosshair-circle" />
//               <div className="crosshair-line horiz" />
//               <div className="crosshair-line vert" />
//             </div>
//           </div>

//           {/* Telemetry panel */}
//           <aside className="live-track-telemetry">
//             <h3 className="telemetry-title">Telemetry</h3>
//             <div className="telemetry-row">
//               <span className="telemetry-label">Mode</span>
//               <span className="telemetry-value">IDLE</span>
//             </div>
//             <div className="telemetry-row">
//               <span className="telemetry-label">Altitude</span>
//               <span className="telemetry-value">{altitude.toFixed(1)} m</span>
//             </div>
//             <div className="telemetry-row">
//               <span className="telemetry-label">H-speed</span>
//               <span className="telemetry-value">{hSpeed.toFixed(1)} m/s</span>
//             </div>
//             <div className="telemetry-row">
//               <span className="telemetry-label">V-speed</span>
//               <span className="telemetry-value">{vSpeed.toFixed(1)} m/s</span>
//             </div>
//             <div className="telemetry-row">
//               <span className="telemetry-label">Battery</span>
//               <span className="telemetry-value">{battery}%</span>
//             </div>
//             <div className="telemetry-row">
//               <span className="telemetry-label">Lat</span>
//               <span className="telemetry-value">
//                 {(livePosition as Point)[0].toFixed(5)}
//               </span>
//             </div>
//             <div className="telemetry-row">
//               <span className="telemetry-label">Lon</span>
//               <span className="telemetry-value">
//                 {(livePosition as Point)[1].toFixed(5)}
//               </span>
//             </div>
//           </aside>

//           {/* Mini map in bottom-right */}
//           <div className="live-track-mini-map-wrapper">
//             <MapContainer
//               center={livePosition}
//               zoom={18}
//               scrollWheelZoom={false}
//               zoomControl={false}
//               className="live-track-mini-map"
//             >
//               <TileLayer
//                 url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
//                 attribution='&copy; Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
//               />
//               <ZoomControl position="topright" />
//               <Marker position={livePosition} />
//               <Polyline
//                 positions={track as LatLngExpression[]}
//                 pathOptions={{ weight: 3 }}
//               />
//             </MapContainer>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LiveTrackModal;




// // src/components/LiveTrackModal.tsx
// import React, {
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
//   type FC,
// } from "react";
// import "./LiveTrackModal.css";

// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Polyline,
//   ZoomControl,
// } from "react-leaflet";
// import type { LatLngExpression } from "leaflet";
// import "leaflet/dist/leaflet.css";

// type LiveTrackModalProps = {
//   isOpen?: boolean;
//   onClose?: () => void;
//   droneName?: string;
// };

// type Point = [number, number];

// const START_POINT: Point = [12.9716, 77.5946];

// const buildDemoTrack = (): Point[] => {
//   const points: Point[] = [];
//   const [baseLat, baseLon] = START_POINT;

//   for (let i = 0; i < 80; i += 1) {
//     const angle = (i / 80) * 2 * Math.PI;
//     const lat = baseLat + 0.0012 * Math.sin(angle);
//     const lon = baseLon + 0.0012 * Math.cos(angle);
//     points.push([lat, lon]);
//   }
//   return points;
// };

// const LiveTrackModal: FC<LiveTrackModalProps> = ({
//   isOpen = true,
//   onClose,
//   droneName = "Hawk Demo",
// }) => {
//   const track: Point[] = useMemo(() => buildDemoTrack(), []);
//   const [index, setIndex] = useState(0);
//   const [isPlaying, setIsPlaying] = useState(true);
//   const [isVideoReady, setIsVideoReady] = useState(false);
//   const [hasError, setHasError] = useState(false);
//   const videoRef = useRef<HTMLVideoElement | null>(null);

//   // move marker around
//   useEffect(() => {
//     if (!isOpen || !isPlaying) return;

//     const id = window.setInterval(() => {
//       setIndex((prev) => (prev + 1) % track.length);
//     }, 800);

//     return () => window.clearInterval(id);
//   }, [isOpen, isPlaying, track.length]);

//   // control video playback
//   useEffect(() => {
//     const video = videoRef.current;
//     if (!video) return;

//     if (!isOpen) {
//       video.pause();
//       video.currentTime = 0;
//       return;
//     }

//     if (isPlaying) {
//       video
//         .play()
//         .then(() => {
//           // ok
//         })
//         .catch((err) => {
//           console.warn("Autoplay blocked:", err);
//         });
//     } else {
//       video.pause();
//     }
//   }, [isOpen, isPlaying]);

//   if (!isOpen) return null;

//   const livePosition: LatLngExpression = track[index];

//   const altitude = 5 + (index % 20);
//   const hSpeed = (index % 12) * 0.8;
//   const vSpeed = index % 2 === 0 ? 0.0 : -0.2;
//   const battery = 100 - (index % 50);

//   const handleVideoClick = () => {
//     setIsPlaying((prev) => !prev);
//   };

//   return (
//     <div className="live-track-backdrop">
//       <div className="live-track-modal">
//         {/* Close */}
//         <button
//           type="button"
//           className="live-track-close"
//           onClick={onClose}
//           aria-label="Close live view"
//         >
//           ✕
//         </button>

//         {/* Header */}
//         <header className="live-track-header">
//           <div className="live-track-title-block">
//             <h2 className="live-track-title">{droneName}</h2>
//             <span className="live-track-status-dot" />
//             <span className="live-track-status-label">Online</span>
//           </div>
//         </header>

//         {/* Main content */}
//         <div className="live-track-main">
//           {/* VIDEO */}
//           <div className="live-track-video" onClick={handleVideoClick}>
//             <div className={`live-pill ${isPlaying ? "on" : "paused"}`}>
//               {isPlaying ? "LIVE" : "PAUSED"}
//             </div>

//             <video
//               ref={videoRef}
//               className="live-video-element"
//               src="/demo-flight.mp4"     // ⬅️ served from /public
//               muted
//               loop
//               playsInline
//               onLoadedData={() => {
//                 console.log("Video loaded");
//                 setIsVideoReady(true);
//                 setHasError(false);
//               }}
//               onPlaying={() => {
//                 console.log("Video playing");
//                 setIsVideoReady(true);
//                 setHasError(false);
//               }}
//               onError={(e) => {
//                 console.error("Video error", e);
//                 setHasError(true);
//               }}
//             >
//               Your browser does not support the video tag.
//             </video>

//             {/* waiting / error messages */}
//             {!isVideoReady && !hasError && (
//               <div className="video-placeholder-text">
//                 Stream will start playing automatically
//                 <br />
//                 when it is live
//               </div>
//             )}

//             {hasError && (
//               <div className="video-placeholder-text">
//                 Unable to load demo-flight.mp4
//                 <br />
//                 Check that the file is in /public and path is correct.
//               </div>
//             )}

//             <div className="video-overlay">
//               <div className="crosshair-circle" />
//               <div className="crosshair-line horiz" />
//               <div className="crosshair-line vert" />
//             </div>
//           </div>

//           {/* TELEMETRY */}
//           <aside className="live-track-telemetry">
//             <h3 className="telemetry-title">Telemetry</h3>
//             <div className="telemetry-row">
//               <span className="telemetry-label">Mode</span>
//               <span className="telemetry-value">IDLE</span>
//             </div>
//             <div className="telemetry-row">
//               <span className="telemetry-label">Altitude</span>
//               <span className="telemetry-value">{altitude.toFixed(1)} m</span>
//             </div>
//             <div className="telemetry-row">
//               <span className="telemetry-label">H-speed</span>
//               <span className="telemetry-value">{hSpeed.toFixed(1)} m/s</span>
//             </div>
//             <div className="telemetry-row">
//               <span className="telemetry-label">V-speed</span>
//               <span className="telemetry-value">{vSpeed.toFixed(1)} m/s</span>
//             </div>
//             <div className="telemetry-row">
//               <span className="telemetry-label">Battery</span>
//               <span className="telemetry-value">{battery}%</span>
//             </div>
//             <div className="telemetry-row">
//               <span className="telemetry-label">Lat</span>
//               <span className="telemetry-value">
//                 {(livePosition as Point)[0].toFixed(5)}
//               </span>
//             </div>
//             <div className="telemetry-row">
//               <span className="telemetry-label">Lon</span>
//               <span className="telemetry-value">
//                 {(livePosition as Point)[1].toFixed(5)}
//               </span>
//             </div>
//           </aside>

//           {/* MINI MAP */}
//           <div className="live-track-mini-map-wrapper">
//             <MapContainer
//               center={livePosition}
//               zoom={18}
//               scrollWheelZoom={false}
//               zoomControl={false}
//               className="live-track-mini-map"
//             >
//               <TileLayer
//                 url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
//                 attribution='&copy; Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
//               />
//               <ZoomControl position="topright" />
//               <Marker position={livePosition} />
//               <Polyline
//                 positions={track as LatLngExpression[]}
//                 pathOptions={{ weight: 3 }}
//               />
//             </MapContainer>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LiveTrackModal;






// src/components/LiveTrackModal.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import "./LiveTrackModal.css";

import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  ZoomControl,
} from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

type LiveTrackModalProps = {
  /** Optional so old callers don’t break */
  isOpen?: boolean;
  onClose?: () => void;
  droneName?: string;
};

type Point = [number, number];

const START_POINT: Point = [12.9716, 77.5946];

// public/demo-flight.mp4  ➜  http://localhost:5173/demo-flight.mp4
const DEMO_VIDEO_SRC = "/demo-flight.mp4";

/** Small circular fake track around the stadium */
const buildDemoTrack = (): Point[] => {
  const points: Point[] = [];
  const [baseLat, baseLon] = START_POINT;

  for (let i = 0; i < 80; i += 1) {
    const angle = (i / 80) * 2 * Math.PI;
    const lat = baseLat + 0.0012 * Math.sin(angle);
    const lon = baseLon + 0.0012 * Math.cos(angle);
    points.push([lat, lon]);
  }
  return points;
};

const LiveTrackModal: React.FC<LiveTrackModalProps> = ({
  isOpen = true,
  onClose,
  droneName = "Hawk Demo",
}) => {
  const track = useMemo<Point[]>(() => buildDemoTrack(), []);
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Advance marker along the track while "playing"
  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % track.length);
    }, 800);

    return () => window.clearInterval(id);
  }, [isOpen, isPlaying, track.length]);

  // Handle video autoplay / pause with state
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!isOpen) {
      video.pause();
      video.currentTime = 0;
      return;
    }

    if (isPlaying) {
      video
        .play()
        .then(() => {
          // autoplay ok
        })
        .catch(() => {
          // autoplay blocked (browser), user can hit play manually
        });
    } else {
      video.pause();
    }
  }, [isOpen, isPlaying]);

  if (!isOpen) return null;

  const livePosition: LatLngExpression = track[index];

  // Fake telemetry values just so the panel changes
  const altitude = 5 + (index % 20); // m
  const hSpeed = (index % 12) * 0.8; // m/s
  const vSpeed = index % 2 === 0 ? 0.0 : -0.2;
  const battery = 100 - (index % 50);

  const handleVideoClick = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleVideoReady = () => {
    setIsVideoReady(true);
    setVideoError(null);
  };

  const handleVideoError = () => {
    setVideoError("Unable to load demo-flight.mp4");
    setIsVideoReady(false);
  };

  return (
    <div className="live-track-backdrop">
      <div className="live-track-modal">
        {/* Close button */}
        <button
          type="button"
          className="live-track-close"
          onClick={onClose}
          aria-label="Close live view"
        >
          ✕
        </button>

        {/* Header */}
        <header className="live-track-header">
          <div className="live-track-title-block">
            <h2 className="live-track-title">{droneName}</h2>
            <span className="live-track-status-dot" />
            <span className="live-track-status-label">Online</span>
          </div>
        </header>

        {/* Main layout: video + telemetry + mini-map */}
        <div className="live-track-main">
          {/* VIDEO AREA */}
          <div className="live-track-video" onClick={handleVideoClick}>
            {/* LIVE / PAUSED pill */}
            <div className={`live-pill ${isPlaying ? "on" : "paused"}`}>
              {isPlaying ? "LIVE" : "PAUSED"}
            </div>

            {/* Actual video element */}
            <video
              ref={videoRef}
              className="live-video-element"
              src={DEMO_VIDEO_SRC}
              muted
              loop
              playsInline
              controls
              autoPlay
              onCanPlay={handleVideoReady}
              onPlay={handleVideoReady}
              onError={handleVideoError}
            >
              <source src={DEMO_VIDEO_SRC} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Placeholder / error messages */}
            {!isVideoReady && !videoError && (
              <div className="video-placeholder-text">
                Stream will start playing automatically
                <br />
                when it is live
              </div>
            )}

            {videoError && (
              <div className="video-placeholder-text video-error">
                {videoError}
                <br />
                Open DevTools → Network and check that{" "}
                <code>{DEMO_VIDEO_SRC}</code> returns 200.
              </div>
            )}

            {/* HUD overlay */}
            <div className="video-overlay">
              <div className="crosshair-circle" />
              <div className="crosshair-line horiz" />
              <div className="crosshair-line vert" />
            </div>
          </div>

          {/* TELEMETRY PANEL */}
          <aside className="live-track-telemetry">
            <h3 className="telemetry-title">Telemetry</h3>
            <div className="telemetry-row">
              <span className="telemetry-label">Mode</span>
              <span className="telemetry-value">IDLE</span>
            </div>
            <div className="telemetry-row">
              <span className="telemetry-label">Altitude</span>
              <span className="telemetry-value">{altitude.toFixed(1)} m</span>
            </div>
            <div className="telemetry-row">
              <span className="telemetry-label">H-speed</span>
              <span className="telemetry-value">{hSpeed.toFixed(1)} m/s</span>
            </div>
            <div className="telemetry-row">
              <span className="telemetry-label">V-speed</span>
              <span className="telemetry-value">{vSpeed.toFixed(1)} m/s</span>
            </div>
            <div className="telemetry-row">
              <span className="telemetry-label">Battery</span>
              <span className="telemetry-value">{battery}%</span>
            </div>
            <div className="telemetry-row">
              <span className="telemetry-label">Lat</span>
              <span className="telemetry-value">
                {(livePosition as Point)[0].toFixed(5)}
              </span>
            </div>
            <div className="telemetry-row">
              <span className="telemetry-label">Lon</span>
              <span className="telemetry-value">
                {(livePosition as Point)[1].toFixed(5)}
              </span>
            </div>
          </aside>

          {/* MINI MAP */}
          <div className="live-track-mini-map-wrapper">
            <MapContainer
              center={livePosition}
              zoom={18}
              scrollWheelZoom={false}
              zoomControl={false}
              className="live-track-mini-map"
            >
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution='&copy; Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
              />
              <ZoomControl position="topright" />
              <Marker position={livePosition} />
              <Polyline
                positions={track as LatLngExpression[]}
                pathOptions={{ weight: 3 }}
              />
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTrackModal;
