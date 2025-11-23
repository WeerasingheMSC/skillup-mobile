import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchCourses } from '../../store/slices/coursesSlice';
import { toggleFavourite, saveFavourites } from '../../store/slices/favouritesSlice';
import { CourseCard } from '../../components/course/CourseCard';
import { useTheme } from '../../hooks/useTheme';
import { Feather } from '@expo/vector-icons';
import { Course } from '../../types';

export default function HomeScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isDarkMode } = useTheme();
  const { user } = useAppSelector((state) => state.auth);
  const { courses, isLoading, error } = useAppSelector((state) => state.courses);
  const { favouriteIds } = useAppSelector((state) => state.favourites);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchCourses());
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchCourses());
    setRefreshing(false);
  };

  const handleFavouritePress = (courseId: number) => {
    dispatch(toggleFavourite(courseId));
    // Save to AsyncStorage
    const newFavourites = favouriteIds.includes(courseId)
      ? favouriteIds.filter((id) => id !== courseId)
      : [...favouriteIds, courseId];
    dispatch(saveFavourites(newFavourites));
  };

  const handleCoursePress = (course: Course) => {
    // Navigate to course details
    // For now, we'll just show an alert
    console.log('Course pressed:', course.title);
  };

  if (isLoading && !refreshing) {
    return (
      <View
        className={`flex-1 justify-center items-center ${
          isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
        }`}
      >
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className={`mt-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Loading courses...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View
        className={`flex-1 justify-center items-center px-6 ${
          isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
        }`}
      >
        <Feather name="alert-circle" size={64} color="#EF4444" />
        <Text className={`text-lg font-semibold mt-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Oops! Something went wrong
        </Text>
        <Text className={`text-center mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {error}
        </Text>
        <TouchableOpacity
          onPress={() => dispatch(fetchCourses())}
          className="mt-6 bg-blue-600 px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-semibold">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <FlatList
        data={courses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CourseCard
            course={item}
            onPress={() => handleCoursePress(item)}
            isFavourite={favouriteIds.includes(item.id)}
            onFavouritePress={() => handleFavouritePress(item.id)}
          />
        )}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#3B82F6"
          />
        }
        ListHeaderComponent={
          <View className="mb-6">
            <Text className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Welcome back, {user?.firstName}! 👋
            </Text>
            <Text className={`text-base mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Continue your learning journey
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View className="items-center justify-center py-12">
            <Feather name="book" size={64} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
            <Text
              className={`text-lg font-semibold mt-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
            >
              No courses available
            </Text>
            <Text className={`text-center mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Check back later for new courses
            </Text>
          </View>
        }
      />
    </View>
  );
}
