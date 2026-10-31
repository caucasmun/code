import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import GamePage from './pages/GamePage';
import ProgressPage from './pages/ProgressPage';
import CoursePage from './pages/CoursePage';
import CourseLessonPage from './pages/CourseLessonPage';
import NotFoundPage from './pages/NotFoundPage';
import { restoreSession } from './features/auth/authSlice';
import { loadUserProgress } from './features/progress/progressSlice';
import { loadCourseUserProgress } from './features/course/courseSlice';

/**
 * Корневой компонент приложения.
 *
 * Здесь решаются две задачи:
 *  1. Восстановление сессии из localStorage при запуске.
 *  2. Описание маршрутов приложения.
 *
 * Сами игры доступны и гостю — учиться можно без аккаунта.
 * Прогресс и задания привязаны к аккаунту, поэтому сохраняются
 * только для авторизованного пользователя.
 */
function App() {
  const dispatch = useDispatch();
  const { user, initialized } = useSelector((state) => state.auth);

  // Восстанавливаем сессию один раз при старте приложения.
  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  // Прогресс загружается только для авторизованного пользователя.
  useEffect(() => {
    if (user) {
      dispatch(loadUserProgress(user.id));
      dispatch(loadCourseUserProgress(user.id));
    }
  }, [dispatch, user]);

  // Пока сессия не восстановлена — показываем загрузку, чтобы не «мигал» вход.
  if (!initialized) {
    return (
      <div className="app-loading" role="status" aria-live="polite">
        <span className="app-loading__spinner" aria-hidden="true" />
        <p>Загружаем приложение…</p>
      </div>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/course" element={<CoursePage />} />
        <Route path="/course/:slug" element={<CourseLessonPage />} />
        <Route path="/game/:slug" element={<GamePage />} />
        <Route
          path="/progress"
          element={
            <ProtectedRoute>
              <ProgressPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
