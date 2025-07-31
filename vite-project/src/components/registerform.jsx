import React, { useState } from 'react';

export default function RegisterForm({ switchToLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    fullName: '',
    age: '',
    gender: '',
    profession: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'age' ? value.replace(/\D/, '') : value, // allow only digits for age
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      age: parseInt(formData.age, 10), // convert age to number
    };

    try {
      const res = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert('User registered successfully!');
        switchToLogin(); // Show login form
      } else {
        const data = await res.json();
        alert(`Registration failed: ${data.message || data}`);
      }
    } catch (err) {
      console.error('Register error:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="username" onChange={handleChange} placeholder="Username" />
      <input name="password" type="password" onChange={handleChange} placeholder="Password" />
      <input name="email" onChange={handleChange} placeholder="Email" />
      <input name="fullName" onChange={handleChange} placeholder="Full Name" />
      <input
        name="age"
        type="number"
        min="5"
        max="100"
        onChange={handleChange}
        placeholder="Age"
      />
      <input name="gender" onChange={handleChange} placeholder="Gender" />
      <input name="profession" onChange={handleChange} placeholder="Profession" />
      <button type="submit">Register</button>
    </form>
  );
}
