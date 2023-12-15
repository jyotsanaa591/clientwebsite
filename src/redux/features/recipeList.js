import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  data: [],
  loading: false,
  errorState: false,
  error: '',
};

export const getRecipeList = createAsyncThunk(
  'recipeList/getRecipeList',
  async ({ token, page }) => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/items/recipe?limit=9&page=${page}&sort=title`,
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

export const getRecipeListBySearch = createAsyncThunk(
  'recipeList/getRecipeListBySearch',
  async ({ token, page, search }) => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/items/recipe?search=${search}&limit=9&page=${page}&sort=title`,
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

const recipeList = createSlice({
  name: 'recipeList',
  initialState,
  reducers: {
    clearrecipeList: () => {
      return { ...initialState };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getRecipeList.pending, (state, action) => {
      return { ...state, loading: true };
    });
    builder.addCase(getRecipeList.fulfilled, (state, action) => {
      return {
        ...state,
        loading: false,
        data: action.payload.data,
      };
    });
    builder.addCase(getRecipeList.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        errorState: true,
        error: action.payload,
      };
    });
    builder.addCase(getRecipeListBySearch.pending, (state, action) => {
      return { ...state, loading: true };
    });
    builder.addCase(getRecipeListBySearch.fulfilled, (state, action) => {
      return {
        ...state,
        loading: false,
        data: action.payload.data,
      };
    });
    builder.addCase(getRecipeListBySearch.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        errorState: true,
        error: action.payload,
      };
    });
  },
});

export default recipeList.reducer;
export const { clearrecipeList } = recipeList.actions;
