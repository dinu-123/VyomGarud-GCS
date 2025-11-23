import React from "react";
import "./ProjectsPage.css";

type ProjectStatus = "planning" | "scheduled" | "in-progress" | "completed";

interface ProjectRow {
  id: string;
  name: string;
  site: string;
  city: string;
  drone: string;
  pilot: string;
  status: ProjectStatus;
  startDate: string;
  lastActivity: string;
}

const demoProjects: ProjectRow[] = [
  {
    id: "VG-PR-001",
    name: "Solar Farm – String Inspection",
    site: "Helios Solar Park",
    city: "Ahmedabad",
    drone: "VyomGarud Demo Drone",
    pilot: "Amit Sharma",
    status: "in-progress",
    startDate: "2025-11-18",
    lastActivity: "Live flight • 18 min ago",
  },
  {
    id: "VG-PR-002",
    name: "Highway Corridor Mapping",
    site: "NH 48, Sector B",
    city: "Bengaluru",
    drone: "Survey Drone Alpha",
    pilot: "Priya Verma",
    status: "scheduled",
    startDate: "2025-11-22",
    lastActivity: "Next mission in 2 days",
  },
  {
    id: "VG-PR-003",
    name: "Bridge Structural Inspection",
    site: "Kaveri Bridge",
    city: "Mysuru",
    drone: "Inspection Drone X2",
    pilot: "Rohit Singh",
    status: "completed",
    startDate: "2025-11-10",
    lastActivity: "3 missions completed",
  },
  {
    id: "VG-PR-004",
    name: "Factory Roof Thermal Audit",
    site: "BlueSteel Plant",
    city: "Pune",
    drone: "VyomGarud Demo Drone",
    pilot: "Sneha Iyer",
    status: "planning",
    startDate: "2025-11-25",
    lastActivity: "Mission plan draft ready",
  },
];

function ProjectsPage() {
  const totalProjects = demoProjects.length;
  const activeProjects = demoProjects.filter(
    (p) => p.status === "in-progress" || p.status === "scheduled"
  ).length;
  const completedProjects = demoProjects.filter(
    (p) => p.status === "completed"
  ).length;
  const planningProjects = demoProjects.filter(
    (p) => p.status === "planning"
  ).length;

  return (
    <div className="projects-page">
      {/* Header */}
      <header className="projects-header">
        <div>
          <h1 className="projects-title">Projects</h1>
          <p className="projects-subtitle">
            Plan, schedule and track VyomGarud missions across all client sites.
          </p>
        </div>

        <div className="projects-header-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={() =>
              alert("In the real app this will open project filters / search.")
            }
          >
            Filters
          </button>
          <button
            type="button"
            className="primary-button"
            onClick={() =>
              alert("In the real app this will open the new-project workflow.")
            }
          >
            New Project
          </button>
        </div>
      </header>

      {/* Summary cards */}
      <section className="projects-summary">
        <div className="project-card">
          <p className="project-card-label">Total projects</p>
          <p className="project-card-value">{totalProjects}</p>
          <p className="project-card-footnote">
            All active & archived projects
          </p>
        </div>

        <div className="project-card">
          <p className="project-card-label">Active / Scheduled</p>
          <p className="project-card-value">{activeProjects}</p>
          <p className="project-card-footnote">
            Currently running or scheduled
          </p>
        </div>

        <div className="project-card">
          <p className="project-card-label">Completed</p>
          <p className="project-card-value">{completedProjects}</p>
          <p className="project-card-footnote">
            Missions fully executed & closed
          </p>
        </div>

        <div className="project-card">
          <p className="project-card-label">In planning</p>
          <p className="project-card-value">{planningProjects}</p>
          <p className="project-card-footnote">
            Draft missions waiting for approval
          </p>
        </div>
      </section>

      {/* Main table card */}
      <section className="projects-card">
        {demoProjects.length === 0 ? (
          <div className="projects-empty">
            <p className="projects-empty-title">No projects created yet</p>
            <p className="projects-empty-text">
              Use &ldquo;New Project&rdquo; to define a site, add missions and
              assign a VyomGarud drone.
            </p>
          </div>
        ) : (
          <div className="projects-table-wrapper">
            <table className="projects-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Project</th>
                  <th>Site</th>
                  <th>City</th>
                  <th>Drone</th>
                  <th>Pilot</th>
                  <th>Start date</th>
                  <th>Last activity</th>
                  <th className="col-status">Status</th>
                </tr>
              </thead>
              <tbody>
                {demoProjects.map((project) => (
                  <tr
                    key={project.id}
                    className="projects-row"
                    onClick={() =>
                      alert(
                        `In the real app this opens the project detail view for:\n\n${project.name}`
                      )
                    }
                  >
                    <td>{project.id}</td>
                    <td>{project.name}</td>
                    <td>{project.site}</td>
                    <td>{project.city}</td>
                    <td>{project.drone}</td>
                    <td>{project.pilot}</td>
                    <td>{project.startDate}</td>
                    <td>{project.lastActivity}</td>
                    <td className="col-status">
                      <span
                        className={`project-status project-status--${project.status}`}
                      >
                        {project.status === "planning"
                          ? "Planning"
                          : project.status === "scheduled"
                          ? "Scheduled"
                          : project.status === "in-progress"
                          ? "In progress"
                          : "Completed"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default ProjectsPage;
