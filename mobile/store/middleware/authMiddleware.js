import { logout } from '../slices/authSlice';

  const authMiddleware = (store) => (next) => (action) => {
  if (action.error && action.payload?.status === 401) {
    console.log("authMiddleware: Detected 401, dispatching logout");
    store.dispatch(logout());
  }
  return next(action);
};

export default authMiddleware;