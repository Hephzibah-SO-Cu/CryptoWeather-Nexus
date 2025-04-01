import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import store from './store'; // Change to default import
import type { RootState, AppDispatch } from './store';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;