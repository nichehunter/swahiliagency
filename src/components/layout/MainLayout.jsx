"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "@/styles/layout/layout.css";
import {
  AppstoreOutlined,
  BarChartOutlined,
  BellOutlined,
  FileTextOutlined,
  HomeOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
  DashboardOutlined,
  QuestionCircleOutlined,
  CloseOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { useAuthStore } from "@/stores/authStore";
import ProtectedLayout from "./ProtectedLayout";
import {
  getFirstWord,
  getInitials,
  toLowerCase,
  toSmartTitleCase,
} from "@/lib/utils/char";

const getMenuGroups = (company) => {
  const allowedCategories = company?.allowed_categories || [];

  return [
    {
      title: "MAIN",
      items: [
        {
          label: "Dashboard",
          href: "/dashboard",
          icon: <DashboardOutlined />,
        },

        ...(allowedCategories.includes(1)
          ? [
              {
                label: "Events",
                href: "/event",
                icon: <CalendarOutlined />,
              },
            ]
          : []),

        ...(allowedCategories.includes(2)
          ? [
              {
                label: "Facilities",
                href: "/facility",
                icon: <HomeOutlined />,
              },
            ]
          : []),

        ...(allowedCategories.includes(3)
          ? [
              {
                label: "Tourism",
                href: "/tourism",
                icon: <EnvironmentOutlined />,
              },
            ]
          : []),
      ],
    },

    {
      title: "MANAGEMENT",
      items: [
        {
          label: "Activities",
          href: "/activities",
          icon: <AppstoreOutlined />,
        },
        {
          label: "Reports",
          icon: <BarChartOutlined />,
          children: [
            {
              label: "Customer Reports",
              href: "/reports/customers",
            },
            {
              label: "Revenue Reports",
              href: "/reports/revenue",
            },
            {
              label: "Transaction Reports",
              href: "/reports/transactions",
            },
          ],
        },
        {
          label: "Documents",
          href: "/documents",
          icon: <FileTextOutlined />,
        },
      ],
    },

    {
      title: "SYSTEM",
      items: [
        {
          label: "Settings",
          href: "/settings",
          icon: <SettingOutlined />,
        },
        {
          label: "Help & Support",
          href: "/help",
          icon: <QuestionCircleOutlined />,
        },
      ],
    },
  ];
};

export default function MainLayout({ children }) {
  const pathname = usePathname();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const userMenuRef = useRef(null);
  const router = useRouter();
  const [expandedMenu, setExpandedMenu] = useState(null);
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const company = useAuthStore((state) => state.company);
  const menuGroups = getMenuGroups(company);

  const isActive = (href) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard" || pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };
  const toggleMenu = (label) => {
    setExpandedMenu((prev) => (prev === label ? null : label));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  return (
    <ProtectedLayout>
      <div className="sw-agent-layout">
        {/* =====================================================
          MOBILE OVERLAY
      ===================================================== */}

        {mobileOpen && (
          <div
            className="sw-agent-mobile-overlay"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* =====================================================
          SIDEBAR
      ===================================================== */}

        <aside
          className={`
          sw-agent-sidebar
          ${collapsed ? "sw-agent-sidebar-collapsed" : ""}
          ${mobileOpen ? "sw-agent-sidebar-mobile-open" : ""}
        `}
        >
          {/* LOGO */}

          <div className="sw-agent-sidebar-logo">
            <Link href="/dashboard">
              <div className="sw-agent-sidebar-logo-mark">
                <span>S</span>
              </div>

              {!collapsed && (
                <div className="sw-agent-sidebar-logo-text">
                  <strong>SwahiliExpi</strong>
                  <span>AGENT PLATFORM</span>
                </div>
              )}
            </Link>

            {/* MOBILE CLOSE */}

            <button
              className="sw-agent-mobile-close"
              onClick={() => setMobileOpen(false)}
            >
              <CloseOutlined />
            </button>
          </div>

          {/* NAVIGATION */}

          <nav className="sw-agent-sidebar-nav">
            {menuGroups.map((group) => (
              <div className="sw-agent-nav-group" key={group.title}>
                <div className="sw-agent-nav-title">{group.title}</div>

                {group.items.map((item) => {
                  const hasChildren = item.children?.length > 0;

                  const childIsActive = hasChildren
                    ? item.children.some(
                        (child) =>
                          pathname === child.href ||
                          pathname.startsWith(`${child.href}/`),
                      )
                    : false;

                  const active = hasChildren
                    ? childIsActive
                    : isActive(item.href);

                  return (
                    <div key={item.label} className="sw-agent-nav-item-wrapper">
                      {hasChildren ? (
                        <>
                          <button
                            type="button"
                            className={`sw-agent-nav-link ${
                              active ? "active" : ""
                            }`}
                            onClick={() => toggleMenu(item.label)}
                          >
                            <span className="sw-agent-nav-icon">
                              {item.icon}
                            </span>

                            <span className="sw-agent-nav-label">
                              {item.label}
                            </span>

                            <span
                              className={`sw-agent-nav-arrow ${
                                expandedMenu === item.label ? "open" : ""
                              }`}
                            >
                              ▾
                            </span>
                          </button>

                          {expandedMenu === item.label && (
                            <div className="sw-agent-submenu">
                              {item.children.map((child) => (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  className={`sw-agent-submenu-link ${
                                    isActive(child.href) ? "active" : ""
                                  }`}
                                >
                                  <span className="sw-agent-submenu-dot" />

                                  <span>{child.label}</span>
                                </Link>
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <Link
                          href={item.href}
                          className={`sw-agent-nav-link ${
                            active ? "active" : ""
                          }`}
                        >
                          <span className="sw-agent-nav-icon">{item.icon}</span>

                          <span className="sw-agent-nav-label">
                            {item.label}
                          </span>
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* SIDEBAR FOOTER */}

          <div className="sw-agent-sidebar-footer">
            {!collapsed && (
              <div className="sw-agent-sidebar-user">
                <div className="sw-agent-sidebar-avatar">
                  <UserOutlined />
                </div>

                <div className="sw-agent-sidebar-user-info">
                  <strong>{user?.username}</strong>

                  <span>
                    <i />
                    Active
                  </span>
                </div>
              </div>
            )}

            <button className="sw-agent-logout">
              <LogoutOutlined />

              {!collapsed && <span>Sign out</span>}
            </button>
          </div>
        </aside>

        {/* =====================================================
          MAIN AREA
      ===================================================== */}

        <div
          className={`
          sw-agent-main
          ${collapsed ? "sw-agent-main-collapsed" : ""}
        `}
        >
          {/* ===================================================
            HEADER
        =================================================== */}

          <header className="sw-agent-header">
            <div className="sw-agent-header-left">
              {/* DESKTOP SIDEBAR TOGGLE */}

              <button
                className="sw-agent-sidebar-toggle"
                onClick={() => setCollapsed(!collapsed)}
                aria-label="Toggle sidebar"
              >
                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              </button>

              {/* MOBILE MENU */}

              <button
                className="sw-agent-mobile-menu"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <MenuUnfoldOutlined />
              </button>

              <div className="sw-agent-header-title">
                <span>AGENT PLATFORM</span>

                <strong>Dashboard</strong>
              </div>
            </div>

            {/* HEADER RIGHT */}

            <div className="sw-agent-header-right">
              {/* NOTIFICATION */}

              <button className="sw-agent-notification">
                <BellOutlined />

                <span />
              </button>

              {/* USER */}

              <div className="sw-agent-header-divider" />

              {/* USER MENU */}
              <div className="sw-agent-header-user-wrapper" ref={userMenuRef}>
                <button
                  type="button"
                  className="sw-agent-header-user"
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                >
                  <div className="sw-agent-header-avatar">
                    {getInitials(user?.first_name)}
                  </div>

                  <div className="sw-agent-header-user-info">
                    <strong>{toSmartTitleCase(user?.first_name)}</strong>
                    <span>
                      {user?.is_supervisor ? "Supervisor" : "Officer"}
                    </span>
                  </div>

                  <span
                    className={`sw-agent-header-chevron ${
                      userMenuOpen ? "open" : ""
                    }`}
                  >
                    ▾
                  </span>
                </button>

                {userMenuOpen && (
                  <div className="sw-agent-user-dropdown">
                    {/* PROFILE */}
                    <button
                      type="button"
                      className="sw-agent-dropdown-item"
                      onClick={() => router.push("/profile")}
                    >
                      <span className="sw-agent-dropdown-icon">
                        <UserOutlined />
                      </span>

                      <span className="sw-agent-dropdown-content">
                        <strong>My Profile</strong>
                        <small>View your profile</small>
                      </span>
                    </button>

                    {/* SETTINGS */}
                    <button
                      type="button"
                      className="sw-agent-dropdown-item"
                      onClick={() => router.push("/settings")}
                    >
                      <span className="sw-agent-dropdown-icon">
                        <SettingOutlined />
                      </span>

                      <span className="sw-agent-dropdown-content">
                        <strong>Account Settings</strong>
                        <small>Manage your account</small>
                      </span>
                    </button>

                    {/* NOTIFICATIONS */}
                    <button
                      type="button"
                      className="sw-agent-dropdown-item"
                      onClick={() => router.push("/notifications")}
                    >
                      <span className="sw-agent-dropdown-icon">
                        <BellOutlined />
                      </span>

                      <span className="sw-agent-dropdown-content">
                        <strong>Notifications</strong>
                        <small>View your notifications</small>
                      </span>
                    </button>

                    {/* HELP */}
                    <button
                      type="button"
                      className="sw-agent-dropdown-item"
                      onClick={() => router.push("/help")}
                    >
                      <span className="sw-agent-dropdown-icon">
                        <QuestionCircleOutlined />
                      </span>

                      <span className="sw-agent-dropdown-content">
                        <strong>Help & Support</strong>
                        <small>Get help and assistance</small>
                      </span>
                    </button>

                    <div className="sw-agent-dropdown-divider" />

                    {/* LOGOUT */}
                    <button
                      type="button"
                      className="sw-agent-dropdown-item sw-agent-dropdown-logout"
                      onClick={handleLogout}
                    >
                      <span className="sw-agent-dropdown-icon">
                        <LogoutOutlined />
                      </span>

                      <span className="sw-agent-dropdown-content">
                        <strong>Logout</strong>
                        <small>Sign out of your account</small>
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* ===================================================
            PAGE CONTENT
        =================================================== */}

          <main className="sw-agent-content">{children}</main>
        </div>
      </div>
    </ProtectedLayout>
  );
}
