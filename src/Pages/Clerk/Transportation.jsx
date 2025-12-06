import React, { useState } from "react";
import ClerkSidebar from "../../Components/Clerk/ClerkSidebar";
import TransportCard from "../../Components/Admin/TransportCard"; // Reusing Admin Component
import TransportDetailView from "../../Components/Admin/TransportDetailView"; // Reusing Admin Component
import { Bus, Bell, Plus } from "phosphor-react";

const Transportation = () => {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Dummy Data State (Local CRUD ke liye)
  const [vehicles, setVehicles] = useState([
    { id: 1, name: "Blue Line Express", plateNo: "DL-1XX-5678", schoolId: "BUS-01", driver: "Rajesh Kumar", route: "Sector 15 → School", image: "", alerts: 2 },
    { id: 2, name: "Green Valley", plateNo: "HR-2YY-1234", schoolId: "BUS-02", driver: "Suresh Singh", route: "Main Road → School", image: "", alerts: 0 },
  ]);

  // New Vehicle Form State
  const [newVehicleData, setNewVehicleData] = useState({
    name: "", plateNo: "", schoolId: "", driver: "", route: ""
  });

  const handleAddNew = () => {
    const newV = { ...newVehicleData, id: Date.now(), alerts: 0, image: "" };
    setVehicles([...vehicles, newV]);
    setIsAddingNew(false);
    setNewVehicleData({ name: "", plateNo: "", schoolId: "", driver: "", route: "" });
  };

  const totalAlerts = vehicles.reduce((sum, v) => sum + v.alerts, 0);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <ClerkSidebar />

      <main className="flex-1 p-6 overflow-hidden flex flex-col">
        
        {/* Header */}
        <header className="mb-6 flex justify-between items-end shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Bus size={32} className="text-blue-600" weight="duotone" />
              Transportation Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">Manage fleet, drivers & students</p>
          </div>

          <div className="flex gap-3">
             {/* Add Button */}
             <button 
               onClick={() => setIsAddingNew(true)}
               className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition"
             >
                <Plus size={20} weight="bold" /> Add Vehicle
             </button>

             {/* Notification Bell */}
             <div className="relative">
               <button className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition relative">
                 <Bell size={24} className="text-gray-600" weight="duotone" />
                 {totalAlerts > 0 && (
                   <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                     {totalAlerts}
                   </span>
                 )}
               </button>
             </div>
          </div>
        </header>

        {/* MAIN CONTENT AREA */}
        <section className="flex-1 overflow-y-auto custom-scrollbar relative">
          
          {/* MODAL: Add New Vehicle */}
          {isAddingNew && (
             <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-100 w-full max-w-lg animate-fade-in">
                   <h2 className="text-xl font-bold mb-6 text-gray-800">Add New Transport Vehicle</h2>
                   <div className="space-y-4">
                      <div>
                         <label className="text-xs font-bold text-gray-500 uppercase">Vehicle Name / Type</label>
                         <input type="text" className="w-full border border-gray-300 p-2 rounded-lg mt-1" placeholder="e.g. Yellow Bus 1"
                            value={newVehicleData.name} onChange={e => setNewVehicleData({...newVehicleData, name: e.target.value})} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Plate No.</label>
                            <input type="text" className="w-full border border-gray-300 p-2 rounded-lg mt-1" placeholder="DL-1C-0000"
                               value={newVehicleData.plateNo} onChange={e => setNewVehicleData({...newVehicleData, plateNo: e.target.value})} />
                         </div>
                         <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">School ID</label>
                            <input type="text" className="w-full border border-gray-300 p-2 rounded-lg mt-1" placeholder="BUS-01"
                               value={newVehicleData.schoolId} onChange={e => setNewVehicleData({...newVehicleData, schoolId: e.target.value})} />
                         </div>
                      </div>
                      <div>
                         <label className="text-xs font-bold text-gray-500 uppercase">Driver Name</label>
                         <input type="text" className="w-full border border-gray-300 p-2 rounded-lg mt-1" placeholder="Driver Name"
                            value={newVehicleData.driver} onChange={e => setNewVehicleData({...newVehicleData, driver: e.target.value})} />
                      </div>
                      <div>
                         <label className="text-xs font-bold text-gray-500 uppercase">Route</label>
                         <input type="text" className="w-full border border-gray-300 p-2 rounded-lg mt-1" placeholder="Start Point -> End Point"
                            value={newVehicleData.route} onChange={e => setNewVehicleData({...newVehicleData, route: e.target.value})} />
                      </div>
                      
                      <div className="flex gap-3 pt-4">
                         <button onClick={() => setIsAddingNew(false)} className="flex-1 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100">Cancel</button>
                         <button onClick={handleAddNew} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg">Save Vehicle</button>
                      </div>
                   </div>
                </div>
             </div>
          )}

          {selectedVehicle ? (
            <TransportDetailView 
              vehicle={selectedVehicle} 
              onBack={() => setSelectedVehicle(null)} 
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-6">
              {vehicles.map((v) => (
                <TransportCard key={v.id} vehicle={v} onClick={() => setSelectedVehicle(v)} />
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
};

export default Transportation;
