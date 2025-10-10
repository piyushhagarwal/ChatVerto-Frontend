import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import flowReducer from './slices/flowsSlice';
import contactReducer from './slices/contactSlice';
import groupReducer from './slices/groupSlice';
import userReducer from './slices/userSlice';
import templateReducer from './slices/templateSlice';
import campiagnReducer from './slices/campiagnSlice';
import mediaReducer from './slices/mediaSlice';
import analyticsReducer from './slices/analyticsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    flow: flowReducer,
    contact: contactReducer,
    group: groupReducer,
    user: userReducer,
    template: templateReducer,
    campaign: campiagnReducer,
    media: mediaReducer,
    analytics: analyticsReducer,
  },
});

// ✅ Infer types for RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
