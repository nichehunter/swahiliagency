"use client";

import { toSmartTitleCase, getFirstWord } from "@/lib/utils/char";
import { useAuthStore } from "@/stores/authStore";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  FileAddOutlined,
  FileTextOutlined,
  MoreOutlined,
  PlusOutlined,
  TeamOutlined,
  TransactionOutlined,
  UserAddOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { useEffect, useState } from "react";

const summaryCards = [
  {
    title: "Applications",
    value: "1,284",
    change: "12.5%",
    trend: "up",
    description: "vs. previous month",
    icon: <FileTextOutlined />,
  },
  {
    title: "Customers",
    value: "3,842",
    change: "8.2%",
    trend: "up",
    description: "vs. previous month",
    icon: <TeamOutlined />,
  },
  {
    title: "Transactions",
    value: "8,426",
    change: "14.8%",
    trend: "up",
    description: "vs. previous month",
    icon: <TransactionOutlined />,
  },
  {
    title: "Revenue",
    value: "TZS 284.6M",
    change: "11.3%",
    trend: "up",
    description: "vs. previous month",
    icon: <DollarOutlined />,
  },
];

const applicationStatus = [
  {
    label: "Approved",
    value: 42,
    count: 539,
  },
  {
    label: "Pending",
    value: 28,
    count: 360,
  },
  {
    label: "Under Review",
    value: 18,
    count: 231,
  },
  {
    label: "Rejected",
    value: 12,
    count: 154,
  },
];

const recentApplications = [
  {
    id: "APP-10245",
    customer: "Asha Mohamed",
    type: "Business Loan",
    amount: "TZS 2,400,000",
    status: "Approved",
    date: "03 Sep 2026",
  },
  {
    id: "APP-10244",
    customer: "Juma Hassan",
    type: "Working Capital",
    amount: "TZS 1,800,000",
    status: "Pending",
    date: "03 Sep 2026",
  },
  {
    id: "APP-10243",
    customer: "Fatma Ali",
    type: "Business Loan",
    amount: "TZS 4,500,000",
    status: "Under Review",
    date: "02 Sep 2026",
  },
  {
    id: "APP-10242",
    customer: "Mohamed Said",
    type: "Asset Finance",
    amount: "TZS 7,200,000",
    status: "Approved",
    date: "02 Sep 2026",
  },
  {
    id: "APP-10241",
    customer: "Salma Omar",
    type: "Working Capital",
    amount: "TZS 1,250,000",
    status: "Rejected",
    date: "01 Sep 2026",
  },
];

const activities = [
  {
    title: "Application approved",
    description: "APP-10245 was approved successfully",
    time: "12 minutes ago",
    type: "success",
  },
  {
    title: "New customer registered",
    description: "Asha Mohamed was added to customers",
    time: "35 minutes ago",
    type: "customer",
  },
  {
    title: "Transaction completed",
    description: "TZS 850,000 transaction processed",
    time: "1 hour ago",
    type: "transaction",
  },
  {
    title: "Application requires review",
    description: "APP-10243 needs your attention",
    time: "2 hours ago",
    type: "warning",
  },
];

const weeklyTransactions = [
  { day: "Mon", value: 58 },
  { day: "Tue", value: 72 },
  { day: "Wed", value: 64 },
  { day: "Thu", value: 86 },
  { day: "Fri", value: 78 },
  { day: "Sat", value: 54 },
  { day: "Sun", value: 42 },
];

