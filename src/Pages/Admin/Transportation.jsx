import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/Admin/Sidebar";
import { db } from "../../firebase"; // Firebase Import
import { ref, onValue, push, remove } from "firebase/database";
import { Bus, Bell, Plus, MapPin, User, Phone, Trash, X } from "phosphor-react";

const Transportation = () => {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [form, setForm] = useState({
     name: "", plateNo: "", driver: "", phone: "", route: "", schoolId: "", alerts: 0
  });

  // --- 1. FETCH VEHICLES (Real-time) ---
  useEffect(() => {
    const transportRef = ref(db, 'transport');
    const unsubscribe = onValue(transportRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
         const list = Object.keys(data).map(key => ({ id: key, ...data[key] }));
         setVehicles(list);
      } else {
         setVehicles([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // --- 2. ADD VEHICLE ---
  const handleAdd = async (e) => {
     e.preventDefault();
     await push(ref(db, 'transport'), form);
     setShowModal(false);
     setForm({ name: "", plateNo: "", driver: "", phone: "", route: "", schoolId: "", alerts: 0 });
  };

  // --- 3. DELETE VEHICLE ---
  const handleDelete = async (id) => {
     if(window.confirm("Delete this vehicle permanently?")) {
        await remove(ref(db, `transport/${id}`));
        setSelectedVehicle(null); // Close detail view if open
     }
  };

  const totalAlerts = vehicles.reduce((sum, v) => sum + (v.alerts || 0), 0);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />

      <main className="flex-1 p-6 overflow-hidden flex flex-col">
        
        {/* Header */}
        <header className="mb-6 flex justify-between items-end shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Bus size={32} className="text-blue-600" weight="duotone" />
              Transportation
            </h1>
            <p className="text-sm text-gray-500 mt-1">Manage vehicles, drivers & routes</p>
          </div>

          <div className="flex gap-3">
             <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-sm hover:bg-blue-700 transition">
                <Plus weight="bold"/> Add Vehicle
             </button>
             
             {/* Notification Bell */}
             <div className="relative">
               <button className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition relative">
                 <Bell size={24} className="text-gray-600" weight="duotone" />
                 {totalAlerts > 0 && (
                   <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
                     {totalAlerts}
                   </span>
                 )}
               </button>
             </div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto custom-scrollbar">
          {loading ? (
             <div className="text-center py-20 text-gray-400 animate-pulse">Loading Fleet Data...</div>
          ) : selectedVehicle ? (
            // DETAIL VIEW (Simple Inline Component)
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 animate-fade-in">
               <div className="flex justify-between mb-6">
                  <button onClick={() => setSelectedVehicle(null)} className="text-sm font-bold text-gray-500 hover:text-gray-800">← Back to Fleet</button>
                  <button onClick={() => handleDelete(selectedVehicle.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg"><Trash size={20}/></button>
               </div>
               
               <div className="flex gap-8">
                  <div className="w-1/3 bg-gray-100 rounded-xl h-48 flex items-center justify-center text-gray-400">
                     <Bus size={64} weight="duotone"/>
                  </div>
                  <div className="flex-1 space-y-4">
                     <div>
                        <h2 className="text-2xl font-bold text-gray-800">{selectedVehicle.name}</h2>
                        <p className="text-gray-500 font-mono">{selectedVehicle.plateNo} • ID: {selectedVehicle.schoolId}</p>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                           <p className="text-xs font-bold text-gray-400 uppercase mb-1">Driver</p>
                           <div className="flex items-center gap-2 font-bold text-gray-700">
                              <User size={18}/> {selectedVehicle.driver}
                           </div>
                           <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                              <Phone size={14}/> {selectedVehicle.phone}
                           </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                           <p className="text-xs font-bold text-gray-400 uppercase mb-1">Route</p>
                           <div className="flex items-start gap-2 text-sm text-gray-700">
                              <MapPin size={18} className="text-red-500 shrink-0"/> 
                              {selectedVehicle.route}
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          ) : (
            // LIST VIEW
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-6">
              {vehicles.map((v) => (
                <div 
                  key={v.id} 
                  onClick={() => setSelectedVehicle(v)}
                  className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer group relative"
                >
                   <div className="flex justify-between items-start mb-3">
                      <div className="bg-blue-50 text-blue-600 p-3 rounded-xl"><Bus size={24} weight="duotone"/></div>
                      {v.alerts > 0 && <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-lg">{v.alerts} Alerts</span>}
                   </div>
                   <h3 className="font-bold text-gray-800 text-lg">{v.name}</h3>
                   <p className="text-sm text-gray-500 mb-4">{v.plateNo}</p>
                   <div className="pt-4 border-t border-gray-100 flex justify-between text-sm text-gray-600">
                      <span className="flex items-center gap-1"><User size={16}/> {v.driver}</span>
                      <span className="font-bold text-blue-600">View Details →</span>
                   </div>
                </div>
              ))}
              {vehicles.length === 0 && <p className="col-span-full text-center text-gray-400 py-10">No vehicles found.</p>}
            </div>
          )}
        </section>

        {/* ADD MODAL */}
        {showModal && (
           <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
              <form onSubmit={handleAdd} className="bg-white p-6 rounded-2xl w-full max-w-md space-y-4 animate-fade-in">
                 <div className="flex justify-between"><h3 className="font-bold text-lg">Add New Vehicle</h3><button type="button" onClick={()=>setShowModal(false)}><X size={24}/></button></div>
                 
                 <div className="grid grid-cols-2 gap-3">
                    <input required placeholder="Bus Name (e.g. Bus 1)" className="border p-2 rounded-lg w-full" value={form.name} onChange={e=>setForm({...form, name: e.target.value})}/>
                    <input required placeholder="Plate No (DL-1C...)" className="border p-2 rounded-lg w-full" value={form.plateNo} onChange={e=>setForm({...form, plateNo: e.target.value})}/>
                 </div>
                 <input required placeholder="School ID (BUS-01)" className="border p-2 rounded-lg w-full" value={form.schoolId} onChange={e=>setForm({...form, schoolId: e.target.value})}/>
                 
                 <div className="grid grid-cols-2 gap-3">
                    <input required placeholder="Driver Name" className="border p-2 rounded-lg w-full" value={form.driver} onChange={e=>setForm({...form, driver: e.target.value})}/>
                    <input required placeholder="Phone Number" className="border p-2 rounded-lg w-full" value={form.phone} onChange={e=>setForm({...form, phone: e.target.value})}/>
                 </div>

                 <textarea required placeholder="Route (e.g. Sector 15 -> Main Road -> School)" className="border p-2 rounded-lg w-full h-20" value={form.route} onChange={e=>setForm({...form, route: e.target.value})}/>
                 
                 <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700">Add Vehicle</button>
              </form>
           </div>
        )}

      </main>
    </div>
  );
};

export default Transportation;
