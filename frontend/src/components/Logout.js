import React from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear JWT token from local storage
    navigate('/login'); // Redirect to login page
  };

  return (
    <button onClick={handleLogout} className="text-white hover:underline">Logout</button>
  );
}

export default Logout;