"use client";

import { Skeleton } from "antd";

export const ReviewsSkeleton = () => {
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

          <div className="sw-details-review-summary-skeleton">
            <Skeleton.Avatar active size={13} shape="circle" />

            <Skeleton.Input
              active
              size="small"
              className="sw-details-review-score-skeleton"
            />

            <Skeleton.Input
              active
              size="small"
              className="sw-details-review-count-skeleton"
            />
          </div>
        </div>

        {/* REVIEWS */}
        <div className="sw-details-review-list">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="sw-details-review-item">
              {/* AVATAR */}
              <Skeleton.Avatar active size={36} shape="circle" />

              {/* CONTENT */}
              <div className="sw-details-review-content">
                <div className="sw-details-review-skeleton-top">
                  <div>
                    <Skeleton.Input
                      active
                      size="small"
                      className="sw-details-review-name-skeleton"
                    />

                    <Skeleton.Input
                      active
                      size="small"
                      className="sw-details-review-stars-skeleton"
                    />
                  </div>

                  <Skeleton.Input
                    active
                    size="small"
                    className="sw-details-review-date-skeleton"
                  />
                </div>

                <Skeleton
                  active
                  title={false}
                  paragraph={{
                    rows: 2,
                    width: [
                      index % 2 === 0 ? "95%" : "88%",
                      index % 2 === 0 ? "70%" : "62%",
                    ],
                  }}
                  className="sw-details-review-comment-skeleton"
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
