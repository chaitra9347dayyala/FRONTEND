import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/authcontext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const { token, user, refreshUserProfile } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    age: '',
    gender: '',
    profession: '',
    phoneNumber: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        fullName: user.fullName || '',
        age: user.age || '',
        gender: user.gender || '',
        profession: user.profession || '',
        phoneNumber: user.phoneNumber || '',
        addressLine1: user.addressLine1 || '',
        addressLine2: user.addressLine2 || '',
        city: user.city || '',
        state: user.state || '',
        country: user.country || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form data:", formData);

    const cleanedData = {
      ...formData,
      age: Number(formData.age),
    };

    try {
      const response = await axios.put(
        'http://localhost:3000/users/profile',
        cleanedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      alert('Profile updated successfully');
      await refreshUserProfile();
      navigate('/');
    } catch (error) {
      console.error('Profile update failed:', error.response?.data || error.message);
      alert('Failed to update profile');
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 border rounded-lg shadow bg-white">
      <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" className="border p-2 rounded" required />
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="border p-2 rounded" required />
        <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" className="border p-2 rounded" />
        <input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="Age" className="border p-2 rounded" />
        <input type="text" name="gender" value={formData.gender} onChange={handleChange} placeholder="Gender" className="border p-2 rounded" />
        <input type="text" name="profession" value={formData.profession} onChange={handleChange} placeholder="Profession" className="border p-2 rounded" />
        <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone Number" className="border p-2 rounded" />
        <input type="text" name="addressLine1" value={formData.addressLine1} onChange={handleChange} placeholder="Address Line 1" className="border p-2 rounded" />
        <input type="text" name="addressLine2" value={formData.addressLine2} onChange={handleChange} placeholder="Address Line 2" className="border p-2 rounded" />
        <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" className="border p-2 rounded" />
        <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="State" className="border p-2 rounded" />
        <input type="text" name="country" value={formData.country} onChange={handleChange} placeholder="Country" className="border p-2 rounded" />

        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
