import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/Admin/Sidebar";
import { db } from "../../firebase"; // Firebase Import
import { ref, onValue, update } from "firebase/database";
import { Check, X, CalendarBlank, User, Clock, FunnelSimple } from "phosphor-react";

const Leave = () => {
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  // --- 1. FETCH LEAVE APPLICATIONS (Real-time) ---
  useEffect(() => {
    const leavesRef = ref(db, 'leaves');
    const unsubscribe = onValue(leavesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        })).reverse(); // Newest first
        setApplications(list);
      } else {
        setApplications([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // --- 2. HANDLE APPROVE / REJECT ---
  const handleStatusChange = async (id, newStatus) => {
    try {
      const updates = {};
      updates[`leaves/${id}/status`] = newStatus;
      updates[`leaves/${id}/actionBy`] = "Admin"; // Track who acted
      updates[`leaves/${id}/actionDate`] = new Date().toISOString();
      
      await update(ref(db), updates);
    } catch (error) {
      alert("Error updating status");
    }
  };

  // Stats Calculation
  const pendingCount = applications.filter(a => a.status === 'Pending').length;
  const todayCount = applications.filter(a => {
     const today = new Date().toISOString().split('T')[0];
     // Check if dates string contains today or dateApplied is today (Simple check)
     return a.dateApplied?.includes(today);
  }).length;

  return (
    <div className="flex min-h-screen bg-[#F3F4F6] overflow-hidden">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto custom-scrollbar h-screen">
        {/* Header */}
        <header className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Leave Applications</h1>
            <p className="text-sm text-gray-500 mt-1">Manage student & faculty leave requests</p>
          </div>
          
          {/* Stats */}
          <div className="flex gap-4">
             <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 text-center min-w-[100px]">
                <span className="block text-[10px] text-gray-400 uppercase font-bold tracking-wider">Pending</span>
                <span className="text-xl font-bold text-orange-500">{loading ? "..." : pendingCount}</span>
             </div>
             <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 text-center min-w-[100px]">
                <span className="block text-[10px] text-gray-400 uppercase font-bold tracking-wider">New Today</span>
                <span className="text-xl font-bold text-blue-600">{loading ? "..." : todayCount}</span>
             </div>
          </div>
        </header>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
           {["All", "Pending", "Approved", "Rejected"].map((status) => (
              <button
                 key={status}
                 onClick={() => setFilter(status)}
                 className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                    filter === status 
                    ? "bg-gray-800 text-white shadow-md" 
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                 }`}
              >
                 {status}
              </button>
           ))}
        </div>

        {/* Applications List */}
        <section className="space-y-4 pb-10">
          {loading ? (
             <div className="text-center py-10 text-gray-400 animate-pulse">Loading Applications...</div>
          ) : (
             applications
               .filter((app) => filter === "All" || app.status === filter)
               .map((app) => (
               <div key={app.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row items-start md:items-center gap-6 hover:shadow-md transition-all animate-fade-in">
                  
                  {/* User Info */}
                  <div className="flex items-center gap-4 w-full md:w-1/4">
                     <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 shrink-0">
                        <User size={24} weight="bold" />
                     </div>
                     <div>
                        <h3 className="font-bold text-gray-800 text-sm">{app.name}</h3>
                        <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded uppercase">
                           {app.role || "Student"} • {app.class || "N/A"}
                        </span>
                     </div>
                  </div>

                  {/* Date & Reason */}
                  <div className="flex-1">
                     <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1 flex-wrap">
                        <CalendarBlank size={18} className="text-blue-500" />
                        <span>{app.dates}</span>
                        <span className="text-xs font-normal text-gray-400">({app.days || 1} Days)</span>
                     </div>
                     <p className="text-sm text-gray-600 leading-relaxed">{app.reason}</p>
                     <div className="flex items-center gap-1 mt-2 text-[10px] text-gray-400">
                        <Clock size={14} />
                        <span>Applied: {new Date(app.dateApplied).toLocaleString()}</span>
                     </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex items-center justify-end gap-4 w-full md:w-auto min-w-[150px]">
                     {app.status === "Pending" ? (
                        <div className="flex gap-3">
                           <button 
                              onClick={() => handleStatusChange(app.id, "Approved")}
                              className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 border border-green-200 transition-colors font-bold text-xs shadow-sm"
                           >
                              <Check size={16} weight="bold" /> Approve
                           </button>
                           <button 
                              onClick={() => handleStatusChange(app.id, "Rejected")}
                              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 border border-red-200 transition-colors font-bold text-xs shadow-sm"
                           >
                              <X size={16} weight="bold" /> Reject
                           </button>
                        </div>
                     ) : (
                        <span className={`px-4 py-2 rounded-lg text-xs font-bold border flex items-center gap-2 ${
                           app.status === 'Approved' 
                           ? 'bg-green-50 text-green-700 border-green-100' 
                           : 'bg-red-50 text-red-700 border-red-100'
                        }`}>
                           {app.status === 'Approved' ? <Check weight="bold"/> : <X weight="bold"/>}
                           {app.status}
                        </span>
                     )}
                  </div>
               </div>
             ))
          )}

          {!loading && applications.length === 0 && (
             <div className="flex flex-col items-center justify-center py-20 text-gray-400 bg-white rounded-xl border border-dashed border-gray-300">
                <CalendarBlank size={48} className="mb-2 opacity-20"/>
                <p>No leave applications found.</p>
             </div>
          )}
        </section>

      </main>
    </div>
  );
};

export default Leave;
