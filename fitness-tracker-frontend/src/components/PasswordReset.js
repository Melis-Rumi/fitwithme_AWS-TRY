import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './PasswordReset.css';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://fitwithmpt.pythonanywhere.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  httpsAgent: {
    rejectUnauthorized: false
  }
});

const PasswordReset = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
  });
  const [status, setStatus] = useState({
    isSubmitting: false,
    isSuccess: false,
    message: '',
    error: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ ...status, isSubmitting: true, message: '', error: '' });

    try {
      const response = await apiClient.post('/reset-password/', formData);
      
      if (response.status === 200) {
        setStatus({
          isSubmitting: false,
          isSuccess: true,
          message: 'Password reset email sent! Please check your inbox.',
          error: ''
        });
      }
    } catch (error) {
      let errorMessage = 'An unexpected error occurred';
      
      if (error.response) {
        errorMessage = error.response.data?.error || 'Password reset failed';
      } else if (error.request) {
        errorMessage = 'No response from server. Check your network connection.';
      }
      
      setStatus({
        isSubmitting: false,
        isSuccess: false,
        message: '',
        error: errorMessage
      });
    }
  };

  return (
    <div className="password-reset-container">
      <h1>Reset Your Password</h1>
      <p className="instructions">
        Enter your username and email address below. If they match our records, we will send a temporary password to your email.
      </p>
      
      {status.error && <p className="error-message">{status.error}</p>}
      {status.message && <p className="success-message">{status.message}</p>}
      
      {!status.isSuccess ? (
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
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <button 
            type="submit" 
            disabled={status.isSubmitting}
          >
            {status.isSubmitting ? 'Processing...' : 'Reset Password'}
          </button>
        </form>
      ) : (
        <div className="reset-success">
          <p>Please check your email for a temporary password.</p>
          <button onClick={() => navigate('/login')}>
            Return to Login
          </button>
        </div>
      )}
      
      <p className="back-link">
        <span onClick={() => navigate('/login')}>
          Back to Login
        </span>
      </p>
    </div>
  );
};

export default PasswordReset;