"use client";
import { useEventStore } from "@/lib/store/event/eventStore";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { Tag } from "antd";
import DataTable from "@/components/common/DataTable";
import { useState, useEffect } from "react";
import { loadEvent } from "@/services/agent/eventService";
import { EventAdd } from "./add";
import { toSmartTitleCase } from "@/lib/utils/char";

export default function EventContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const setNavigationState = useEventStore((state) => state.setNavigationState);
  const clearNavigationState = useEventStore(
    (state) => state.clearNavigationState,
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        clearNavigationState();

        const limit = pageSize;
        const offset = (page - 1) * pageSize;

        const response = await loadEvent({
          limit,
          offset,
          search,
        });

        setData(response?.results || []);
        setTotal(response?.count || 0);
      } catch (error) {
        setData([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, pageSize, search, index]);

  const columns = [
    {
      title: "#",
      key: "__index",
      width: 60,
      align: "center",

      render: (_, __, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "Event",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
      width: 300,

      render: (value, record) => (
        <div className="sw-table-primary-cell">
          <div className="sw-table-primary-icon">
            <CalendarOutlined />
          </div>

          <div>
            <strong>{toSmartTitleCase(record.title)}</strong>

            <span>{record.slug}</span>
          </div>
        </div>
      ),
    },

    {
      title: "Category",
      dataIndex: "category_name",
      key: "category_name",
      ellipsis: true,
      width: 150,
      render: (value) => <span>{toSmartTitleCase(value)}</span>,
    },

    {
      title: "Sub Category",
      dataIndex: "sub_category_name",
      key: "sub_category_name",
      ellipsis: true,
      width: 150,
      render: (value) => <span>{toSmartTitleCase(value)}</span>,
    },

    {
      title: "Location",
      dataIndex: "address",
      key: "address",
      ellipsis: true,
      width: 150,

      render: (value) => (
        <span className="sw-table-location">
          <EnvironmentOutlined />
          {toSmartTitleCase(value)}
        </span>
      ),
    },

    {
      title: "Venue",
      dataIndex: "venue_type_name",
      key: "venue_type_name",
      ellipsis: true,
      width: 150,

      render: (value) => (
        <span className="sw-table-location">
          <EnvironmentOutlined />
          {toSmartTitleCase(value)}
        </span>
      ),
    },

    {
      title: "Date",
      key: "duration",
      width: 190,

      render: (_, record) => (
        <div className="sw-table-date">
          <div className="sw-table-date-row">
            <ClockCircleOutlined />
            <span>{dayjs(record.start_date).format("DD MMM YYYY, HH:mm")}</span>
          </div>

          <div className="sw-table-date-line" />

          <div className="sw-table-date-row">
            <ClockCircleOutlined />
            <span>{dayjs(record.end_date).format("DD MMM YYYY, HH:mm")}</span>
          </div>
        </div>
      ),
    },

    {
      title: "Status",
      dataIndex: "event_status_name",
      key: "event_status_name",
      width: 100,

      render: (status) => {
        const statusConfig = {
          ongoing: {
            color: "success",
            icon: <CheckCircleOutlined />,
          },

          upcoming: {
            color: "warning",
            icon: <ClockCircleOutlined />,
          },

          completed: {
            color: "default",
          },
        };

        const config = statusConfig[status] || {};

        return (
          <Tag color={config.color} icon={config.icon}>
            {toSmartTitleCase(status)}
          </Tag>
        );
      },
    },
  ];

  return (
    <>
      <div className="sw-page">
        <DataTable
          title="Events"
          description="Manage and monitor all events registered on the platform."
          columns={columns}
          dataSource={data}
          rowKey="id"
          searchPlaceholder="Search events..."
          total={total}
          currentPageSize={pageSize}
          setCurrentPageSize={setPageSize}
          currentPage={page}
          setCurrentPage={setPage}
          search={search}
          setSearch={setSearch}
          //   filters={[
          //     {
          //       field: "category_name",
          //       placeholder: "All Categories",
          //       options: [
          //         {
          //           label: "Festival",
          //           value: "Festival",
          //         },
          //         {
          //           label: "Food",
          //           value: "Food",
          //         },
          //         {
          //           label: "Cultural",
          //           value: "Cultural",
          //         },
          //         {
          //           label: "Music",
          //           value: "Music",
          //         },
          //         {
          //           label: "Business",
          //           value: "Business",
          //         },
          //       ],
          //     },

          //     {
          //       field: "event_status_name",
          //       placeholder: "All Statuses",
          //       options: [
          //         {
          //           label: "Active",
          //           value: "Active",
          //         },
          //         {
          //           label: "Pending",
          //           value: "Pending",
          //         },
          //         {
          //           label: "Draft",
          //           value: "Draft",
          //         },
          //       ],
          //     },
          //   ]}
          showAddButton
          addButtonText="Add Event"
          onAdd={() => {
            setOpen(true);
          }}
          showRefresh
          onRefresh={() => {
            setLoading(true);

            setTimeout(() => {
              setIndex((prev) => prev + 1);
              setLoading(false);
            }, 800);
          }}
          onRow={(record) => ({
            onClick: () => {
              const state = {
                dataId: record.id,
                dataTitle: record.title,
                dataSlug: record.slug,
                dataStatus: record.event_status_name,
              };

              setNavigationState(state);

              router.push("/event/details");
            },
            style: {
              cursor: "pointer",
            },
          })}
          loading={loading}
        />
      </div>
      <EventAdd
        open={open}
        onClose={() => {
          setOpen(false);
          setIndex((prev) => prev + 1);
        }}
        setIndex={setIndex}
      />
    </>
  );
}
