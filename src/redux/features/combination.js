import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  data: {},
  loading: false,
  errorState: false,
  error: '',
};

export const makeCombinationByid = createAsyncThunk(
  'combination/makeCombinationByid',
  async ({ token, data }) => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/items/combination`,
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

export const getCombinationById = createAsyncThunk(
  'combination/getCombinationById',
  async ({ token, id }) => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/items/combination/${id}`,
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

export const deleteCombinationByid = createAsyncThunk(
  'combination/deleteCombinationByid',
  async ({ token, id }) => {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/items/combination/${id}`,
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

export const updateCombinationByid = createAsyncThunk(
  'combination/updateCombinationByid',
  async ({ token, id, data }) => {
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/items/combination/${id}`,
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

const combination = createSlice({
  name: 'combination',
  initialState,
  reducers: {
    clearCombination: () => {
      return { ...initialState };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(makeCombinationByid.pending, (state, action) => {
      return { ...state, loading: true };
    });
    builder.addCase(makeCombinationByid.fulfilled, (state, action) => {
      return {
        ...state,
        loading: false,
        data: action.payload.data,
      };
    });
    builder.addCase(makeCombinationByid.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        errorState: true,
        error: action.error.message,
      };
    });
    builder.addCase(getCombinationById.pending, (state, action) => {
      return { ...state, loading: true };
    });
    builder.addCase(getCombinationById.fulfilled, (state, action) => {
      return {
        ...state,
        loading: false,
        data: action.payload.data,
      };
    });
    builder.addCase(getCombinationById.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        errorState: true,
        error: action.error.message,
      };
    });
    builder.addCase(updateCombinationByid.pending, (state, action) => {
      return { ...state, loading: true };
    });
    builder.addCase(updateCombinationByid.fulfilled, (state, action) => {
      return {
        ...state,
        loading: false,
        data: action.payload.data,
      };
    });
    builder.addCase(updateCombinationByid.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        errorState: true,
        error: action.error.message,
      };
    });
    builder.addCase(deleteCombinationByid.pending, (state, action) => {
      return { ...state, loading: true };
    });
    builder.addCase(deleteCombinationByid.fulfilled, (state, action) => {
      return {
        ...state,
        loading: false,
        data: action.payload.data,
      };
    });
    builder.addCase(deleteCombinationByid.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        errorState: true,
        error: action.error.message,
      };
    });
  },
});

export default combination.reducer;
export const { clearCombination } = combination.actions;
