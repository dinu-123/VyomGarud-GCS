// // src/layouts/MainLayout.tsx
// import { NavLink, Outlet, useNavigate } from "react-router-dom";
// import "./MainLayout.css";

// const MainLayout = () => {
//   const navigate = useNavigate();

//   const handleLogoClick = () => {
//     navigate("/console/dashboard");
//   };

//   return (
//     <div className="console-shell">
//       {/* Sidebar */}
//       <aside className="console-sidebar">
//         <div className="console-logo" onClick={handleLogoClick}>
//           <img src="/vyomgarud-logo.png" alt="VyomGarud" />
//         </div>

//         <nav className="console-nav">
//           <div className="console-nav-section-label">Overview</div>
//           <NavLink
//             to="/console/dashboard"
//             className={({ isActive }) =>
//               "console-nav-link" + (isActive ? " is-active" : "")
//             }
//           >
//             Dashboard
//           </NavLink>

//           <div className="console-nav-section-label">Fleet</div>
//           <NavLink
//             to="/console/drones"
//             className={({ isActive }) =>
//               "console-nav-link" + (isActive ? " is-active" : "")
//             }
//           >
//             Drones
//           </NavLink>
//           <NavLink
//             to="/console/flights"
//             className={({ isActive }) =>
//               "console-nav-link" + (isActive ? " is-active" : "")
//             }
//           >
//             Flights
//           </NavLink>
//           <NavLink
//             to="/console/pilots"
//             className={({ isActive }) =>
//               "console-nav-link" + (isActive ? " is-active" : "")
//             }
//           >
//             Pilots
//           </NavLink>

//           <div className="console-nav-section-label">Management</div>
//           <NavLink
//             to="/console/projects"
//             className={({ isActive }) =>
//               "console-nav-link" + (isActive ? " is-active" : "")
//             }
//           >
//             Projects
//           </NavLink>
//           <NavLink
//             to="/console/operation-calendar"
//             className={({ isActive }) =>
//               "console-nav-link" + (isActive ? " is-active" : "")
//             }
//           >
//             Operation Calendar
//           </NavLink>
//           <NavLink
//             to="/console/inspection"
//             className={({ isActive }) =>
//               "console-nav-link" + (isActive ? " is-active" : "")
//             }
//           >
//             Inspection
//           </NavLink>
//           <NavLink
//             to="/console/incidents"
//             className={({ isActive }) =>
//               "console-nav-link" + (isActive ? " is-active" : "")
//             }
//           >
//             Incidents
//           </NavLink>
//           <NavLink
//             to="/console/reports"
//             className={({ isActive }) =>
//               "console-nav-link" + (isActive ? " is-active" : "")
//             }
//           >
//             Generate Reports
//           </NavLink>

//           <div className="console-nav-section-label">Account</div>
//           <NavLink
//             to="/console/settings"
//             className={({ isActive }) =>
//               "console-nav-link" + (isActive ? " is-active" : "")
//             }
//           >
//             Settings
//           </NavLink>
//           <button
//             className="console-nav-link console-logout"
//             type="button"
//             onClick={() => navigate("/login")}
//           >
//             Logout
//           </button>
//         </nav>
//       </aside>

//       {/* Main content area */}
//       <div className="console-main">
//         <header className="console-header">
//           <span className="console-org-pill">Demo Org</span>
//           <div className="console-user-avatar">DG</div>
//         </header>

//         <main className="console-content">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default MainLayout;


// // src/layouts/MainLayout.tsx
// import React from "react";
// import { NavLink, Outlet } from "react-router-dom";
// import "./MainLayout.css";

// // If the logo is in /public, this Vite path works:
// import logo from "/vyomgarud-logo.png";

// const MainLayout: React.FC = () => {
//   return (
//     <div className="console-shell">
//       {/* Sidebar */}
//       <aside className="console-sidebar">
//         <div className="console-sidebar-logo">
//           <img src={logo} alt="VyomGarud" />
//         </div>

//         <nav className="console-sidebar-nav">
//           <div className="nav-section">
//             <div className="nav-section-label">OVERVIEW</div>
//             <NavLink
//               to="/console/dashboard"
//               className={({ isActive }) =>
//                 "nav-link" + (isActive ? " nav-link-active" : "")
//               }
//             >
//               Dashboard
//             </NavLink>
//           </div>

//           <div className="nav-section">
//             <div className="nav-section-label">FLEET</div>
//             <NavLink
//               to="/console/drones"
//               className={({ isActive }) =>
//                 "nav-link" + (isActive ? " nav-link-active" : "")
//               }
//             >
//               Drones
//             </NavLink>
//             <NavLink
//               to="/console/flights"
//               className={({ isActive }) =>
//                 "nav-link" + (isActive ? " nav-link-active" : "")
//               }
//             >
//               Flights
//             </NavLink>
//             <NavLink
//               to="/console/pilots"
//               className={({ isActive }) =>
//                 "nav-link" + (isActive ? " nav-link-active" : "")
//               }
//             >
//               Pilots
//             </NavLink>
//           </div>

