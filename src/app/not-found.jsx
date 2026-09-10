"use client";

import Link from "next/link";
import {
  ArrowLeftOutlined,
  HomeOutlined,
  SearchOutlined,
  CompassOutlined,
} from "@ant-design/icons";

import "@/styles/notfound.css";

export default function NotFound() {
  return (
    <main className="sw-agent-404-wrapper">
      {/* Decorative background elements */}
      <div className="sw-agent-404-glow sw-agent-404-glow-one" />
      <div className="sw-agent-404-glow sw-agent-404-glow-two" />

      <div className="sw-agent-404-container">
        <div className="sw-agent-404-card">
          {/* LEFT SIDE */}
          <section className="sw-agent-404-left">
            <div className="sw-agent-404-brand">
              <div className="sw-agent-404-logo">
                <span>S</span>
              </div>

              <div className="sw-agent-404-brand-text">
                <strong>SwahiliExpi</strong>
                <span>Agent Platform</span>
              </div>
            </div>

            <div className="sw-agent-404-illustration">
              <div className="sw-agent-404-number">
                <span>4</span>
                <div className="sw-agent-404-circle">
                  <CompassOutlined />
                </div>
                <span>4</span>
              </div>

              <div className="sw-agent-404-dots">
                <span />
                <span />
                <span />
              </div>
            </div>

            <div className="sw-agent-404-left-bottom">
              <span className="sw-agent-404-status">
                <span className="sw-agent-404-status-dot" />
                SYSTEM ONLINE
              </span>

              <p>
                Your agent workspace is ready.
                <br />
                {`Let's get you back on track.`}
              </p>
            </div>
          </section>

          {/* RIGHT SIDE */}
          <section className="sw-agent-404-right">
            <div className="sw-agent-404-content">
              <span className="sw-agent-404-label">PAGE NOT FOUND</span>

              <h1>
                {"Looks like you've"}
                <span className="ms-2">lost your way.</span>
              </h1>

              <p className="sw-agent-404-description">
                {`The page you're looking for doesn't exist, has been moved, or
                may no longer be available. Don't worry, you can return to your
                agent dashboard and continue your work.`}
              </p>

              <div className="sw-agent-404-actions">
                <Link href="/" className="sw-agent-404-primary-button">
                  <HomeOutlined />
                  Back to Dashboard
                </Link>

                <button
                  type="button"
                  className="sw-agent-404-secondary-button"
                  onClick={() => window.history.back()}
                >
                  <ArrowLeftOutlined />
                  Go Back
                </button>
              </div>

              <div className="sw-agent-404-help">
                <div className="sw-agent-404-help-icon">
                  <SearchOutlined />
                </div>

                <div>
                  <strong>Looking for something?</strong>
                  <span>
                    Check the URL or use the navigation menu to find what you
                    need.
                  </span>
                </div>
              </div>
            </div>

            <div className="sw-agent-404-footer">
              <span>© {new Date().getFullYear()} SwahiliExpi</span>
              <span className="sw-agent-404-footer-divider" />
              <span>Agent Platform</span>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
