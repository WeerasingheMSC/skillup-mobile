import React from 'react';
import { TextInput, TextInputProps, Text, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, ...props }) => {
  const { isDarkMode } = useTheme();

  return (
    <View className="mb-4">
      {label && (
        <Text className={`mb-2 font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          {label}
        </Text>
      )}
      <TextInput
        className={`px-4 py-3 rounded-lg border ${
          error
            ? 'border-red-500'
            : isDarkMode
            ? 'border-gray-600 bg-gray-800 text-white'
            : 'border-gray-300 bg-white text-gray-900'
        }`}
        placeholderTextColor={isDarkMode ? '#9CA3AF' : '#6B7280'}
        {...props}
      />
      {error && <Text className="mt-1 text-red-500 text-sm">{error}</Text>}
    </View>
  );
};
