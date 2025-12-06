import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/Admin/Sidebar";
import { db } from "../../firebase";
import { ref, onValue, update, get, child } from "firebase/database";
import { 
  CalendarBlank, Clock, User, ChalkboardTeacher, PencilSimple, Check, X, FunnelSimple 
} from "phosphor-react";

const Timetable = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null); // e.g., "10-A"
  const [timetableData, setTimetableData] = useState({}); // { "Monday": { "1": { subject: "Math", teacher: "Mr. X" } } }
  const [loading, setLoading] = useState(false);
  
  // Edit Modal State
  const [editModal, setEditModal] = useState(null); // { day: "Monday", period: 1, data: {...} }
  const [formData, setFormData] = useState({ subject: "", teacher: "" });

  // --- 1. FETCH CLASS LIST ---
  useEffect(() => {
    const fetchClasses = async () => {
       const snapshot = await get(child(ref(db), 'classes'));
       if (snapshot.exists()) {
          const data = snapshot.val();
          const list = Object.values(data).map(c => `${c.className}-${c.section}`);
          setClasses(list);
          if (list.length > 0) setSelectedClass(list[0]); // Auto select first
       }
    };
    fetchClasses();
  }, []);

  // --- 2. FETCH TIMETABLE (Real-time) ---
  useEffect(() => {
    if (!selectedClass) return;
    setLoading(true);
    
    // Path: timetables/10-A
    const unsubscribe = onValue(ref(db, `timetables/${selectedClass}`), (snapshot) => {
       setTimetableData(snapshot.val() || {});
       setLoading(false);
    });
    return () => unsubscribe();
  }, [selectedClass]);

  // --- 3. SAVE TIMETABLE SLOT ---
  const handleSaveSlot = async () => {
     if(!editModal) return;
     const { day, period } = editModal;
     
     // Update path: timetables/10-A/Monday/1
     const updates = {};
     updates[`timetables/${selectedClass}/${day}/${period}`] = {
        subject: formData.subject,
        teacher: formData.teacher
     };

     await update(ref(db), updates);
     setEditModal(null);
  };

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const periods = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />

      <main className="flex-1 p-6 overflow-hidden flex flex-col">
        
        {/* Header */}
        <header className="mb-6 flex justify-between items-center shrink-0">
           <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                 <CalendarBlank size={32} className="text-indigo-600" weight="duotone"/> Class Timetable
              </h1>
              <p className="text-sm text-gray-500">Manage Weekly Schedule</p>
           </div>

           {/* Class Selector */}
           <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
              <FunnelSimple size={20} className="text-gray-400 ml-2"/>
              <select 
                 value={selectedClass || ""} 
                 onChange={(e) => setSelectedClass(e.target.value)}
                 className="outline-none text-sm font-bold text-gray-700 bg-transparent pr-4 cursor-pointer"
              >
                 {classes.map(c => <option key={c} value={c}>Class {c}</option>)}
                 {classes.length === 0 && <option>Loading Classes...</option>}
              </select>
           </div>
        </header>

        {/* TIMETABLE GRID */}
        <section className="flex-1 overflow-auto custom-scrollbar bg-white rounded-2xl shadow-sm border border-gray-200 relative">
           {loading ? (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">Loading Schedule...</div>
           ) : (
              <div className="min-w-[1000px] p-6">
                 {/* Periods Header */}
                 <div className="grid grid-cols-9 gap-4 mb-4 text-center">
                    <div className="font-bold text-gray-400 uppercase text-xs py-2">Day / Period</div>
                    {periods.map(p => (
                       <div key={p} className="bg-gray-50 rounded-lg py-2 text-xs font-bold text-gray-500 uppercase">
                          Period {p}
                       </div>
                    ))}
                 </div>

                 {/* Days Rows */}
                 {days.map(day => (
                    <div key={day} className="grid grid-cols-9 gap-4 mb-4">
                       {/* Day Name */}
                       <div className="flex items-center justify-center font-bold text-gray-700 bg-indigo-50 rounded-xl text-sm">
                          {day}
                       </div>

                       {/* Slots */}
                       {periods.map(period => {
                          const slotData = timetableData[day]?.[period];
                          return (
                             <div 
                                key={`${day}-${period}`}
                                onClick={() => {
                                   setEditModal({ day, period, data: slotData });
                                   setFormData({ subject: slotData?.subject || "", teacher: slotData?.teacher || "" });
                                }}
                                className={`
                                   h-24 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all group relative
                                   ${slotData ? 'border-indigo-200 bg-white hover:border-indigo-400 hover:shadow-md' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'}
                                `}
                             >
                                {slotData ? (
                                   <>
                                      <span className="text-sm font-bold text-indigo-700">{slotData.subject}</span>
                                      <span className="text-[10px] text-gray-500 mt-1 flex items-center gap-1">
                                         <User size={10}/> {slotData.teacher}
                                      </span>
                                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
                                         <PencilSimple size={14} className="text-gray-400"/>
                                      </div>
                                   </>
                                ) : (
                                   <span className="text-xs text-gray-300 font-medium group-hover:text-gray-500">Empty</span>
                                )}
                             </div>
                          );
                       })}
                    </div>
                 ))}
              </div>
           )}
        </section>

        {/* EDIT SLOT MODAL */}
        {editModal && (
           <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
                 <div className="flex justify-between items-center mb-6">
                    <div>
                       <h3 className="font-bold text-lg text-gray-800">Edit Schedule</h3>
                       <p className="text-xs text-gray-500 font-medium">{editModal.day} • Period {editModal.period}</p>
                    </div>
                    <button onClick={() => setEditModal(null)} className="text-gray-400 hover:text-red-500"><X size={24}/></button>
                 </div>

                 <div className="space-y-4">
                    <div>
                       <label className="text-xs font-bold text-gray-500 uppercase">Subject</label>
                       <input 
                          autoFocus
                          type="text" 
                          placeholder="e.g. Mathematics" 
                          className="w-full border p-3 rounded-xl mt-1 outline-none focus:border-indigo-500 transition font-bold text-gray-700"
                          value={formData.subject}
                          onChange={e => setFormData({...formData, subject: e.target.value})}
                       />
                    </div>
                    <div>
                       <label className="text-xs font-bold text-gray-500 uppercase">Teacher</label>
                       <div className="relative">
                          <User className="absolute top-3.5 left-3 text-gray-400" size={18}/>
                          <input 
                             type="text" 
                             placeholder="Teacher's Name" 
                             className="w-full border p-3 pl-10 rounded-xl mt-1 outline-none focus:border-indigo-500 transition text-gray-700"
                             value={formData.teacher}
                             onChange={e => setFormData({...formData, teacher: e.target.value})}
                          />
                       </div>
                    </div>

                    <div className="flex gap-3 mt-4">
                       {editModal.data && (
                          <button 
                             onClick={() => {
                                setFormData({ subject: "", teacher: "" }); // Clear local
                                handleSaveSlot(); // Save empty
                             }}
                             className="flex-1 py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition"
                          >
                             Clear Slot
                          </button>
                       )}
                       <button 
                          onClick={handleSaveSlot}
                          className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
                       >
                          Save Changes
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        )}

      </main>
    </div>
  );
};

export default Timetable;
