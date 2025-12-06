import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/Admin/Sidebar";
import { 
  Student, ChalkboardTeacher, CurrencyInr, ChartPieSlice, 
  Bus, Bell, CaretRight, TrendUp, WarningCircle, Users, CalendarBlank 
} from "phosphor-react";
import { Link } from "react-router-dom";
import { db } from "../../firebase"; 
import { ref, onValue } from "firebase/database";

const Dashboard = () => {
  // --- STATES ---
  const [counts, setCounts] = useState({
    students: 0,
    teachers: 0,
    classes: 0,
    vehicles: 0
  });

  const [finance, setFinance] = useState({
    totalExpected: 0,
    collected: 0,
    pending: 0
  });

  const [attendanceToday, setAttendanceToday] = useState(0); // Percentage
  const [recentNotices, setRecentNotices] = useState([]);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- 1. FETCH COUNTS (Students, Teachers, Classes, Transport) ---
  useEffect(() => {
    const refs = [
      { key: 'students', setter: (count) => setCounts(prev => ({...prev, students: count})) },
      { key: 'faculty', setter: (count) => setCounts(prev => ({...prev, teachers: count})) },
      { key: 'classes', setter: (count) => setCounts(prev => ({...prev, classes: count})) },
      { key: 'transport', setter: (count) => setCounts(prev => ({...prev, vehicles: count})) }
    ];

    refs.forEach(({ key, setter }) => {
       onValue(ref(db, key), (snapshot) => {
          setter(snapshot.exists() ? Object.keys(snapshot.val()).length : 0);
       });
    });
    setLoading(false);
  }, []);

  // --- 2. FETCH FINANCE (Real Calculation) ---
  useEffect(() => {
    onValue(ref(db, 'finance'), (snapshot) => {
       if (snapshot.exists()) {
          const data = Object.values(snapshot.val());
          // Assuming your finance object has 'amount' and 'status'
          // If you have a separate 'fees' structure, logic changes here.
          // For now, summing up transaction records:
          const collected = data
             .filter(t => t.status === 'Completed')
             .reduce((sum, t) => sum + Number(t.amount || 0), 0);
          
          const pending = data
             .filter(t => t.status === 'Pending')
             .reduce((sum, t) => sum + Number(t.amount || 0), 0);

          setFinance({
             collected,
             pending,
             totalExpected: collected + pending // Or a fixed target if preferred
          });
       }
    });
  }, []);

  // --- 3. FETCH ATTENDANCE (Today's Average) ---
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    onValue(ref(db, 'attendance'), (snapshot) => {
       if (snapshot.exists()) {
          const classesData = snapshot.val(); // { "10-A": { "2023-10-05": { ... } } }
          let totalPresent = 0;
          let totalStudents = 0;

          Object.values(classesData).forEach(classDates => {
             if (classDates[today]) {
                const students = Object.values(classDates[today]);
                totalStudents += students.length;
                totalPresent += students.filter(s => s.status === 'Present').length;
             }
          });

          const avg = totalStudents > 0 ? Math.round((totalPresent / totalStudents) * 100) : 0;
          setAttendanceToday(avg);
       } else {
         setAttendanceToday(0);
       }
    });
  }, []);

  // --- 4. FETCH NOTICES & LEAVES ---
  useEffect(() => {
     // Messages (Chats)
     onValue(ref(db, 'chats'), (snap) => {
        const data = snap.val();
        if(data) {
           const list = Object.keys(data).map(k => ({id: k, ...data[k]})).reverse().slice(0, 3);
           setRecentNotices(list);
        }
     });

     // Leaves (Pending Only)
     onValue(ref(db, 'leaves'), (snap) => {
        const data = snap.val();
        if(data) {
           const list = Object.keys(data)
              .map(k => ({id: k, ...data[k]}))
              .filter(l => l.status === 'Pending')
              .slice(0, 3);
           setPendingLeaves(list);
        }
     });
  }, []);

  // Static Alert for now (unless you have 'alerts' node)
  const transportAlert = counts.vehicles > 0 ? "All vehicles operational" : "No vehicles added to fleet";


  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />

      <main className="flex-1 p-6 overflow-y-auto custom-scrollbar">
        
        {/* HEADER */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
            <p className="text-sm text-gray-500">Real-time School Metrics</p>
          </div>
          <div className="flex items-center gap-3">
             <span className="text-sm font-bold text-gray-600 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                {new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
             </span>
             <div className="relative">
                <Bell size={24} className="text-gray-600" />
                {pendingLeaves.length > 0 && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>}
             </div>
          </div>
        </header>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Students" value={counts.students} icon={<Student size={32} weight="duotone" />} color="bg-blue-50 text-blue-600" trend="Registered" />
          <StatCard title="Total Teachers" value={counts.teachers} icon={<ChalkboardTeacher size={32} weight="duotone" />} color="bg-purple-50 text-purple-600" trend="Faculty" />
          <StatCard title="Active Classes" value={counts.classes} icon={<Users size={32} weight="duotone" />} color="bg-indigo-50 text-indigo-600" trend="Sections" />
          
          {/* Attendance Donut */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
             <div>
                <p className="text-gray-500 text-[10px] font-bold uppercase mb-1">Attendance Today</p>
                <h3 className="text-2xl font-bold text-gray-800">{attendanceToday}%</h3>
                <span className="text-xs text-green-600 font-bold flex items-center gap-1"><TrendUp/> Live</span>
             </div>
             <div className="relative w-14 h-14">
                <div className="w-full h-full rounded-full" style={{ background: `conic-gradient(#22c55e 0% ${attendanceToday}%, #f3f4f6 ${attendanceToday}% 100%)` }}></div>
                <div className="absolute inset-1.5 bg-white rounded-full flex items-center justify-center">
                   <ChartPieSlice size={20} className="text-green-600" />
                </div>
             </div>
          </div>
        </div>

        {/* MAIN SECTIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT (Finance & Transport) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* FINANCE CARD */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
               <div className="flex justify-between items-center mb-5">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2"><CurrencyInr size={20} className="text-orange-500"/> Finance Status</h3>
                  <Link to="/admin/finance" className="text-xs font-bold text-blue-600 hover:bg-blue-50 px-2 py-1 rounded">View Report</Link>
               </div>
               
               {/* Progress Bar */}
               <div className="mb-4">
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                     <span className="text-gray-500">Revenue Goal</span>
                     <span className="text-gray-800">₹{finance.totalExpected.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                     <div 
                       className="bg-indigo-500 h-full rounded-full transition-all duration-500" 
                       style={{width: `${finance.totalExpected > 0 ? (finance.collected / finance.totalExpected) * 100 : 0}%`}}
                     ></div>
                  </div>
               </div>

               <div className="flex gap-4">
                  <div className="flex-1 bg-green-50 p-3 rounded-xl border border-green-100">
                     <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider">Collected</p>
                     <p className="text-lg font-bold text-gray-800">₹{finance.collected.toLocaleString()}</p>
                  </div>
                  <div className="flex-1 bg-red-50 p-3 rounded-xl border border-red-100">
                     <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">Pending</p>
                     <p className="text-lg font-bold text-gray-800">₹{finance.pending.toLocaleString()}</p>
                  </div>
               </div>
            </div>

            {/* TRANSPORT CARD */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
               <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                     <Bus size={20} className="text-blue-500"/> Transport Fleet
                     <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">{counts.vehicles} Buses</span>
                  </h3>
                  <Link to="/admin/transportation" className="text-xs font-bold text-blue-600">Manage</Link>
               </div>
               
               <div className={`flex items-center gap-3 p-3 rounded-xl border ${counts.vehicles === 0 ? 'bg-orange-50 border-orange-100 text-orange-700' : 'bg-green-50 border-green-100 text-green-700'}`}>
                  {counts.vehicles === 0 ? <WarningCircle size={20} weight="fill"/> : <TrendUp size={20} weight="fill"/>}
                  <span className="text-sm font-bold">{transportAlert}</span>
               </div>
            </div>
          </div>

          {/* RIGHT (Notices & Leaves) */}
          <div className="space-y-6">
             
             {/* NOTICES LIST */}
             <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                   <h3 className="font-bold text-gray-800">Recent Messages</h3>
                   <Link to="/admin/notices" className="text-xs font-bold text-blue-600">View All</Link>
                </div>
                <div className="space-y-3">
                   {recentNotices.length === 0 ? (
                      <p className="text-xs text-gray-400 text-center py-4 italic">No recent messages</p>
                   ) : (
                      recentNotices.map(notice => (
                         <div key={notice.id} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg transition cursor-pointer">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-[10px] shrink-0">
                               {notice.initials || "MSG"}
                            </div>
                            <div className="min-w-0">
                               <h4 className="text-xs font-bold text-gray-800 truncate">{notice.title}</h4>
                               <p className="text-[10px] text-gray-500 truncate">{notice.role || 'Admin'}</p>
                            </div>
                         </div>
                      ))
                   )}
                </div>
             </div>

             {/* PENDING LEAVES */}
             <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                   <h3 className="font-bold text-gray-800">Pending Leaves</h3>
                   <Link to="/admin/leave" className="text-xs font-bold text-blue-600">Check All</Link>
                </div>
                <div className="space-y-3">
                   {pendingLeaves.length === 0 ? (
                      <div className="flex flex-col items-center py-4 text-gray-300">
                         <CalendarBlank size={24} weight="duotone" className="mb-1"/>
                         <span className="text-xs">No pending requests</span>
                      </div>
                   ) : (
                      pendingLeaves.map(leave => (
                         <div key={leave.id} className="flex items-center justify-between p-2 border border-gray-100 rounded-lg bg-gray-50">
                            <div>
                               <h4 className="text-xs font-bold text-gray-800">{leave.name}</h4>
                               <p className="text-[10px] text-gray-500">{leave.class} • {leave.days} Days</p>
                            </div>
                            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                         </div>
                      ))
                   )}
                </div>
             </div>

          </div>
        </div>

      </main>
    </div>
  );
};

// Helper Component
const StatCard = ({ title, value, icon, color, trend }) => (
  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
    <div>
       <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wide mb-1">{title}</p>
       <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
       <span className="text-[10px] font-bold bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 mt-2 inline-block">{trend}</span>
    </div>
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>{icon}</div>
  </div>
);

export default Dashboard;
   