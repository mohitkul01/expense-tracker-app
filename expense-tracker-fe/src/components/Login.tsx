import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.username) newErrors.username = 'Username is required';
    if (!form.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await authService.login(form.username, form.password);
          navigate('/');

    } catch (err: any) {
      alert(err.message);
    }
  };

  // const handleOAuthLogin = async () => {
  //   try {
  //     const user: User = await authService.mockOAuthLogin();
  //     navigate('/');
  //   } catch (err: any) {
  //     alert('OAuth Login Failed');
  //   }
  // };

  return (
    <div className="auth-container dark-mode">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input name="username" value={form.username} onChange={handleChange} placeholder="Username" />
        {errors.username && <p className="error">{errors.username}</p>}

        <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password" />
        {errors.password && <p className="error">{errors.password}</p>}

        <button type="submit">Login</button>
      </form>

      {/* <button type="button" onClick={handleOAuthLogin}>
        Login with Mock OAuth
      </button> */}
    </div>
  );
};

export default Login;
