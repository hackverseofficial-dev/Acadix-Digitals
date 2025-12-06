import React from "react";
import TeacherSidebar from "../../Components/Teacher/TeacherSidebar";
import { 
  ChalkboardTeacher, Student, Clock, CheckCircle, 
  CalendarBlank, Bell, BookOpen 
} from "phosphor-react";

const TeacherDashboard = () => {
  const stats = {
    totalClasses: 4,
    totalStudents: 145,
    pendingAssignments: 12,
    attendanceMarked: "3/4"
  };

  const todaySchedule = [
    { id: 1, time: "09:00 AM", class: "10-A", subject: "Physics", room: "Lab 2" },
    { id: 2, time: "11:00 AM", class: "12-Sci", subject: "Physics", room: "Room 101" },
    { id: 3, time: "01:00 PM", class: "10-B", subject: "Physics", room: "Room 104" },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <TeacherSidebar />
      
      <main className="flex-1 p-6 overflow-y-auto custom-scrollbar">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Good Morning, Suresh Sir!</h1>
            <p className="text-sm text-gray-500">Here's your schedule for today.</p>
          </div>
          <button className="p-2 bg-white border border-gray-200 rounded-full relative hover:bg-gray-100">
            <Bell size={24} className="text-gray-600"/>
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
           <StatCard title="Classes Today" value={stats.totalClasses} icon={<ChalkboardTeacher size={32}/>} color="bg-indigo-100 text-indigo-600"/>
           <StatCard title="Total Students" value={stats.totalStudents} icon={<Student size={32}/>} color="bg-blue-100 text-blue-600"/>
           <StatCard title="Assignments Check" value={stats.pendingAssignments} icon={<BookOpen size={32}/>} color="bg-orange-100 text-orange-600"/>
           <StatCard title="Attendance" value={stats.attendanceMarked} icon={<CheckCircle size={32}/>} color="bg-green-100 text-green-600"/>
        </div>

        {/* Main Content Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           
           {/* Schedule Section */}
           <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Clock size={20} className="text-indigo-500"/> Today's Timetable</h3>
              <div className="space-y-4">
                 {todaySchedule.map((slot, index) => (
                    <div key={slot.id} className="flex items-center p-4 border border-gray-100 rounded-xl hover:bg-indigo-50 transition group">
                       <div className="w-16 text-center border-r border-gray-200 pr-4 mr-4">
                          <p className="text-xs text-gray-500 font-bold uppercase">Start</p>
                          <p className="font-bold text-gray-800">{slot.time}</p>
                       </div>
                       <div>
                          <h4 className="font-bold text-gray-800 text-lg">{slot.subject}</h4>
                          <p className="text-sm text-gray-500">Class {slot.class} • {slot.room}</p>
                       </div>
                       <button className="ml-auto px-4 py-2 text-xs font-bold bg-white border border-gray-200 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition">
                          View Class
                       </button>
                    </div>
                 ))}
                 {todaySchedule.length === 0 && <p className="text-gray-400 italic">No classes scheduled for today.</p>}
              </div>
           </div>

           {/* Quick Actions / Notices */}
           <div className="space-y-6">
              <div className="bg-indigo-600 text-white p-6 rounded-2xl shadow-lg">
                 <h3 className="font-bold text-lg mb-2">Create Assignment</h3>
                 <p className="text-indigo-100 text-sm mb-4">Upload notes or create homework for your classes.</p>
                 <button className="w-full py-2 bg-white text-indigo-600 font-bold rounded-lg hover:bg-indigo-50 transition">
                    + New Task
                 </button>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                 <h3 className="font-bold text-gray-800 mb-4">School Notices</h3>
                 <div className="space-y-3">
                    <div className="flex gap-3 items-start">
                       <div className="w-2 h-2 mt-1.5 rounded-full bg-red-500 shrink-0"></div>
                       <div>
                          <p className="text-sm font-bold text-gray-800">Staff Meeting</p>
                          <p className="text-xs text-gray-500">Today at 2:00 PM in Conference Hall</p>
                       </div>
                    </div>
                    <div className="flex gap-3 items-start">
                       <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-500 shrink-0"></div>
                       <div>
                          <p className="text-sm font-bold text-gray-800">Marks Submission</p>
                          <p className="text-xs text-gray-500">Deadline: Friday 10th Oct</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

        </div>
      </main>
    </div>
  );
};

// Helper Stat Card
const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
     <div>
        <p className="text-xs font-bold text-gray-400 uppercase">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
     </div>
     <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        {icon}
     </div>
  </div>
);

export default TeacherDashboard;
