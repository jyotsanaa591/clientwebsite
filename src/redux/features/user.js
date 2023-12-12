import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  token: '',
  data: {},
  loading: false,
  errorState: false,
  error: '',
};

export const userLogin = createAsyncThunk(
  'user/login',
  async ({ email, password }) => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      {
        email,
        password,
      }
    );
    return response.data;
  }
);

export const userVerify = createAsyncThunk('user/verify', async ({ token }) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/users/me`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
});

const user = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser: () => {
      return { ...initialState };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(userLogin.pending, (state, action) => {
      return { ...state, loading: true };
    });
    builder.addCase(userLogin.fulfilled, (state, action) => {
      return {
        ...state,
        loading: false,
        token: action.payload.data.access_token,
        data: {},
      };
    });
    builder.addCase(userLogin.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        errorState: true,
        error: action.payload,
      };
    });

    builder.addCase(userVerify.pending, (state, action) => {
      return { ...state, loading: true };
    });
    builder.addCase(userVerify.fulfilled, (state, action) => {
      return { ...state, loading: false, data: action.payload.data };
    });
    builder.addCase(userVerify.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        errorState: true,
        error: action.payload,
      };
    });
  },
});

export default user.reducer;
export const { clearUser, updateToken } = user.actions;
