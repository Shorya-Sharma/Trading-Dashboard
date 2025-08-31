import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchSymbols } from '../api/symbols';

export const loadSymbols = createAsyncThunk('symbols/loadSymbols', async () => {
  const data = await fetchSymbols();
  return data;
});

const symbolsSlice = createSlice({
  name: 'symbols',
  initialState: {
    list: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(loadSymbols.pending, state => {
        state.status = 'loading';
      })
      .addCase(loadSymbols.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(loadSymbols.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default symbolsSlice.reducer;
