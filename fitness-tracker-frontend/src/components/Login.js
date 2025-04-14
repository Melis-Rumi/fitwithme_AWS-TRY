import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';
import { AuthContext } from '../AuthContext';
import './Login.css';


const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://fitwithmpt.pythonanywhere.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  // For development, you can bypass SSL verification
  httpsAgent: {
    rejectUnauthorized: false
  }
});

const Login = () => {
  const { login } = useContext(AuthContext);
  const { setUserId, setUsername } = useContext(UserContext);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      console.log('Attempting to log in with:', {
        url: `${apiClient.defaults.baseURL}/login/`,
        data: formData
      });
  
      const response = await apiClient.post('/login/', formData);
      
      if (response.status === 200) {
        const token = response.data.token;
        login(token);
        const username = formData.username;
        setUserId(response.data.user_id);
        setUsername(username);
        alert('Login successful!');
        navigate('/home');
      }
    } catch (error) {
      console.error('Full Error Details:', {
        message: error.message,
        config: error.config,
        code: error.code,
        request: error.request ? {
          method: error.request.method,
          url: error.request.url,
          headers: error.request.headers
        } : null
      });
      
      if (error.response) {
        // The request was made and the server responded with a status code
        console.error('Error Response Data:', error.response.data);
        console.error('Error Status:', error.response.status);
        setError(error.response.data?.error || 'Login failed');
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received', error.request);
        setError('No response from server. Check your network connection.');
      } else {
        // Something happened in setting up the request
        console.error('Error Message:', error.message);
        setError('An unexpected error occurred');
      }
    }
  };

  return (
    <div className="login-container">
      <h1>Welcome Back</h1>
      <h2>Log in to access your fitness tracker</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Log In</button>
      </form>
      <p>
        Don't have an account?{' '}
        <span className="signup-link" onClick={() => navigate('/intro')}>
          Sign up
        </span>
      </p>
    </div>
  );
};

export default Login;