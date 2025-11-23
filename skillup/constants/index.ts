// API Base URLs
export const API_BASE_URL = 'https://dummyjson.com';
export const OPENLIBRARY_BASE_URL = 'https://openlibrary.org';

// API Endpoints
export const API_ENDPOINTS = {
  // DummyJSON - Authentication
  LOGIN: '/auth/login',
  REGISTER: '/users/add',
  USER_ME: '/auth/me',
  
  // Open Library - Educational Content
  SEARCH_BOOKS: '/search.json',
  SUBJECTS: '/subjects',
  WORKS: '/works',
  AUTHORS: '/authors',
};

// Open Library Subjects for Courses
export const EDUCATION_SUBJECTS = [
  'programming',
  'computer_science',
  'mathematics',
  'physics',
  'chemistry',
  'biology',
  'business',
  'history',
  'philosophy',
  'art',
  'music',
  'languages',
];

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: '@skillup_auth_token',
  USER_DATA: '@skillup_user_data',
  FAVOURITES: '@skillup_favourites',
  THEME: '@skillup_theme',
};

// Navigation Routes
export const ROUTES = {
  AUTH_STACK: 'AuthStack',
  LOGIN: 'Login',
  REGISTER: 'Register',
  MAIN_TABS: 'MainTabs',
  HOME: 'Home',
  FAVOURITES: 'Favourites',
  PROFILE: 'Profile',
  COURSE_DETAILS: 'CourseDetails',
};

// Course Status
export const COURSE_STATUS = {
  ACTIVE: 'Active',
  UPCOMING: 'Upcoming',
  POPULAR: 'Popular',
} as const;

// Validation Messages
export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  EMAIL_INVALID: 'Please enter a valid email address',
  PASSWORD_MIN: 'Password must be at least 6 characters',
  USERNAME_MIN: 'Username must be at least 3 characters',
};
