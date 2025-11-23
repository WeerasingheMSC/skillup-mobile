import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { register, clearError, login } from '../../store/slices/authSlice';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { registerSchema } from '../../utils/validation';
import { useTheme } from '../../hooks/useTheme';
import { RegisterCredentials } from '../../types';

export default function RegisterScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const { isDarkMode } = useTheme();

  const [formData, setFormData] = useState<RegisterCredentials>({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterCredentials, string>>>({});

  React.useEffect(() => {
    if (error) {
      Alert.alert('Registration Error', error);
      dispatch(clearError());
    }
  }, [error]);

  const handleChange = (field: keyof RegisterCredentials, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleRegister = async () => {
    try {
      await registerSchema.validate(formData, { abortEarly: false });
      setErrors({});

      const result = await dispatch(register(formData)).unwrap();
      
      if (result) {
        Alert.alert('Success', 'Registration successful! Please login.', [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]);
      }
    } catch (err: any) {
      if (err.inner) {
        const validationErrors: Partial<Record<keyof RegisterCredentials, string>> = {};
        err.inner?.forEach((error: any) => {
          if (error.path) {
            validationErrors[error.path as keyof RegisterCredentials] = error.message;
          }
        });
        setErrors(validationErrors);
      }
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
            <TouchableOpacity
              onPress={() => router.back()}
              className={`w-10 h-10 rounded-full items-center justify-center mb-4 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}
            >
              <Feather name="arrow-left" size={20} color={isDarkMode ? '#9CA3AF' : '#4B5563'} />
            </TouchableOpacity>
            <View className="w-16 h-16 rounded-2xl bg-blue-600 items-center justify-center mb-6">
              <Feather name="user-plus" size={32} color="white" />
            </View>
            <Text className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Create Account
            </Text>
            <Text className={`text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Join us and start your learning journey
            </Text>
          </View>

          {/* Registration Form */}
          <View className="mb-6">
            <View className="mb-2">
              <Text className={`text-sm font-semibold mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Personal Information
              </Text>
            </View>

            <View className="flex-row gap-3 mb-4">
              <View className="flex-1">
                <Input
                  label="First Name"
                  placeholder="John"
                  value={formData.firstName}
                  onChangeText={(text) => handleChange('firstName', text)}
                  error={errors.firstName}
                />
              </View>
              <View className="flex-1">
                <Input
                  label="Last Name"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChangeText={(text) => handleChange('lastName', text)}
                  error={errors.lastName}
                />
              </View>
            </View>

            <View className="mb-2 mt-4">
              <Text className={`text-sm font-semibold mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Account Details
              </Text>
            </View>

            <Input
              label="Username"
              placeholder="Choose a unique username"
              value={formData.username}
              onChangeText={(text) => handleChange('username', text)}
              error={errors.username}
              autoCapitalize="none"
            />

            <Input
              label="Email Address"
              placeholder="your.email@example.com"
              value={formData.email}
              onChangeText={(text) => handleChange('email', text)}
              error={errors.email}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <Input
              label="Password"
              placeholder="Create a strong password"
              value={formData.password}
              onChangeText={(text) => handleChange('password', text)}
              error={errors.password}
              secureTextEntry
            />

            {/* Password Requirements */}
            <View className={`mt-2 p-3 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <Text className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Password must be at least 6 characters long
              </Text>
            </View>
          </View>

          {/* Sign Up Button */}
          <Button
            title="Create Account"
            onPress={handleRegister}
            isLoading={isLoading}
            disabled={isLoading}
          />

          {/* Divider */}
          <View className="flex-row items-center my-6">
            <View className={`flex-1 h-px ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`} />
            <Text className={`mx-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>or</Text>
            <View className={`flex-1 h-px ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`} />
          </View>

          {/* Sign In Link */}
          <TouchableOpacity
            onPress={() => router.back()}
            className={`p-4 rounded-xl border-2 ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}
          >
            <Text className={`text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Already have an account?{' '}
              <Text className="text-blue-600 font-semibold">Sign In</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
