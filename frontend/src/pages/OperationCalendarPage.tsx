import React from "react";
import "./OperationCalendarPage.css";

type MissionStatus = "scheduled" | "in-progress" | "completed" | "cancelled";

interface CalendarMission {
  id: string;
  project: string;
  site: string;
  city: string;
  drone: string;
  pilot: string;
  status: MissionStatus;
  startTime: string; // e.g. "09:30"
  endTime: string;   // e.g. "11:00"
  day: string;       // e.g. "Mon", "Tue"
}

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const missions: CalendarMission[] = [
  {
    id: "MSN-101",
    project: "Solar Farm – String Inspection",
    site: "Helios Solar Park",
    city: "Ahmedabad",
    drone: "VyomGarud Demo Drone",
    pilot: "Amit Sharma",
    status: "in-progress",
    startTime: "09:30",
    endTime: "11:00",
    day: "Tue",
  },
  {
    id: "MSN-102",
    project: "Highway Corridor Mapping",
    site: "NH 48, Sector B",
    city: "Bengaluru",
    drone: "Survey Drone Alpha",
    pilot: "Priya Verma",
    status: "scheduled",
    startTime: "15:00",
    endTime: "17:30",
    day: "Thu",
  },
  {
    id: "MSN-103",
    project: "Bridge Structural Inspection",
    site: "Kaveri Bridge",
    city: "Mysuru",
    drone: "Inspection Drone X2",
    pilot: "Rohit Singh",
    status: "completed",
    startTime: "08:00",
    endTime: "09:15",
    day: "Mon",
  },
  {
    id: "MSN-104",
    project: "Factory Roof Thermal Audit",
    site: "BlueSteel Plant",
    city: "Pune",
    drone: "VyomGarud Demo Drone",
    pilot: "Sneha Iyer",
    status: "scheduled",
    startTime: "10:00",
    endTime: "12:00",
    day: "Sat",
  },
];

function statusLabel(status: MissionStatus) {
  switch (status) {
    case "scheduled":
      return "Scheduled";
    case "in-progress":
      return "In progress";
    case "completed":
      return "Completed";
    case "cancelled":
      return "Cancelled";
    default:
      return status;
  }
}

function OperationCalendarPage() {
  const todayLabel = "This week · 18–24 Nov 2025";

  const handleCreateMission = () => {
    alert("In the real app this will open the mission creation flow.");
  };

  const handleMissionClick = (mission: CalendarMission) => {
    alert(
      `In the real app this will open mission details:\n\n${mission.id} – ${mission.project}`
    );
  };

  return (
    <div className="calendar-page">
      {/* Header */}
      <header className="calendar-header">
        <div>
          <h1 className="calendar-title">Operation calendar</h1>
          <p className="calendar-subtitle">
            View all scheduled VyomGarud missions in a single weekly timeline.
          </p>
        </div>

        <div className="calendar-header-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={() => alert("In the real app this will switch to month view.")}
          >
            Month
          </button>
          <button
            type="button"
            className="secondary-button secondary-button--active"
            onClick={() => {}}
          >
            Week
          </button>
          <button
            type="button"
            className="primary-button"
            onClick={handleCreateMission}
          >
            + New mission
          </button>
        </div>
      </header>

      {/* Range + small filters row */}
      <section className="calendar-range-row">
        <div className="calendar-range-text">{todayLabel}</div>
        <div className="calendar-chips">
          <button
            type="button"
            className="chip chip--active"
            onClick={() => {}}
          >
            All missions
          </button>
          <button
            type="button"
            className="chip"
            onClick={() => alert("Would filter only VyomGarud Demo Drone.")}
          >
            VyomGarud Demo Drone
          </button>
          <button
            type="button"
            className="chip"
            onClick={() => alert("Would filter in-progress missions.")}
          >
            In progress
          </button>
        </div>
      </section>

      <div className="calendar-layout">
        {/* Left: week strip with missions */}
        <section className="calendar-week-card">
          <div className="calendar-week-header">
            <span className="calendar-week-label">Week view</span>
            <span className="calendar-week-sub">Local time (IST)</span>
          </div>

          <div className="calendar-week-grid">
            {/* Day header row */}
            <div className="calendar-week-row calendar-week-row--header">
              <div className="calendar-week-time-col" />
              {weekDays.map((day) => (
                <div key={day} className="calendar-week-day-col">
                  <span className="calendar-week-day-name">{day}</span>
                </div>
              ))}
            </div>

            {/* Time slots – just a few for visual */}
            {["08:00", "10:00", "12:00", "14:00", "16:00"].map((time) => (
              <div key={time} className="calendar-week-row">
                <div className="calendar-week-time-col">{time}</div>
                {weekDays.map((day) => {
                  const slotMissions = missions.filter(
                    (m) => m.day === day && m.startTime === time
                  );
                  return (
                    <div key={day + time} className="calendar-week-day-col">
                      {slotMissions.map((mission) => (
                        <button
                          key={mission.id}
                          type="button"
                          className={`calendar-mission-pill calendar-mission-pill--${mission.status}`}
                          onClick={() => handleMissionClick(mission)}
                        >
                          <span className="calendar-mission-pill-title">
                            {mission.project}
                          </span>
                          <span className="calendar-mission-pill-meta">
                            {mission.startTime}–{mission.endTime} ·{" "}
                            {mission.city}
                          </span>
                        </button>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </section>

        {/* Right: side card with upcoming missions list */}
        <aside className="calendar-side-card">
          <div className="calendar-side-header">
            <h2>Upcoming missions</h2>
            <p>Quick view of the next scheduled operations.</p>
          </div>

          <div className="calendar-side-list">
            {missions.map((mission) => (
              <div
                key={mission.id}
                className="calendar-side-item"
                onClick={() => handleMissionClick(mission)}
              >
                <div className="calendar-side-item-top">
                  <span className="calendar-side-id">{mission.id}</span>
                  <span
                    className={`calendar-side-status calendar-side-status--${mission.status}`}
                  >
                    {statusLabel(mission.status)}
                  </span>
                </div>
                <div className="calendar-side-title">{mission.project}</div>
                <div className="calendar-side-meta">
                  <span>
                    {mission.day} · {mission.startTime}–{mission.endTime}
                  </span>
                  <span>
                    {mission.site}, {mission.city}
                  </span>
                </div>
                <div className="calendar-side-footer">
                  <span>{mission.drone}</span>
                  <span>{mission.pilot}</span>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default OperationCalendarPage;
