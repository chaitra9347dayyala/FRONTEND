// src/components/ViewProfile.jsx
import React from 'react';
import { useAuth } from '../context/authcontext';

const ViewProfile = () => {
  const { user } = useAuth();

  if (!user) {
    return <p>Loading profile...</p>;
  }

  return (
    <div>
      <h2>View Profile</h2>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Full Name:</strong> {user.fullName}</p>
      <p><strong>Age:</strong> {user.age}</p>
      <p><strong>Gender:</strong> {user.gender}</p>
      <p><strong>Profession:</strong> {user.profession}</p>
      <p><strong>Phone Number:</strong> {user.phoneNumber}</p>
      <p><strong>Address Line 1:</strong> {user.addressLine1}</p>
      <p><strong>Address Line 2:</strong> {user.addressLine2}</p>
      <p><strong>City:</strong> {user.city}</p>
      <p><strong>State:</strong> {user.state}</p>
      <p><strong>Country:</strong> {user.country}</p>
    </div>
  );
};

export default ViewProfile;
