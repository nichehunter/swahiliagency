import { Skeleton } from "antd";

export const LocationSkeleton = () => {
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

        {/* LOCATION CONTENT */}
        <div className="sw-details-location-page">
          {/* MAP */}
          <div className="sw-details-map-placeholder sw-details-map-skeleton">
            <Skeleton.Avatar active size={42} shape="circle" />

            <Skeleton.Input
              active
              size="small"
              className="sw-details-map-skeleton-label"
            />
          </div>

          {/* LOCATION DETAILS */}
          <div className="sw-details-location-details">
            {/* ADDRESS */}
            <div className="sw-details-location-detail-item">
              <Skeleton.Input
                active
                size="small"
                className="sw-details-location-skeleton-label"
              />

              <Skeleton.Input
                active
                size="small"
                className="sw-details-location-skeleton-value sw-details-location-skeleton-address"
              />
            </div>

            {/* LATITUDE */}
            <div className="sw-details-location-detail-item">
              <Skeleton.Input
                active
                size="small"
                className="sw-details-location-skeleton-label"
              />

              <Skeleton.Input
                active
                size="small"
                className="sw-details-location-skeleton-value sw-details-location-skeleton-coordinate"
              />
            </div>

            {/* LONGITUDE */}
            <div className="sw-details-location-detail-item">
              <Skeleton.Input
                active
                size="small"
                className="sw-details-location-skeleton-label"
              />

              <Skeleton.Input
                active
                size="small"
                className="sw-details-location-skeleton-value sw-details-location-skeleton-coordinate"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
