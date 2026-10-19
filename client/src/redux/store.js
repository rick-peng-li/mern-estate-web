import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import userReducer from '@/redux/user/userSlice';

const localStorage = {
  setItem: async (key, value) => window.localStorage.setItem(key, value),
  getItem: async (key) => window.localStorage.getItem(key),
  removeItem: async (key) => window.localStorage.removeItem(key),
};

const rootReducer = combineReducers({ user: userReducer });

const persistConfig = {
  key: 'root',
  storage: localStorage,
  version: 1,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
