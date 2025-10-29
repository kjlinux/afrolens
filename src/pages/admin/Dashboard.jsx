import React from 'react';

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard Admin</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600">Utilisateurs</h3>
          <p className="text-3xl font-bold">145</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600">Photos</h3>
          <p className="text-3xl font-bold">69</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600">Revenus</h3>
          <p className="text-3xl font-bold">5,420€</p>
        </div>
      </div>
    </div>
  );
}
