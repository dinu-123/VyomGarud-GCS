// // src/components/LiveMap.tsx
// import React, { useEffect, useMemo, useState } from "react";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Polyline,
//   useMap,
// } from "react-leaflet";
// import L, { LatLngExpression } from "leaflet";
// import "leaflet/dist/leaflet.css";
// import "./LiveMap.css";

// type LiveMapProps = {
//   lat: number;
//   lon: number;
//   autoFollow?: boolean; // camera follows drone
// };

// const droneIcon = L.icon({
//   iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
//   shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [0, -32],
//   shadowSize: [41, 41],
// });

// function FollowDrone({
//   position,
//   autoFollow,
// }: {
//   position: LatLngExpression;
//   autoFollow: boolean;
// }) {
//   const map = useMap();

//   useEffect(() => {
//     if (!autoFollow) return;
//     map.setView(position, map.getZoom(), { animate: true });
//   }, [position, autoFollow, map]);

//   return null;
// }

// const LiveMap: React.FC<LiveMapProps> = ({
//   lat,
//   lon,
//   autoFollow = true,
// }) => {
//   const [track, setTrack] = useState<LatLngExpression[]>([]);

//   // Build track / trail from the incoming lat/lon
//   useEffect(() => {
//     if (!Number.isFinite(lat) || !Number.isFinite(lon)) return;

//     const point: LatLngExpression = [lat, lon];

//     setTrack((prev) => {
//       if (prev.length) {
//         const [lastLat, lastLon] = prev[prev.length - 1] as [number, number];
//         if (lastLat === lat && lastLon === lon) return prev;
//       }
//       const next = [...prev, point];
//       // keep last 300 points
//       return next.slice(-300);
//     });
//   }, [lat, lon]);

//   const currentPosition = useMemo<LatLngExpression>(() => {
//     if (track.length) return track[track.length - 1]!;
//     if (Number.isFinite(lat) && Number.isFinite(lon)) return [lat, lon];
//     // default to Bengaluru if nothing yet
//     return [12.9716, 77.5946];
//   }, [track, lat, lon]);

//   const initialCenter: LatLngExpression = currentPosition;

//   return (
//     <div className="vg-live-map-root">
//       <MapContainer
//         center={initialCenter}
//         zoom={17}
//         scrollWheelZoom
//         minZoom={3}
//         maxZoom={20}
//         className="vg-live-map-leaflet"
//       >
//         {/* Premium-feeling satellite imagery (Esri World Imagery) */}
//         <TileLayer
//           url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
//           attribution='&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
//         />

//         {track.length > 1 && (
//           <Polyline
//             positions={track}
//             pathOptions={{
//               weight: 3,
//               opacity: 0.9,
//             }}
//           />
//         )}

//         <Marker position={currentPosition} icon={droneIcon} />
//         <FollowDrone position={currentPosition} autoFollow={autoFollow} />
//       </MapContainer>
//     </div>
//   );
// };

// export default LiveMap;



// // src/components/LiveMap.tsx
// import React, { useEffect } from "react";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Polyline,
//   useMap,
// } from "react-leaflet";
// import L, { LatLngExpression } from "leaflet";
// import "leaflet/dist/leaflet.css";
// import "./LiveMap.css";

// type LiveMapProps = {
//   lat: number;
//   lon: number;
//   track?: { lat: number; lon: number }[];
//   follow?: boolean; // camera follows drone when true
// };

// const defaultIcon = L.icon({
//   iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
//   shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowSize: [41, 41],
// });

// L.Marker.prototype.options.icon = defaultIcon;

// const FollowDrone: React.FC<{ center: LatLngExpression }> = ({ center }) => {
//   const map = useMap();

//   useEffect(() => {
//     map.setView(center);
//   }, [center, map]);

//   return null;
// };

// const LiveMap: React.FC<LiveMapProps> = ({
//   lat,
//   lon,
//   track = [],
//   follow = true,
// }) => {
//   const center: LatLngExpression = [lat, lon];
//   const trackLatLngs: LatLngExpression[] = track.map((p) => [p.lat, p.lon]);

