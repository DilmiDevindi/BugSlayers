import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css'; // Import CSS file

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', { email, password });
      if (response.data.success) {
        navigate('/dashboard');
      } else {
        alert(response.data.message);
      }
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert('Login failed', error);
    }
  };

  return (
    <div className="container-wrapper">
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn">Login</button>
        </form>
        <p>Don&apos;t have an account? <a href="/signup">Sign up</a></p>
      </div>
      <div className="info-container">
        <h1>New Sisira Furniture Management System</h1>
      </div>
    </div>
  );
};

export default Login;
