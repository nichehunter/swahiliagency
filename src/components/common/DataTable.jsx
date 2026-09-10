"use client";

import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  SettingOutlined,
} from "@ant-design/icons";

import {
  Button,
  Dropdown,
  Empty,
  Input,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
} from "antd";

import { useMemo, useState } from "react";

const DataTable = ({
  title,
  description,

  columns = [],
  dataSource = [],

  loading = false,

  rowKey = "id",

  searchable = true,
  searchPlaceholder = "Search...",
  search,
  setSearch,

  showAddButton = true,
  addButtonText = "Add New",
  onAdd,

  showRefresh = true,
  onRefresh,

  onRow,

  total,
  pagination = true,
  currentPageSize = 10,
  setCurrentPageSize,
  pageSizeOptions = ["10", "20", "50", "100", "500", "1000", total],
  currentPage = 1,
  setCurrentPage,

  bordered = false,

  emptyText = "No records found",

  className = "",
}) => {
  const [activeFilters, setActiveFilters] = useState({});

  /*
   * RESET PAGE WHEN SEARCH/FILTER CHANGES
   */

  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (field, value) => {
    setActiveFilters((prev) => ({
      ...prev,
      [field]: value,
    }));

    setCurrentPage(1);
  };

  const clearFilters = () => {
    setActiveFilters({});
    setSearch("");
    setCurrentPage(1);
  };

  /*
   * PAGINATION
   */

  const paginationConfig = pagination
    ? {
        current: currentPage,
        pageSize: currentPageSize,

        total: total,

        showSizeChanger: true,

        pageSizeOptions,

        showTotal: (total, range) => (
          <span className="sw-data-table-pagination-total">
            Showing{" "}
            <strong>
              {range[0]}–{range[1]}
            </strong>{" "}
            of <strong>{total}</strong> records
          </span>
        ),

        onChange: (page, size) => {
          setCurrentPage(page);

          if (size !== currentPageSize) {
            setCurrentPageSize(size);
            setCurrentPage(1);
          }
        },

        showQuickJumper: true,
      }
    : false;

  return (
    <div className={`sw-data-table ${className}`}>
      {/* =====================================================
          HEADER
      ===================================================== */}

      {(title || description) && (
        <div className="sw-data-table-header">
          <div className="sw-data-table-header-content">
            {title && <h2 className="sw-data-table-title">{title}</h2>}

            {description && (
              <p className="sw-data-table-description">{description}</p>
            )}
          </div>

          {showAddButton && onAdd && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              className="sw-data-table-add-button"
              onClick={onAdd}
            >
              {addButtonText}
            </Button>
          )}
        </div>
      )}

      {/* =====================================================
          TOOLBAR
      ===================================================== */}

      <div className="sw-data-table-toolbar">
        <div className="sw-data-table-toolbar-left">
          {searchable && (
            <Input
              allowClear
              value={search}
              prefix={<SearchOutlined />}
              placeholder={searchPlaceholder}
              className="sw-data-table-search"
              onChange={(event) => handleSearch(event.target.value)}
            />
          )}
        </div>

        <div className="sw-data-table-toolbar-right">
          {showRefresh && onRefresh && (
            <Tooltip title="Refresh">
              <Button
                icon={<ReloadOutlined />}
                className="sw-data-table-toolbar-button"
                onClick={onRefresh}
              />
            </Tooltip>
          )}
        </div>
      </div>

      {/* =====================================================
          TABLE INFO
      ===================================================== */}

      <div className="sw-data-table-info">
        <span>
          <strong>{total.toLocaleString()}</strong>{" "}
          {total === 1 ? "record" : "records"}
        </span>
      </div>

      {/* =====================================================
          TABLE
      ===================================================== */}

      <div className="sw-data-table-wrapper">
        <Table
          rowKey={rowKey}
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          bordered={bordered}
          scroll={{
            x: 950,
          }}
          sticky
          onRow={onRow}
          pagination={paginationConfig}
          locale={{
            emptyText: (
              <div className="sw-data-table-empty">
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={emptyText}
                />
              </div>
            ),
          }}
        />
      </div>
    </div>
  );
};

export default DataTable;
