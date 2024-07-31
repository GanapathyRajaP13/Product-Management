import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from '../slices/authSlices';
import productsReducer from '../slices/productSlices';

const authPersistConfig = {
  key: 'auth',
  storage,  // bind with redux persist localstorage 
};

const productsPersistConfig = {
  key: 'products',
  storage, // bind with redux persist localstorage 
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer); // persist auth will prevent the data clear while reload
const persistedProductsReducer = persistReducer(productsPersistConfig, productsReducer); // persist product will prevent the data clear while reload

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    products: persistedProductsReducer,
  },
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
