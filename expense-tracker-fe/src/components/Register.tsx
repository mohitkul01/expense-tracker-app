import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';
import { User } from '../interfaces/User';

const Register = () => {
  const [form, setForm] = useState({
    username: '',
    password: '',
    email: '',
    first_name: '',
    last_name: '',
  });

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
    if (!form.email) newErrors.email = 'Email is required';
    if (!form.first_name) newErrors.first_name = 'First name is required';
    if (!form.last_name) newErrors.last_name = 'Last name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await authService.register(form);
      navigate('/');
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="auth-container dark-mode">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input name="username" value={form.username} onChange={handleChange} placeholder="Username" />
        {errors.username && <p className="error">{errors.username}</p>}

        <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password" />
        {errors.password && <p className="error">{errors.password}</p>}

        <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" />
        {errors.email && <p className="error">{errors.email}</p>}

        <input name="first_name" value={form.first_name} onChange={handleChange} placeholder="First Name" />
        {errors.first_name && <p className="error">{errors.first_name}</p>}

        <input name="last_name" value={form.last_name} onChange={handleChange} placeholder="Last Name" />
        {errors.last_name && <p className="error">{errors.last_name}</p>}

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Register;
