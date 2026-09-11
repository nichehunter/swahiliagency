"use client";

export default function MainLoading({
  message = "Preparing your dashboard...",
}) {
  return (
    <main className="sw-main-loading">
      <div className="sw-main-loading-content">
        <div className="sw-main-loading-logo">
          <span>S</span>
        </div>

        <div className="sw-main-loading-ring" />

        <div className="sw-main-loading-brand">
          <strong>SwahiliExpi</strong>
          <span>Agent Platform</span>
        </div>

        <div className="sw-main-loading-message">
          <span className="sw-main-loading-dot" />
          <span>{message}</span>
        </div>

        <div className="sw-main-loading-progress">
          <span />
        </div>
      </div>
    </main>
  );
}
