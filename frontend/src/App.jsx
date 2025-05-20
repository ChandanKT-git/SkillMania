import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Register from './components/auth/Register';
import Login from './components/auth/Login';

const App = () => {
  return (
    <div className="App"> {/* Optional: A main container div for basic styling */}
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {/* Optional: Add an index route */}
        {/* <Route path="/" element={<div>Welcome to the App!</div>} /> */}
      </Routes>
    </div>
  );
};

export default App;