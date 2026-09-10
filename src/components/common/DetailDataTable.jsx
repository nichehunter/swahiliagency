"use client";

import { useMemo } from "react";
import { Empty, Input, Table } from "antd";
import { SearchOutlined } from "@ant-design/icons";

import "@/styles/common/detaildatatable.css";

const DetailDataTable = ({
  data = [],
  columns = [],

  // Search
  searchable = true,
  search = "",
  onSearch,

  searchPlaceholder = "Search...",
  toolbar = null,

  pageName,
  currentPage = 1,
  currentPageSize = 10,
  total = 0,
  setCurrentPage,
  setCurrentPageSize,

  // Row
  rowKey = "id",
  onRow,

  // Empty state
  emptyText = "No data available",

  // Loading
  loading = false,

  // Optional custom class
  className = "",
}) => {
  const pagination = {
    current: currentPage,
    pageSize: currentPageSize,
    total,

    showSizeChanger: true,

    pageSizeOptions: [10, 20, 50, 100],

    showTotal: (total, range) =>
      `${range[0]}-${range[1]} of ${total} ${pageName || ""}`,

    onChange: (page, pageSize) => {
      /*
       * When page size changes, go back to page 1.
       */
      if (currentPageSize !== pageSize) {
        setCurrentPage(1);
        setCurrentPageSize(pageSize);
        return;
      }

      setCurrentPage(page);
    },
  };

  const resolvedRowKey =
    typeof rowKey === "function"
      ? rowKey
      : (record) => String(record?.[rowKey]);

  return (
    <div className={`sw-auth-detail-table ${className}`}>
      {/* TOOLBAR */}
      {(searchable || toolbar) && (
        <div className="sw-auth-detail-table-toolbar">
          {searchable ? (
            <Input
              allowClear
              prefix={<SearchOutlined />}
              placeholder={searchPlaceholder}
              value={search}
              onChange={(event) => onSearch?.(event.target.value)}
              className="sw-auth-detail-table-search"
            />
          ) : (
            <div />
          )}

          {toolbar && (
            <div className="sw-auth-detail-table-toolbar-actions">
              {toolbar}
            </div>
          )}
        </div>
      )}

      {/* TABLE */}
      <div className="sw-auth-detail-table-card">
        <Table
          rowKey={resolvedRowKey}
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={pagination}
          onRow={onRow}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  search ? "No results match your search" : emptyText
                }
              />
            ),
          }}
          className="sw-auth-detail-table-table"
        />
      </div>
    </div>
  );
};

export default DetailDataTable;
