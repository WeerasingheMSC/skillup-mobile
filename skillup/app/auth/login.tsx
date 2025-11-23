import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { login, clearError } from '../../store/slices/authSlice';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { loginSchema } from '../../utils/validation';
import { useTheme } from '../../hooks/useTheme';
import { LoginCredentials } from '../../types';

export default function LoginScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);
  const { isDarkMode } = useTheme();

  const [formData, setFormData] = useState<LoginCredentials>({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof LoginCredentials, string>>>({});

  React.useEffect(() => {
    if (isAuthenticated) {
      // @ts-ignore - Expo Router typing limitation
      router.replace('/(tabs)');
    }
  }, [isAuthenticated]);

  React.useEffect(() => {
    if (error) {
      Alert.alert('Login Error', error);
      dispatch(clearError());
    }
  }, [error]);

  const handleChange = (field: keyof LoginCredentials, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleLogin = async () => {
    try {
      // Validate form
      await loginSchema.validate(formData, { abortEarly: false });
      setErrors({});

      // Dispatch login action
      dispatch(login(formData));
    } catch (err: any) {
      // Handle validation errors
      const validationErrors: Partial<Record<keyof LoginCredentials, string>> = {};
      err.inner?.forEach((error: any) => {
        if (error.path) {
          validationErrors[error.path as keyof LoginCredentials] = error.message;
        }
      });
      setErrors(validationErrors);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView
        className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}
        contentContainerClassName="flex-grow"
      >
        <View className="flex-1 justify-center px-6 py-12">
          {/* Header */}
          <View className="mb-8">
            <Text
              className={`text-4xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
            >
              Welcome Back
            </Text>
            <Text className={`text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Sign in to continue learning
            </Text>
          </View>

          {/* Demo Credentials Info */}
          <View className="mb-6 p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Text className="text-blue-800 dark:text-blue-200 text-sm font-semibold mb-1">
              Demo Credentials:
            </Text>
            <Text className="text-blue-700 dark:text-blue-300 text-xs">
              Username: emilys
            </Text>
            <Text className="text-blue-700 dark:text-blue-300 text-xs">
              Password: emilyspass
            </Text>
          </View>

          {/* Login Form */}
          <View className="mb-6">
            <Input
              label="Username"
              placeholder="Enter your username"
              value={formData.username}
              onChangeText={(text) => handleChange('username', text)}
              error={errors.username}
              autoCapitalize="none"
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              value={formData.password}
              onChangeText={(text) => handleChange('password', text)}
              error={errors.password}
              secureTextEntry
            />
          </View>

          {/* Login Button */}
          <Button
            title="Sign In"
            onPress={handleLogin}
            isLoading={isLoading}
            disabled={isLoading}
          />

          {/* Register Link */}
          <View className="flex-row justify-center mt-6">
            <Text className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              Don't have an account?{' '}
            </Text>
            <Text
              className="text-blue-600 font-semibold"
              onPress={() => {
                // @ts-ignore - Expo Router typing limitation
                router.push('/auth/register');
              }}
            >
              Sign Up
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
