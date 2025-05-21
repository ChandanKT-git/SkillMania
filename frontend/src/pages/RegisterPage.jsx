import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '', // Password confirmation
  });

  const [message, setMessage] = useState('');

  const { username, email, password, password2 } = formData;

  const navigate = useNavigate();

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear previous messages

    if (password !== password2) {
      setMessage('Passwords do not match');
      return; // Prevent submission
    }

    const newUser = {
      username,
      email,
      password,
    };

    try {
      const res = await axios.post('/api/auth/register', newUser);

      console.log('Registration successful:', res.data);
      setMessage('Registration successful!');

      // Store the JWT
      localStorage.setItem('token', res.data.token);

      // Redirect to login page after successful registration
      navigate('/login');

    } catch (err) {
      console.error('Registration error:', err.response.data);
      setMessage(err.response.data.msg || 'Registration failed'); // Set error message from backend or generic
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4 text-center">Sign Up</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Username"
              name="username"
              value={username}
              onChange={onChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Email Address"
              name="email"
              value={email}
              onChange={onChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
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
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              name="password2"
              value={password2}
              onChange={onChange}
              minLength="6"
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Register
          </button>
        </form>
        {message && (
          <p
            className={`mt-4 text-center ${
              message.includes('successful') ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;