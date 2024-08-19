import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from '../slices/authSlices';

// Persist configuration for auth slice
const authPersistConfig = {
  key: 'auth',
  storage,  // bind with redux persist localstorage 
};

// Apply persist reducers
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer); // persist auth will prevent the data clear while reload

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types that contain non-serializable values
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);

// Define RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
