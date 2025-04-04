import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Email validation regex (basic validation)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Check if email is valid
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address');
      return; // Exit the function if the email is invalid
    }

    try {
      const response = await axios.post('http://localhost:5002/api/login', { email, password });
      if (response.data.success) {
        navigate('/dashboard');
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert('Login failed: ' + error);
    }
  };

  return (
    <div className="login-page">
      <div className="container-wrapper-login">
        <div className="info-container">
          <img src="/furniture-log.png" alt="Furniture" className="login-image" />
          <h1>Welcome To</h1>
          <p className='logpara'>Manage your furniture business with ease and efficiency, streamline operations.</p>
        </div>
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
      </div>
    </div>
  );
};

export default Login;
