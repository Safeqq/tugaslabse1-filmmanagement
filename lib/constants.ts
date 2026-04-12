export const PAGINATION = {
  FILMS_PER_PAGE: 12,
  GENRES_PER_PAGE: 10,
  DEFAULT_PAGE: 1,
} as const;

export const DEBOUNCE_DELAY = 500; // milliseconds

export const ROUTES = {
  HOME: '/',
  FILMS: '/films',
  GENRES: '/genres',
  LOGIN: '/login',
  REGISTER: '/register',
  ADMIN: '/admin',
  ADMIN_GENRES: '/admin/genres',
  ADMIN_FILMS: '/admin/films',
  MY_LISTS: '/my-lists',
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
  },
  FILMS: '/films',
  GENRES: '/genres',
  GENRES_ADMIN: '/genres/admin',
  REVIEWS: '/reviews',
  REACTIONS: '/reactions',
  FILM_LISTS: '/film-lists',
  USERS: '/users',
} as const;

export const RATING_OPTIONS = [1, 2, 3, 4, 5] as const;

export const TOAST_DURATION = 3000; // milliseconds
