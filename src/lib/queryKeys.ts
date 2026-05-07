export const queryKeys = {
  landing: {
    all: ["landing"] as const,
    warehouses: () => [...queryKeys.landing.all, "warehouses"] as const,
    stats: () => [...queryKeys.landing.all, "stats"] as const,
    config: () => [...queryKeys.landing.all, "config"] as const,
  },
  parcels: {
    all: ["parcels"] as const,
    list: (email?: string) =>
      [...queryKeys.parcels.all, "list", { email }] as const,
    details: (id: string) => [...queryKeys.parcels.all, "details", id] as const,
    tracking: (id: string) =>
      [...queryKeys.parcels.all, "tracking", id] as const,
  },
  users: {
    all: ["users"] as const,
    profile: (email?: string) =>
      [...queryKeys.users.all, "profile", email] as const,
  },
  notifications: {
    all: ["notifications"] as const,
    unread: (email?: string) =>
      [...queryKeys.notifications.all, "unread", email] as const,
  },
  finance: {
    all: ["finance"] as const,
    payments: (email?: string) =>
      [...queryKeys.finance.all, "payments", email] as const,
  },
};
