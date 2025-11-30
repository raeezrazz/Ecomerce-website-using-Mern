import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import type  {RootState}  from "../../store/store";

const UserProtected = () => {
    const { userInfo } = useSelector((state: RootState) => state.user);
    return userInfo ? <Outlet /> : <Navigate to="/auth" />;
};

export default UserProtected;
