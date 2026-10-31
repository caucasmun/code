import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';

/**
 * РћР±С‰Р°СЏ РѕР±РѕР»РѕС‡РєР° РїСЂРёР»РѕР¶РµРЅРёСЏ: С€Р°РїРєР° СЃ РЅР°РІРёРіР°С†РёРµР№, СЃРѕРґРµСЂР¶РёРјРѕРµ Рё РїРѕРґРІР°Р».
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
      // РРіРЅРѕСЂРёСЂСѓРµРј РЅРµРґРѕСЃС‚СѓРїРЅРѕСЃС‚СЊ localStorage.
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
            <span>РљРѕРґ РІ РёРіСЂРµ</span>
          </Link>

          <button
            type="button"
            className="layout__burger"
            aria-expanded={menuOpen}
            aria-controls="main-navigation"
            aria-label={menuOpen ? 'Р—Р°РєСЂС‹С‚СЊ РјРµРЅСЋ' : 'РћС‚РєСЂС‹С‚СЊ РјРµРЅСЋ'}
            onClick={() => setMenuOpen((value) => !value)}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>

          <nav
            id="main-navigation"
            className={`layout__nav ${menuOpen ? 'layout__nav--open' : ''}`.trim()}
            aria-label="РћСЃРЅРѕРІРЅР°СЏ РЅР°РІРёРіР°С†РёСЏ"
          >
            <NavLink to="/" end className="layout__link" onClick={closeMenu}>
              РРіСЂС‹
            </NavLink>
            <NavLink to="/course" className="layout__link" onClick={closeMenu}>
              РљСѓСЂСЃ
            </NavLink>
            <NavLink to="/progress" className="layout__link" onClick={closeMenu}>
              РџСЂРѕРіСЂРµСЃСЃ
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
                <span className="theme-toggle__icon theme-toggle__icon--moon">🌙</span>
                <span className="theme-toggle__icon theme-toggle__icon--sun">☀️</span>
                <span className="theme-toggle__thumb" />
              </span>
            </button>

            {user ? (
              <>
                <span className="layout__user" title={user.email}>
                  {user.email}
                </span>
                <button type="button" className="button button--ghost" onClick={handleLogout}>
                  Р’С‹Р№С‚Рё
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="layout__link" onClick={closeMenu}>
                  Р’С…РѕРґ
                </NavLink>
                <NavLink to="/register" className="button button--primary" onClick={closeMenu}>
                  Р РµРіРёСЃС‚СЂР°С†РёСЏ
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
            В«РљРѕРґ РІ РёРіСЂРµВ» вЂ” СѓС‡РµР±РЅС‹Р№ РїСЂРѕРµРєС‚: РёР·СѓС‡РµРЅРёРµ JavaScript С‡РµСЂРµР· РёРЅС‚РµСЂР°РєС‚РёРІРЅС‹Рµ РјРёРЅРё-РёРіСЂС‹.
          </p>
          <p className="layout__footer-note">
            Р”Р°РЅРЅС‹Рµ Р°РєРєР°СѓРЅС‚Р° Рё РїСЂРѕРіСЂРµСЃСЃР° С…СЂР°РЅСЏС‚СЃСЏ С‚РѕР»СЊРєРѕ РІ РІР°С€РµРј Р±СЂР°СѓР·РµСЂРµ.
          </p>
        </div>
      </footer>
    </div>
  );
}


