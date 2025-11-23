import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { toggleFavourite, saveFavourites } from '../../store/slices/favouritesSlice';
import { useTheme } from '../../hooks/useTheme';
import { Course } from '../../types';

export default function CourseDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isDarkMode } = useTheme();
  const { courses } = useAppSelector((state) => state.courses);
  const { favouriteIds } = useAppSelector((state) => state.favourites);
  
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Find course by ID
    const foundCourse = courses.find((c) => c.id.toString() === id);
    if (foundCourse) {
      setCourse(foundCourse);
    }
    setIsLoading(false);
  }, [id, courses]);

  const handleFavouritePress = () => {
    if (!course) return;
    dispatch(toggleFavourite(course.id));
    const newFavourites = favouriteIds.includes(course.id)
      ? favouriteIds.filter((fid) => fid !== course.id)
      : [...favouriteIds, course.id];
    dispatch(saveFavourites(newFavourites));
  };

  const handleEnroll = () => {
    Alert.alert(
      'Enroll in Course',
      `Would you like to enroll in "${course?.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Enroll',
          onPress: () => Alert.alert('Success', 'You have been enrolled!'),
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`} edges={['top']}>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      </SafeAreaView>
    );
  }

  if (!course) {
    return (
      <SafeAreaView className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`} edges={['top']}>
        <View className="flex-1 justify-center items-center px-6">
          <Feather name="alert-circle" size={64} color="#EF4444" />
          <Text className={`text-lg font-semibold mt-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Course Not Found
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="mt-6 bg-blue-600 px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-semibold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const isFavourite = favouriteIds.includes(course.id);

  const getStatusColor = (status: Course['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-green-500';
      case 'Upcoming':
        return 'bg-orange-500';
      case 'Popular':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <SafeAreaView className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`} edges={['top']}>
      <ScrollView className="flex-1">
        {/* Header with Back Button */}
        <View className="relative">
          <Image
            source={{ uri: course.thumbnail }}
            className="w-full h-72"
            resizeMode="cover"
          />
          
          {/* Overlay Gradient */}
          <View className="absolute inset-0 bg-black/30" />
          
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute top-4 left-4 bg-black/50 p-2 rounded-full"
          >
            <Feather name="arrow-left" size={24} color="white" />
          </TouchableOpacity>

          {/* Favourite Button */}
          <TouchableOpacity
            onPress={handleFavouritePress}
            className="absolute top-4 right-4 bg-black/50 p-2 rounded-full"
          >
            <Feather
              name={isFavourite ? 'heart' : 'heart'}
              size={24}
              color={isFavourite ? '#EF4444' : 'white'}
              fill={isFavourite ? '#EF4444' : 'none'}
            />
          </TouchableOpacity>

          {/* Status Badge */}
          <View className={`absolute bottom-4 left-4 ${getStatusColor(course.status)} px-4 py-2 rounded-full`}>
            <Text className="text-white text-sm font-semibold">{course.status}</Text>
          </View>
        </View>

        {/* Course Content */}
        <View className="p-6">
          {/* Category */}
          <Text className={`text-sm font-semibold mb-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
            {course.category}
          </Text>

          {/* Title */}
          <Text className={`text-3xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {course.title}
          </Text>

          {/* Instructor & Rating */}
          <View className="flex-row items-center justify-between mb-6">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-blue-600 items-center justify-center mr-3">
                <Feather name="user" size={20} color="white" />
              </View>
              <View>
                <Text className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {course.instructor}
                </Text>
                <Text className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Instructor
                </Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <Feather name="star" size={20} color="#FCD34D" />
              <Text className={`ml-1 text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {course.rating.toFixed(1)}
              </Text>
              <Text className={`ml-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                (4.5k reviews)
              </Text>
            </View>
          </View>

          {/* Course Stats */}
          <View className={`flex-row justify-between mb-6 p-4 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <View className="items-center flex-1">
              <Feather name="clock" size={20} color={isDarkMode ? '#60A5FA' : '#3B82F6'} />
              <Text className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Duration
              </Text>
              <Text className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {course.duration}
              </Text>
            </View>

            <View className={`w-px ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`} />

            <View className="items-center flex-1">
              <Feather name="bar-chart-2" size={20} color={isDarkMode ? '#60A5FA' : '#3B82F6'} />
              <Text className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Level
              </Text>
              <Text className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {course.level}
              </Text>
            </View>

            <View className={`w-px ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`} />

            <View className="items-center flex-1">
              <Feather name="users" size={20} color={isDarkMode ? '#60A5FA' : '#3B82F6'} />
              <Text className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Students
              </Text>
              <Text className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                12.5k
              </Text>
            </View>
          </View>

          {/* Description */}
          <View className="mb-6">
            <Text className={`text-lg font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              About This Course
            </Text>
            <Text className={`text-base leading-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {course.description}
            </Text>
          </View>

          {/* What You'll Learn */}
          <View className="mb-6">
            <Text className={`text-lg font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              What You'll Learn
            </Text>
            {[
              'Understand core concepts and fundamentals',
              'Build practical projects from scratch',
              'Master advanced techniques and best practices',
              'Gain hands-on experience with real-world scenarios',
            ].map((item, index) => (
              <View key={index} className="flex-row items-start mb-3">
                <View className="w-6 h-6 rounded-full bg-green-500 items-center justify-center mr-3 mt-0.5">
                  <Feather name="check" size={14} color="white" />
                </View>
                <Text className={`flex-1 text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {item}
                </Text>
              </View>
            ))}
          </View>

          {/* Course Content */}
          <View className="mb-6">
            <Text className={`text-lg font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Course Content
            </Text>
            <View className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <View className="flex-row items-center justify-between mb-2">
                <Text className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  8 Sections • 42 Lectures
                </Text>
                <Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {course.duration}
                </Text>
              </View>
              <Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Full lifetime access • Certificate of completion
              </Text>
            </View>
          </View>

          {/* Additional Info */}
          {course.publishYear && (
            <View className="mb-6">
              <Text className={`text-lg font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Additional Information
              </Text>
              <View className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                {course.publishYear && (
                  <View className="flex-row justify-between mb-2">
                    <Text className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Published Year
                    </Text>
                    <Text className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {course.publishYear}
                    </Text>
                  </View>
                )}
                {course.language && (
                  <View className="flex-row justify-between mb-2">
                    <Text className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Language
                    </Text>
                    <Text className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {course.language.join(', ')}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View
        className={`p-4 border-t ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}
      >
        <View className="flex-row items-center justify-between">
          <View>
            <Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Price
            </Text>
            <Text className={`text-3xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
              ${course.price}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleEnroll}
            className="bg-blue-600 px-8 py-4 rounded-xl flex-row items-center"
          >
            <Feather name="book-open" size={20} color="white" />
            <Text className="text-white font-bold text-lg ml-2">Enroll Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
