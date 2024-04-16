import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function WithAuth(WrappedComponent) {
  return function WithAuth(props) {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        // Redirect to login page if token is not present
        navigate('/login');
      }
    }, [location]);

    return <WrappedComponent {...props} />;
  };
}

export default WithAuth;