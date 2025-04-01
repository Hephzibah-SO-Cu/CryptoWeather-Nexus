import { createSlice } from '@reduxjs/toolkit';

interface FavoritesState {
  cities: string[];
  cryptos: string[];
}

const initialState: FavoritesState = {
  cities: [],
  cryptos: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavoriteCity: (state, action) => {
      if (!state.cities.includes(action.payload)) {
        state.cities.push(action.payload);
      }
    },
    removeFavoriteCity: (state, action) => {
      state.cities = state.cities.filter((city) => city !== action.payload);
    },
    addFavoriteCrypto: (state, action) => {
      if (!state.cryptos.includes(action.payload)) {
        state.cryptos.push(action.payload);
      }
    },
    removeFavoriteCrypto: (state, action) => {
      state.cryptos = state.cryptos.filter((crypto) => crypto !== action.payload);
    },
  },
});

export const {
  addFavoriteCity,
  removeFavoriteCity,
  addFavoriteCrypto,
  removeFavoriteCrypto,
} = favoritesSlice.actions;

export default favoritesSlice.reducer;