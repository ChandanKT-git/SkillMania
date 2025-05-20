import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [message, setMessage] = useState('');

  const { email, password } = formData;

  const navigate = useNavigate();

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear previous messages

    const userCredentials = {
      email,
      password,
    };

    try {
      const res = await axios.post('/api/auth/login', userCredentials);

      console.log('Login successful:', res.data);
      setMessage('Login successful!');

      // Store the JWT (e.g., in localStorage)
      localStorage.setItem('token', res.data.token);

      // Redirect to dashboard or protected page
      navigate('/dashboard');

    } catch (err) {
      console.error('Login error:', err.response.data);
      setMessage(err.response.data.msg || 'Login failed'); // Set error message from backend or generic
    }
  };

  return (
    <div className="container">
      <h1>Sign In</h1>
      <p>Sign in to your account</p>
      <form onSubmit={onSubmit}>
        <div>
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={onChange}
            minLength="6"
            required
          />
        </div>
        <input type="submit" value="Login" />
      </form>
      {message && <p>{message}</p>} {/* Display messages */}
    </div>
  );
};

export default Login;