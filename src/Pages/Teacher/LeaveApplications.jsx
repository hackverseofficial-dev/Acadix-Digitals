import React, { useState } from "react";
import TeacherSidebar from "../../Components/Teacher/TeacherSidebar";
import { CalendarBlank, CheckCircle, XCircle, ArrowRight } from "phosphor-react";

const TeacherLeaves = () => {
  // Dummy Data
  const [leaves, setLeaves] = useState([
    { id: 1, name: "Rohan Sharma", roll: 12, dates: "05 Oct - 07 Oct", reason: "Suffering from fever", status: "Pending" },
    { id: 2, name: "Priya Patel", roll: 4, dates: "10 Oct", reason: "Sister's Marriage", status: "Approved" },
    { id: 3, name: "Amit Verma", roll: 22, dates: "15 Oct - 25 Oct", reason: "Family Trip to Abroad", status: "Pending" },
  ]);

  const handleAction = (id, action) => {
     // action: 'Approved' | 'Rejected' | 'Forwarded'
     const statusText = action === 'Forwarded' ? 'Forwarded to Admin' : action;
     setLeaves(leaves.map(l => l.id === id ? { ...l, status: statusText } : l));
     
     if(action === 'Forwarded') {
        alert("Application forwarded to Admin Portal successfully.");
     }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <TeacherSidebar />
      <main className="flex-1 p-6 overflow-y-auto custom-scrollbar">
         
         <header className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
               <CalendarBlank size={32} className="text-orange-600" weight="duotone" />
               Student Leave Requests
            </h1>
            <p className="text-sm text-gray-500 mt-1">Manage applications for Class 10-A</p>
         </header>

         <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-100">
               {leaves.map((leave) => (
                  <div key={leave.id} className="p-5 hover:bg-gray-50 transition flex flex-col md:flex-row justify-between md:items-center gap-4">
                     <div>
                        <div className="flex items-center gap-3 mb-1">
                           <h3 className="font-bold text-gray-800">{leave.name}</h3>
                           <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Roll: {leave.roll}</span>
                           <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                              leave.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 
                              leave.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                              leave.status === 'Forwarded to Admin' ? 'bg-purple-100 text-purple-700' : 'bg-red-100 text-red-700'
                           }`}>
                              {leave.status}
                           </span>
                        </div>
                        <p className="text-sm text-gray-600 font-medium mb-1">Reason: {leave.reason}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-1"><CalendarBlank weight="fill"/> {leave.dates}</p>
                     </div>

                     {leave.status === 'Pending' && (
                        <div className="flex flex-wrap gap-2">
                           <button onClick={() => handleAction(leave.id, 'Approved')} className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg font-bold text-xs hover:bg-green-700 shadow-sm">
                              <CheckCircle size={16} weight="bold"/> Approve
                           </button>
                           <button onClick={() => handleAction(leave.id, 'Rejected')} className="flex items-center gap-1 px-3 py-2 bg-red-100 text-red-600 rounded-lg font-bold text-xs hover:bg-red-200 border border-red-200">
                              <XCircle size={16} weight="bold"/> Reject
                           </button>
                           
                           {/* FORWARD BUTTON */}
                           <button onClick={() => handleAction(leave.id, 'Forwarded')} className="flex items-center gap-1 px-3 py-2 bg-purple-100 text-purple-600 rounded-lg font-bold text-xs hover:bg-purple-200 border border-purple-200" title="Forward to Principal/Admin">
                              <ArrowRight size={16} weight="bold"/> Forward to Admin
                           </button>
                        </div>
                     )}
                  </div>
               ))}
            </div>
         </div>

      </main>
    </div>
  );
};

export default TeacherLeaves;
