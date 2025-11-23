import React, { useState } from "react";
import "./SettingsPage.css";

const SettingsPage: React.FC = () => {
  const [orgName, setOrgName] = useState("Demo Org");
  const [primaryContact, setPrimaryContact] = useState("ops@vyomgarud.com");
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [telemetryUrl, setTelemetryUrl] = useState(
    "wss://telemetry.vyomgarud.com/live"
  );
  const [mapsApiKey] = useState("••••-••••-••••-MAPS");
  const [backendConnected] = useState(true);

  const handleSave = () => {
    alert("Settings saved (UI demo only). In real app this will call API.");
  };

  const handleRotateKey = () => {
    alert("Rotate API key clicked (UI demo only).");
  };

  return (
    <div className="settings-page">
      <header className="settings-header">
        <div>
          <h2>Console Settings</h2>
          <p>Organisation and console configuration.</p>
        </div>

        <div
          className={`backend-status-pill ${
            backendConnected ? "connected" : "disconnected"
          }`}
        >
          <span className="status-dot" />
          {backendConnected ? "Live backend connected" : "Backend offline"}
        </div>
      </header>

      <div className="settings-grid">
        {/* ORG CARD */}
        <section className="settings-card">
          <h3>Organisation profile</h3>
          <p className="card-subtitle">
            Basic information used across flights, reports and invoices.
          </p>

          <div className="field-group">
            <label>Organisation name</label>
            <input
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder="Enter organisation name"
            />
          </div>

          <div className="field-group">
            <label>Primary contact email</label>
            <input
              type="email"
              value={primaryContact}
              onChange={(e) => setPrimaryContact(e.target.value)}
              placeholder="ops@example.com"
            />
          </div>

          <div className="field-group">
            <label>Console theme</label>
            <div className="theme-toggle">
              <button
                className={theme === "light" ? "active" : ""}
                onClick={() => setTheme("light")}
              >
                Light
              </button>
              <button
                className={theme === "dark" ? "active" : ""}
                onClick={() => setTheme("dark")}
              >
                Dark
              </button>
            </div>
            <p className="hint">
              (Demo only) This will control how the console is rendered for all
              operators.
            </p>
          </div>
        </section>

        {/* TELEMETRY / MAPS CARD */}
        <section className="settings-card">
          <h3>Telemetry & maps</h3>
          <p className="card-subtitle">
            Configure live telemetry stream and mapping provider.
          </p>

          <div className="field-group">
            <label>Telemetry WebSocket URL</label>
            <input
              type="text"
              value={telemetryUrl}
              onChange={(e) => setTelemetryUrl(e.target.value)}
              placeholder="wss://..."
            />
          </div>

          <div className="field-group">
            <label>Maps API key</label>
            <div className="api-key-row">
              <input type="text" value={mapsApiKey} readOnly />
              <button className="rotate-btn" onClick={handleRotateKey}>
                Rotate key
              </button>
            </div>
            <p className="hint">
              Real key will be stored securely on the server, not in the
              browser.
            </p>
          </div>
        </section>

        {/* NOTIFICATIONS CARD */}
        <section className="settings-card wide">
          <h3>Notifications</h3>
          <p className="card-subtitle">
            Choose what events should generate alerts for your team.
          </p>

          <div className="notif-row">
            <label>
              <input type="checkbox" defaultChecked />
              <span>Mission completed</span>
            </label>
            <span className="notif-note">Email & console</span>
          </div>

          <div className="notif-row">
            <label>
              <input type="checkbox" defaultChecked />
              <span>Battery critical / RTL triggered</span>
            </label>
            <span className="notif-note">Console only</span>
          </div>

          <div className="notif-row">
            <label>
              <input type="checkbox" />
              <span>New report ready to download</span>
            </label>
            <span className="notif-note">Email only</span>
          </div>
        </section>
      </div>

      <div className="settings-footer">
        <button className="save-btn" onClick={handleSave}>
          Save changes
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
