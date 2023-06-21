import {
  TypedUseSelectorHook,
  useDispatch as dispatch,
  useSelector as selector,
} from 'react-redux';

import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import userSlice from 'redux/userSlice';

import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

///////////////////////////////////////////////////
const persistConfig = {
  key: 'root',
  storage,
};

const reducers = combineReducers({
  user: userSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useSelector: TypedUseSelectorHook<AppState> = selector;
export const useDispatch = () => dispatch<AppDispatch>();

const actions = {
  ...userSlice.actions,
};
export const useDispatcher = (targetAction: keyof typeof actions) => {
  const dispatch = useDispatch();
  const actionObj = actions[targetAction]();

  return () => dispatch(actionObj);
};
