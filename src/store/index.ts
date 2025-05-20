import { configureStore } from '@reduxjs/toolkit';
import AuthReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: AuthReducer,
  },
});
