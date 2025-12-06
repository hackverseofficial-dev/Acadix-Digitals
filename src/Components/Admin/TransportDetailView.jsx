import React, { useState } from "react";
import { ArrowLeft, PencilSimple, Plus, Trash, User, CalendarBlank, FileText, CheckCircle, XCircle } from "phosphor-react";

const TransportDetailView = ({ vehicle, onBack }) => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Dummy students list
  const [students, setStudents] = useState([
    { id: 1, name: "Rohan Sharma", class: "10-A", roll: 101 },
    { id: 2, name: "Priya Patel", class: "10-B", roll: 102 },
  ]);

  // Check expiry status
  const checkExpiry = (date) => {
    const today = new Date();
    const expiryDate = new Date(date);
    const diffDays = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const ExpiryBadge = ({ date, label }) => {
    const days = checkExpiry(date);
    const isExpired = days < 0;
    const isNearExpiry = days >= 0 && days <= 30;

    return (
      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
        <p className="text-xs text-gray-500 uppercase font-bold mb-1">{label}</p>
        <p className="text-sm font-bold text-gray-800 mb-1">{date}</p>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
          isExpired ? 'bg-red-100 text-red-600' : isNearExpiry ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
        }`}>
          {isExpired ? 'EXPIRED' : isNearExpiry ? `${days} days left` : 'Valid'}
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full animate-fade-in overflow-hidden">
      
      {/* Header */}
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition">
            <ArrowLeft size={24} className="text-gray-500" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{vehicle.name}</h2>
            <p className="text-xs text-gray-500">Vehicle Details & Students</p>
          </div>
        </div>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition font-bold text-sm"
        >
          <PencilSimple size={18} /> {isEditing ? 'Save' : 'Edit'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          
          {/* LEFT: Driver Details */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
            <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
              <User size={18} className="text-blue-500" /> Driver Information
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 font-bold uppercase">Name</label>
                <input 
                  type="text" 
                  defaultValue={vehicle.driver} 
                  disabled={!isEditing}
                  className="w-full mt-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-800 disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-bold uppercase">License No.</label>
                <input 
                  type="text" 
                  defaultValue={vehicle.licenseNo || "DL-XXXXXXXX"} 
                  disabled={!isEditing}
                  className="w-full mt-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-bold uppercase">Contact</label>
                <input 
                  type="text" 
                  defaultValue={vehicle.driverContact || "+91 98765 43210"} 
                  disabled={!isEditing}
                  className="w-full mt-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 disabled:bg-gray-100"
                />
              </div>
            </div>
          </div>

          {/* RIGHT: Vehicle Documents */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
            <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
              <FileText size={18} className="text-green-500" /> Vehicle Documents
            </h3>
            <div className="space-y-3">
              <ExpiryBadge date="15 Jan 2026" label="Insurance Expiry" />
              <ExpiryBadge date="05 Dec 2025" label="Pollution Certificate" />
              <ExpiryBadge date="20 Mar 2027" label="RC Valid Till" />
              
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Registration No.</p>
                <p className="text-sm font-bold text-gray-800">{vehicle.plateNo}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Students Section */}
        <div className="px-6 pb-6">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-sm font-bold text-gray-700">Students Using This Vehicle</h3>
              <button className="flex items-center gap-1 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100">
                <Plus size={14} /> Add Student
              </button>
            </div>

            <div className="divide-y divide-gray-100">
              {students.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                      {student.roll}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-800">{student.name}</h4>
                      <p className="text-xs text-gray-500">Class {student.class}</p>
                    </div>
                  </div>
                  <button className="p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition">
                    <Trash size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default TransportDetailView;
