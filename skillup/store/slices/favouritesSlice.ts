import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { FavouritesState } from '../../types';
import { setStorageItem, getStorageItem } from '../../utils/storage';
import { STORAGE_KEYS } from '../../constants';

const initialState: FavouritesState = {
  favouriteIds: [],
};

// Async thunks
export const loadFavourites = createAsyncThunk(
  'favourites/loadFavourites',
  async () => {
    const favourites = await getStorageItem<(string | number)[]>(STORAGE_KEYS.FAVOURITES);
    return favourites || [];
  }
);

export const saveFavourites = createAsyncThunk(
  'favourites/saveFavourites',
  async (favouriteIds: (string | number)[]) => {
    await setStorageItem(STORAGE_KEYS.FAVOURITES, favouriteIds);
    return favouriteIds;
  }
);

const favouritesSlice = createSlice({
  name: 'favourites',
  initialState,
  reducers: {
    toggleFavourite: (state, action: PayloadAction<string | number>) => {
      const courseId = action.payload;
      const index = state.favouriteIds.indexOf(courseId);
      
      if (index > -1) {
        state.favouriteIds.splice(index, 1);
      } else {
        state.favouriteIds.push(courseId);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadFavourites.fulfilled, (state, action: PayloadAction<(string | number)[]>) => {
      state.favouriteIds = action.payload;
    });
    builder.addCase(saveFavourites.fulfilled, (state, action: PayloadAction<(string | number)[]>) => {
      state.favouriteIds = action.payload;
    });
  },
});

export const { toggleFavourite } = favouritesSlice.actions;
export default favouritesSlice.reducer;
