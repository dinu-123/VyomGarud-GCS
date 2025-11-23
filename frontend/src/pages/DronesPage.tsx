

// import React from "react";
// import "./DronesPage.css";

// type DroneStatus = "online" | "offline";

// interface DroneRow {
//   id: string;
//   name: string;
//   model: string;
//   pilots: number;
//   flights: number;
//   dateAdded: string;
//   lastPilot: string;
//   status: DroneStatus;
// }

// const demoDrones: DroneRow[] = [
//   {
//     id: "VG-DR-001",
//     name: "Hawk Demo",
//     model: "VyomGarud Demo Drone",
//     pilots: 2,
//     flights: 12,
//     dateAdded: "Aug 8, 2025",
//     lastPilot: "System",
//     status: "online",
//   },
//   {
//     id: "VG-DR-002",
//     name: "Divyanshu SITL",
//     model: "Blue Jay",
//     pilots: 1,
//     flights: 4,
//     dateAdded: "Aug 10, 2025",
//     lastPilot: "Demo Pilot",
//     status: "offline",
//   },
//   {
//   name: "Internal Testing Raven 2",
//   model: "Raven",
//   pilots: 1,
//   flights: 123,
//   dateAdded: "Aug 4, 2022",
//   lastPilot: "Divyanshu",
//   status: "OFFLINE",
// },
// {
//   "name": "CUBE Hawk 2",
//   "model": "Hawk",
//   "pilots": 1,
//   "flights": 81,
//   "dateAdded": "Aug 29, 2022",
//   "lastPilot": "No Info",
//   "status": "ONLINE",
// },
// ];

// function DronesPage() {
//   return (
//     <div className="drones-page">
//       {/* Header */}
//       <header className="drones-header">
//         <div>
//           <h1 className="drones-title">Drone Fleet</h1>
//           <p className="drones-subtitle">
//             Manage your VyomGarud drones (demo data for now).
//           </p>
//         </div>

//         <button
//           type="button"
//           className="primary-button"
//           onClick={() => {
//             // Placeholder – will wire to a real dialog / form later
//             alert("In the real app, this will open the 'Add Drone' form.");
//           }}
//         >
//           Add Drone
//         </button>
//       </header>

//       {/* Main card */}
//       <section className="drones-card">
//         {demoDrones.length === 0 ? (
//           <div className="drones-empty">
//             <p className="drones-empty-title">No drones added yet</p>
//             <p className="drones-empty-text">
//               Click <strong>Add Drone</strong> to register your first aircraft into this
//               organisation.
//             </p>
//           </div>
//         ) : (
//           <div className="drones-table-wrapper">
//             <table className="drones-table">
//               <thead>
//                 <tr>
//                   <th className="col-drone">Drone</th>
//                   <th>Pilots</th>
//                   <th>Flights</th>
//                   <th>Date Added</th>
//                   <th>Last Pilot</th>
//                   <th className="col-status">Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {demoDrones.map((drone) => (
//                   <tr
//                     key={drone.id}
//                     className="drones-row"
//                     onClick={() =>
//                       alert(`In the real app this opens details for ${drone.name}.`)
//                     }
//                   >
//                     <td className="col-drone">
//                       <div className="drone-main">
//                         <div
//                           className={
//                             "drone-status-dot " +
//                             (drone.status === "online"
//                               ? "drone-status-dot--online"
//                               : "drone-status-dot--offline")
//                           }
//                         />
//                         <div className="drone-text">
//                           <div className="drone-name">{drone.name}</div>
//                           <div className="drone-model">{drone.model}</div>
//                         </div>
//                       </div>
//                     </td>
//                     <td>{drone.pilots}</td>
//                     <td>{drone.flights}</td>
//                     <td>{drone.dateAdded}</td>
//                     <td>{drone.lastPilot}</td>
//                     <td className="col-status">
//                       <span
//                         className={
//                           "status-pill " +
//                           (drone.status === "online"
//                             ? "status-pill--online"
//                             : "status-pill--offline")
//                         }
//                       >
//                         {drone.status === "online" ? "Online" : "Offline"}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </section>
//     </div>
//   );
// }

// export default DronesPage;


// src/pages/DronesPage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./DronesPage.css";

type DroneStatus = "online" | "offline";

interface DroneRow {
  id: string;
  name: string;
  model: string;
  pilots: number;
  flights: number;
  dateAdded: string;
  lastPilot: string;
  status: DroneStatus;
}

const demoDrones: DroneRow[] = [
  {
    id: "hawk-demo",
    name: "Hawk Demo",
    model: "VyomGarud Demo Drone",
    pilots: 2,
    flights: 12,
    dateAdded: "Aug 8, 2025",
    lastPilot: "System",
    status: "online",
  },
  {
    id: "divyanshu-sitl",
    name: "Divyanshu SITL",
    model: "Blue Jay",
    pilots: 1,
    flights: 4,
    dateAdded: "Aug 10, 2025",
    lastPilot: "Demo Pilot",
    status: "offline",
  },
  {
    id: "raven-2",
    name: "Internal Testing Raven 2",
    model: "Raven",
    pilots: 1,
    flights: 123,
    dateAdded: "Aug 4, 2022",
    lastPilot: "Divyanshu",
    status: "offline",
  },
  {
    id: "cube-hawk-2",
    name: "CUBE Hawk 2",
    model: "Hawk",
    pilots: 1,
    flights: 81,
    dateAdded: "Aug 29, 2022",
    lastPilot: "No Info",
    status: "offline",
  },
];

function DronesPage() {
  const navigate = useNavigate();

  const handleRowClick = (drone: DroneRow) => {
    // ✅ Instead of alert, go to detail page
    navigate(`/console/drones/${drone.id}`);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Drone Fleet</h1>
        <p className="page-subtitle">
          Manage your VyomGarud drones (demo data for now).
        </p>
      </div>

      <div className="drones-card">
        <table className="drones-table">
          <thead>
            <tr>
              <th>Drone</th>
              <th>Pilots</th>
              <th>Flights</th>
              <th>Date Added</th>
              <th>Last Pilot</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {demoDrones.map((drone) => (
              <tr
                key={drone.id}
                className="drones-row"
                onClick={() => handleRowClick(drone)}
              >
                <td>
                  <div className="drone-main-cell">
                    <span
                      className={
                        drone.status === "online"
                          ? "status-dot status-dot-online"
                          : "status-dot status-dot-offline"
                      }
                    />
                    <div className="drone-main-text">
                      <div className="drone-name">{drone.name}</div>
                      <div className="drone-model">{drone.model}</div>
                    </div>
                  </div>
                </td>
                <td>{drone.pilots}</td>
                <td>{drone.flights}</td>
                <td>{drone.dateAdded}</td>
                <td>{drone.lastPilot}</td>
                <td>
                  <span
                    className={
                      drone.status === "online"
                        ? "status-pill status-pill-online"
                        : "status-pill status-pill-offline"
                    }
                  >
                    {drone.status.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DronesPage;

