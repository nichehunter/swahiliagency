"use client";

import { Skeleton } from "antd";

export const HeroSkeleton = () => {
  return (
    <section className="sw-details-hero sw-details-hero-skeleton">
      {/* IMAGE */}
      <div className="sw-details-hero-image">
        <Skeleton.Image active className="sw-details-skeleton-image" />
      </div>

      {/* CONTENT */}
      <div className="sw-details-hero-content">
        {/* CATEGORY */}
        <Skeleton.Input
          active
          size="small"
          className="sw-details-skeleton-category"
        />

        {/* TITLE + STATUS */}
        <div className="sw-details-skeleton-title-row">
          <Skeleton.Input
            active
            size="large"
            className="sw-details-skeleton-title"
          />

          <Skeleton.Button
            active
            size="small"
            className="sw-details-skeleton-status"
          />
        </div>

        {/* SLUG */}
        <Skeleton.Input
          active
          size="small"
          className="sw-details-skeleton-slug"
        />

        {/* SUMMARY */}
        <Skeleton
          active
          title={false}
          paragraph={{
            rows: 2,
            width: ["95%", "75%"],
          }}
          className="sw-details-skeleton-summary"
        />

        {/* META */}
        <div className="sw-details-skeleton-meta">
          <Skeleton.Input active size="small" />
          <Skeleton.Input active size="small" />
          <Skeleton.Input active size="small" />
          <Skeleton.Input active size="small" />
        </div>
      </div>
    </section>
  );
};
