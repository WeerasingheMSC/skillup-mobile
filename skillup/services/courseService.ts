import axios from 'axios';
import { OPENLIBRARY_BASE_URL, API_ENDPOINTS, COURSE_STATUS, EDUCATION_SUBJECTS } from '../constants';
import { Course } from '../types';

const openLibraryClient = axios.create({
  baseURL: OPENLIBRARY_BASE_URL,
  timeout: 15000,
});

// Helper function to get cover image URL
const getCoverUrl = (coverId: number | null, size: 'S' | 'M' | 'L' = 'L'): string => {
  if (!coverId) return 'https://placehold.co/400x600/1F2937/60A5FA?text=No+Cover';
  return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
};

// Helper function to generate random course metadata
const generateCourseMetadata = (index: number) => {
  const levels = ['Beginner', 'Intermediate', 'Advanced'];
  const statuses = [COURSE_STATUS.ACTIVE, COURSE_STATUS.UPCOMING, COURSE_STATUS.POPULAR];
  const prices = [0, 9.99, 19.99, 29.99, 49.99, 99.99];
  
  return {
    level: levels[index % 3],
    status: statuses[index % 3] as Course['status'],
    price: prices[index % 6],
    rating: 4 + Math.random(),
    duration: `${Math.floor(Math.random() * 20) + 5} hours`,
  };
};

export const courseService = {
  getCourses: async (): Promise<Course[]> => {
    try {
      // Fetch books from multiple educational subjects
      const subjectsToFetch = EDUCATION_SUBJECTS.slice(0, 4); // Fetch from 4 subjects
      const allBooks: Course[] = [];

      for (let i = 0; i < subjectsToFetch.length; i++) {
        const subject = subjectsToFetch[i];
        const response = await openLibraryClient.get(
          `${API_ENDPOINTS.SUBJECTS}/${subject}.json?limit=8`
        );

        const books = response.data.works || [];
        
        books.forEach((book: any, bookIndex: number) => {
          const metadata = generateCourseMetadata(allBooks.length);
          // Create unique ID by combining subject and book index to avoid duplicates
          const uniqueId = `${subject}-${bookIndex}-${book.key?.replace(/\//g, '-') || allBooks.length}`;
          
          allBooks.push({
            id: uniqueId,
            title: book.title || 'Untitled',
            description: book.first_sentence || book.description || 
              `Explore ${subject.replace('_', ' ')} through this comprehensive educational resource.`,
            category: subject.replace('_', ' ').toUpperCase(),
            thumbnail: getCoverUrl(book.cover_id),
            price: metadata.price,
            rating: metadata.rating,
            instructor: book.authors?.[0]?.name || 'Expert Instructor',
            duration: metadata.duration,
            level: metadata.level,
            status: metadata.status,
            publishYear: book.first_publish_year,
            language: ['English'],
          });
        });
      }

      // Shuffle and return
      return allBooks.sort(() => Math.random() - 0.5);
    } catch (error: any) {
      console.error('Error fetching courses from Open Library:', error);
      // Fallback to sample data if API fails
      return getSampleCourses();
    }
  },

  getCourseById: async (id: string | number): Promise<Course> => {
    try {
      // If it's a work key (starts with /works/)
      let workKey = typeof id === 'string' ? id : '';
      if (!workKey.startsWith('/works/')) {
        workKey = `/works/${id}`;
      }

      const response = await openLibraryClient.get(`${workKey}.json`);
      const work = response.data;
      const metadata = generateCourseMetadata(0);

      return {
        id: work.key || id,
        title: work.title || 'Untitled',
        description: work.description?.value || work.description || 
          'A comprehensive educational resource for learners.',
        category: work.subjects?.[0] || 'General',
        thumbnail: work.covers?.[0] 
          ? getCoverUrl(work.covers[0]) 
          : 'https://placehold.co/400x600/1F2937/60A5FA?text=No+Cover',
        price: metadata.price,
        rating: metadata.rating,
        instructor: work.authors?.[0]?.author?.key || 'Expert Instructor',
        duration: metadata.duration,
        level: metadata.level,
        status: metadata.status,
        publishYear: work.first_publish_date,
        language: ['English'],
      };
    } catch (error: any) {
      console.error('Error fetching course by ID:', error);
      throw error;
    }
  },
};

// Fallback sample courses if API fails
const getSampleCourses = (): Course[] => {
  return [
    {
      id: 'sample-1',
      title: 'Introduction to Programming',
      description: 'Learn the fundamentals of programming with practical examples.',
      category: 'PROGRAMMING',
      thumbnail: 'https://placehold.co/400x600/3B82F6/FFFFFF?text=Programming',
      price: 29.99,
      rating: 4.5,
      instructor: 'John Doe',
      duration: '10 hours',
      level: 'Beginner',
      status: 'Active',
    },
    {
      id: 'sample-2',
      title: 'Advanced Mathematics',
      description: 'Master advanced mathematical concepts and applications.',
      category: 'MATHEMATICS',
      thumbnail: 'https://placehold.co/400x600/10B981/FFFFFF?text=Mathematics',
      price: 49.99,
      rating: 4.8,
      instructor: 'Jane Smith',
      duration: '15 hours',
      level: 'Advanced',
      status: 'Popular',
    },
  ];
};
