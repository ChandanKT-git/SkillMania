import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
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
      // Make API call to backend login endpoint
      const res = await axios.post('/api/auth/login', userCredentials);

      console.log('Login successful:', res.data);
      setMessage('Login successful!');

      // Store the JWT in local storage
      localStorage.setItem('token', res.data.token);

      // Redirect to dashboard or protected page
      navigate('/dashboard'); // Assuming you have a dashboard route

    } catch (err) {
      console.error('Login error:', err.response.data);
      setMessage(err.response.data.msg || 'Login failed'); // Display error message from backend or a generic one
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email Address"
              name="email"
              value={email}
              onChange={onChange}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={onChange}
              required
              minLength="6"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300">
            Login
          </button>
        </form>
        {message && (
          <p className={`mt-4 text-center ${message.includes('successful') ? 'text-green-500' : 'text-red-500'}`}>
            {message}
          </p>
        )} {/* Display messages */}
      </div>
    </div>
  );
};

export default LoginPage;