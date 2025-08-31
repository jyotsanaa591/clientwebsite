import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  data: [],
  loading: false,
  errorState: false,
  error: '',
};

export const getCombinationsList = createAsyncThunk(
  'combinationList/getCombinations',
  async ({ token, page }) => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/items/combination?limit=9&page=${page}`,
       
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }
);

export const getCombinationsListBySearch = createAsyncThunk(
  'combinationList/getCombinationsBySearch',
  async ({ token, page, search }) => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/items/combination?search=${search}&limit=9&page=${page}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }
);

const combinationList = createSlice({
  name: 'combinationList',
  initialState,
  reducers: {
    clearcombinationList: () => {
      return { ...initialState };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCombinationsList.pending, (state, action) => {
      return { ...state, loading: true };
    });
    builder.addCase(getCombinationsList.fulfilled, (state, action) => {
      return {
        ...state,
        loading: false,
        data: action.payload.data,
      };
    });
    builder.addCase(getCombinationsList.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        errorState: true,
        error: action.payload,
      };
    });
    builder.addCase(getCombinationsListBySearch.pending, (state, action) => {
      return { ...state, loading: true };
    });
    builder.addCase(getCombinationsListBySearch.fulfilled, (state, action) => {
      return {
        ...state,
        loading: false,
        data: action.payload.data,
      };
    });
    builder.addCase(getCombinationsListBySearch.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        errorState: true,
        error: action.payload,
      };
    });
  },
});

export default combinationList.reducer;
export const { clearcombinationList } = combinationList.actions;