//           <div className="nav-section">
//             <div className="nav-section-label">MANAGEMENT</div>
//             <NavLink
//               to="/console/projects"
//               className={({ isActive }) =>
//                 "nav-link" + (isActive ? " nav-link-active" : "")
//               }
//             >
//               Projects
//             </NavLink>
//             <NavLink
//               to="/console/operation-calendar"
//               className={({ isActive }) =>
//                 "nav-link" + (isActive ? " nav-link-active" : "")
//               }
//             >
//               Operation Calendar
//             </NavLink>
//             <NavLink
//               to="/console/inspection"
//               className={({ isActive }) =>
//                 "nav-link" + (isActive ? " nav-link-active" : "")
//               }
//             >
//               Inspection
//             </NavLink>
//             <NavLink
//               to="/console/incidents"
//               className={({ isActive }) =>
//                 "nav-link" + (isActive ? " nav-link-active" : "")
//               }
//             >
//               Incidents
//             </NavLink>
//             <NavLink
//               to="/console/reports"
//               className={({ isActive }) =>
//                 "nav-link" + (isActive ? " nav-link-active" : "")
//               }
//             >
//               Generate Reports
//             </NavLink>
//           </div>

//           <div className="nav-section nav-section-bottom">
//             <div className="nav-section-label">ACCOUNT</div>
//             <NavLink
//               to="/console/settings"
//               className={({ isActive }) =>
//                 "nav-link" + (isActive ? " nav-link-active" : "")
//               }
//             >
//               Settings
//             </NavLink>
//             <NavLink
//               to="/login"
//               className="nav-link nav-link-logout"
//             >
//               Logout
//             </NavLink>
//           </div>
//         </nav>
//       </aside>

//       {/* Right side */}
//       <div className="console-main">
//         {/* Header */}
//         <header className="console-header">
//           <span className="org-pill">Demo Org</span>

//           <div className="header-right">
//             {/* (You can add notification bell etc here later) */}
//             <div className="user-avatar">DG</div>
//           </div>
//         </header>

//         {/* Page content */}
//         <main className="console-content">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default MainLayout;






// src/layouts/MainLayout.tsx
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./MainLayout.css";

const MainLayout = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/console/dashboard");
  };

  return (
    <div className="console-shell">
      {/* Sidebar */}
      <aside className="console-sidebar">
        <div className="console-logo" onClick={handleLogoClick}>
          <img src="/vyomgarud-logo.png" alt="VyomGarud" />
        </div>

        <nav className="console-nav">
          <div className="console-nav-section-label">Overview</div>
          <NavLink
            to="/console/dashboard"
            className={({ isActive }) =>
              "console-nav-link" + (isActive ? " is-active" : "")
            }
          >
            Dashboard
          </NavLink>

          <div className="console-nav-section-label">Fleet</div>
          <NavLink
            to="/console/drones"
            className={({ isActive }) =>
              "console-nav-link" + (isActive ? " is-active" : "")
            }
          >
            Drones
          </NavLink>
          <NavLink
            to="/console/flights"
            className={({ isActive }) =>
              "console-nav-link" + (isActive ? " is-active" : "")
            }
          >
            Flights
          </NavLink>
          <NavLink
            to="/console/pilots"
            className={({ isActive }) =>
              "console-nav-link" + (isActive ? " is-active" : "")
            }
          >
            Pilots
          </NavLink>

          <div className="console-nav-section-label">Management</div>
          <NavLink
            to="/console/projects"
            className={({ isActive }) =>
              "console-nav-link" + (isActive ? " is-active" : "")
            }
          >
            Projects
          </NavLink>
          <NavLink
            to="/console/operation-calendar"
            className={({ isActive }) =>
              "console-nav-link" + (isActive ? " is-active" : "")
            }
          >
            Operation Calendar
          </NavLink>
          <NavLink
            to="/console/inspection"
            className={({ isActive }) =>
              "console-nav-link" + (isActive ? " is-active" : "")
            }
          >
            Inspection
          </NavLink>
          <NavLink
            to="/console/incidents"
            className={({ isActive }) =>
              "console-nav-link" + (isActive ? " is-active" : "")
            }
          >
            Incidents
          </NavLink>
          <NavLink
            to="/console/reports"
            className={({ isActive }) =>
              "console-nav-link" + (isActive ? " is-active" : "")
            }
          >
            Generate Reports
          </NavLink>

          <div className="console-nav-section-label">Account</div>
          <NavLink
            to="/console/settings"
            className={({ isActive }) =>
              "console-nav-link" + (isActive ? " is-active" : "")
            }
          >
            Settings
          </NavLink>
          <button
            className="console-nav-link console-logout"
            type="button"
            onClick={() => navigate("/login")}
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main content area */}
      <div className="console-main">
        <header className="console-header">
          <span className="console-org-pill">Demo Org</span>
          <div className="console-user-avatar">DG</div>
        </header>

        <main className="console-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
