"use client";

import {
  CalendarOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EnvironmentOutlined,
  EyeOutlined,
  PlusOutlined,
  SaveOutlined,
  ShareAltOutlined,
  StarFilled,
  TagOutlined,
  TagsOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useEffect } from "react";
import { loadEventShortDetails } from "@/services/agent/eventService";
import { HeroSkeleton } from "@/components/common/sekeleton/HeroSkeleton";

import { Button, Input, Tabs, Tag, Image } from "antd";

import { useState } from "react";
import { useEventStore } from "@/lib/store/event/eventStore";
import {
  OverviewTab,
  ScheduleTab,
  LocationTab,
  ReviewTab,
  MediaTab,
  BookingTab,
  TicketsTab,
  ActivityTab,
} from "./tabs";
import { useNotify } from "@/components/common/NotificationProvider";
import {
  toSentenceCase,
  toSmartTitleCase,
  toUpperCase,
} from "@/lib/utils/char";
import moment from "moment";

export default function EventDetails() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const notify = useNotify();
  const navigationState = useEventStore((state) => state.navigationState);
  const { dataId } = navigationState;

  useEffect(() => {
    if (!navigationState) return;

    const fetchData = async () => {
      setLoading(true);

      try {
        const response = await loadEventShortDetails(dataId);

        setData(response);
      } catch (error) {
        const responseData = error?.response?.data;
        let errorMessage = "Something went wrong. Please try again.";

        if (typeof responseData === "string") {
          errorMessage = responseData;
        } else if (responseData?.error) {
          errorMessage = responseData.error;
        } else if (responseData?.detail) {
          errorMessage = responseData.detail;
        } else if (responseData?.message) {
          errorMessage = responseData.message;
        } else if (typeof responseData === "object") {
          const firstKey = Object.keys(responseData)[0];
          const firstError = responseData[firstKey];
          if (Array.isArray(firstError)) {
            errorMessage = `${firstError[0]}`;
          }
        }
        notify.error("Failed to Create Event", errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigationState]);

  const { dataTitle, dataSlug, dataStatus } = navigationState;

  const tabs = [
    {
      key: "overview",
      label: "Overview",

      children: (
        <>
          <OverviewTab dataId={dataId} />
        </>
      ),
    },
    {
      key: "schedule",
      label: "Schedule",

      children: (
        <>
          <ScheduleTab dataId={dataId} />
        </>
      ),
    },
    {
      key: "location",
      label: "Location",

      children: (
        <>
          <LocationTab dataId={dataId} />
        </>
      ),
    },
    {
      key: "reviews",
      label: "Reviews",

      children: (
        <>
          <ReviewTab dataId={dataId} />
        </>
      ),
    },
    {
      key: "media",
      label: "Media",

      children: (
        <>
          <MediaTab dataId={dataId} />
        </>
      ),
    },
    {
      key: "booking",
      label: "Booking",

      children: (
        <>
          <BookingTab dataId={dataId} />
        </>
      ),
    },
    {
      key: "tickets",
      label: "Tickets",

      children: (
        <>
          <TicketsTab dataId={dataId} />
        </>
      ),
    },
    {
      key: "activity",
      label: "Activity",

      children: (
        <>
          <ActivityTab dataId={dataId} />
        </>
      ),
    },
  ];

  return (
    <div className="sw-details-page">
      {loading || !data ? (
        <HeroSkeleton />
      ) : (
        <section className="sw-details-hero">
          <div className="sw-details-hero-image">
            <Image src={data?.image} alt={dataTitle} width={500} height={300} />

            <div className="sw-details-image-overlay">
              <span>
                <EyeOutlined />
                1,284 views
              </span>
            </div>
          </div>

          <div className="sw-details-hero-content">
            <div className="sw-details-category">
              <TagOutlined />
              {toUpperCase(data?.category_name)}
            </div>

            <div className="sw-details-title-line">
              <h1>{toSmartTitleCase(data?.title)}</h1>

              <Tag
                className={`sw-details-hero-status status-${data?.event_status_name
                  ?.toLowerCase()
                  .replace(/\s+/g, "-")}`}
              >
                {data?.event_status_name}
              </Tag>
            </div>

            <p className="sw-details-slug">{data?.slug}</p>

            <p className="sw-details-summary">
              {toSentenceCase(data?.description)}
            </p>

            <div className="sw-details-meta">
              <div className="sw-details-meta-item">
                <EnvironmentOutlined />
                <span>{toSmartTitleCase(data?.address)}, Tanzania</span>
              </div>
              <div className="sw-details-meta-item">
                <CalendarOutlined />
                <span>
                  {moment(data?.start_date).format("DD MMM YYYY - HH:mm")}
                </span>
              </div>
              -
              <div className="sw-details-meta-item">
                <CalendarOutlined />
                <span>
                  {moment(data?.end_date).format("DD MMM YYYY - HH:mm")}
                </span>
              </div>
              <div className="sw-details-meta-item sw-details-rating">
                <StarFilled />

                <strong>4.8</strong>

                <span>(124)</span>
              </div>
            </div>
          </div>
        </section>
      )}
      <section className="sw-details-tabs-container">
        <Tabs
          className="sw-details-tabs"
          defaultActiveKey="overview"
          items={tabs}
        />
      </section>
    </div>
  );
}
