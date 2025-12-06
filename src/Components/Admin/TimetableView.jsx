import React, { useState } from "react";
import { ArrowLeft, CaretLeft, CaretRight, PencilSimple, FloppyDisk, Plus, Users, GearSix, WarningCircle } from "phosphor-react";

const TimetableView = ({ classData, onBack }) => {
  // 1. SETUP MODE (Initial Choice)
  // Values: 'NOT_SET' | 'FIXED' | 'WEEKLY' | 'DAILY'
  const [scheduleType, setScheduleType] = useState("FIXED"); 
  const [showSettings, setShowSettings] = useState(false);

  const [viewMode, setViewMode] = useState("Daily"); // View toggle
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isEditing, setIsEditing] = useState(false);

  // Dummy Data (Ab ye structure change ho sakta hai type ke hisaab se)
  const [schedule, setSchedule] = useState([
    { id: 1, time: "09:00 - 10:00", subject: "Mathematics", teacher: "Rakesh Kumar", type: "Lecture", isProxy: false },
    { id: 2, time: "10:00 - 11:00", subject: "Physics", teacher: "Suresh Singh", type: "Lab", isProxy: false },
    { id: 3, time: "11:00 - 11:15", subject: "Break", teacher: "-", type: "Break", isProxy: false },
    { id: 4, time: "11:15 - 12:15", subject: "English", teacher: "Anjali Ma'am", type: "Lecture", isProxy: false },
  ]);

  const changeDate = (days) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  // Handle Proxy / Edit
  const handleEditChange = (id, field, value) => {
    const updatedSchedule = schedule.map((slot) => 
      slot.id === id ? { ...slot, [field]: value } : slot
    );
    setSchedule(updatedSchedule);
  };

  // Mark as Proxy (Substitute)
  const markAsProxy = (id) => {
    const updatedSchedule = schedule.map((slot) => 
      slot.id === id ? { ...slot, isProxy: !slot.isProxy } : slot
    );
    setSchedule(updatedSchedule);
  };

  const formattedDate = currentDate.toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'short'
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full animate-fade-in relative">
      
      {/* HEADER */}
      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Class {classData.className}</h2>
            <div className="flex items-center gap-2 text-xs text-gray-500">
               <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-bold uppercase">{scheduleType} MODE</span>
               <span>• {classData.classTeacher}</span>
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-3">
           <button 
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg border border-transparent hover:border-gray-200 transition"
              title="Change Timetable Type"
           >
              <GearSix size={20} />
           </button>

           <button 
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition ${isEditing ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
           >
              {isEditing ? <><FloppyDisk size={18} /> Save Changes</> : <><PencilSimple size={18} /> Manage / Proxy</>}
           </button>
        </div>
      </div>

      {/* SETTINGS DROPDOWN (Type Change Karne Ke Liye) */}
      {showSettings && (
         <div className="bg-gray-50 p-4 border-b border-gray-200 animate-fade-in">
            <h3 className="text-sm font-bold text-gray-700 mb-2">Timetable Configuration</h3>
            <div className="flex gap-4">
               {['FIXED', 'WEEKLY', 'DAILY'].map((type) => (
                  <button
                     key={type}
                     onClick={() => { setScheduleType(type); setShowSettings(false); }}
                     className={`px-4 py-2 rounded-lg text-sm font-medium border ${scheduleType === type ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-600 border-gray-300 hover:border-purple-400'}`}
                  >
                     {type === 'FIXED' && "Fixed (Same Everyday)"}
                     {type === 'WEEKLY' && "Weekly (Mon-Sat)"}
                     {type === 'DAILY' && "Daily (Dynamic)"}
                  </button>
               ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">
               *Changing this will reset the current structure.
            </p>
         </div>
      )}

      {/* DATE NAVIGATOR (Agar Fixed nahi hai to date change zaroori hai) */}
      <div className="flex items-center justify-center gap-6 py-3 bg-white border-b border-gray-100">
           <button onClick={() => changeDate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition text-gray-600"><CaretLeft size={20} /></button>
           <span className="text-base font-bold text-gray-700 min-w-[150px] text-center">{formattedDate}</span>
           <button onClick={() => changeDate(1)} className="p-2 hover:bg-gray-100 rounded-full transition text-gray-600"><CaretRight size={20} /></button>
      </div>

      {/* TIMETABLE SLOTS */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
         <div className="space-y-3 max-w-4xl mx-auto">
            {schedule.map((slot) => (
               <div 
                  key={slot.id} 
                  className={`flex flex-col md:flex-row items-center gap-4 p-4 rounded-xl border shadow-sm transition-all relative overflow-hidden ${
                     slot.type === 'Break' 
                     ? 'bg-yellow-50 border-yellow-200' 
                     : slot.isProxy 
                        ? 'bg-orange-50 border-orange-300' 
                        : 'bg-white border-gray-200'
                  }`}
               >
                  {/* Proxy Indicator Strip */}
                  {slot.isProxy && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-orange-500"></div>}

                  {/* Time */}
                  <div className="w-full md:w-32 text-center font-bold text-gray-600 bg-gray-100/50 px-2 py-1.5 rounded border border-gray-200 text-sm">
                     {slot.time}
                  </div>

                  {/* Details */}
                  <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                     {isEditing && slot.type !== 'Break' ? (
                        <>
                           <div>
                              <label className="text-[10px] text-gray-400 uppercase font-bold">Subject</label>
                              <input 
                                 type="text" 
                                 value={slot.subject} 
                                 onChange={(e) => handleEditChange(slot.id, 'subject', e.target.value)}
                                 className="w-full border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:border-purple-500 font-bold text-gray-800 text-sm"
                              />
                           </div>
                           <div className="flex gap-2">
                              <div className="flex-1">
                                 <label className="text-[10px] text-gray-400 uppercase font-bold">Teacher</label>
                                 <input 
                                    type="text" 
                                    value={slot.teacher} 
                                    onChange={(e) => handleEditChange(slot.id, 'teacher', e.target.value)}
                                    className="w-full border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:border-purple-500 text-gray-600 text-sm"
                                 />
                              </div>
                              {/* PROXY BUTTON */}
                              <div className="flex items-end">
                                 <button 
                                    onClick={() => markAsProxy(slot.id)}
                                    title="Mark as Proxy/Substitute"
                                    className={`p-2 rounded border ${slot.isProxy ? 'bg-orange-500 text-white border-orange-500' : 'bg-gray-100 text-gray-400 border-gray-200 hover:border-orange-400 hover:text-orange-500'}`}
                                 >
                                    <WarningCircle size={18} weight={slot.isProxy ? "fill" : "regular"} />
                                 </button>
                              </div>
                           </div>
                        </>
                     ) : (
                        <>
                           <div className="flex items-center gap-2">
                              <span className={`font-bold text-base ${slot.type === 'Break' ? 'text-yellow-700' : 'text-gray-800'}`}>{slot.subject}</span>
                              {slot.isProxy && <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded font-bold uppercase border border-orange-200">Proxy</span>}
                           </div>
                           <div className="text-gray-500 text-sm flex items-center gap-2">
                              {slot.type !== 'Break' && <><Users size={16} /> {slot.teacher}</>}
                           </div>
                        </>
                     )}
                  </div>
               </div>
            ))}
            
            {isEditing && (
               <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-400 font-bold hover:border-purple-400 hover:text-purple-500 hover:bg-purple-50 transition flex items-center justify-center gap-2">
                  <Plus size={20} /> Add Period Slot
               </button>
            )}
         </div>
      </div>

    </div>
  );
};

export default TimetableView;
