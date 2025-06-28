import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import flowReducer from './slices/flowsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    flow: flowReducer,
  },
});

// ✅ Infer types for RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
