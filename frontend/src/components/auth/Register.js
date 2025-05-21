import React, { useState } from 'react';

import axios from 'axios'; // Import axios
import { useNavigate } from 'react-router-dom'; // Import useNavigate
const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '' // Added for password confirmation, common practice
  });

  const { username, email, password, password2 } = formData;
  const [message, setMessage] = useState(''); // State for messages

  const navigate = useNavigate(); // Initialize navigate

  // Add the onChange handler
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Add the onSubmit handler
  const onSubmit = async (e) => { // Make the function async
    e.preventDefault();
    setMessage(''); // Clear previous messages on new submission

    if (password !== password2) {
      setMessage('Passwords do not match'); // Set error message
      setFormData({ ...formData, password: '', password2: '' }); // Clear password fields
      console.log('Passwords do not match'); // Log mismatch
      // TODO: Show user-friendly error message
      return; // Prevent submission
    }

    try {
      // Make the API call
      const res = await axios.post('/api/auth/register', { username, email, password });
      console.log(res.data); // Log success response
      setMessage('Registration successful!'); // Set success message
      setFormData({ username: '', email: '', password: '', password2: '' }); // Clear form data
      localStorage.setItem('token', res.data.token); // Store the JWT
      navigate('/login'); // Redirect to login page after storing token
    } catch (err) {
      console.error(err.response.data); // Log error response
      // Set error message based on backend response or a generic one
      setMessage(err.response && err.response.data && err.response.data.msg ? err.response.data.msg : 'Registration failed');
    }
  };

 return (
    <div>
      <h2>Register</h2>
      {message && <p style={{ color: message.includes('successful') ? 'green' : 'red' }}>{message}</p>} {/* Display message */}
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
 id="username"
            value={username}
 onChange={onChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
 id="email"
            value={email}
 onChange={onChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
 id="password"
            value={password}
 onChange={onChange}
            required
          />
        </div>
 {/* Added for password confirmation */}
        <div>
          <label htmlFor="password2">Confirm Password:</label>
          <input
            type="password"
 id="password2"
 value={password2}
 onChange={onChange}
            required
          />
        </div>
 {/* End added code */}
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;