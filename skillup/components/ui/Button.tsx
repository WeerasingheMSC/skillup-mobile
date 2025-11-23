import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  isLoading = false,
  disabled,
  ...props
}) => {
  const getButtonStyles = () => {
    const base = 'py-3 px-6 rounded-lg items-center justify-center';
    
    if (disabled || isLoading) {
      return `${base} bg-gray-400`;
    }

    switch (variant) {
      case 'primary':
        return `${base} bg-blue-600`;
      case 'secondary':
        return `${base} bg-gray-600`;
      case 'outline':
        return `${base} border-2 border-blue-600 bg-transparent`;
      default:
        return `${base} bg-blue-600`;
    }
  };

  const getTextStyles = () => {
    if (variant === 'outline') {
      return 'text-blue-600 font-semibold text-base';
    }
    return 'text-white font-semibold text-base';
  };

  return (
    <TouchableOpacity
      className={getButtonStyles()}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text className={getTextStyles()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};
