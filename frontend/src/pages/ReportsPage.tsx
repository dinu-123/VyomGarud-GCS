import React, { useState } from "react";
import "./ReportsPage.css";

type ReportStatus = "Ready" | "Processing" | "Scheduled" | "Failed";

interface Report {
  id: string;
  project: string;
  type: string;
  createdOn: string;
  createdBy: string;
  format: "PDF" | "CSV" | "KML";
  status: ReportStatus;
}

const mockReports: Report[] = [
  {
    id: "VG-RPT-221",
    project: "Factory Roof Thermal Audit",
    type: "Thermal inspection summary",
    createdOn: "2025-11-21 • 08:42",
    createdBy: "Amit Sharma",
    format: "PDF",
    status: "Ready",
  },
  {
    id: "VG-RPT-218",
    project: "Highway Corridor Mapping",
    type: "Orthomosaic & contours",
    createdOn: "2025-11-18 • 19:05",
    createdBy: "Priya Verma",
    format: "KML",
    status: "Ready",
  },
  {
    id: "VG-RPT-217",
    project: "Solar Farm Inspection – Phase 2",
    type: "Anomaly list (panel-wise)",
    createdOn: "2025-11-18 • 18:22",
    createdBy: "System",
    format: "CSV",
    status: "Processing",
  },
  {
    id: "VG-RPT-209",
    project: "Urban 3D Mapping – CBD",
    type: "Flight log export",
    createdOn: "2025-11-10 • 11:12",
    createdBy: "Divyanshu SITL",
    format: "CSV",
    status: "Failed",
  },
  {
    id: "VG-RPT-204",
    project: "Pipeline Patrol – Sector 7",
    type: "Mission summary",
    createdOn: "2025-11-03 • 09:01",
    createdBy: "System",
    format: "PDF",
    status: "Scheduled",
  },
];

const statusFilters: Array<ReportStatus | "All"> = [
  "All",
  "Ready",
  "Processing",
  "Scheduled",
  "Failed",
];

function ReportsPage() {
  const [activeFilter, setActiveFilter] = useState<ReportStatus | "All">("All");

  const filteredReports =
    activeFilter === "All"
      ? mockReports
      : mockReports.filter((r) => r.status === activeFilter);

  const handleGenerateNew = () => {
    alert(
      "Generate new report: this is a placeholder action. Later we’ll open a form to choose project, report type and format."
    );
  };

  const handleDownload = (report: Report) => {
    if (report.status !== "Ready") {
      alert(
        `Report ${report.id} is currently ${report.status.toLowerCase()} – download will be enabled once it is ready.`
      );
      return;
    }
    alert(`Download ${report.format} for ${report.id} – ${report.project}`);
  };

  const handleViewDetails = (report: Report) => {
    alert(`Open report details:\n${report.id} – ${report.type}`);
  };

  const handleRetry = (report: Report) => {
    alert(`Retry generating report: ${report.id}`);
  };

  return (
    <div className="page reports-page">
      <div className="reports-header">
        <div>
          <h1>Generate Reports</h1>
          <p className="reports-subtitle">
            Export mission results, flight logs and inspection summaries from
            your VyomGarud operations.
          </p>
        </div>

        <div className="reports-header-actions">
          <div className="reports-quick-pill">
            <span className="reports-pill-title">Ready to download</span>
            <span className="reports-pill-value">
              {mockReports.filter((r) => r.status === "Ready").length}
            </span>
          </div>
          <button className="reports-primary-btn" onClick={handleGenerateNew}>
            + Generate new report
          </button>
        </div>
      </div>

      <div className="reports-toolbar">
        <div className="reports-filters">
          {statusFilters.map((filter) => (
            <button
              key={filter}
              className={
                "reports-filter-chip" +
                (activeFilter === filter ? " reports-filter-chip--active" : "")
              }
              onClick={() => setActiveFilter(filter)}
            >
              {filter === "All" ? "All reports" : filter}
            </button>
          ))}
        </div>
      </div>

      <div className="reports-table-wrapper">
        <table className="reports-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Project</th>
              <th>Type</th>
              <th>Created on</th>
              <th>Format</th>
              <th>Status</th>
              <th className="reports-col-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((report) => (
              <tr key={report.id} className="reports-row">
                <td>
                  <button
                    className="link-like"
                    onClick={() => handleViewDetails(report)}
                  >
                    {report.id}
                  </button>
                </td>
                <td>{report.project}</td>
                <td>{report.type}</td>
                <td>{report.createdOn}</td>
                <td>
                  <span className={`badge badge-format badge-${report.format}`}>
                    {report.format}
                  </span>
                </td>
                <td>
                  <span
                    className={`badge badge-status badge-status-${report.status.replace(
                      " ",
                      "-"
                    )}`}
                  >
                    {report.status}
                  </span>
                </td>
                <td className="reports-row-actions">
                  <button
                    className="reports-action-btn"
                    onClick={() => handleDownload(report)}
                  >
                    Download
                  </button>
                  {report.status === "Failed" && (
                    <button
                      className="reports-action-btn reports-action-btn--ghost"
                      onClick={() => handleRetry(report)}
                    >
                      Retry
                    </button>
                  )}
                </td>
              </tr>
            ))}

            {filteredReports.length === 0 && (
              <tr>
                <td colSpan={7} className="reports-empty">
                  <h3>No reports in this view</h3>
                  <p>
                    Try another filter above or click{" "}
                    <strong>Generate new report</strong> to create one.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReportsPage;
