import { useEffect } from 'react';
import { useGetProfileQuery } from '../services/user';
import { useAppDispatch } from '../store/hook/hooks';
import { setCredentials } from '../slices/authSlice';
import Loader from './Loader';

const AuthBootstrap = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const { data, isLoading } = useGetProfileQuery();

  useEffect(() => {
    if (data) dispatch(setCredentials(data));
  }, [data, dispatch]);

  if (isLoading) return <Loader />;
  return <>{children}</>;
};

export default AuthBootstrap;
