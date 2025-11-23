import apiClient from './api';
import { API_ENDPOINTS, COURSE_STATUS } from '../constants';
import { Course } from '../types';

export const courseService = {
  getCourses: async (): Promise<Course[]> => {
    const response = await apiClient.get(API_ENDPOINTS.PRODUCTS);
    
    // Transform products to courses
    return response.data.products.map((product: any, index: number) => ({
      id: product.id,
      title: product.title,
      description: product.description,
      category: product.category,
      thumbnail: product.thumbnail,
      price: product.price,
      rating: product.rating,
      instructor: product.brand || 'Expert Instructor',
      duration: `${Math.floor(Math.random() * 20) + 5} hours`,
      level: ['Beginner', 'Intermediate', 'Advanced'][Math.floor(Math.random() * 3)],
      status: [COURSE_STATUS.ACTIVE, COURSE_STATUS.UPCOMING, COURSE_STATUS.POPULAR][
        index % 3
      ] as Course['status'],
    }));
  },

  getCourseById: async (id: number): Promise<Course> => {
    const response = await apiClient.get(`${API_ENDPOINTS.PRODUCTS}/${id}`);
    const product = response.data;
    
    return {
      id: product.id,
      title: product.title,
      description: product.description,
      category: product.category,
      thumbnail: product.thumbnail,
      price: product.price,
      rating: product.rating,
      instructor: product.brand || 'Expert Instructor',
      duration: `${Math.floor(Math.random() * 20) + 5} hours`,
      level: ['Beginner', 'Intermediate', 'Advanced'][Math.floor(Math.random() * 3)],
      status: COURSE_STATUS.ACTIVE,
    };
  },
};
