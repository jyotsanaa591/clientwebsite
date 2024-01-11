import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  clients: [],
  loading: false,
  errorState: false,
  error: '',
};

export const getClients = createAsyncThunk(
  'clients/getClients',
  async ({ token, page, active }) => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/users?filter[role]=0ce3fcd3-92a1-453d-8067-8308d5c372ad&filter[status]=${active}&limit=10&page=${page}&sort=first_name`,
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

export const getClientsBySearch = createAsyncThunk(
  'clients/getClientsBySearch',
  async ({ token, page, search, active }) => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/users?filter[role]=0ce3fcd3-92a1-453d-8067-8308d5c372ad&filter[status]=${active}&search=${search}&limit=10&page=${page}&sort=first_name`,
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

export const clientsList = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    clearClients: () => {
      return { ...initialState };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getClients.pending, (state, action) => {
      return { ...state, loading: true };
    });
    builder.addCase(getClients.fulfilled, (state, action) => {
      return {
        ...state,
        loading: false,
        clients: action.payload.data,
      };
    });
    builder.addCase(getClients.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        errorState: true,
        error: action.payload,
      };
    });
    builder.addCase(getClientsBySearch.pending, (state, action) => {
      return { ...state, loading: true };
    });
    builder.addCase(getClientsBySearch.fulfilled, (state, action) => {
      return {
        ...state,
        loading: false,
        clients: action.payload.data,
      };
    });
    builder.addCase(getClientsBySearch.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        errorState: true,
        error: action.payload,
      };
    });
  },
});

export const { clearClients } = clientsList.actions;

export default clientsList.reducer;
