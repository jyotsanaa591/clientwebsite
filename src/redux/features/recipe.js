import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  data: {},
  loading: false,
  errorState: false,
  error: '',
};

export const getRecipeById = createAsyncThunk(
  'recipe/getRecipeById',
  async ({ token, id }) => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/items/recipe/${id}`,
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

export const updateRecipeById = createAsyncThunk(
  'recipe/updateRecipeById',
  async ({ token, id, data }) => {
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/items/recipe/${id}`,
      data,
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

export const deleteRecipeById = createAsyncThunk(
  'recipe/deleteRecipeById',
  async ({ token, id }) => {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/items/recipe/${id}`,
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

export const createNewRecipe = createAsyncThunk(
  'recipe/createNewRecipe',
  async ({ token, data }) => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/items/recipe`,
      data,
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

const recipe = createSlice({
  name: 'recipe',
  initialState,
  reducers: {
    clearrecipe: () => {
      return { ...initialState };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getRecipeById.pending, (state, action) => {
      return { ...state, loading: true };
    });
    builder.addCase(getRecipeById.fulfilled, (state, action) => {
      return {
        ...state,
        loading: false,
        data: action.payload.data,
      };
    });
    builder.addCase(getRecipeById.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        errorState: true,
        error: action.error,
      };
    });
    builder.addCase(updateRecipeById.pending, (state, action) => {
      return { ...state, loading: true };
    });
    builder.addCase(updateRecipeById.fulfilled, (state, action) => {
      return {
        ...state,
        loading: false,
        data: action.payload.data,
      };
    });
    builder.addCase(updateRecipeById.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        errorState: true,
        error: action.error,
      };
    });
    builder.addCase(deleteRecipeById.pending, (state, action) => {
      return { ...state, loading: true };
    });
    builder.addCase(deleteRecipeById.fulfilled, (state, action) => {
      return {
        ...state,
        loading: false,
        data: action.payload.data,
      };
    });
    builder.addCase(deleteRecipeById.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        errorState: true,
        error: action.error,
      };
    });
    builder.addCase(createNewRecipe.pending, (state, action) => {
      return { ...state, loading: true };
    });
    builder.addCase(createNewRecipe.fulfilled, (state, action) => {
      return {
        ...state,
        loading: false,
        data: action.payload.data,
      };
    });
    builder.addCase(createNewRecipe.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        errorState: true,
        error: action.error,
      };
    });
  },
});

export default recipe.reducer;
export const { clearrecipe } = recipe.actions;
