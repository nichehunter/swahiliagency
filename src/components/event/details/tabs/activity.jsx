"use client";

export const ActivityTab = () => {
  return (
    <>
      <div className="sw-details-content">
        <section className="sw-details-card">
          <div className="sw-details-card-header">
            <div>
              <h2>Activity</h2>
              <p>Recent changes and actions</p>
            </div>
          </div>

          <div className="sw-details-empty">No activity available.</div>
        </section>
      </div>
    </>
  );
};