//   return (
//     <div className="live-map-root">
//       <MapContainer
//         center={center}
//         zoom={18}
//         scrollWheelZoom
//         className="live-map-container"
//       >
//         {/* Esri satellite tiles for premium look */}
//         <TileLayer
//           url="https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
//           attribution='&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, Getmapping,
//           Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
//         />
//         {follow && <FollowDrone center={center} />}
//         {trackLatLngs.length > 1 && (
//           <Polyline positions={trackLatLngs} pathOptions={{ color: "#3b82f6", weight: 3 }} />
//         )}
//         <Marker position={center} />
//       </MapContainer>
//     </div>
//   );
// };

// export default LiveMap;



// // src/components/LiveMap.tsx
// import React, { useEffect } from "react";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Polyline,
//   ZoomControl,
//   useMap,
// } from "react-leaflet";
// import L, { LatLngExpression } from "leaflet";
// import "leaflet/dist/leaflet.css";

// type LiveMapProps = {
//   center: [number, number];
//   track?: [number, number][];
// };

// const defaultIcon = L.icon({
//   iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
//   shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   iconSize: [25, 41],
// });

// L.Marker.prototype.options.icon = defaultIcon;

// const FollowDrone: React.FC<{ center: [number, number] }> = ({ center }) => {
//   const map = useMap();

//   useEffect(() => {
//     if (!center) return;
//     map.setView(center, map.getZoom(), {
//       animate: true,
//     });
//   }, [center, map]);

//   return null;
// };

// const LiveMap: React.FC<LiveMapProps> = ({ center, track = [] }) => {
//   const polyline: LatLngExpression[] = track;

//   return (
//     <MapContainer
//       className="live-map"
//       center={center}
//       zoom={17}
//       minZoom={4}
//       maxZoom={19} // avoid going too far and seeing grey tiles
//       zoomControl={false}
//       scrollWheelZoom={true}
//     >
//       {/* Esri satellite tiles – similar visual to your reference */}
//       <TileLayer
//         attribution='&copy; Esri, Maxar, Earthstar Geographics, and the GIS User Community'
//         url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
//       />

//       <FollowDrone center={center} />

//       {polyline.length > 1 && (
//         <Polyline positions={polyline} pathOptions={{ weight: 3 }} />
//       )}

//       <Marker position={center} />

//       <ZoomControl position="topright" />
//     </MapContainer>
//   );
// };

// export default LiveMap;




// // src/components/LiveMap.tsx
// import React, { useEffect } from "react";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Polyline,
//   useMap,
// } from "react-leaflet";
// import L, { LatLngExpression } from "leaflet";
// import "leaflet/dist/leaflet.css";
// import "./LiveMap.css";

// type TrackPoint = {
//   lat: number;
//   lon: number;
// };

// type LiveMapProps = {
//   // we support multiple prop names so it keeps working
//   lat?: number;
//   lon?: number;
//   centerLat?: number;
//   centerLon?: number;
//   path?: TrackPoint[];
//   track?: TrackPoint[];
//   follow?: boolean;
//   zoom?: number;
// };

// // ---------- helpers ----------

// const FALLBACK_CENTER: LatLngExpression = [12.9716, 77.5946]; // Bengaluru

// function isValidCoord(v: unknown): v is number {
//   return typeof v === "number" && !Number.isNaN(v);
// }

// function makeLatLng(lat?: number, lon?: number): LatLngExpression {
//   if (isValidCoord(lat) && isValidCoord(lon)) {
//     return [lat, lon];
//   }
//   return FALLBACK_CENTER;
// }

// // Nice drone-style marker icon (not the default pin)
// const droneIcon = L.icon({
//   iconUrl:
//     "https://cdn-icons-png.flaticon.com/512/2928/2928888.png", // drone icon
//   iconSize: [36, 36],
//   iconAnchor: [18, 18],
//   popupAnchor: [0, -18],
//   className: "drone-marker-icon",
// });

