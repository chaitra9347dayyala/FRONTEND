import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/authcontext';
import { useNavigate } from 'react-router-dom';

const ViewUsers = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;

    axios
      .get('http://localhost:3000/users/all', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers(res.data))
      .catch((err) => console.error('Error fetching users:', err.response?.data || err.message));
  }, [token]);

  const handleSelect = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const handleDelete = () => {
    axios
      .post(
        'http://localhost:3000/users/delete-many',
        { ids: selectedUsers },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setUsers(users.filter((user) => !selectedUsers.includes(user.id)));
        setSelectedUsers([]);
        setShowConfirm(false);
      })
      .catch((err) => console.error('Delete failed:', err.response?.data || err.message));
  };

  const handleDoubleClick = (id) => {
    navigate(`/admin/user/${id}`);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">All Users</h2>
      {users.map((user) => (
        <div
          key={user.id}
          onDoubleClick={() => handleDoubleClick(user.id)}
          className="border p-4 mb-2 rounded shadow cursor-pointer"
        >
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedUsers.includes(user.id)}
              onChange={() => handleSelect(user.id)}
            />
            <span>{user.username} (ID: {user.id})</span>
          </label>
        </div>
      ))}

      {selectedUsers.length > 0 && (
        <button
          onClick={() => setShowConfirm(true)}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded mt-4"
        >
          Delete Selected
        </button>
      )}

      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-md">
            <p className="mb-4">Are you sure you want to delete selected users?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewUsers;
