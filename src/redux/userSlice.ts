import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WritableDraft } from 'immer/dist/internal';

export interface UserState {
  config: {
    mode: 'white' | 'dark';
  };
  memo: {
    isMemoShown: boolean;
  };
}

const initialState: UserState = {
  config: {
    mode: 'white',
  },
  memo: {
    isMemoShown: false,
  },
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    toggleMode: (state) => {
      state.config.mode = state.config.mode === 'white' ? 'dark' : 'white';
    },

    toggleMemoShown: (state) => {
      state.memo.isMemoShown = !state.memo.isMemoShown;
    },

    // Canvas를 redux-persist에 저장 === 로컬스토리지에 저장 => 용량 초과, IndexedDB 도입한다.
  },
});

export default userSlice;
