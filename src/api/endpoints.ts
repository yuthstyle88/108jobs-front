// Minimal endpoints module to satisfy imports.
// Centralizes API route paths used across the app. Adjust as backend evolves.

export const API_ROUTES = {
  profile: {
    getListReview: "/api/reviews",
  },
  chat: {
    listRooms: "/api/chat/rooms",
    unreadCount: "/api/chat/unread-count",
  },
  job: {
    list: "/api/jobs",
    detail: "/api/jobs", // will be used with /:id
    favorite: "/api/favorites",
  },
  category: {
    list: "/api/categories",
  }
} as const;

export const API_ROUTES_SELLER = {
  profile: {
    skillLevel: "/api/seller/skill-level",
  },
  job: {
    getJob: "/api/seller/jobs",
    displayJob: "/api/seller/jobs/display",
  },
} as const;

export type ApiRoutes = typeof API_ROUTES;
export type ApiRoutesSeller = typeof API_ROUTES_SELLER;
