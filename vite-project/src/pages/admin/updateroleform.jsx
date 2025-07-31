import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/authcontext';
import './UpdateRoleForm.css'; // Optional styling

const softwareRoles = [
  'frontend-developer',
  'backend-developer',
  'fullstack-engineer',
  'devops-engineer',
  'qa-engineer',
  'product-manager',
  'project-manager',
  'ui-ux-designer',
  'tech-lead',
  'software-architect',
];

const UpdateRoleForm = () => {
  const [userId, setUserId] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [message, setMessage] = useState('');
  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        `http://localhost:3000/users/update-role/${userId}`,
        { role: selectedRole },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(response.data.message || 'Role updated successfully');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update role');
    }
  };

  return (
    <div className="update-role-form">
      <h2>Update User Role</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>User ID:</label>
          <input
            type="number"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Select New Role:</label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            required
          >
            <option value="">--Select Role--</option>
            {softwareRoles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Update Role</button>
      </form>
      {message && <p style={{ marginTop: '10px', color: 'green' }}>{message}</p>}
    </div>
  );
};

export default UpdateRoleForm;
