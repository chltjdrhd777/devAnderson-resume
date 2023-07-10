import { TypedUseSelectorHook, useDispatch as dispatch, useSelector as selector } from 'react-redux';

import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import userSlice, { UserState } from 'redux/userSlice';

import storage from 'redux-persist/lib/storage';
import { PersistConfig, persistReducer } from 'redux-persist';

///////////////////////////////////////////////////
const reducers = combineReducers({
  user: userSlice.reducer,
});

const persistConfig: PersistConfig<ReturnType<typeof reducers>> = {
  key: 'root',
  storage,
  debug: true,
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useSelector: TypedUseSelectorHook<AppState> = selector;
export const useDispatch = () => dispatch<AppDispatch>();

export const actions = {
  ...userSlice.actions,
};
// export const useDispatcher = (targetAction: keyof typeof actions) => {
//   const dispatch = useDispatch();

//   return () => dispatch(actions[targetAction]());
// };
