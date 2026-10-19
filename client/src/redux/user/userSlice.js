import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  signIn as signInApi,
  signOut as signOutApi,
  googleSignIn as googleSignInApi,
} from '@/api/auth.api';
import {
  deleteUser as deleteUserApi,
  updateUser as updateUserApi,
} from '@/api/user.api';

const createAuthThunk = (name, apiCall) =>
  createAsyncThunk(name, async (arg, { rejectWithValue }) => {
    try {
      return await apiCall(arg);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  });

export const signInUser = createAuthThunk('user/signIn', (formData) =>
  signInApi(formData)
);

export const googleSignIn = createAuthThunk('user/googleSignIn', (payload) =>
  googleSignInApi(payload)
);

export const updateUser = createAuthThunk('user/update', ({ userId, formData }) =>
  updateUserApi(userId, formData)
);

export const deleteUser = createAuthThunk('user/delete', (userId) =>
  deleteUserApi(userId)
);

export const signOutUser = createAuthThunk('user/signOut', () => signOutApi());

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};

const applyFailure = (state, action) => {
  state.error = action.payload;
  state.loading = false;
};

const applyAuthSuccess = (state, action) => {
  state.currentUser = action.payload;
  state.loading = false;
  state.error = null;
};

const applyClearSuccess = (state) => {
  state.currentUser = null;
  state.loading = false;
  state.error = null;
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signInUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(signInUser.fulfilled, applyAuthSuccess)
      .addCase(signInUser.rejected, applyFailure)
      .addCase(googleSignIn.pending, (state) => {
        state.loading = true;
      })
      .addCase(googleSignIn.fulfilled, applyAuthSuccess)
      .addCase(googleSignIn.rejected, applyFailure)
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUser.fulfilled, applyAuthSuccess)
      .addCase(updateUser.rejected, applyFailure)
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUser.fulfilled, applyClearSuccess)
      .addCase(deleteUser.rejected, applyFailure)
      .addCase(signOutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(signOutUser.fulfilled, applyClearSuccess)
      .addCase(signOutUser.rejected, applyFailure);
  },
});

export const { clearUserError } = userSlice.actions;

export default userSlice.reducer;
