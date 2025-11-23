// User and Authentication Types
export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  token?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// Course Types
export interface Course {
  id: string | number;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  price: number;
  rating: number;
  instructor: string;
  duration: string;
  level: string;
  status: 'Active' | 'Upcoming' | 'Popular';
  isbn?: string[];
  publishYear?: number;
  pageCount?: number;
  language?: string[];
}

export interface CoursesState {
  courses: Course[];
  isLoading: boolean;
  error: string | null;
  selectedCourse: Course | null;
}

// Favourites Types
export interface FavouritesState {
  favouriteIds: (string | number)[];
}

// Theme Types
export interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}
