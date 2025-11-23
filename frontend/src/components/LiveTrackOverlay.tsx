// // src/components/LiveTrackOverlay.tsx
// import React, { useEffect, useRef, useState } from "react";
// import LiveMap from "./LiveMap";

// type Telemetry = {
//   lat: number;
//   lon: number;
//   alt: number;
//   battery: number;
//   h_speed?: number;
//   v_speed?: number;
//   mode?: string;
// };

// type Props = {
//   open: boolean;
//   onClose: () => void;
//   droneInfo?:
//     | {
//         name: string;
//         mission: string;
//         home: string;
//       }
//     | undefined;
//   streamUrl: string;
//   telemetry: Telemetry;
//   track: [number, number][];
// };

// const LiveTrackOverlay: React.FC<Props> = ({
//   open,
//   onClose,
//   droneInfo,
//   streamUrl,
//   telemetry,
//   track,
// }) => {
//   const videoRef = useRef<HTMLVideoElement | null>(null);
//   const [status, setStatus] = useState<"idle" | "connecting" | "playing" | "error">(
//     "idle"
//   );

//   // reset status whenever overlay opens
//   useEffect(() => {
//     if (!open) {
//       setStatus("idle");
//     } else {
//       setStatus("connecting");
//     }
//   }, [open]);

//   // hook video element to stream URL
//   useEffect(() => {
//     if (!open || !streamUrl) return;

//     const video = videoRef.current;
//     if (!video) return;

//     setStatus("connecting");
//     video.src = streamUrl;
//     video.autoplay = true;
//     video.muted = true;
//     video.playsInline = true;

//     const handleCanPlay = () => {
//       setStatus("playing");
//       video
//         .play()
//         .catch(() => {
//           // autoplay blocked; still show as connecting
//           setStatus("connecting");
//         });
//     };

//     const handleError = () => {
//       setStatus("error");
//     };

//     video.addEventListener("canplay", handleCanPlay);
//     video.addEventListener("error", handleError);

//     return () => {
//       video.pause();
//       video.removeEventListener("canplay", handleCanPlay);
//       video.removeEventListener("error", handleError);
//     };
//   }, [open, streamUrl]);

//   if (!open) return null;

//   const name = droneInfo?.name ?? "Drone";

//   return (
//     <div className="live-track-overlay">
//       {/* top bar with name and close button */}
//       <div className="lto-top-bar">
//         <div className="lto-drone-name">{name}</div>
//         <div className="lto-top-right">
//           <div className="lto-status-pill">
//             <span className="lto-status-dot" />
//             <span>Online</span>
//           </div>
//           <button className="lto-close-btn" onClick={onClose}>
//             ✕
//           </button>
//         </div>
//       </div>

//       {/* video area */}
//       <div className="lto-video-wrapper">
//         <video
//           ref={videoRef}
//           className={`lto-video ${
//             status === "playing" ? "lto-video-visible" : "lto-video-hidden"
//           }`}
//         />

//         {/* center overlay text for connecting / error */}
//         {status === "connecting" && (
//           <div className="lto-center-message">
//             <div>Stream will start playing automatically</div>
//             <div>when it is live</div>
//           </div>
//         )}

//         {status === "error" && (
//           <div className="lto-center-message lto-error-message">
//             <div>Unable to load live stream.</div>
//             <div>Please check the stream URL or server.</div>
//           </div>
//         )}
//       </div>

//       {/* mini map bottom-right */}
//       <div className="lto-mini-map">
//         <LiveMap center={[telemetry.lat, telemetry.lon]} track={track} />
//       </div>
//     </div>
//   );
// };

// export default LiveTrackOverlay;



// // src/components/LiveTrackOverlay.tsx
// import React, { useEffect, useRef, useState } from "react";
// import "./LiveTrackOverlay.css";

// import { MapContainer, TileLayer, Marker } from "react-leaflet";
// import L from "leaflet";

// type Telemetry = {
//   lat: number;
//   lon: number;
//   alt: number;
//   battery: number;
//   h_speed?: number;
//   v_speed?: number;
//   mode?: string;
// };

