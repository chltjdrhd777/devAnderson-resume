import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  config: {
    mode: 'white' | 'dark';
  };
}

const initialState: UserState = {
  config: {
    mode: 'white',
  },
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    toggleMode: state => {
      state.config.mode = state.config.mode === 'white' ? 'dark' : 'white';
    },
  },
});

export default userSlice;
