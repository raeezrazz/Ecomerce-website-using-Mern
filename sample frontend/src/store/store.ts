import userSlice from "./Slice/userSlice";
import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// Configuration for persisting the user slice
const userPersistConfig = {
  key: "user",
  storage,
};

// Apply persistence to the user reducer
const persistedUserReducer = persistReducer(userPersistConfig, userSlice);

// Combine reducers
const rootReducer = combineReducers({
  user: persistedUserReducer,
  // Add more slices here later if needed
});

// Create Redux store with persisted reducer
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Suppresses non-serializable warning from redux-persist
    }),
});

// Persistor for redux-persist to hook into React
export const persistor = persistStore(store);

// Types for use in components
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