// type LiveTrackOverlayProps = {
//   droneName: string;
//   streamUrl: string;          // comes from DashboardPage
//   telemetry: Telemetry;
//   track: [number, number][];
//   onClose: () => void;
// };

// const droneIcon = L.divIcon({
//   className: "live-track-drone-icon",
//   html: "✈",
//   iconSize: [24, 24],
//   iconAnchor: [12, 12],
// });

// const LiveTrackOverlay: React.FC<LiveTrackOverlayProps> = ({
//   droneName,
//   streamUrl,
//   telemetry,
//   track,
//   onClose,
// }) => {
//   const videoRef = useRef<HTMLVideoElement | null>(null);

//   // true = show "Stream will start..." text
//   const [showPlaceholder, setShowPlaceholder] = useState(true);

//   // try to autoplay whenever the URL changes / overlay opens
//   useEffect(() => {
//     const v = videoRef.current;
//     if (!v) return;

//     const play = async () => {
//       try {
//         await v.play();
//       } catch (err) {
//         // browser blocked autoplay – user can click on the video to start
//         console.warn("Autoplay failed, waiting for user interaction", err);
//       }
//     };

//     play();
//   }, [streamUrl]);

//   // when video is actually ready → hide the text (this gives you 2nd image)
//   const handleCanPlay = () => {
//     setShowPlaceholder(false);
//   };

//   // extra safety: even if onCanPlay never fires, remove text after 3s
//   useEffect(() => {
//     const id = window.setTimeout(() => setShowPlaceholder(false), 3000);
//     return () => window.clearTimeout(id);
//   }, []);

//   return (
//     <div className="live-track-overlay-backdrop">
//       <div className="live-track-overlay">
//         {/* HEADER */}
//         <header className="live-track-header">
//           <div className="live-track-header-left">
//             <div className="live-track-drone-name">{droneName}</div>
//             <div className="live-track-status-row">
//               <span className="status-dot" />
//               <span>Online</span>
//             </div>
//           </div>

//           <button className="live-track-close" onClick={onClose}>
//             ✕
//           </button>
//         </header>

//         {/* MAIN LAYOUT */}
//         <div className="live-track-main">
//           {/* BIG VIDEO AREA (center) */}
//           <div className="live-track-video-shell">
//             {showPlaceholder && (
//               <div className="live-track-placeholder">
//                 Stream will start playing automatically
//                 <br />
//                 when it is live
//               </div>
//             )}

//             <video
//               ref={videoRef}
//               className="live-track-video"
//               src={streamUrl}
//               autoPlay
//               muted
//               loop
//               playsInline
//               controls={false}          // <— no ugly browser controls
//               onCanPlay={handleCanPlay} // <— switch from 1st → 2nd image
//             />
//           </div>

//           {/* TELEMETRY PANEL (right side) */}
//           <aside className="live-track-side">
//             <h3 className="side-title">Telemetry</h3>
//             <div className="side-row">
//               <span>Mode</span>
//               <span>{telemetry.mode ?? "IDLE"}</span>
//             </div>
//             <div className="side-row">
//               <span>Altitude</span>
//               <span>{telemetry.alt.toFixed(1)} m</span>
//             </div>
//             <div className="side-row">
//               <span>H-speed</span>
//               <span>{(telemetry.h_speed ?? 0).toFixed(1)} m/s</span>
//             </div>
//             <div className="side-row">
//               <span>V-speed</span>
//               <span>{(telemetry.v_speed ?? 0).toFixed(1)} m/s</span>
//             </div>
//             <div className="side-row">
//               <span>Battery</span>
//               <span>{telemetry.battery.toFixed(1)}%</span>
//             </div>
//             <div className="side-row">
//               <span>Lat</span>
//               <span>{telemetry.lat.toFixed(5)}</span>
//             </div>
//             <div className="side-row">
//               <span>Lon</span>
//               <span>{telemetry.lon.toFixed(5)}</span>
//             </div>
//           </aside>

