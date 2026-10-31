import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { register, clearError } from '../features/auth/authSlice';
import { validateRegisterForm, hasErrors, MIN_PASSWORD_LENGTH } from '../utils/validators';

/**
 * Страница регистрации нового аккаунта.
 */
export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error, storageWarning } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ email: '', password: '', passwordConfirm: '' });
  const [fieldErrors, setFieldErrors] = useState({
    email: null,
    password: null,
    passwordConfirm: null,
  });

  useEffect(() => {
    document.title = 'Регистрация — Код в игре';
  }, []);

  // После успешной регистрации пользователь сразу авторизован.
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

    const errors = validateRegisterForm(form);
    setFieldErrors(errors);
    if (hasErrors(errors)) return;

    await dispatch(register({ email: form.email, password: form.password }));
  };

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="auth">
      <div className="auth__card">
        <h1 className="auth__title">Регистрация</h1>
        <p className="auth__subtitle">
          Демонстрационная учётная запись хранится только в вашем браузере — пароль не уходит на
          сервер.
        </p>

        {storageWarning ? <p className="alert alert--warning">{storageWarning}</p> : null}
        {error ? (
          <p className="alert alert--error" role="alert">
            {error}
          </p>
        ) : null}

        <form className="form" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label className="field__label" htmlFor="register-email">
              Email
            </label>
            <input
              id="register-email"
              name="email"
              type="email"
              className={`field__input ${fieldErrors.email ? 'field__input--error' : ''}`.trim()}
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              placeholder="student@example.com"
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? 'register-email-error' : undefined}
            />
            {fieldErrors.email ? (
              <p id="register-email-error" className="field__error">
                {fieldErrors.email}
              </p>
            ) : null}
          </div>

          <div className="field">
            <label className="field__label" htmlFor="register-password">
              Пароль
            </label>
            <input
              id="register-password"
              name="password"
              type="password"
              className={`field__input ${fieldErrors.password ? 'field__input--error' : ''}`.trim()}
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              aria-invalid={Boolean(fieldErrors.password)}
              aria-describedby={fieldErrors.password ? 'register-password-error' : undefined}
            />
            {fieldErrors.password ? (
              <p id="register-password-error" className="field__error">
                {fieldErrors.password}
              </p>
            ) : (
              <p className="field__hint">Минимум {MIN_PASSWORD_LENGTH} символов.</p>
            )}
          </div>

          <div className="field">
            <label className="field__label" htmlFor="register-password-confirm">
              Повторите пароль
            </label>
            <input
              id="register-password-confirm"
              name="passwordConfirm"
              type="password"
              className={`field__input ${fieldErrors.passwordConfirm ? 'field__input--error' : ''}`.trim()}
              value={form.passwordConfirm}
              onChange={handleChange}
              autoComplete="new-password"
              aria-invalid={Boolean(fieldErrors.passwordConfirm)}
              aria-describedby={fieldErrors.passwordConfirm ? 'register-confirm-error' : undefined}
            />
            {fieldErrors.passwordConfirm ? (
              <p id="register-confirm-error" className="field__error">
                {fieldErrors.passwordConfirm}
              </p>
            ) : null}
          </div>

          <button type="submit" className="button button--primary button--full" disabled={loading}>
            {loading ? 'Создаём аккаунт…' : 'Зарегистрироваться'}
          </button>
        </form>

        <p className="auth__footer">
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </div>
    </div>
  );
}
