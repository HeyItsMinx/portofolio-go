import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Login Admin";
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    api.login(form.username, form.password)
      .then(res => {
        if (!res.ok) throw new Error("Invalid credentials");
        return res.json();
      })
      .then(data => {
        localStorage.setItem('token', data.token);
        navigate('/admin');
      })
      .catch(() => setError('Invalid username or password.'));
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
        <h1 className="text-red-600 uppercase font-black text-xl">Admin Login</h1>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="bg-black border border-neutral-800 p-3"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="bg-black border border-neutral-800 p-3"
        />
        <button className="bg-white text-black font-bold uppercase p-3 hover:bg-red-600 hover:text-white transition-colors">
          Log In
        </button>
      </form>
    </div>
  );
}