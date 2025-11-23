import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
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
    <SafeAreaView className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View className="pt-8 pb-6">
            <View className="w-16 h-16 rounded-2xl bg-blue-600 items-center justify-center mb-6">
              <Feather name="book-open" size={32} color="white" />
            </View>
            <Text className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Welcome Back!
            </Text>
            <Text className={`text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Sign in to continue your learning journey
            </Text>
          </View>

          {/* Demo Credentials Card */}
          <View className="mb-8 p-4 rounded-xl border" style={{
            backgroundColor: isDarkMode ? '#1E3A8A20' : '#DBEAFE',
            borderColor: isDarkMode ? '#1E40AF' : '#93C5FD'
          }}>
            <View className="flex-row items-center mb-2">
              <Feather name="info" size={16} color={isDarkMode ? '#60A5FA' : '#2563EB'} />
              <Text className={`ml-2 font-semibold ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>
                Demo Account
              </Text>
            </View>
            <Text className={`text-sm ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
              Username: <Text className="font-mono font-semibold">emilys</Text>
            </Text>
            <Text className={`text-sm ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
              Password: <Text className="font-mono font-semibold">emilyspass</Text>
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

          {/* Divider */}
          <View className="flex-row items-center my-6">
            <View className={`flex-1 h-px ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`} />
            <Text className={`mx-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>or</Text>
            <View className={`flex-1 h-px ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`} />
          </View>

          {/* Register Link */}
          <TouchableOpacity
            onPress={() => {
              // @ts-ignore - Expo Router typing limitation
              router.push('/auth/register');
            }}
            className={`p-4 rounded-xl border-2 ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}
          >
            <Text className={`text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Don't have an account?{' '}
              <Text className="text-blue-600 font-semibold">Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
