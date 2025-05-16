import api from './apiConfig';
import { deleteToken } from '../utils/secureStorage';

// Auth API calls
export const authAPI = {
  // Register new user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      console.log("response in register>>>", response)

      return response.data;
    } catch (error) {
      console.log("error in register>>>", error)
      throw {
        message: error.response?.data?.message || error.message,
        status: error.response?.status, 
      };
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      console.log("response in login>>>", response)
      return response.data;
    } catch (error) {
      console.log("error in login>>>", error)
      throw {
        message: error.response?.data?.message || error.message,
        status: error.response?.status, 
      };
    }
  },
};

// Books API calls
export const booksAPI = {
  // Get all books with pagination
  getBooks: async (page = 1, limit = 5) => {
    try {
      const response = await api.get(`/books?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw {
        message: error.response?.data?.message || error.message,
        status: error.response?.status, 
      };
    }
  },

  // Get user's books
  getUserBooks: async () => {
    try {
      const response = await api.get('/books/user');
      return response.data;
    } catch (error) {
      throw {
        message: error.response?.data?.message || error.message,
        status: error.response?.status, 
      };
    }
  },

  // Create new book
  createBook: async (bookData) => {
    try {
      const response = await api.post('/books', bookData);
      console.log("response in create book>>>", response)
      return response.data;
    } catch (error) {
      console.log("error in create book>>>", error)
      throw {
        message: error.response?.data?.message || error.message,
        status: error.response?.status, 
      };
    }
  },

  // Delete book
  deleteBook: async (bookId) => {
    try {
      const response = await api.delete(`/books/${bookId}`);
      return response.data;
    } catch (error) {
      console.log("error in delete book>>>", error)
      console.log("error.response?.data in delete book>>>", error.response?.data)
      throw {
        message: error.response?.data?.message || error.message,
        status: error.response?.status, 
      };
    }
  },
};

export default api; 