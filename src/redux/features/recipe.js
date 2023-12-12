import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  data: {},
  loading: false,
  errorState: false,
  error: '',
};

const recipe = createSlice({
  name: 'recipe',
  initialState,
  reducers: {
    clearrecipe: () => {
      return { ...initialState };
    },
  },
});

export default recipe.reducer;
export const { clearrecipe } = recipe.actions;
