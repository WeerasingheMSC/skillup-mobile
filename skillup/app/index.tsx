import "../global.css";
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAppSelector } from '../hooks/redux';

export default function Index() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Small delay to ensure navigation is ready
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        // @ts-ignore
        router.replace('/(tabs)');
      } else {
        // @ts-ignore
        router.replace('/auth/login');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  return (
    <View className="flex-1 items-center justify-center bg-gray-50 dark:bg-gray-900">
      <ActivityIndicator size="large" color="#3B82F6" />
    </View>
  );
}