import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authcontext';

const AdminPanel = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user || user.role !== 'admin') {
    return <div>Unauthorized</div>;
  }

  return (
    <div>
      <nav style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
        <button onClick={() => navigate('/view-users')}>View Users</button>
        <button onClick={() => navigate('/view-user-data')}>View User Data</button>
        <button onClick={() => navigate('/register-user')}>Register User</button>

        <div className="dropdown">
          <button className="dropbtn">{user.username} ⏷</button>
          <div className="dropdown-content">
            <button onClick={() => navigate('/profile')}>View Profile</button>
            <button onClick={() => navigate('/edit-profile')}>Edit Profile</button>
            <button onClick={logout}>Logout</button>
          </div>
        </div>
      </nav>

      <h1>Welcome Admin: {user.username}</h1>
    </div>
  );
};

export default AdminPanel;
