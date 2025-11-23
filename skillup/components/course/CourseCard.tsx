import React from 'react';
import { TouchableOpacity, View, Text, Image } from 'react-native';
import { Course } from '../../types';
import { useTheme } from '../../hooks/useTheme';
import { Feather } from '@expo/vector-icons';

interface CourseCardProps {
  course: Course;
  onPress: () => void;
  isFavourite?: boolean;
  onFavouritePress?: () => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onPress,
  isFavourite = false,
  onFavouritePress,
}) => {
  const { isDarkMode } = useTheme();

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
    <TouchableOpacity
      onPress={onPress}
      className={`mb-4 rounded-xl overflow-hidden ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      } shadow-lg`}
    >
      {/* Course Image */}
      <View className="relative">
        <Image
          source={{ uri: course.thumbnail }}
          className="w-full h-48"
          resizeMode="cover"
        />
        
        {/* Status Badge */}
        <View className={`absolute top-3 left-3 ${getStatusColor(course.status)} px-3 py-1 rounded-full`}>
          <Text className="text-white text-xs font-semibold">{course.status}</Text>
        </View>

        {/* Favourite Button */}
        {onFavouritePress && (
          <TouchableOpacity
            onPress={onFavouritePress}
            className="absolute top-3 right-3 bg-white/90 p-2 rounded-full"
          >
            <Feather
              name={isFavourite ? 'heart' : 'heart'}
              size={20}
              color={isFavourite ? '#EF4444' : '#6B7280'}
              fill={isFavourite ? '#EF4444' : 'none'}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Course Info */}
      <View className="p-4">
        {/* Category */}
        <Text className={`text-xs font-medium mb-1 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
          {course.category.toUpperCase()}
        </Text>

        {/* Title */}
        <Text
          className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
          numberOfLines={2}
        >
          {course.title}
        </Text>

        {/* Description */}
        <Text
          className={`text-sm mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
          numberOfLines={2}
        >
          {course.description}
        </Text>

        {/* Course Meta Info */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Feather name="user" size={14} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
            <Text className={`ml-1 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {course.instructor}
            </Text>
          </View>

          <View className="flex-row items-center">
            <Feather name="clock" size={14} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
            <Text className={`ml-1 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {course.duration}
            </Text>
          </View>

          <View className="flex-row items-center">
            <Feather name="star" size={14} color="#FCD34D" />
            <Text className={`ml-1 text-xs font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {course.rating.toFixed(1)}
            </Text>
          </View>
        </View>

        {/* Price and Level */}
        <View className="flex-row items-center justify-between mt-3">
          <Text className={`text-lg font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
            ${course.price}
          </Text>
          <View className={`px-3 py-1 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <Text className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {course.level}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
