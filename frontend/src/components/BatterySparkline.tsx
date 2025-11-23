// // src/components/BatterySparkline.tsx
// import React from "react";
// import "./BatterySparkline.css";

// export type SparkPoint = {
//   ts: number;   // timestamp in seconds
//   value: number; // battery percentage 0–100
// };

// type BatterySparklineProps = {
//   data: SparkPoint[];
//   min?: number;
//   max?: number;
// };

// const BatterySparkline: React.FC<BatterySparklineProps> = ({
//   data,
//   min = 0,
//   max = 100,
// }) => {
//   // No data: render a simple placeholder bar
//   if (!data || data.length === 0) {
//     return (
//       <div className="battery-sparkline empty">
//         <div className="battery-sparkline-placeholder">
//           Waiting for telemetry…
//         </div>
//       </div>
//     );
//   }

//   const width = 600;
//   const height = 60;
//   const padding = 4;

//   const clamped = data.map((p) => ({
//     ts: p.ts,
//     value: Math.min(max, Math.max(min, p.value)),
//   }));

//   const minTs = clamped[0].ts;
//   const maxTs = clamped[clamped.length - 1].ts || minTs + 1;

//   const xScale = (ts: number) => {
//     if (maxTs === minTs) return padding;
//     return (
//       padding +
//       ((ts - minTs) / (maxTs - minTs)) * (width - padding * 2)
//     );
//   };

//   const yScale = (v: number) => {
//     if (max === min) return height / 2;
//     const norm = (v - min) / (max - min); // 0..1
//     return padding + (1 - norm) * (height - padding * 2);
//   };

//   const path = clamped
//     .map((p, idx) => {
//       const x = xScale(p.ts);
//       const y = yScale(p.value);
//       return `${idx === 0 ? "M" : "L"} ${x} ${y}`;
//     })
//     .join(" ");

//   const latest = clamped[clamped.length - 1];

//   return (
//     <div className="battery-sparkline">
//       <svg
//         viewBox={`0 0 ${width} ${height}`}
//         className="battery-sparkline-svg"
//         preserveAspectRatio="none"
//       >
//         {/* background */}
//         <rect
//           x={0}
//           y={0}
//           width={width}
//           height={height}
//           rx={8}
//           className="battery-sparkline-bg"
//         />

//         {/* grid line */}
//         <line
//           x1={padding}
//           y1={yScale(20)}
//           x2={width - padding}
//           y2={yScale(20)}
//           className="battery-sparkline-threshold"
//         />

//         {/* path */}
//         <path d={path} className="battery-sparkline-path" />

//         {/* latest dot */}
//         <circle
//           cx={xScale(latest.ts)}
//           cy={yScale(latest.value)}
//           r={3}
//           className="battery-sparkline-dot"
//         />
//       </svg>

//       <div className="battery-sparkline-footer">
//         <span>Battery</span>
//         <span>{latest.value.toFixed(1)} %</span>
//       </div>
//     </div>
//   );
// };

// export default BatterySparkline;





// // src/components/BatterySparkline.tsx
// import React from "react";
// import "./BatterySparkline.css";

// export type SparkPoint = {
//   ts: number;   // timestamp in seconds (or ms, doesn’t really matter for drawing)
//   value: number; // battery percentage 0–100
// };

// type BatterySparklineProps = {
//   data: SparkPoint[];
//   min?: number;  // default 0
//   max?: number;  // default 100
// };

// const BatterySparkline: React.FC<BatterySparklineProps> = ({
//   data,
//   min = 0,
//   max = 100,
// }) => {
//   if (!data || data.length === 0) {
//     return (
//       <div className="battery-sparkline empty">
//         <span className="battery-sparkline-placeholder">
//           No battery data yet
//         </span>
//       </div>
//     );
//   }

//   const clamped = data.map((p) => ({
//     ts: p.ts,
//     value: Math.min(Math.max(p.value, min), max),
//   }));

//   const xMin = clamped[0].ts;
//   const xMax = clamped[clamped.length - 1].ts || xMin + 1;
//   const xRange = xMax - xMin || 1;
//   const yRange = max - min || 1;

//   const points = clamped
//     .map((p) => {
//       const x = ((p.ts - xMin) / xRange) * 100;
//       const y = 100 - ((p.value - min) / yRange) * 100;
//       return `${x},${y}`;
//     })
//     .join(" ");

//   const latest = clamped[clamped.length - 1];

//   return (
//     <div className="battery-sparkline">
//       <svg
//         className="battery-sparkline-svg"
//         viewBox="0 0 100 100"
//         preserveAspectRatio="none"
//       >
//         {/* background line */}
//         <polyline
//           className="battery-sparkline-bg"
//           points="0,100 100,100"
//         />
//         {/* main line */}
//         <polyline
//           className="battery-sparkline-line"
//           points={points}
//         />
//       </svg>

//       <div className="battery-sparkline-meta">
//         <span className="battery-sparkline-label">Battery trend</span>
//         <span className="battery-sparkline-value">
//           {latest.value.toFixed(1)}%
//         </span>
//       </div>
//     </div>
//   );
// };

// export default BatterySparkline;




// src/components/BatterySparkline.tsx
import React from "react";
import "./BatterySparkline.css";

export type SparkPoint = {
  ts: number;
  value: number;
};

type BatterySparklineProps = {
  data: SparkPoint[];
  min?: number;
  max?: number;
};

const BatterySparkline: React.FC<BatterySparklineProps> = ({
  data,
  min = 0,
  max = 100,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="battery-sparkline empty">
        <span>No data</span>
      </div>
    );
  }

  const values = data.map((p) => p.value);
  const vMin = min ?? Math.min(...values);
  const vMax = max ?? Math.max(...values);
  const width = 260;
  const height = 32;

  const points = data
    .map((p, index) => {
      const x = (index / Math.max(data.length - 1, 1)) * width;
      const t = (p.value - vMin) / (vMax - vMin || 1);
      const y = height - t * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="battery-sparkline">
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <polyline points={points} />
      </svg>
    </div>
  );
};

export default BatterySparkline;
