import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { toggleFavourite, saveFavourites } from '../../store/slices/favouritesSlice';
import { CourseCard } from '../../components/course/CourseCard';
import { useTheme } from '../../hooks/useTheme';
import { Feather } from '@expo/vector-icons';
import { Course } from '../../types';

export default function FavouritesScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isDarkMode } = useTheme();
  const { courses } = useAppSelector((state) => state.courses);
  const { favouriteIds } = useAppSelector((state) => state.favourites);

  const favouriteCourses = courses.filter((course) => favouriteIds.includes(course.id));

  const handleFavouritePress = (courseId: string | number) => {
    dispatch(toggleFavourite(courseId));
    const newFavourites = favouriteIds.filter((id) => id !== courseId);
    dispatch(saveFavourites(newFavourites));
  };

  const handleCoursePress = (course: Course) => {
    router.push(`/course/${course.id}`);
  };

  return (
    <View className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <FlatList
        data={favouriteCourses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CourseCard
            course={item}
            onPress={() => handleCoursePress(item)}
            isFavourite={true}
            onFavouritePress={() => handleFavouritePress(item.id)}
          />
        )}
        contentContainerStyle={{ padding: 16 }}
        ListHeaderComponent={
          <View className="mb-6">
            <Text className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Your Favourites ❤️
            </Text>
            <Text className={`text-base mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {favouriteCourses.length} course{favouriteCourses.length !== 1 ? 's' : ''} saved
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View className="items-center justify-center py-12">
            <Feather name="heart" size={64} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
            <Text
              className={`text-lg font-semibold mt-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
            >
              No favourites yet
            </Text>
            <Text className={`text-center mt-2 px-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Start adding courses to your favourites by tapping the heart icon
            </Text>
          </View>
        }
      />
    </View>
  );
}
