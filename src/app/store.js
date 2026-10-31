import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import gamesReducer from '../features/games/gamesSlice';
import progressReducer from '../features/progress/progressSlice';
import courseReducer from '../features/course/courseSlice';

/**
 * Единое хранилище Redux Toolkit.
 * Слаги разделены по смыслу: авторизация, каталог игр, прогресс, курс.
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    games: gamesReducer,
    progress: progressReducer,
    course: courseReducer,
  },
});

export default store;
