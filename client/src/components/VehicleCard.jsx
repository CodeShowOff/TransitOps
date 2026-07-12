import React from 'react';

const VehicleCard = ({ vehicle, onClick }) => {
  return (
    <div 
      className="p-4 bg-white border border-gray-200 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onClick(vehicle)}
    >
      <div className="flex items-center justify-between mb-2">
        <h5 className="text-xl font-bold tracking-tight text-gray-900 uppercase">
          {vehicle.registrationNumber}
        </h5>
        <span className={`px-2 py-1 text-xs font-medium border rounded-full ${
          vehicle.status === 'Available' ? 'bg-green-100 text-green-800 border-green-200' :
          vehicle.status === 'On Trip' ? 'bg-blue-100 text-blue-800 border-blue-200' :
          vehicle.status === 'In Shop' ? 'bg-orange-100 text-orange-800 border-orange-200' :
          'bg-red-100 text-red-800 border-red-200'
        }`}>
          {vehicle.status}
        </span>
      </div>
      <p className="mb-1 text-sm text-gray-700">
        <span className="font-semibold">Model:</span> {vehicle.model}
      </p>
      <p className="mb-1 text-sm text-gray-700">
        <span className="font-semibold">Type:</span> {vehicle.type}
      </p>
      <p className="mb-1 text-sm text-gray-700">
        <span className="font-semibold">Capacity:</span> {vehicle.maxLoadCapacity} kg
      </p>
    </div>
  );
};

export default VehicleCard;
