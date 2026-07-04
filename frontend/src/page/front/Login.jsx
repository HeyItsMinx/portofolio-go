import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:8080/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
        <h1 className="text-red-600 uppercase font-black text-xl">Admin Login</h1>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input
          placeholder="Username"
          value={form.username}
          onChange={e => setForm({ ...form, username: e.target.value })}
          className="bg-black border border-neutral-800 p-3"
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          className="bg-black border border-neutral-800 p-3"
        />
        <button className="bg-white text-black font-bold uppercase p-3 hover:bg-red-600 hover:text-white transition-colors">
          Log In
        </button>
      </form>
    </div>
  );
}