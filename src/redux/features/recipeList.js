import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  data: [],
  loading: false,
  errorState: false,
  error: '',
};

const recipeList = createSlice({
  name: 'recipeList',
  initialState,
  reducers: {
    clearrecipeList: () => {
      return { ...initialState };
    },
  },
});

export default recipeList.reducer;
export const { clearrecipeList } = recipeList.actions;
