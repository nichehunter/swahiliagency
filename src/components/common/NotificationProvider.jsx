"use client";

import { createContext, useCallback, useContext } from "react";
import { App } from "antd";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { notification } = App.useApp();

  const success = useCallback(
    (message, description = "", options = {}) => {
      notification.success({
        title: message,
        description,
        placement: "bottomRight",
        duration: 4,
        ...options,
      });
    },
    [notification],
  );

  const error = useCallback(
    (message, description = "", options = {}) => {
      notification.error({
        title: message,
        description,
        placement: "bottomRight",
        duration: 4,
        ...options,
      });
    },
    [notification],
  );

  const warning = useCallback(
    (message, description = "", options = {}) => {
      notification.warning({
        title: message,
        description,
        placement: "bottomRight",
        duration: 4,
        ...options,
      });
    },
    [notification],
  );

  const info = useCallback(
    (message, description = "", options = {}) => {
      notification.info({
        title: message,
        description,
        placement: "bottomRight",
        duration: 4,
        ...options,
      });
    },
    [notification],
  );

  const open = useCallback(
    (options = {}) => {
      notification.open({
        placement: "bottomRight",
        duration: 4,
        ...options,
      });
    },
    [notification],
  );

  const destroy = useCallback(() => {
    notification.destroy();
  }, [notification]);

  return (
    <NotificationContext.Provider
      value={{
        success,
        error,
        warning,
        info,
        open,
        destroy,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotify() {
  const context = useContext(NotificationContext);

  if (!context) {
    // Return dummy no-op functions during SSR / static build to prevent build errors
    if (typeof window === "undefined") {
      return {
        success: () => {},
        error: () => {},
        info: () => {},
        warning: () => {},
        open: () => {},
        destroy: () => {},
      };
    }

    throw new Error("useNotify must be used inside NotificationProvider");
  }

  return context;
}
