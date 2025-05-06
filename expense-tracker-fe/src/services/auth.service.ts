import { User } from '../interfaces/User';
import api from './api';

const register = async (form: Omit<User, 'id'> & { password: string }): Promise<User> => {
  const res = await api.post('/users/', form)

  const user: User = res.data;
  localStorage.setItem('user', JSON.stringify(user));
  return user;
};

const login = async (username: string, password: string): Promise<User> => {
  const res = await api.post('/login/', {username, password})

  const user: User = res.data
  localStorage.setItem('user', JSON.stringify(user));
  return user;
};

const mockOAuthLogin = async (): Promise<User> => {
  const res = await api.post('/mLogin/')
  const user: User = res.data;
  localStorage.setItem('user', JSON.stringify(user));
  return user;
};

const logout = () => {
  localStorage.removeItem('user');
};

const authService = {
  register,
  login,
  mockOAuthLogin,
  logout,
};

export default authService;
