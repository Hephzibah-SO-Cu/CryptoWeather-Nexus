import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {
    // We'll add reducers later
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(), // Use default middleware, which includes thunk
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;