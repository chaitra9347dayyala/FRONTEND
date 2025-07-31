import React, { useState } from 'react';
import api from '../api/axios';

const AddData = () => {
  const [type, setType] = useState('text');
  const [content, setContent] = useState('');

  const handleAdd = async () => {
    if (type !== 'text') {
      alert('Only text type is supported for now.');
      return;
    }

    if (!content.trim()) {
      alert('Please enter some text');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const payload = {
        object: content.trim(), // ✅ this matches backend DTO
      };

      await api.post('/user-data', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('Data added successfully!');
      setContent('');
    } catch (error) {
      console.error('Error adding data:', error.response?.data || error.message);
      alert('Failed to add data');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-2">Add Data</h2>

      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
      >
        <option value="text">Text</option>
        <option value="image" disabled>Image (coming soon)</option>
        <option value="video" disabled>Video (coming soon)</option>
      </select>

      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter text"
        className="w-full mb-2 p-2 border rounded"
      />

      <button
        onClick={handleAdd}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Add
      </button>
    </div>
  );
};

export default AddData;