//           {/* MINI MAP (bottom-right) */}
//           <div className="live-track-mini-map">
//             <MapContainer
//               center={[telemetry.lat, telemetry.lon]}
//               zoom={16}
//               scrollWheelZoom={false}
//               zoomControl={false}
//               dragging={false}
//               doubleClickZoom={false}
//               className="live-track-mini-map-leaflet"
//             >
//               <TileLayer
//                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                 attribution="&copy; OpenStreetMap contributors"
//               />
//               <Marker
//                 position={[telemetry.lat, telemetry.lon]}
//                 icon={droneIcon}
//               />
//             </MapContainer>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LiveTrackOverlay;






// src/components/LiveTrackOverlay.tsx
import React, { useEffect, useState } from "react";
import "./LiveTrackOverlay.css";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type LiveTrackTelemetry = {
  lat: number;
  lon: number;
  alt: number;
  battery: number;
  h_speed?: number;
  v_speed?: number;
  mode?: string;
};

type LiveTrackOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
  droneName: string;
  telemetry: LiveTrackTelemetry;
  videoUrl?: string; // kept for future, not required right now
};

const droneIcon = L.divIcon({
  className: "lt-drone-icon",
  html: "🛸",
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const LiveTrackOverlay: React.FC<LiveTrackOverlayProps> = ({
  isOpen,
  onClose,
  droneName,
  telemetry,
}) => {
  const [phase, setPhase] = useState<"waiting" | "live">("waiting");

  // whenever overlay opens, show waiting screen first, then switch to "live"
  useEffect(() => {
    if (!isOpen) return;
    setPhase("waiting");
    const timer = window.setTimeout(() => setPhase("live"), 1500);
    return () => window.clearTimeout(timer);
  }, [isOpen, droneName]);

  if (!isOpen) return null;

  return (
    <div className="lt-overlay-backdrop">
      <div className="lt-overlay-shell">
        <header className="lt-header">
          <div className="lt-header-left">
            <div className="lt-drone-name">{droneName}</div>
            <div className="lt-status-line">
              <span className="lt-status-dot" />
              <span>Online</span>
            </div>
          </div>

          <button className="lt-close-btn" onClick={onClose}>
            ✕
          </button>
        </header>

        <div className="lt-main">
          <div className="lt-video-area">
            {phase === "waiting" ? (
              <div className="lt-waiting-screen">
                <p>Stream will start playing automatically</p>
                <p>when it is live</p>
              </div>
            ) : (
              <div className="lt-live-dummy-video">
                <div className="lt-crosshair" />
                <div className="lt-live-label">LIVE</div>
              </div>
            )}
          </div>

          <aside className="lt-telemetry-panel">
            <div className="lt-telemetry-title">Telemetry</div>
            <div className="lt-telemetry-row">
              <span>Mode</span>
              <span>{telemetry.mode ?? "IDLE"}</span>
            </div>
            <div className="lt-telemetry-row">
              <span>Altitude</span>
              <span>{telemetry.alt.toFixed(1)} m</span>
            </div>
            <div className="lt-telemetry-row">
              <span>H-speed</span>
              <span>{(telemetry.h_speed ?? 0).toFixed(1)} m/s</span>
            </div>
            <div className="lt-telemetry-row">
              <span>V-speed</span>
              <span>{(telemetry.v_speed ?? 0).toFixed(1)} m/s</span>
            </div>
            <div className="lt-telemetry-row">
              <span>Battery</span>
              <span>{telemetry.battery.toFixed(1)}%</span>
            </div>
            <div className="lt-telemetry-row">
              <span>Lat</span>
              <span>{telemetry.lat.toFixed(5)}</span>
            </div>
            <div className="lt-telemetry-row">
              <span>Lon</span>
              <span>{telemetry.lon.toFixed(5)}</span>
            </div>
          </aside>
        </div>

        {/* Small minimap in the bottom-right, like original product */}
        <div className="lt-minimap">
          <MapContainer
            center={[telemetry.lat, telemetry.lon]}
            zoom={17}
            scrollWheelZoom={false}
            className="lt-minimap-map"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker
              position={[telemetry.lat, telemetry.lon]}
              icon={droneIcon}
            />
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default LiveTrackOverlay;
