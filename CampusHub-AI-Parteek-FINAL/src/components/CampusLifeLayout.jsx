import { useState } from "react";
import Sidebar from "./Sidebar";
import ThemeToggle from "./ThemeToggle";
import { useCommunity } from "../context/CommunityContext";

export default function CampusLifeLayout({ children, title = "Campus Life" }) {
  const [open, setOpen] = useState(false);
  const { simulateError, setSimulateError } = useCommunity();
  return (
    <div className="dashboard-layout campus-life-host">
      <Sidebar isOpen={open} onClose={() => setOpen(false)} />
      <main className="dashboard-main campus-life-main">
        <header className="dashboard-topbar">
          <div className="dashboard-title">
            <h1>{title}</h1>
            <p>CampusHub AI · student life & community</p>
          </div>
          <div className="campus-life-header-actions">
            <label className="community-demo-switch" title="Toggle this to test the network error and retry state">
              <input type="checkbox" checked={simulateError} onChange={(e) => setSimulateError(e.target.checked)} />
              <span>Demo error</span>
            </label>
            <ThemeToggle />
            <button className="mobile-menu-button" onClick={() => setOpen(true)} aria-label="Open menu">☰</button>
          </div>
        </header>
        <div className="content community-content">{children}</div>
      </main>
    </div>
  );
}
