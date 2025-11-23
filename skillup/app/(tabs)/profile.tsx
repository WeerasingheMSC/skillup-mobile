import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { logout } from '../../store/slices/authSlice';
import { useTheme } from '../../hooks/useTheme';
import { Feather } from '@expo/vector-icons';

export default function ProfileScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { favouriteIds } = useAppSelector((state) => state.favourites);
  const { courses } = useAppSelector((state) => state.courses);
  const { isDarkMode, toggleTheme } = useTheme();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            dispatch(logout());
            // @ts-ignore - Expo Router typing limitation
            router.replace('/auth/login');
          },
        },
      ]
    );
  };

  const ProfileStat = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
    <View
      className={`flex-1 p-4 rounded-lg ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      } shadow-sm mx-1`}
    >
      <View className="items-center">
        <Feather name={icon as any} size={24} color={isDarkMode ? '#60A5FA' : '#3B82F6'} />
        <Text className={`text-2xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {value}
        </Text>
        <Text className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {label}
        </Text>
      </View>
    </View>
  );

  const MenuItem = ({
    icon,
    label,
    onPress,
    showArrow = true,
    rightComponent,
  }: {
    icon: string;
    label: string;
    onPress?: () => void;
    showArrow?: boolean;
    rightComponent?: React.ReactNode;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      className={`flex-row items-center justify-between p-4 mb-2 rounded-lg ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}
    >
      <View className="flex-row items-center">
        <View className={`w-10 h-10 rounded-full items-center justify-center ${
          isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
        }`}>
          <Feather name={icon as any} size={20} color={isDarkMode ? '#60A5FA' : '#3B82F6'} />
        </View>
        <Text className={`ml-3 text-base font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {label}
        </Text>
      </View>
      {rightComponent ? (
        rightComponent
      ) : showArrow ? (
        <Feather name="chevron-right" size={20} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
      ) : null}
    </TouchableOpacity>
  );

  return (
    <ScrollView className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <View className="p-6">
        {/* Profile Header */}
        <View className="items-center mb-6">
          <View className="w-24 h-24 rounded-full bg-blue-600 items-center justify-center mb-4">
            <Text className="text-white text-3xl font-bold">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </Text>
          </View>
          <Text className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text className={`text-base mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            @{user?.username}
          </Text>
          <Text className={`text-sm mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            {user?.email}
          </Text>
        </View>

        {/* Stats */}
        <View className="flex-row mb-6">
          <ProfileStat icon="book" label="Courses" value={courses.length.toString()} />
          <ProfileStat icon="heart" label="Favourites" value={favouriteIds.length.toString()} />
        </View>

        {/* Settings Section */}
        <Text className={`text-lg font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Settings
        </Text>

        <MenuItem
          icon="moon"
          label="Dark Mode"
          showArrow={false}
          rightComponent={
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
              thumbColor={isDarkMode ? '#FFFFFF' : '#F3F4F6'}
            />
          }
        />

        <MenuItem
          icon="bell"
          label="Notifications"
          onPress={() => Alert.alert('Coming Soon', 'Notification settings will be available soon')}
        />

        <MenuItem
          icon="lock"
          label="Privacy & Security"
          onPress={() => Alert.alert('Coming Soon', 'Privacy settings will be available soon')}
        />

        {/* Account Section */}
        <Text className={`text-lg font-bold mb-3 mt-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Account
        </Text>

        <MenuItem
          icon="user"
          label="Edit Profile"
          onPress={() => Alert.alert('Coming Soon', 'Profile editing will be available soon')}
        />

        <MenuItem
          icon="help-circle"
          label="Help & Support"
          onPress={() => Alert.alert('Help', 'Contact support at support@skillup.com')}
        />

        <MenuItem
          icon="info"
          label="About"
          onPress={() => Alert.alert('SkillUp', 'Version 1.0.0\n\nA modern learning platform')}
        />

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          className="mt-6 bg-red-600 p-4 rounded-lg flex-row items-center justify-center"
        >
          <Feather name="log-out" size={20} color="white" />
          <Text className="text-white font-semibold text-base ml-2">Logout</Text>
        </TouchableOpacity>

        <View className="h-8" />
      </View>
    </ScrollView>
  );
}
