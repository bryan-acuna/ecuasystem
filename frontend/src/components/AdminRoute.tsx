import { useAppSelector } from '../store/hook/hooks';
import { selectUserInfo } from '../slices/authSlice';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  const userInfo = useAppSelector(selectUserInfo);
  return userInfo?.isAdmin ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AdminRoute;
