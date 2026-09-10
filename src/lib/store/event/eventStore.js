import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useEventStore = create(
  persist(
    (set) => ({
      navigationState: null,

      setNavigationState: (data) =>
        set({
          navigationState: data,
        }),

      clearNavigationState: () =>
        set({
          navigationState: null,
        }),
    }),
    {
      name: "event-navigation",
    },
  ),
);
