import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SignupForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/register', { name, username, password });
      console.log(response.data);
      navigate('/login');
      // Redirect to login page or dashboard upon successful signup
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  return (
<div className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-4">Sign Up</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
      <div>
          <label htmlFor="name" className="block text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
            placeholder="Enter your username"
            required
          />
        </div>
        <div>
          <label htmlFor="username" className="block text-gray-700">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
            placeholder="Enter your username"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">Sign Up</button>
      </form>
    </div>
  );
}

export default SignupForm;
