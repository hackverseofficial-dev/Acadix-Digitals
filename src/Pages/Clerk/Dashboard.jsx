import React from "react";
import ClerkSidebar from "../../Components/Clerk/ClerkSidebar";
import { 
  Student, Chalkboard, CurrencyInr, Bus, 
  Bell, CaretRight, WarningCircle, Megaphone, 
  CheckCircle, Clock 
} from "phosphor-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  // --- DUMMY DATA (Final Look) ---
  const stats = {
    totalStudents: 1240,
    activeClasses: 36,
    dailyCollection: 25000,
    pendingAdmissions: 8
  };

  const tasks = [
    { id: 1, title: "Verify Class 10 Documents", due: "Today", status: "Pending", priority: "High" },
    { id: 2, title: "Update Bus Route 5", due: "Tomorrow", status: "In Progress", priority: "Medium" },
    { id: 3, title: "Issue ID Cards (Class 9)", due: "Friday", status: "Done", priority: "Low" },
  ];

  const notices = [
    { id: 1, title: "Fee Submission Deadline", time: "10:00 AM", sender: "Admin" },
    { id: 2, title: "Holiday on Friday", time: "Yesterday", sender: "Principal" },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <ClerkSidebar />

      <main className="flex-1 p-6 overflow-y-auto custom-scrollbar">
        
        {/* 1. HEADER SECTION */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Clerk Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Welcome back, Rakesh Kumar</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-gray-700">{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                <p className="text-xs text-gray-400">Academic Year 2025-26</p>
             </div>
             <button className="p-2.5 bg-white border border-gray-200 rounded-full hover:bg-gray-50 text-gray-600 relative shadow-sm transition">
                <Bell size={24} weight="bold" />
                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
             </button>
          </div>
        </header>

        {/* 2. STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Students" 
            value={stats.totalStudents} 
            icon={<Student size={32} weight="duotone" />} 
            color="bg-blue-50 text-blue-600 border-blue-100"
          />
          <StatCard 
            title="Active Classes" 
            value={stats.activeClasses} 
            icon={<Chalkboard size={32} weight="duotone" />} 
            color="bg-purple-50 text-purple-600 border-purple-100"
          />
          <StatCard 
            title="Pending Admissions" 
            value={stats.pendingAdmissions} 
            icon={<Clock size={32} weight="duotone" />} 
            color="bg-orange-50 text-orange-600 border-orange-100"
            badge="Action Req"
          />
          <StatCard 
            title="Today's Collection" 
            value={`₹${(stats.dailyCollection / 1000).toFixed(1)}k`} 
            icon={<CurrencyInr size={32} weight="bold" />} 
            color="bg-green-50 text-green-600 border-green-100"
          />
        </div>

        {/* 3. MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT COLUMN (Tasks & Transport) */}
          <div className="lg:col-span-2 space-y-6">
             
             {/* PENDING TASKS */}
             <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-5">
                   <h3 className="font-bold text-gray-800 flex items-center gap-2">
                      <CheckCircle size={20} className="text-indigo-500"/> Daily Tasks
                   </h3>
                   <button className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full hover:bg-indigo-100 transition">
                      View All
                   </button>
                </div>
                <div className="space-y-3">
                   {tasks.map(task => (
                      <div key={task.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 hover:border-gray-200 transition group">
                         <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${task.priority === 'High' ? 'bg-red-500' : task.priority === 'Medium' ? 'bg-orange-500' : 'bg-green-500'}`}></div>
                            <div>
                               <h4 className="text-sm font-bold text-gray-800 group-hover:text-indigo-600 transition">{task.title}</h4>
                               <p className="text-xs text-gray-400">Due: {task.due}</p>
                            </div>
                         </div>
                         <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${
                            task.status === 'Done' ? 'bg-green-100 text-green-700' : 
                            task.status === 'Pending' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                         }`}>
                            {task.status}
                         </span>
                      </div>
                   ))}
                </div>
             </div>

             {/* TRANSPORT ALERTS */}
             <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                   <h3 className="font-bold text-gray-800 flex items-center gap-2">
                      <Bus size={20} className="text-blue-500"/> Fleet Status
                   </h3>
                   <Link to="/clerk/transportation" className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-blue-600"><CaretRight size={18} weight="bold"/></Link>
                </div>
                <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-start gap-3">
                   <WarningCircle size={24} className="text-red-600 mt-0.5 shrink-0" weight="fill"/>
                   <div>
                      <h4 className="text-sm font-bold text-red-800">Insurance Expiry Alert</h4>
                      <p className="text-xs text-red-600 mt-1">Bus DL-1XX-5678 insurance expires in 3 days. Renew immediately.</p>
                   </div>
                   <button className="text-xs bg-white text-red-600 font-bold px-3 py-1.5 rounded border border-red-200 shadow-sm hover:bg-red-50 ml-auto">
                      Check
                   </button>
                </div>
             </div>

          </div>

          {/* RIGHT COLUMN (Notices & Actions) */}
          <div className="space-y-6">

             {/* NOTICE BOARD */}
             <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                   <h3 className="font-bold text-gray-800 flex items-center gap-2">
                      <Megaphone size={20} className="text-purple-500" /> Notice Board
                   </h3>
                   <Link to="/clerk/notices" className="text-xs font-bold text-purple-600 hover:underline">See All</Link>
                </div>
                <div className="space-y-4">
                   {notices.map(notice => (
                      <div key={notice.id} className="flex gap-3 items-start pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                         <div className="bg-purple-50 text-purple-600 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs shrink-0">
                            {notice.sender[0]}
                         </div>
                         <div>
                            <h4 className="text-sm font-bold text-gray-800 hover:text-purple-600 cursor-pointer transition">{notice.title}</h4>
                            <p className="text-[10px] text-gray-400 mt-0.5">{notice.time} • From {notice.sender}</p>
                         </div>
                      </div>
                   ))}
                </div>
             </div>

             {/* QUICK ACTIONS */}
             <div className="bg-indigo-600 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10"></div>
                <h3 className="font-bold text-lg mb-1 relative z-10">Quick Actions</h3>
                <p className="text-indigo-200 text-xs mb-4 relative z-10">Frequent tasks for you</p>
                
                <div className="grid grid-cols-2 gap-3 relative z-10">
                   <Link to="/clerk/students" className="bg-indigo-500 hover:bg-indigo-400 p-3 rounded-xl text-center transition border border-indigo-400/30">
                      <span className="block text-lg font-bold mb-1">+</span>
                      <span className="text-xs font-bold">Add Student</span>
                   </Link>
                   <Link to="/clerk/classes" className="bg-indigo-500 hover:bg-indigo-400 p-3 rounded-xl text-center transition border border-indigo-400/30">
                      <span className="block text-lg font-bold mb-1">#</span>
                      <span className="text-xs font-bold">New Class</span>
                   </Link>
                </div>
             </div>

          </div>
        </div>

      </main>
    </div>
  );
};

// Reusable Stat Component
const StatCard = ({ title, value, icon, color, badge }) => (
  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between hover:shadow-md transition duration-300 relative overflow-hidden">
    <div>
       <p className="text-gray-500 text-xs font-bold uppercase mb-1 tracking-wide">{title}</p>
       <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
       {badge && <span className="inline-block mt-2 text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded font-bold uppercase">{badge}</span>}
    </div>
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${color}`}>
       {icon}
    </div>
  </div>
);

export default Dashboard;