export const DashboardContent = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="sw-agent-dashboard">
      <div className="pension-welcome-card">
        {/* Left: Welcome */}
        <div className="pension-welcome-content">
          <div className="pension-welcome-icon">
            <i className="bi bi-sun"></i>
          </div>

          <div>
            <span className="pension-welcome-label">WELCOME BACK</span>

            <h4>
              {/* {greeting.generateGreetings()},{" "} */}
              {"Good Afternoon, "}
              {toSmartTitleCase(getFirstWord(user.first_name))}...!
            </h4>

            <p>
              Welcome back to your dashboard. Here&apos;s what&apos;s happening
              today.
            </p>
          </div>
        </div>

        {/* Right: Date & Time */}
        <div className="pension-welcome-datetime">
          <div className="pension-welcome-date">
            <i className="bi bi-calendar3"></i>

            <div>
              <span>Today</span>

              <strong>{moment(new Date()).format("dddd, DD MMMM YYYY")}</strong>
            </div>
          </div>

          <div className="pension-welcome-time">
            <i className="bi bi-clock"></i>

            <strong>{moment(currentTime).format("HH:mm:ss")}</strong>
          </div>
        </div>
      </div>
      <hr className="mt-3" />
      <div className="sw-dashboard-summary-grid">
        {summaryCards.map((card) => (
          <div className="sw-dashboard-summary-card" key={card.title}>
            <div className="sw-dashboard-summary-icon">{card.icon}</div>

            <div className="sw-dashboard-summary-content">
              <span className="sw-dashboard-summary-title">{card.title}</span>

              <div className="sw-dashboard-summary-value">{card.value}</div>

              <div className="sw-dashboard-summary-meta">
                <span
                  className={`sw-dashboard-summary-change ${
                    card.trend === "up" ? "positive" : "negative"
                  }`}
                >
                  {card.trend === "up" ? "↑" : "↓"} {card.change}
                </span>

                <span className="sw-dashboard-summary-description">
                  {card.description}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* =====================================================
          CHART ROW
      ====================================================== */}

      <div className="sw-dashboard-chart-grid">
        {/* TRANSACTIONS */}

        <div className="sw-dashboard-panel sw-dashboard-chart-panel">
          <div className="sw-dashboard-panel-header">
            <div>
              <h2>Transaction Overview</h2>
              <p>Transaction activity for the current week</p>
            </div>

            <select className="sw-dashboard-select">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
            </select>
          </div>

          <div className="sw-dashboard-chart">
            <div className="sw-dashboard-chart-y">
              <span>100</span>
              <span>75</span>
              <span>50</span>
              <span>25</span>
              <span>0</span>
            </div>

            <div className="sw-dashboard-chart-area">
              <div className="sw-dashboard-chart-gridlines">
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>

              <div className="sw-dashboard-bars">
                {weeklyTransactions.map((item) => (
                  <div className="sw-dashboard-bar-wrapper" key={item.day}>
                    <div
                      className="sw-dashboard-bar"
                      style={{
                        height: `${item.value}%`,
                      }}
                      title={`${item.value} transactions`}
                    />

                    <span>{item.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* APPLICATION STATUS */}

        <div className="sw-dashboard-panel sw-dashboard-status-panel">
          <div className="sw-dashboard-panel-header">
            <div>
              <h2>Application Status</h2>
              <p>Current application distribution</p>
            </div>

            <button className="sw-dashboard-more">
              <MoreOutlined />
            </button>
          </div>

          <div className="sw-dashboard-status-total">
            <strong>1,284</strong>
            <span>Total applications</span>
          </div>

          <div className="sw-dashboard-progress">
            {applicationStatus.map((item) => (
              <div className="sw-dashboard-progress-row" key={item.label}>
                <div className="sw-dashboard-progress-info">
                  <span>{item.label}</span>
                  <strong>{item.count}</strong>
                </div>

                <div className="sw-dashboard-progress-track">
                  <div
                    className={`sw-dashboard-progress-fill sw-status-${item.label
                      .toLowerCase()
                      .replace(" ", "-")}`}
                    style={{
                      width: `${item.value}%`,
                    }}
                  />
                </div>

                <span className="sw-dashboard-progress-percent">
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =====================================================
          RECENT APPLICATIONS
      ====================================================== */}

      <div className="sw-dashboard-panel sw-dashboard-table-panel">
        <div className="sw-dashboard-panel-header">
          <div>
            <h2>Recent Applications</h2>
            <p>Latest applications submitted through your account</p>
          </div>

          <button className="sw-dashboard-view-all">
            View all
            <ArrowUpOutlined />
          </button>
        </div>

        <div className="sw-dashboard-table-wrapper">
          <table className="sw-dashboard-table">
            <thead>
              <tr>
                <th>Application</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th />
              </tr>
            </thead>

            <tbody>
              {recentApplications.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong className="sw-dashboard-app-id">{item.id}</strong>
                  </td>

                  <td>
                    <div className="sw-dashboard-customer">
                      <div className="sw-dashboard-customer-avatar">
                        {item.customer
                          .split(" ")
                          .map((word) => word[0])
                          .join("")
                          .slice(0, 2)}
                      </div>

                      <span>{item.customer}</span>
                    </div>
                  </td>

                  <td>{item.type}</td>

                  <td>
                    <strong>{item.amount}</strong>
                  </td>

                  <td>
                    <span
                      className={`sw-dashboard-status sw-status-${item.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      <span />
                      {item.status}
                    </span>
                  </td>

                  <td className="sw-dashboard-date-cell">{item.date}</td>

                  <td>
                    <button className="sw-dashboard-row-action">
                      <MoreOutlined />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* =====================================================
          BOTTOM ROW
      ====================================================== */}

      <div className="sw-dashboard-bottom-grid">
        {/* ACTIVITY */}

        <div className="sw-dashboard-panel">
          <div className="sw-dashboard-panel-header">
            <div>
              <h2>Recent Activity</h2>
              <p>Your latest platform activity</p>
            </div>

            <button className="sw-dashboard-view-all">View all</button>
          </div>

          <div className="sw-dashboard-activity-list">
            {activities.map((activity, index) => (
              <div className="sw-dashboard-activity" key={index}>
                <div className={`sw-dashboard-activity-icon ${activity.type}`}>
                  {activity.type === "success" && <CheckCircleOutlined />}

                  {activity.type === "customer" && <UserAddOutlined />}

                  {activity.type === "transaction" && <DollarOutlined />}

                  {activity.type === "warning" && <WarningOutlined />}
                </div>

                <div className="sw-dashboard-activity-content">
                  <strong>{activity.title}</strong>

                  <p>{activity.description}</p>

                  <span>{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* QUICK ACTIONS */}

        <div className="sw-dashboard-panel sw-dashboard-actions-panel">
          <div className="sw-dashboard-panel-header">
            <div>
              <h2>Quick Actions</h2>
              <p>Frequently used operations</p>
            </div>
          </div>

          <div className="sw-dashboard-actions">
            <button className="sw-dashboard-action">
              <span className="sw-dashboard-action-icon orange">
                <FileAddOutlined />
              </span>

              <span>
                <strong>New Application</strong>
                <small>Create a new application</small>
              </span>

              <ArrowUpOutlined />
            </button>

            <button className="sw-dashboard-action">
              <span className="sw-dashboard-action-icon blue">
                <UserAddOutlined />
              </span>

              <span>
                <strong>Register Customer</strong>
                <small>Add a new customer</small>
              </span>

              <ArrowUpOutlined />
            </button>

            <button className="sw-dashboard-action">
              <span className="sw-dashboard-action-icon green">
                <TransactionOutlined />
              </span>

              <span>
                <strong>New Transaction</strong>
                <small>Process a transaction</small>
              </span>

              <ArrowUpOutlined />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
