import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import flowReducer from './slices/flowsSlice';
import contactReducer from './slices/contactSlice';
import groupReducer from './slices/groupSlice';
import profileReducer from "./slices/profileSlice"


export const store = configureStore({
  reducer: {
    auth: authReducer,
    flow: flowReducer,
    contact: contactReducer,
    group: groupReducer,
    profile: profileReducer,
    
  },
});

// ✅ Infer types for RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
