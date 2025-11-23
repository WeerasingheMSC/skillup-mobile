import apiClient from './api';
import { API_ENDPOINTS } from '../constants';
import { LoginCredentials, RegisterCredentials, User } from '../types';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    const response = await apiClient.post(API_ENDPOINTS.LOGIN, credentials);
    return {
      id: response.data.id,
      username: response.data.username,
      email: response.data.email,
      firstName: response.data.firstName,
      lastName: response.data.lastName,
      token: response.data.token,
    };
  },

  register: async (credentials: RegisterCredentials): Promise<User> => {
    const response = await apiClient.post(API_ENDPOINTS.REGISTER, credentials);
    return {
      id: response.data.id,
      username: response.data.username,
      email: response.data.email,
      firstName: response.data.firstName,
      lastName: response.data.lastName,
    };
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get(API_ENDPOINTS.USER_ME);
    return response.data;
  },
};
