import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { CoursesState, Course } from '../../types';
import { courseService } from '../../services/courseService';

const initialState: CoursesState = {
  courses: [],
  isLoading: false,
  error: null,
  selectedCourse: null,
};

// Async thunks
export const fetchCourses = createAsyncThunk(
  'courses/fetchCourses',
  async (_, { rejectWithValue }) => {
    try {
      const courses = await courseService.getCourses();
      return courses;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch courses');
    }
  }
);

export const fetchCourseById = createAsyncThunk(
  'courses/fetchCourseById',
  async (id: number, { rejectWithValue }) => {
    try {
      const course = await courseService.getCourseById(id);
      return course;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch course');
    }
  }
);

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    clearSelectedCourse: (state) => {
      state.selectedCourse = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch courses
    builder.addCase(fetchCourses.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchCourses.fulfilled, (state, action: PayloadAction<Course[]>) => {
      state.isLoading = false;
      state.courses = action.payload;
    });
    builder.addCase(fetchCourses.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Fetch course by ID
    builder.addCase(fetchCourseById.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchCourseById.fulfilled, (state, action: PayloadAction<Course>) => {
      state.isLoading = false;
      state.selectedCourse = action.payload;
    });
    builder.addCase(fetchCourseById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearSelectedCourse, clearError } = coursesSlice.actions;
export default coursesSlice.reducer;
