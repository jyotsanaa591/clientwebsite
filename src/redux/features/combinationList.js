import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  data: [],
  loading: false,
  errorState: false,
  error: '',
};

const combinationList = createSlice({
  name: 'combinationList',
  initialState,
  reducers: {
    clearcombinationList: () => {
      return { ...initialState };
    },
  },
});

export default combinationList.reducer;
export const { clearcombinationList } = combinationList.actions;
