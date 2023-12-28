import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  data: [],
  loading: false,
  errorState: false,
  error: '',
};

export const getScheduleByclientID = createAsyncThunk(
  'combinationList/getScheduleByclientID',
  async ({ token, id, page }) => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/items/schedule_directus_users?fields[]=schedule_id.schedule&fields[]=schedule_id.client_name&fields[]=schedule_id.start&fields[]=schedule_id.end&fields[]=directus_users_id.first_name&fields[]=directus_users_id.dob&fields[]=directus_users_id.last_name&fields[]=directus_users_id.name&fields[]=directus_users_id.height&fields[]=directus_users_id.initial_weight&fields[]=directus_users_id.current_weight&fields[]=id&filter[_and][0][directus_users_id]=${id}&page=${page}&limit=10&sort=-schedule_id.start`,
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

const schedule_client = createSlice({
  name: 'schedule_client',
  initialState,
  reducers: {
    clearschedule_client: () => {
      return { ...initialState };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getScheduleByclientID.pending, (state, action) => {
      return { ...state, loading: true };
    });
    builder.addCase(getScheduleByclientID.fulfilled, (state, action) => {
      return {
        ...state,
        loading: false,
        data: action.payload.data,
      };
    });
    builder.addCase(getScheduleByclientID.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        errorState: true,
        error: action.error.message,
      };
    });
  },
});

export const { clearschedule_client } = schedule_client.actions;
export default schedule_client.reducer;
