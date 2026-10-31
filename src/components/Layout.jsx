import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';

/**
 * Общая оболочка приложения: шапка с навигацией, содержимое и подвал.
 */
export default function Layout({ children }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute('data-theme') || 'light',
  );

  const handleLogout = () => {
    setMenuOpen(false);
    dispatch(logout());
  };

  const closeMenu = () => setMenuOpen(false);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('theme', next);
    } catch (error) {
      // Игнорируем недоступность localStorage.
    }
  };

  return (
    <div className="layout">
      <header className="layout__header">
        <div className="container layout__header-inner">
          <Link to="/" className="layout__logo" onClick={closeMenu}>
            <span className="layout__logo-mark" aria-hidden="true">
              {'</>'}
            </span>
            <span>Код в игре</span>
          </Link>

          <button
            type="button"
            className="layout__burger"
            aria-expanded={menuOpen}
            aria-controls="main-navigation"
            aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
            onClick={() => setMenuOpen((value) => !value)}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>

          <nav
            id="main-navigation"
            className={`layout__nav ${menuOpen ? 'layout__nav--open' : ''}`.trim()}
            aria-label="Основная навигация"
          >
            <NavLink to="/" end className="layout__link" onClick={closeMenu}>
              Игры
            </NavLink>
            <NavLink to="/course" className="layout__link" onClick={closeMenu}>
              Курс
            </NavLink>
            <NavLink to="/progress" className="layout__link" onClick={closeMenu}>
              Прогресс
            </NavLink>

            <button
              type="button"
              className={`theme-toggle ${theme === 'dark' ? 'theme-toggle--dark' : ''}`}
              onClick={toggleTheme}
              role="switch"
              aria-checked={theme === 'dark'}
              aria-label={theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'}
            >
              <span className="theme-toggle__track" aria-hidden="true">
                <svg className="theme-toggle__icon theme-toggle__icon--sun" viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                </svg>
                <svg className="theme-toggle__icon theme-toggle__icon--moon" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
                <span className="theme-toggle__thumb" />
              </span>
            </button>

            {user ? (
              <>
                <span className="layout__user" title={user.email}>
                  {user.email}
                </span>
                <button type="button" className="button button--ghost" onClick={handleLogout}>
                  Выйти
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="layout__link" onClick={closeMenu}>
                  Вход
                </NavLink>
                <NavLink to="/register" className="button button--primary" onClick={closeMenu}>
                  Регистрация
                </NavLink>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="layout__main">
        <div className="container">{children}</div>
      </main>

      <footer className="layout__footer">
        <div className="container layout__footer-inner">
          <p>
            «Код в игре» — учебный проект: изучение JavaScript через интерактивные мини-игры.
          </p>
          <p className="layout__footer-note">
            Данные аккаунта и прогресса хранятся только в вашем браузере.
          </p>
        </div>
      </footer>
    </div>
  );
}
