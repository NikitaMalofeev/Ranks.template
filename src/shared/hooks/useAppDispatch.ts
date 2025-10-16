import { useDispatch } from 'react-redux';
import type { AppDispatch } from 'app/providers/store/config/store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
