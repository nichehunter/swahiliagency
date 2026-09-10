import { Skeleton } from "antd";

export const ScheduleSkeleton = () => {
  return (
    <div className="sw-details-content">
      <section className="sw-details-card sw-details-skeleton-card">
        {/* HEADER */}
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

        {/* BODY */}
        <div className="sw-details-card-body">
          <div className="sw-details-schedule">
            {/* START DATE */}
            <div className="sw-details-schedule-item">
              <Skeleton.Avatar active size={40} shape="square" />

              <div className="sw-details-skeleton-schedule-content">
                <Skeleton.Input
                  active
                  size="small"
                  className="sw-details-skeleton-schedule-label"
                />

                <Skeleton.Input
                  active
                  size="small"
                  className="sw-details-skeleton-schedule-value"
                />

                <Skeleton.Input
                  active
                  size="small"
                  className="sw-details-skeleton-schedule-small"
                />
              </div>
            </div>

            <div className="sw-details-schedule-divider" />

            {/* START TIME */}
            <div className="sw-details-schedule-item">
              <Skeleton.Avatar active size={40} shape="square" />

              <div className="sw-details-skeleton-schedule-content">
                <Skeleton.Input
                  active
                  size="small"
                  className="sw-details-skeleton-schedule-label"
                />

                <Skeleton.Input
                  active
                  size="small"
                  className="sw-details-skeleton-schedule-value sw-details-skeleton-time"
                />

                <Skeleton.Input
                  active
                  size="small"
                  className="sw-details-skeleton-schedule-small sw-details-skeleton-timezone"
                />
              </div>
            </div>

            <div className="sw-details-schedule-divider" />

            {/* END DATE */}
            <div className="sw-details-schedule-item">
              <Skeleton.Avatar active size={40} shape="square" />

              <div className="sw-details-skeleton-schedule-content">
                <Skeleton.Input
                  active
                  size="small"
                  className="sw-details-skeleton-schedule-label"
                />

                <Skeleton.Input
                  active
                  size="small"
                  className="sw-details-skeleton-schedule-value"
                />

                <Skeleton.Input
                  active
                  size="small"
                  className="sw-details-skeleton-schedule-small"
                />
              </div>
            </div>

            <div className="sw-details-schedule-divider" />

            {/* END TIME */}
            <div className="sw-details-schedule-item">
              <Skeleton.Avatar active size={40} shape="square" />

              <div className="sw-details-skeleton-schedule-content">
                <Skeleton.Input
                  active
                  size="small"
                  className="sw-details-skeleton-schedule-label"
                />

                <Skeleton.Input
                  active
                  size="small"
                  className="sw-details-skeleton-schedule-value sw-details-skeleton-time"
                />

                <Skeleton.Input
                  active
                  size="small"
                  className="sw-details-skeleton-schedule-small sw-details-skeleton-timezone"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
