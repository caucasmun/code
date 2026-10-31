import { createSlice } from '@reduxjs/toolkit';
import {
  loadUsers,
  saveUsers,
  loadSession,
  saveSession,
  clearSession,
} from '../../utils/storage';
import {
  generateUserId,
  generateSalt,
  hashPassword,
  verifyPassword,
  isCryptoAvailable,
  CRYPTO_UNAVAILABLE_MESSAGE,
} from '../../utils/auth';

/**
 * Состояние авторизации.
 *
 * В Redux НЕ хранятся пароли и их хеши — здесь только публичные
 * данные пользователя (идентификатор, email, дата регистрации).
 */
const initialState = {
  user: null,
  initialized: false,
  loading: false,
  error: null,
  storageWarning: null,
};

/** Приводит запись пользователя к публичному виду (без хеша и соли). */
function toPublicUser(user) {
  return {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
  };
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /** Сброс ошибки (например, при начале ввода в форме). */
    clearError(state) {
      state.error = null;
    },

    /** Начало любой операции (вход/регистрация/восстановление). */
    startLoading(state) {
      state.loading = true;
      state.error = null;
    },

    /** Успешное восстановление сессии при загрузке приложения. */
    sessionRestored(state, action) {
      state.user = action.payload;
      state.initialized = true;
      state.loading = false;
      state.error = null;
    },

    /** Недействительная сессия — пользователь не найден или данные повреждены. */
    sessionInvalid(state) {
      state.user = null;
      state.initialized = true;
      state.loading = false;
      state.error = null;
    },

    /** Успешный вход или регистрация. */
    authSuccess(state, action) {
      state.user = action.payload;
      state.initialized = true;
      state.loading = false;
      state.error = null;
    },

    /** Ошибка авторизации с понятным текстом для пользователя. */
    authFailure(state, action) {
      state.user = null;
      state.initialized = true;
      state.loading = false;
      state.error = action.payload;
    },

    /** Выход из аккаунта. */
    loggedOut(state) {
      state.user = null;
      state.initialized = true;
      state.loading = false;
      state.error = null;
    },

    /** Предупреждение о недоступности хранилища. */
    storageWarningSet(state, action) {
      state.storageWarning = action.payload;
    },
  },
});

export const {
  clearError,
  startLoading,
  sessionRestored,
  sessionInvalid,
  authSuccess,
  authFailure,
  loggedOut,
  storageWarningSet,
} = authSlice.actions;


/**
 * Восстанавливает сессию из localStorage при запуске приложения.
 * Если сохранённый пользователь не найден или данные повреждены —
 * сессия очищается, приложение открывается как для гостя.
 */
export const restoreSession = () => (dispatch) => {
  dispatch(startLoading());
  try {
    const session = loadSession();
    if (!session) {
      dispatch(sessionInvalid());
      return;
    }

    const { users } = loadUsers();
    const user = users.find((item) => item.id === session.userId);

    if (!user) {
      // Недействительная сессия — аккуратно её удаляем.
      clearSession();
      dispatch(sessionInvalid());
      return;
    }

    dispatch(sessionRestored(toPublicUser(user)));
  } catch (error) {
    console.error('[auth] не удалось восстановить сессию', error);
    dispatch(sessionInvalid());
  }
};

/**
 * Регистрация нового демонстрационного аккаунта.
 * @param {{ email: string, password: string }} credentials
 */
export const register = (credentials) => async (dispatch) => {
  dispatch(startLoading());

  try {
    if (!isCryptoAvailable()) {
      dispatch(authFailure(CRYPTO_UNAVAILABLE_MESSAGE));
      return;
    }

    const email = credentials.email.trim().toLowerCase();
    const { users } = loadUsers();

    const alreadyExists = users.some(
      (user) => typeof user.email === 'string' && user.email.toLowerCase() === email,
    );
    if (alreadyExists) {
      dispatch(authFailure('Пользователь с таким email уже зарегистрирован'));
      return;
    }

    const salt = generateSalt();
    const passwordHash = await hashPassword(credentials.password, salt);

    const user = {
      id: generateUserId(),
      email,
      passwordHash,
      salt,
      createdAt: new Date().toISOString(),
    };

    const saved = saveUsers([...users, user]);
    if (!saved) {
      dispatch(authFailure('Не удалось сохранить аккаунт: браузер запретил доступ к хранилищу'));
      return;
    }

    const sessionSaved = saveSession(user.id);
    if (!sessionSaved) {
      dispatch(authFailure('Аккаунт создан, но не удалось сохранить сессию'));
      return;
    }

    dispatch(authSuccess(toPublicUser(user)));
  } catch (error) {
    console.error('[auth] ошибка регистрации', error);
    dispatch(
      authFailure(
        error && error.message === CRYPTO_UNAVAILABLE_MESSAGE
          ? CRYPTO_UNAVAILABLE_MESSAGE
          : 'Не удалось выполнить регистрацию. Попробуйте ещё раз.',
      ),
    );
  }
};

/**
 * Вход в демонстрационный аккаунт.
 */
export const login = (credentials) => async (dispatch) => {
  dispatch(startLoading());

  try {
    if (!isCryptoAvailable()) {
      dispatch(authFailure(CRYPTO_UNAVAILABLE_MESSAGE));
      return;
    }

    const email = credentials.email.trim().toLowerCase();
    const { users } = loadUsers();
    const user = users.find((item) => item.email.toLowerCase() === email);

    // Одинаковое сообщение для «нет такого email» и «неверный пароль»:
    // так нельзя выяснить, какие аккаунты существуют.
    const genericError = 'Неверный email или пароль';

    if (!user) {
      dispatch(authFailure(genericError));
      return;
    }

    const isValid = await verifyPassword(credentials.password, user);
    if (!isValid) {
      dispatch(authFailure(genericError));
      return;
    }

    const sessionSaved = saveSession(user.id);
    if (!sessionSaved) {
      dispatch(authFailure('Не удалось сохранить сессию: браузер запретил доступ к хранилищу'));
      return;
    }

    dispatch(authSuccess(toPublicUser(user)));
  } catch (error) {
    console.error('[auth] ошибка входа', error);
    dispatch(
      authFailure(
        error && error.message === CRYPTO_UNAVAILABLE_MESSAGE
          ? CRYPTO_UNAVAILABLE_MESSAGE
          : 'Не удалось выполнить вход. Попробуйте ещё раз.',
      ),
    );
  }
};

/**
 * Выход из аккаунта.
 * Сессия удаляется, прогресс и демонстрационная учётная запись сохраняются.
 */
export const logout = () => (dispatch) => {
  clearSession();
  dispatch(loggedOut());
};

export default authSlice.reducer;