// // Component to keep map centered on active drone when follow=true
// const FollowView: React.FC<{ position: LatLngExpression; follow: boolean }> = ({
//   position,
//   follow,
// }) => {
//   const map = useMap();

//   useEffect(() => {
//     if (!follow) return;
//     // smooth pan to new position
//     map.setView(position, map.getZoom(), {
//       animate: true,
//     });
//   }, [position, follow, map]);

//   return null;
// };

// // ---------- main component ----------

// const LiveMap: React.FC<LiveMapProps> = (props) => {
//   const {
//     lat,
//     lon,
//     centerLat,
//     centerLon,
//     path,
//     track,
//     follow = true,
//     zoom = 17,
//   } = props;

//   // choose whichever coordinates are present
//   const primaryLat = isValidCoord(lat) ? lat : centerLat;
//   const primaryLon = isValidCoord(lon) ? lon : centerLon;

//   const center = makeLatLng(primaryLat, primaryLon);
//   const markerPosition = center;

//   // choose track/path and clean invalid points
//   const rawTrack = (track ?? path ?? []) as TrackPoint[];
//   const linePositions: LatLngExpression[] = rawTrack
//     .filter(
//       (p) => isValidCoord(p?.lat) && isValidCoord(p?.lon)
//     )
//     .map((p) => [p.lat, p.lon]);

//   return (
//     <div className="live-map-root">
//       <MapContainer
//         center={center}
//         zoom={zoom}
//         className="live-map-container"
//         scrollWheelZoom={true}
//       >
//         {/* Esri World Imagery style (nice satellite look) */}
//         <TileLayer
//           attribution='&copy; Esri &amp; contributors'
//           url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
//         />

//         <Marker position={markerPosition} icon={droneIcon} />

//         {linePositions.length > 1 && (
//           <Polyline positions={linePositions} />
//         )}

//         <FollowView position={markerPosition} follow={follow} />
//       </MapContainer>
//     </div>
//   );
// };

// export default LiveMap;



// // src/components/LiveMap.tsx
// import React, { useEffect, useState } from "react";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Polyline,
//   ZoomControl,
//   useMap,
// } from "react-leaflet";
// import type { LatLngExpression } from "leaflet";
// import "leaflet/dist/leaflet.css";

// type LiveMapProps = {
//   lat?: number;
//   lon?: number;
// };

// // simple track point for demo
// type TrackPoint = {
//   lat: number;
//   lon: number;
// };

// const defaultCenter: LatLngExpression = [12.9716, 77.5946]; // Bengaluru

// // Fix default Leaflet marker icon (and use a drone icon instead)
// const droneIcon = L.icon({
//   iconUrl:
//     "https://cdn-icons-png.flaticon.com/512/809/809957.png", // drone-style icon
//   iconSize: [36, 36],
//   iconAnchor: [18, 18],
//   popupAnchor: [0, -18],
// });

// // helper component: recenter map when position changes
// const RecenterOnPosition: React.FC<{ position: LatLngExpression }> = ({
//   position,
// }) => {
//   const map = useMap();
//   useEffect(() => {
//     map.setView(position);
//   }, [position, map]);
//   return null;
// };

// const LiveMap: React.FC<LiveMapProps> = ({ lat, lon }) => {
//   // guard against invalid values -> avoid "Invalid LatLng" error
//   const safeLat =
//     typeof lat === "number" && Number.isFinite(lat) ? lat : (defaultCenter as [
//       number,
//       number,
//     ])[0];
//   const safeLon =
//     typeof lon === "number" && Number.isFinite(lon) ? lon : (defaultCenter as [
//       number,
//       number,
//     ])[1];

//   const currentPosition: LatLngExpression = [safeLat, safeLon];

//   const [track, setTrack] = useState<TrackPoint[]>([]);

//   // fake track: just append current position whenever it changes
//   useEffect(() => {
//     setTrack((prev) => [...prev, { lat: safeLat, lon: safeLon }].slice(-200));
//   }, [safeLat, safeLon]);

