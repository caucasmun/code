import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { login, clearError } from '../features/auth/authSlice';
import { validateLoginForm, hasErrors } from '../utils/validators';

/**
 * Страница входа в аккаунт.
 */
export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error, storageWarning } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({ email: null, password: null });

  useEffect(() => {
    document.title = 'Вход — Код в игре';
  }, []);

  // После успешного входа возвращаем пользователя на главную.
  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    dispatch(clearError());
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const errors = validateLoginForm(form);
    setFieldErrors(errors);
    if (hasErrors(errors)) return;

    await dispatch(login(form));
  };

  // Уже авторизованный пользователь не должен видеть форму входа.
  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="auth">
      <div className="auth__card">
        <h1 className="auth__title">Вход в аккаунт</h1>
        <p className="auth__subtitle">
          Аккаунт нужен, чтобы сохранять прогресс и отметки о выполненных заданиях.
        </p>

        {storageWarning ? <p className="alert alert--warning">{storageWarning}</p> : null}
        {error ? (
          <p className="alert alert--error" role="alert">
            {error}
          </p>
        ) : null}

        <form className="form" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label className="field__label" htmlFor="login-email">
              Email
            </label>
            <input
              id="login-email"
              name="email"
              type="email"
              className={`field__input ${fieldErrors.email ? 'field__input--error' : ''}`.trim()}
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              placeholder="student@example.com"
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? 'login-email-error' : undefined}
            />
            {fieldErrors.email ? (
              <p id="login-email-error" className="field__error">
                {fieldErrors.email}
              </p>
            ) : null}
          </div>

          <div className="field">
            <label className="field__label" htmlFor="login-password">
              Пароль
            </label>
            <input
              id="login-password"
              name="password"
              type="password"
              className={`field__input ${fieldErrors.password ? 'field__input--error' : ''}`.trim()}
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              aria-invalid={Boolean(fieldErrors.password)}
              aria-describedby={fieldErrors.password ? 'login-password-error' : undefined}
            />
            {fieldErrors.password ? (
              <p id="login-password-error" className="field__error">
                {fieldErrors.password}
              </p>
            ) : null}
          </div>

          <button type="submit" className="button button--primary button--full" disabled={loading}>
            {loading ? 'Проверяем…' : 'Войти'}
          </button>
        </form>

        <p className="auth__footer">
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </p>
      </div>
    </div>
  );
}
