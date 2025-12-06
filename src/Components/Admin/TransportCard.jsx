import React from "react";
import { MapPin, User, WarningCircle } from "phosphor-react";

const TransportCard = ({ vehicle, onClick }) => {
  const hasAlert = vehicle.alerts > 0;

  return (
    <div 
      onClick={onClick}
      className={`relative bg-white rounded-xl border-2 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden ${
        hasAlert ? 'border-orange-300 hover:border-orange-400' : 'border-gray-200 hover:border-indigo-300'
      }`}
    >
      {/* Alert Badge */}
      {hasAlert && (
        <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 z-10 shadow-md">
          <WarningCircle size={14} weight="fill" />
          {vehicle.alerts}
        </div>
      )}

      {/* Landscape Layout */}
      <div className="flex items-center gap-4 p-4">
        
        {/* Vehicle Image */}
        <div className="w-32 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
          <img 
            src={vehicle.image || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRaup3FoAJaMY7_JejHjUrOmW17_HA8VGrYQ&s"} 
            alt={vehicle.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-bold text-gray-800 text-base">{vehicle.name}</h3>
              <p className="text-xs text-gray-500">Plate: {vehicle.plateNo}</p>
            </div>
            <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs font-bold">
              #{vehicle.schoolId}
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <User size={14} className="text-blue-500" />
              <span className="font-medium">{vehicle.driver}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <MapPin size={14} className="text-green-500" />
              <span className="truncate">{vehicle.route}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransportCard;
