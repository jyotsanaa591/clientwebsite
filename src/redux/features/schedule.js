import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  data: {},
  loading: false,
  errorState: false,
  error: '',
};

export const makeSchedule = createAsyncThunk(
  'schedule/makeSchedule',
  async ({ token, data }) => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/items/schedule`,
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

export const deleteScheduleById = createAsyncThunk(
  'schedule/deleteScheduleById',
  async ({ token, id }) => {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/items/schedule/${id}`,
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

export const getScheduleById = createAsyncThunk(
  'schedule/getScheduleById',
  async ({ token, id }) => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/items/schedule/${id}`,
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

const schedule = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    clearschedule: () => {
      return { ...initialState };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(makeSchedule.pending, (state, action) => {
      return { ...state, loading: true };
    });
    builder.addCase(makeSchedule.fulfilled, (state, action) => {
      return {
        ...state,
        loading: false,
        data: action.payload.data,
      };
    });
    builder.addCase(makeSchedule.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        errorState: true,
        error: action.error.message,
      };
    });
    builder.addCase(getScheduleById.pending, (state, action) => {
      return { ...state, loading: true };
    });
    builder.addCase(getScheduleById.fulfilled, (state, action) => {
      return {
        ...state,
        loading: false,
        data: action.payload.data,
      };
    });
    builder.addCase(getScheduleById.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        errorState: true,
        error: action.error.message,
      };
    });
    builder.addCase(deleteScheduleById.pending, (state, action) => {
      return { ...state, loading: true };
    });
    builder.addCase(deleteScheduleById.fulfilled, (state, action) => {
      return {
        ...state,
        loading: false,
        data: action.payload.data,
      };
    });
    builder.addCase(deleteScheduleById.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        errorState: true,
        error: action.error.message,
      };
    });
  },
});

export const { clearschedule } = schedule.actions;
export default schedule.reducer;
