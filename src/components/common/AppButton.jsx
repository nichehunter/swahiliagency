"use client";

import { Button } from "antd";

import "@/styles/common/buttons.css";

export default function AppButton({
  children,
  type = "default",
  icon,
  loading = false,
  disabled = false,
  htmlType = "button",
  onClick,
  size = "middle",
  block = false,
  className = "",
  danger = false,
}) {
  return (
    <Button
      htmlType={htmlType}
      icon={icon}
      loading={loading}
      disabled={loading || disabled}
      onClick={onClick}
      size={size}
      block={block}
      danger={danger}
      className={`sw-auth-btn sw-auth-btn-${type} ${className}`}
    >
      {children}
    </Button>
  );
}
