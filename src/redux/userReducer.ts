import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  config: {
    mode: 'white' | 'dark';
  };
}

const initialState: UserState = {
  config: {
    mode: 'dark',
  },
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    test: state => {
      if (state.config.mode === 'white') {
        state.config.mode = 'dark';
      } else {
        state.config.mode = 'white';
      }
    },
  },
});

export const { test } = userSlice.actions;
export default userSlice.reducer;
