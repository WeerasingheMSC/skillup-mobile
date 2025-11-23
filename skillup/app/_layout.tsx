import React, { useEffect } from 'react';
import { Slot } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '../store';
import { ThemeProvider } from '../hooks/useTheme';
import { useAppDispatch } from '../hooks/redux';
import { loadUserFromStorage } from '../store/slices/authSlice';
import { loadFavourites } from '../store/slices/favouritesSlice';

function RootLayoutNav() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadUserFromStorage());
    dispatch(loadFavourites());
  }, []);

  return <Slot />;
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <RootLayoutNav />
      </ThemeProvider>
    </Provider>
  );
}
