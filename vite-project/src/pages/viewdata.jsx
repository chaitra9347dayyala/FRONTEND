import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/authcontext';
import { useNavigate } from 'react-router-dom';

const ViewData = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [dataList, setDataList] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:3000/user-data', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDataList(res.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDelete = async () => {
    if (selectedIds.length === 0) {
      alert('Please select at least one item to delete.');
      return;
    }

    const confirmed = window.confirm('Are you sure you want to delete selected items?');
    if (!confirmed) return;

    try {
      const res = await axios.post(
        'http://localhost:3000/user-data/delete-many',
        { ids: selectedIds },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Deleted:', res.data);
      fetchData();
      setSelectedIds([]);
    } catch (err) {
      console.error('Error deleting data:', err);
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = dataList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(dataList.length / itemsPerPage);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Your Uploaded Data</h2>
      <div className="mb-4">
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Delete Selected
        </button>
      </div>

      {currentItems.length === 0 ? (
        <p>No data found.</p>
      ) : (
        <ul className="space-y-4">
          {currentItems.map((item) => (
            <li key={item.id} className="border p-4 rounded flex items-center justify-between">
              <div>
                <p><strong>Type:</strong> {item.type}</p>
                <p><strong>Object:</strong> {item.object}</p>
              </div>
              <input
                type="checkbox"
                checked={selectedIds.includes(item.id)}
                onChange={() => handleCheckboxChange(item.id)}
              />
            </li>
          ))}
        </ul>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ViewData;
