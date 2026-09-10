"use client";

import { Skeleton } from "antd";

export const MediaSkeleton = () => {
  return (
    <div className="sw-details-content">
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

        <div className="sw-details-media-grid sw-details-media-grid-skeleton">
          {Array.from({ length: 8 }).map((_, index) => (
            <div className="sw-details-media-item" key={index}>
              <Skeleton.Image active />
            </div>
          ))}
        </div>

        <div className="sw-details-media-pagination">
          <Skeleton.Input
            active
            size="small"
            className="sw-details-media-pagination-skeleton"
          />
        </div>
      </section>
    </div>
  );
};
