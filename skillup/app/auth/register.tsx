import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView
        className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}
        contentContainerClassName="flex-grow"
      >
        <View className="flex-1 justify-center px-6 py-12">
          <View className="mb-8">
            <Text
              className={`text-4xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
            >
              Create Account
            </Text>
            <Text className={`text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Sign up to start learning
            </Text>
          </View>

          <View className="mb-6">
            <Input
              label="Username"
              placeholder="Choose a username"
              value={formData.username}
              onChangeText={(text) => handleChange('username', text)}
              error={errors.username}
              autoCapitalize="none"
            />

            <Input
              label="Email"
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={(text) => handleChange('email', text)}
              error={errors.email}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <Input
              label="First Name"
              placeholder="Enter your first name"
              value={formData.firstName}
              onChangeText={(text) => handleChange('firstName', text)}
              error={errors.firstName}
            />

            <Input
              label="Last Name"
              placeholder="Enter your last name"
              value={formData.lastName}
              onChangeText={(text) => handleChange('lastName', text)}
              error={errors.lastName}
            />

            <Input
              label="Password"
              placeholder="Create a password"
              value={formData.password}
              onChangeText={(text) => handleChange('password', text)}
              error={errors.password}
              secureTextEntry
            />
          </View>

          <Button
            title="Sign Up"
            onPress={handleRegister}
            isLoading={isLoading}
            disabled={isLoading}
          />

          <View className="flex-row justify-center mt-6">
            <Text className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              Already have an account?{' '}
            </Text>
            <Text
              className="text-blue-600 font-semibold"
              onPress={() => router.back()}
            >
              Sign In
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
