import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * Компонент для маршрутов, доступных только авторизованным пользователям.
 *
 * Гость перенаправляется на страницу входа, а исходный адрес
 * сохраняется в параметре `from`, чтобы после входа вернуться
 * на нужную страницу.
 */
export default function ProtectedRoute({ children }) {
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();

  if (!user) {
    const from = `${location.pathname}${location.search}`;
    return <Navigate to={`/login?from=${encodeURIComponent(from)}`} replace />;
  }

  return children;
}
