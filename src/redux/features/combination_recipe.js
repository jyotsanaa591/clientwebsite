// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';

// const initialState = {
//   data: [],
//   loading: false,
//   errorState: false,
//   error: '',
// };

// export const getCombinationabyrecipeId = createAsyncThunk(
//   'combinationList/getCombinationabyrecipeId',
//   async ({ token, id }) => {
//     const response = await axios.get(
//       `${process.env.NEXT_PUBLIC_API_URL}/items/combination_recipe?fields[]=combination_id.title&fields[]=combination_id.id&fields[]=id&filter[_and][0][recipe_id]=${id}&page=1&limit=300`,
      
//       {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
//     return response.data;
//   }
// );

// export const getRecipeByCombinationId = createAsyncThunk(
//   'combinationList/getRecipeByCombinationId',
//   async ({ token, id, search }) => {
//     const response = await axios.get(
//       `${process.env.NEXT_PUBLIC_API_URL}/items/combination_recipe?fields[]=recipe_id.title&fields[]=recipe_id.id&fields[]=recipe_id.instruction&fields[]=id&filter[_and][0][combination_id]=${id}&page=1&limit=60&search=${search}`,
//       {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
//     return response.data;
//   }
// );

// const combination_recipe = createSlice({
//   name: 'combination_recipe',
//   initialState,
//   reducers: {
//     clearcombination_recipe: () => {
//       return { ...initialState };
//     },
//   },
//   extraReducers: (builder) => {
//     builder.addCase(getCombinationabyrecipeId.pending, (state, action) => {
//       return { ...state, loading: true };
//     });
//     builder.addCase(getCombinationabyrecipeId.fulfilled, (state, action) => {
//       return {
//         ...state,
//         loading: false,
//         data: action.payload.data,
//       };
//     });
//     builder.addCase(getCombinationabyrecipeId.rejected, (state, action) => {
//       return {
//         ...state,
//         loading: false,
//         errorState: true,
//         error: action.error.message,
//       };
//     });
//     builder.addCase(getRecipeByCombinationId.pending, (state, action) => {
//       return { ...state, loading: true };
//     });
//     builder.addCase(getRecipeByCombinationId.fulfilled, (state, action) => {
//       return {
//         ...state,
//         loading: false,
//         data: action.payload.data,
//       };
//     });
//     builder.addCase(getRecipeByCombinationId.rejected, (state, action) => {
//       return {
//         ...state,
//         loading: false,
//         errorState: true,
//         error: action.error.message,
//       };
//     });
//   },
// });

// export const { clearcombination_recipe } = combination_recipe.actions;
// export default combination_recipe.reducer;


import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  data: [],
  loading: false,
  errorState: false,
  error: '',
};

// safer: check for id before making request
export const getCombinationabyrecipeId = createAsyncThunk(
  'combinationList/getCombinationabyrecipeId',
  async ({ token, id }) => {
    if (!id) {
      console.warn("⚠️ No recipe_id provided to getCombinationabyrecipeId");
      return { data: [] }; // return safe empty result
    }

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/items/combination_recipe?fields[]=combination_id.title&fields[]=combination_id.id&fields[]=id&filter[_and][0][recipe_id]=${id}&page=1&limit=300`,
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

export const getRecipeByCombinationId = createAsyncThunk(
  'combinationList/getRecipeByCombinationId',
  async ({ token, id, search }) => {
    if (!id) {
      console.warn("⚠️ No combination_id provided to getRecipeByCombinationId");
      return { data: [] }; // safe fallback
    }

    const url =
      `${process.env.NEXT_PUBLIC_API_URL}/items/combination_recipe?fields[]=recipe_id.title&fields[]=recipe_id.id&fields[]=recipe_id.instruction&fields[]=id&filter[_and][0][combination_id]=${id}&page=1&limit=60` +
      (search ? `&search=${search}` : "");

    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }
);

const combination_recipe = createSlice({
  name: 'combination_recipe',
  initialState,
  reducers: {
    clearcombination_recipe: () => {
      return { ...initialState };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCombinationabyrecipeId.pending, (state) => {
      return { ...state, loading: true };
    });
    builder.addCase(getCombinationabyrecipeId.fulfilled, (state, action) => {
      return {
        ...state,
        loading: false,
        data: action.payload.data,
      };
    });
    builder.addCase(getCombinationabyrecipeId.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        errorState: true,
        error: action.error.message,
      };
    });
    builder.addCase(getRecipeByCombinationId.pending, (state) => {
      return { ...state, loading: true };
    });
    builder.addCase(getRecipeByCombinationId.fulfilled, (state, action) => {
      return {
        ...state,
        loading: false,
        data: action.payload.data,
      };
    });
    builder.addCase(getRecipeByCombinationId.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        errorState: true,
        error: action.error.message,
      };
    });
  },
});

export const { clearcombination_recipe } = combination_recipe.actions;
export default combination_recipe.reducer;