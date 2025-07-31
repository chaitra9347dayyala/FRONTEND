import React, { useState } from 'react';
import { useAuth } from '../context/authcontext';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ onClose }) => {
  const { login, user } = useAuth();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const success = await login(credentials.username, credentials.password);
    if (success) {
      onClose && onClose();
      if (user?.role === 'admin') {
        navigate('/admin-panel');
      } else {
        navigate('/home');
      }
    } else {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="login-form">
      <form onSubmit={handleLogin}>
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={credentials.username}
          onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;
