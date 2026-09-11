"use client";

import { createContext, useContext, useState } from "react";
import MainLoading from "./MainLoading";

const NavigationLoadingContext = createContext(null);

export default function NavigationLoadingProvider({ children }) {
  const [isNavigating, setIsNavigating] = useState(false);
  const [message, setMessage] = useState("Loading...");

  const startNavigation = (loadingMessage = "Loading...") => {
    setMessage(loadingMessage);
    setIsNavigating(true);
  };

  const stopNavigation = () => {
    setIsNavigating(false);
  };

  return (
    <NavigationLoadingContext.Provider
      value={{
        isNavigating,
        startNavigation,
        stopNavigation,
      }}
    >
      {children}

      {isNavigating && <MainLoading message={message} />}
    </NavigationLoadingContext.Provider>
  );
}

export function useNavigationLoading() {
  const context = useContext(NavigationLoadingContext);

  if (!context) {
    // Safe fallback during build / SSG
    if (typeof window === "undefined") {
      return {
        isNavigating: false,
        message: "",
        startNavigation: () => {},
        stopNavigation: () => {},
      };
    }

    throw new Error(
      "useNavigationLoading must be used inside NavigationLoadingProvider",
    );
  }

  return context;
}
