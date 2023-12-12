import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  data: {},
  loading: false,
  errorState: false,
  error: '',
};

export const makeClient = createAsyncThunk(
  'clients/makeClient',
  async ({ token, data }) => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/users`,
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

export const getClientById = createAsyncThunk(
  'clients/getClientById',
  async ({ token, id }) => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
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

export const updateClient = createAsyncThunk(
  'clients/updateClient',
  async ({ token, id, data }) => {
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
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

export const deleteClientByID = createAsyncThunk(
  'clients/deleteClient',
  async ({ token, id }) => {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
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

const client = createSlice({
  name: 'client',
  initialState,
  reducers: {
    clearClient: () => {
      return { ...initialState };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(makeClient.pending, (state, action) => {
      return { ...state, loading: true };
    });
    builder.addCase(makeClient.fulfilled, (state, action) => {
      return {
        ...state,
        loading: false,
        data: action.payload.data,
      };
    });
    builder.addCase(makeClient.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        errorState: true,
        error: action.payload,
      };
    });
    builder.addCase(getClientById.pending, (state, action) => {
      return { ...state, loading: true };
    });
    builder.addCase(getClientById.fulfilled, (state, action) => {
      return {
        ...state,
        loading: false,
        data: action.payload.data,
      };
    });
    builder.addCase(getClientById.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        errorState: true,
        error: action.payload,
      };
    });
    builder.addCase(updateClient.pending, (state, action) => {
      return { ...state, loading: true };
    });
    builder.addCase(updateClient.fulfilled, (state, action) => {
      return {
        ...state,
        loading: false,
        data: action.payload.data,
      };
    });
    builder.addCase(updateClient.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        errorState: true,
        error: action.payload,
      };
    });
    builder.addCase(deleteClientByID.pending, (state, action) => {
      return { ...state, loading: true };
    });
    builder.addCase(deleteClientByID.fulfilled, (state, action) => {
      return {
        ...state,
        loading: false,
        data: action.payload.data,
      };
    });
    builder.addCase(deleteClientByID.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        errorState: true,
        error: action.payload,
      };
    });
  },
});

export const { clearClient } = client.actions;

export default client.reducer;
