import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import assetReducer from './slices/assetSlice';
import developmentTokenReducer from './slices/developmentTokenSlice';
import authReducer from './slices/authSlice';

const store = configureStore({
  reducer: {
    assets: assetReducer,
    developmentToken: developmentTokenReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export default store;
