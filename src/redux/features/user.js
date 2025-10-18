// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';

// const initialState = {
//   token: '',
//   data: {},
//   roleName:'',
//   loading: false,
//   errorState: false,
//   error: '',
// };

// export const userLogin = createAsyncThunk(
//   'user/login',
//   async ({ email, password }) => {
//     const response = await axios.post(
//       `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      
//       {
//         email,
//         password,
//       }
//     );
//     return response.data;
//   }
// );

// export const userVerify = createAsyncThunk('user/verify', async ({ token }) => {
//   const response = await axios.get(
//     `${process.env.NEXT_PUBLIC_API_URL}/users/me`,
   
//     {
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   );
//   return response.data;
// });

// const user = createSlice({
//   name: 'user',
//   initialState,
//   reducers: {
//     clearUser: () => {
//       return { ...initialState };
//     },
//   },
//   extraReducers: (builder) => {
//     builder.addCase(userLogin.pending, (state, action) => {
//       return { ...state, loading: true };
//     });
//     builder.addCase(userLogin.fulfilled, (state, action) => {
//       return {
//         ...state,
//         loading: false,
//         token: action.payload.data.access_token,

//         data: {},
//       };
//     });
//     builder.addCase(userLogin.rejected, (state, action) => {
//       return {
//         ...state,
//         loading: false,
//         errorState: true,
//         error: action.error,
//       };
//     });

//     builder.addCase(userVerify.pending, (state, action) => {
//       return { ...state, loading: true };
//     });
//     builder.addCase(userVerify.fulfilled, (state, action) => {
//       return { ...state, loading: false, data: action.payload.data };
//     });
//     builder.addCase(userVerify.rejected, (state, action) => {
//       return {
//         ...state,
//         loading: false,
//         errorState: true,
//         error: action.payload,
//       };
//     });
//   },
// });

// export default user.reducer;
// export const { clearUser, updateToken } = user.actions;



import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  token: '',
  data: {},
  roleName: '', // add role name storage
  loading: false,
  errorState: false,
  error: '',
};

//  Login request
export const userLogin = createAsyncThunk(
  'user/login',
  async ({ email, password }) => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      { email, password }
    );
    return response.data;
  }
);

// Verify request (fetch user details & role)
export const userVerify = createAsyncThunk('user/verify', async ({ token }) => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
});

const user = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser: () => ({ ...initialState }),
  },
  extraReducers: (builder) => {
    // 🔹 LOGIN
    builder.addCase(userLogin.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(userLogin.fulfilled, (state, action) => {
      state.loading = false;
      state.token = action.payload.data.access_token;
    });
    builder.addCase(userLogin.rejected, (state, action) => {
      state.loading = false;
      state.errorState = true;
      state.error = action.error;
    });

    // VERIFY (get user details & normalize role)
    builder.addCase(userVerify.fulfilled, (state, action) => {
      console.log("Directus /users/ me response", action.payload.data)
      const userData = action.payload.data;

      // Normalize the role structure (Directus sometimes gives object or string)
      const role =
        typeof userData.role === 'object'
          ? userData.role.name?.toLowerCase()
          : userData.role?.toLowerCase();

      // Save everything properly
      state.loading = false;
      state.data = userData;
      state.roleName = role; //  this is the key line!
    });

    builder.addCase(userVerify.rejected, (state, action) => {
      state.loading = false;
      state.errorState = true;
      state.error = action.payload;
    });
  },
});

export const { clearUser } = user.actions;
export default user.reducer;
