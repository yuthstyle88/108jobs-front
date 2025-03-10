export const API_ENDPOINTS = {
    posts: {
      list: '/posts',
      detail: (id: string | number) => `/posts/${id}`,
    },
    users: {
      profile: '/users/me',
    },
  };