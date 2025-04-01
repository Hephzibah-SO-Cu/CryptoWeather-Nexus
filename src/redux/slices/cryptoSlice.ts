import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCryptoData } from '../../utils/api';
import { CryptoData } from '../../types';

interface CryptoState {
  data: CryptoData[];
  loading: boolean;
  error: string | null;
}

const initialState: CryptoState = {
  data: [],
  loading: false,
  error: null,
};

export const fetchCrypto = createAsyncThunk(
  'crypto/fetchCrypto',
  async (ids: string[], { rejectWithValue }) => {
    try {
      const data = await fetchCryptoData(ids);
      return data;
    } catch (error) {
      return rejectWithValue('Failed to fetch crypto data');
    }
  }
);

const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCrypto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCrypto.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchCrypto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default cryptoSlice.reducer;