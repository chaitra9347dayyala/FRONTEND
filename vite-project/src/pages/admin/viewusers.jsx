// src/components/admin/ViewUsers.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/authcontext';

const ViewUsers = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:3000/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      setError('Error fetching users');
    }
  };

  const handleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const handleDelete = async () => {
    try {
      await axios.post(
        'http://localhost:3000/users/delete-many',
        { ids: selected },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
      setSelected([]);
      setConfirmDelete(false);
    } catch (err) {
      setError('Delete failed');
      console.error('Delete error:', err.response?.data || err.message);
    }
  };

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const paginatedUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">All Users</h2>
      {error && <p className="text-red-500">{error}</p>}

      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Select</th>
            <th className="p-2">ID</th>
            <th className="p-2">Username</th>
            <th className="p-2">Email</th>
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.map((u) => (
            <tr key={u.id} className="border-t">
              <td className="text-center">
                <input
                  type="checkbox"
                  checked={selected.includes(u.id)}
                  onChange={() => handleSelect(u.id)}
                />
              </td>
              <td className="p-2">{u.id}</td>
              <td className="p-2">{u.username}</td>
              <td className="p-2">{u.email}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1 ? 'bg-blue-500 text-white' : ''
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {selected.length > 0 && (
        <div className="mt-4">
          <button
            className="bg-red-600 text-white px-4 py-2 rounded"
            onClick={() => setConfirmDelete(true)}
          >
            Delete Selected
          </button>
        </div>
      )}

      {confirmDelete && (
        <div className="mt-4 p-4 border bg-red-100">
          <p>Are you sure you want to delete selected users?</p>
          <button
            onClick={handleDelete}
            className="bg-red-700 text-white px-3 py-1 rounded mr-2 mt-2"
          >
            Confirm
          </button>
          <button
            onClick={() => setConfirmDelete(false)}
            className="bg-gray-400 px-3 py-1 rounded mt-2"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default ViewUsers;
