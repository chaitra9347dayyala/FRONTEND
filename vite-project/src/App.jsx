// src/App.jsx
import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import { useAuth } from './context/authcontext';
import LoginForm from './components/loginform';
import RegisterForm from './components/registerform';
import HomePage from './homepage';
import ViewProfile from './pages/viewprofile';
import EditProfile from './pages/editprofile';
import AddData from './pages/adddata';
import ViewData from './pages/viewdata';
import ViewUsers from './pages/admin/viewusers';
import UserData from './pages/admin/viewuserdata';
import AdminRegisterUser from './pages/admin/register user';
import ProtectedRoute from './routes/protectedroutes';

function App() {
  const { user, logout, role } = useAuth();
  const [showLogin, setShowLogin] = React.useState(false);
  const [showRegister, setShowRegister] = React.useState(false);

  return (
    <>
      <div className="navbar">
        <Link to="/">Home</Link>

        {user && (
          <>
            <Link to="/view-data">View Data</Link>
            <Link to="/add-data">Add Data</Link>
            {role === 'admin' && (
              <>
                <Link to="/view-users">View Users</Link>
                <Link to="/user-data">User Data</Link> 
                <Link to="/admin-register">Register User</Link>
              </>
            )}
          </>
        )}

        <div className="login-section">
          {!user ? (
            <>
              <button onClick={() => setShowLogin(true)}>Login</button>
              <button onClick={() => setShowRegister(true)}>Register</button>
            </>
          ) : (
            <div className="dropdown">
              <span>{user.username} ▼</span>
              <div className="dropdown-content">
                <Link to="/view-profile">View Profile</Link>
                <Link to="/edit-profile">Edit Profile</Link>
                <button onClick={logout}>Logout</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showLogin && <LoginForm onClose={() => setShowLogin(false)} />}
      {showRegister && <RegisterForm onClose={() => setShowRegister(false)} />}

      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/view-profile" element={<ProtectedRoute><ViewProfile /></ProtectedRoute>} />
        <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
        <Route path="/add-data" element={<ProtectedRoute><AddData /></ProtectedRoute>} />
        <Route path="/view-data" element={<ProtectedRoute><ViewData /></ProtectedRoute>} />
        <Route path="/view-users" element={<ProtectedRoute allowedRoles={['admin']}><ViewUsers /></ProtectedRoute>} />
        <Route path="/user-data" element={<ProtectedRoute allowedRoles={['admin']}><UserData /></ProtectedRoute>} /> 
        <Route path="/admin-register" element={<ProtectedRoute allowedRoles={['admin']}><AdminRegisterUser /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

export default App;
