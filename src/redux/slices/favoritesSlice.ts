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
    addCityToFavorites: (state, action: { payload: string }) => {
      if (!state.cities.includes(action.payload)) {
        state.cities.push(action.payload);
        if (typeof window !== 'undefined') {
          localStorage.setItem('favorites', JSON.stringify({ cities: state.cities, cryptos: state.cryptos }));
        }
      }
    },
    removeCityFromFavorites: (state, action: { payload: string }) => {
      state.cities = state.cities.filter((city) => city !== action.payload);
      if (typeof window !== 'undefined') {
        localStorage.setItem('favorites', JSON.stringify({ cities: state.cities, cryptos: state.cryptos }));
      }
    },
    addCryptoToFavorites: (state, action: { payload: string }) => {
      if (!state.cryptos.includes(action.payload)) {
        state.cryptos.push(action.payload);
        if (typeof window !== 'undefined') {
          localStorage.setItem('favorites', JSON.stringify({ cities: state.cities, cryptos: state.cryptos }));
        }
      }
    },
    removeCryptoFromFavorites: (state, action: { payload: string }) => {
      state.cryptos = state.cryptos.filter((crypto) => crypto !== action.payload);
      if (typeof window !== 'undefined') {
        localStorage.setItem('favorites', JSON.stringify({ cities: state.cities, cryptos: state.cryptos }));
      }
    },
    setFavorites: (state, action: { payload: FavoritesState }) => {
      state.cities = action.payload.cities;
      state.cryptos = action.payload.cryptos;
    },
  },
});

export const {
  addCityToFavorites,
  removeCityFromFavorites,
  addCryptoToFavorites,
  removeCryptoFromFavorites,
  setFavorites,
} = favoritesSlice.actions;

export default favoritesSlice.reducer;