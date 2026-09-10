"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import "@/styles/common/loading.css";

const LoadingContext = createContext(null);

export function LoadingProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(1);
  const [message, setMessage] = useState("Please wait...");

  const progressTimerRef = useRef(null);
  const hideTimerRef = useRef(null);

  const clearTimers = useCallback(() => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }

    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  /**
   * Start loading
   */
  const startLoading = useCallback(
    (loadingMessage = "Please wait...") => {
      clearTimers();

      setMessage(loadingMessage);
      setProgress(1);
      setLoading(true);

      progressTimerRef.current = setInterval(() => {
        setProgress((current) => {
          if (current >= 90) {
            return current;
          }

          let increment = 1;

          if (current < 20) {
            increment = 1;
          } else if (current < 50) {
            increment = 1;
          } else if (current < 75) {
            increment = 0.5;
          } else {
            increment = 0.2;
          }

          return Math.min(Number((current + increment).toFixed(1)), 90);
        });
      }, 300);
    },
    [clearTimers],
  );

  /**
   * Finish loading
   */
  const finishLoading = useCallback(() => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }

    // Finish at 100%
    setProgress(100);

    // Keep 100% visible slightly longer
    hideTimerRef.current = setTimeout(() => {
      setLoading(false);
      setProgress(1);
    }, 500);
  }, []);

  /**
   * Run any async function with the global loader.
   *
   * Example:
   *
   * await loading.run(
   *   () => createStaff(values),
   *   "Creating staff..."
   * );
   */
  const run = useCallback(
    async (action, loadingMessage = "Please wait...") => {
      startLoading(loadingMessage);

      try {
        const result = await action();

        return result;
      } catch (error) {
        throw error;
      } finally {
        finishLoading();
      }
    },
    [startLoading, finishLoading],
  );

  /**
   * Update progress manually.
   *
   * Useful for file uploads or downloads where
   * you know the real percentage.
   */
  const setLoadingProgress = useCallback((value) => {
    const numericValue = Number(value);

    if (Number.isNaN(numericValue)) {
      return;
    }

    setProgress(Math.min(100, Math.max(1, Number(numericValue.toFixed(1)))));
  }, []);

  /**
   * Cleanup timers when provider unmounts.
   */
  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  return (
    <LoadingContext.Provider
      value={{
        loading,
        progress,
        message,
        startLoading,
        finishLoading,
        setLoadingProgress,
        run,
      }}
    >
      {children}

      {loading && (
        <div
          className="sw-auth-loading-overlay"
          aria-live="polite"
          aria-busy="true"
        >
          <div className="sw-auth-loading-card">
            {/* Circular Progress */}
            <div
              className="sw-auth-loading-circle"
              style={{
                "--loading-progress": `${progress}%`,
              }}
            >
              <div className="sw-auth-loading-circle-inner">
                <span className="sw-auth-loading-percent">
                  {progress % 1 === 0
                    ? `${progress}%`
                    : `${progress.toFixed(1)}%`}
                </span>
              </div>
            </div>

            {/* Loading Title */}
            <div className="sw-auth-loading-title">Please wait</div>

            {/* Loading Message */}
            <div className="sw-auth-loading-message">{message}</div>

            {/* Small animated indicator */}
            <div className="sw-auth-loading-dots">
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      )}
    </LoadingContext.Provider>
  );
}

/**
 * Global loading hook
 */
export function useLoading() {
  const context = useContext(LoadingContext);

  if (!context) {
    // If evaluated during build time / SSG, return a safe dummy context object
    if (typeof window === "undefined") {
      return {
        loading: false,
        progress: 1,
        message: "",
        startLoading: () => {},
        finishLoading: () => {},
        setLoadingProgress: () => {},
        run: async (action) => await action(),
      };
    }

    throw new Error("useLoading must be used inside LoadingProvider");
  }

  return context;
}
