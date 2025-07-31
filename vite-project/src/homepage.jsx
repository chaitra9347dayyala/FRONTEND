// src/HomePage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './components/loginform';
import { useAuth } from './context/authcontext';

const HomePage = () => {
  const navigate = useNavigate();
  const { user, role, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  const toggleDropdown = () => setShowDropdown((prev) => !prev);

  return (
    <div>
      <nav className="navbar">
        <h2>My App</h2>
        <div className="nav-right">
          {user && (
            <>
              <button onClick={() => navigate('/view-data')}>View Data</button>
              <button onClick={() => navigate('/add-data')}>Add Data</button>
              {role === 'admin' && (
                <>
                  <button onClick={() => navigate('/view-users')}>View Users</button>
                  {/* <button onClick={() => navigate('/user-data')}>User Data</button> */}
                  <button onClick={() => navigate('/update-role/:id')}>UpdateRoleForm</button>
                  <button onClick={() => navigate('/admin-register')}>Register User</button>
                </>
              )}
            </>
          )}
          <div className="user-section">
            {user ? (
              <div className="user-dropdown">
                <button onClick={toggleDropdown}>
                  {user.username} ⬇️
                </button>
                {showDropdown && (
                  <div className="dropdown-menu">
                    <button
                      onClick={() => {
                        navigate('/view-profile');
                        setShowDropdown(false);
                      }}
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => {
                        navigate('/edit-profile');
                        setShowDropdown(false);
                      }}
                    >
                      Edit Profile
                    </button>
                    <button onClick={handleLogout}>Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => setShowLogin(true)}>Login</button>
            )}
          </div>
        </div>
      </nav>

      {showLogin && !user && (
        <LoginForm onClose={() => setShowLogin(false)} />
      )}
    </div>
  );
};

export default HomePage;
