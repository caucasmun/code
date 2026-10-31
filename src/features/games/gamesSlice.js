import { createSlice } from '@reduxjs/toolkit';
import { games, getGameBySlug } from '../../data/games';

/**
 * Состояние каталога игр.
 * Метаданные игр всегда берутся из data/games.js — дублировать их здесь не нужно.
 */
const initialState = {
  list: games,
  current: null,
  search: '',
  difficulty: 'all',
};

const gamesSlice = createSlice({
  name: 'games',
  initialState,
  reducers: {
    /** Устанавливает поисковый запрос (регистр не важен — сравнение в селекторе). */
    setSearch(state, action) {
      state.search = action.payload;
    },

    /** Устанавливает фильтр по сложности: all | easy | medium | hard. */
    setDifficulty(state, action) {
      state.difficulty = action.payload;
    },

    /** Сбрасывает поиск и фильтр. */
    resetFilters(state) {
      state.search = '';
      state.difficulty = 'all';
    },

    /** Выбирает текущую игру по slug. */
    setCurrentGame(state, action) {
      state.current = getGameBySlug(action.payload);
    },
  },
});

export const { setSearch, setDifficulty, resetFilters, setCurrentGame } = gamesSlice.actions;

/**
 * Селектор: список игр с учётом поиска и фильтра по сложности.
 * Поиск работает без учёта регистра и ищет по названию и описанию.
 */
export const selectFilteredGames = (state) => {
  const { list, search, difficulty } = state.games;
  const query = search.trim().toLowerCase();

  return list.filter((game) => {
    if (difficulty !== 'all' && game.difficulty !== difficulty) return false;
    if (!query) return true;

    return (
      game.title.toLowerCase().includes(query) ||
      game.shortDescription.toLowerCase().includes(query) ||
      game.topics.some((topic) => topic.toLowerCase().includes(query))
    );
  });
};

/** Селектор: количество найденных игр. */
export const selectFilteredGamesCount = (state) => selectFilteredGames(state).length;

export default gamesSlice.reducer;