//   return (
//     <div
//       className="live-map-leaflet-wrapper"
//       style={{
//         width: "100%",
//         height: "360px", // full height in the card
//         borderRadius: "24px",
//         overflow: "hidden",
//       }}
//     >
//       <MapContainer
//         center={currentPosition}
//         zoom={17}
//         zoomControl={false}
//         style={{
//           width: "100%",
//           height: "100%",
//         }}
//       >
//         {/* Esri / satellite style tiles */}
//         <TileLayer
//           url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
//           attribution='&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
//         />

//         <ZoomControl position="topright" />

//         <Marker position={currentPosition} icon={droneIcon} />

//         {track.length > 1 && (
//           <Polyline
//             positions={track.map((p) => [p.lat, p.lon]) as LatLngExpression[]}
//           />
//         )}

//         <RecenterOnPosition position={currentPosition} />
//       </MapContainer>
//     </div>
//   );
// };

// export default LiveMap;




// src/components/LiveMap.tsx
import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  ZoomControl,
  useMap,
} from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import L from "leaflet"; // <-- runtime import for L (fixes TS2686)
import "leaflet/dist/leaflet.css";

// Props used in different places:
//  - LiveTrackModal / Dashboard pass center + track
//  - Some places pass lat / lon
export type LiveMapProps = {
  lat?: number;
  lon?: number;
  center?: [number, number];
  track?: [number, number][];
};

// simple track point for demo / internal tracking
type TrackPoint = {
  lat: number;
  lon: number;
};

const defaultCenter: LatLngExpression = [12.9716, 77.5946]; // Bengaluru

// Drone marker icon
const droneIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/809/809957.png",
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  popupAnchor: [0, -18],
});

// helper component: recenter map when position changes
const RecenterOnPosition: React.FC<{ position: LatLngExpression }> = ({
  position,
}) => {
  const map = useMap();
  useEffect(() => {
    map.setView(position);
  }, [position, map]);
  return null;
};

const LiveMap: React.FC<LiveMapProps> = ({ lat, lon, center, track }) => {
  // Guard against invalid lat/lon
  const safeLat =
    typeof lat === "number" && Number.isFinite(lat)
      ? lat
      : (defaultCenter as [number, number])[0];

  const safeLon =
    typeof lon === "number" && Number.isFinite(lon)
      ? lon
      : (defaultCenter as [number, number])[1];

  // If a center prop is provided (from Dashboard / LiveTrackModal),
  // prefer that. Otherwise fall back to lat/lon or defaultCenter.
  const effectiveCenter: LatLngExpression = center ?? [safeLat, safeLon];

  // Internal track for the "lat/lon only" case
  const [internalTrack, setInternalTrack] = useState<TrackPoint[]>([]);

  // Fake track: just append current position when it changes (only when we
  // are not receiving an explicit `track` prop).
  useEffect(() => {
    if (track && track.length > 0) return; // external track in control

    setInternalTrack((prev) =>
      [...prev, { lat: safeLat, lon: safeLon }].slice(-200)
    );
  }, [safeLat, safeLon, track]);

  // Decide which track to render
  const linePositions: LatLngExpression[] = track
    ? track.map(([tLat, tLon]) => [tLat, tLon])
    : internalTrack.map((p) => [p.lat, p.lon]);

  return (
    <div
      className="live-map-leaflet-wrapper"
      style={{
        width: "100%",
        height: "360px",
        borderRadius: "24px",
        overflow: "hidden",
      }}
    >
      <MapContainer
        center={effectiveCenter}
        zoom={17}
        zoomControl={false}
        style={{ width: "100%", height: "100%" }}
      >
        {/* Esri / satellite style tiles */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution='&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        />

        <ZoomControl position="topright" />

        <Marker position={effectiveCenter} icon={droneIcon} />

        {linePositions.length > 1 && <Polyline positions={linePositions} />}

        <RecenterOnPosition position={effectiveCenter} />
      </MapContainer>
    </div>
  );
};

export default LiveMap;
