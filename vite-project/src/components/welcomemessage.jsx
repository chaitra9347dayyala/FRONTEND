import React from 'react';

export default function WelcomeMessage({ role }) {
  return (
    <div className="mt-6 text-center text-lg font-semibold text-green-700">
      {role === 'admin' ? 'Welcome Admin' : 'Welcome'}
    </div>
  );
}
