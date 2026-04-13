export interface User {
  id: string;
  email: string;
  username: string;
  display_name: string;
  bio: string;
  role: 'USER' | 'ADMIN';
  createdAt?: string;
}

export interface Film {
  id: string;
  title: string;
  synopsis: string;
  airing_status: 'airing' | 'finished_airing' | 'not_yet_aired';
  total_episodes: number;
  release_date: string;
  images?: string[];
  genres?: Genre[];
  average_rating?: number;
  reviews?: Review[];
}

export interface Genre {
  id: string;
  name: string;
}

export interface Review {
  id: string;
  film_id: string;
  user_id: string;
  user?: User;
  rating: number;
  comment: string;
  created_at: string;
  reactions?: Reaction[];
  like_count?: number;
  dislike_count?: number;
}

export interface Reaction {
  id: string;
  review_id: string;
  user_id: string;
  status: 'like' | 'dislike';
}

export interface FilmList {
  id: string;
  user_id: string;
  film_id: string;
  film_title?: string;
  list_status: 'watching' | 'completed' | 'plan_to_watch';
  visibility: 'public' | 'private';
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  meta?: {
    take: number;
    page: number;
    total_data: number;
    total_page: number;
    sort: string;
    sort_by: string;
    filter?: string;
    filter_by?: string;
  }[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}
