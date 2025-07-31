// src/components/admin/RegisterUserPopup.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/authcontext';

const RegisterUserPopup = ({ onClose }) => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: 'xyz@123',
    email: '',
    fullName: '',
    age: '',
    gender: '',
    profession: ''
  });
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        age: Number(formData.age), // Ensure age is a number
      };

      await axios.post('http://localhost:3000/users/register', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess('User registered successfully');
      setFormData({
        username: '',
        password: 'xyz@123',
        email: '',
        fullName: '',
        age: '',
        gender: '',
        profession: ''
      });
    } catch (err) {
      console.error(err);
      setSuccess('Registration failed');
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-30 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h3 className="text-lg font-bold mb-4">Register New User</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          {['username', 'email', 'fullName', 'gender', 'profession'].map((field) => (
            <input
              key={field}
              type="text"
              placeholder={field}
              value={formData[field]}
              onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
              className="w-full px-3 py-2 border rounded"
              required
            />
          ))}
          <input
            key="age"
            type="number"
            placeholder="age"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            className="w-full px-3 py-2 border rounded"
            required
          />
          <p className="text-sm text-gray-500">Default password: xyz@123</p>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
            Register
          </button>
          {success && <p className="text-green-600">{success}</p>}
        </form>
        <button onClick={onClose} className="mt-3 text-blue-500 underline">Close</button>
      </div>
    </div>
  );
};

export default RegisterUserPopup;
