import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  data: {},
  loading: false,
  errorState: false,
  error: '',
};

const combination = createSlice({
  name: 'combination',
  initialState,
  reducers: {
    clearCombination: () => {
      return { ...initialState };
    },
  },
});

export default combination.reducer;
export const { clearCombination } = combination.actions;
