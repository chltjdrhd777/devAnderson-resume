import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  config: {
    mode: 'white' | 'dark';
  };
  memo: {
    isMemoShown: boolean;
    memoData: string[];
  };
}

const initialState: UserState = {
  config: {
    mode: 'white',
  },
  memo: {
    isMemoShown: false,
    memoData: [],
  },
};
export type UserKeys = keyof UserState;
export type UserValues = UserState[UserKeys];

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    toggleMode: (state) => {
      state.config.mode = state.config.mode === 'white' ? 'dark' : 'white';
    },
    // 캔버스 저장하려했더니 localstorage 초과. 방법 찾자
    // 그 과정 블로깅해야함.
  },
});

export default userSlice;
