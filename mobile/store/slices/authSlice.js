import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../services/api';
import { saveToken, deleteToken } from '../../utils/secureStorage';

const initialState = {
  user: null,
};

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials) => {
    const data = await authAPI.login(credentials);
    await saveToken(data.token);
    return data.user; // Only return user data
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData) => {
    const data = await authAPI.register(userData);
    await saveToken(data.token);
    return data.user; // Only return user data
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, { payload }) => {
      state.user = payload;
    },
    logout: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, { payload }) => {
        state.user = payload;
      })
      .addCase(register.fulfilled, (state, { payload }) => {
        state.user = payload;
      });
  },
});

export const { setUser, logout } = authSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;

export default authSlice.reducer; 