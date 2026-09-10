import { Skeleton } from "antd";

export const OverviewSkeleton = () => {
  return (
    <div className="sw-details-content">
      <div className="sw-details-columns">
        <div className="sw-details-main-column">
          <section className="sw-details-card sw-details-skeleton-card">
            <div className="sw-details-card-header">
              <div className="sw-details-skeleton-header-content">
                <Skeleton.Input
                  active
                  size="small"
                  className="sw-details-skeleton-heading"
                />

                <Skeleton.Input
                  active
                  size="small"
                  className="sw-details-skeleton-subheading"
                />
              </div>

              <Skeleton.Button
                active
                size="small"
                className="sw-details-skeleton-action"
              />
            </div>

            <div className="sw-details-card-body">
              <Skeleton.Input
                active
                size="small"
                className="sw-details-skeleton-section-title"
              />

              <Skeleton
                active
                title={false}
                paragraph={{
                  rows: 4,
                  width: ["100%", "100%", "95%", "72%"],
                }}
                className="sw-details-skeleton-description"
              />
            </div>
          </section>
          <section className="sw-details-card sw-details-skeleton-card">
            <div className="sw-details-card-header">
              <div className="sw-details-skeleton-header-content">
                <Skeleton.Input
                  active
                  size="small"
                  className="sw-details-skeleton-heading"
                />

                <Skeleton.Input
                  active
                  size="small"
                  className="sw-details-skeleton-subheading"
                />
              </div>
            </div>

            <div className="sw-details-card-body">
              <div className="sw-details-information-grid">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="sw-details-information-item">
                    <Skeleton.Input
                      active
                      size="small"
                      className="sw-details-skeleton-info-label"
                    />

                    <Skeleton.Input
                      active
                      size="small"
                      className="sw-details-skeleton-info-value"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
        <aside className="sw-details-side-column">
          {/* QUICK INFORMATION */}
          <section className="sw-details-card sw-details-skeleton-card">
            <div className="sw-details-card-header">
              <div className="sw-details-skeleton-header-content">
                <Skeleton.Input
                  active
                  size="small"
                  className="sw-details-skeleton-heading"
                />

                <Skeleton.Input
                  active
                  size="small"
                  className="sw-details-skeleton-subheading"
                />
              </div>
            </div>

            <div className="sw-details-info-list">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="sw-details-info-row">
                  <div className="sw-details-info-label">
                    <Skeleton.Avatar active size={14} shape="square" />

                    <Skeleton.Input
                      active
                      size="small"
                      className="sw-details-skeleton-quick-label"
                    />
                  </div>

                  <Skeleton.Input
                    active
                    size="small"
                    className={`sw-details-skeleton-quick-value ${
                      index === 3 ? "sw-details-skeleton-status" : ""
                    }`}
                  />
                </div>
              ))}
            </div>
          </section>
          <section className="sw-details-card sw-details-skeleton-card">
            <div className="sw-details-card-header">
              <div className="sw-details-skeleton-header-content">
                <Skeleton.Input
                  active
                  size="small"
                  className="sw-details-skeleton-heading"
                />

                <Skeleton.Input
                  active
                  size="small"
                  className="sw-details-skeleton-subheading"
                />
              </div>
            </div>

            <div className="sw-details-location-preview">
              <Skeleton.Avatar active size={40} shape="square" />

              <div className="sw-details-skeleton-location-content">
                <Skeleton.Input
                  active
                  size="small"
                  className="sw-details-skeleton-location-title"
                />

                <Skeleton.Input
                  active
                  size="small"
                  className="sw-details-skeleton-location-subtitle"
                />
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};
