"use client";

import { App } from "antd";
import {
  ExclamationCircleOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

import "@/styles/common/confirmation.css";

const ICONS = {
  warning: <ExclamationCircleOutlined />,
  danger: <DeleteOutlined />,
  success: <CheckCircleOutlined />,
  info: <InfoCircleOutlined />,
};

export function useConfirm() {
  const { modal } = App.useApp();

  const confirm = ({
    title = "Are you sure?",
    content = "Please confirm that you want to continue.",
    type = "warning",
    okText = "Continue",
    cancelText = "Cancel",
    onOk,
    onCancel,
  }) => {
    return modal.confirm({
      centered: true,
      width: 350,
      icon: null,

      className: `sw-auth-confirm sw-auth-confirm-${type}`,

      title: (
        <div className="sw-auth-confirm-header">
          <div className="sw-auth-confirm-icon">
            {ICONS[type] || ICONS.warning}
          </div>

          <div className="sw-auth-confirm-heading">{title}</div>
        </div>
      ),

      content: (
        <div className="sw-auth-confirm-body">
          <div className="sw-auth-confirm-message">{content}</div>
        </div>
      ),

      okText,
      cancelText,

      okButtonProps: {
        className: `sw-auth-confirm-ok sw-auth-confirm-ok-${type}`,
      },

      cancelButtonProps: {
        className: "sw-auth-confirm-cancel",
      },

      onOk,
      onCancel,
    });
  };

  return confirm;
}
