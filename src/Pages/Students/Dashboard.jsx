import React from "react";
import StudentSidebar from "../../Components/Students/StudentSidebar";
import { 
  TrendUp, CalendarCheck, CurrencyInr, BookBookmark, 
  WarningCircle, Bell, CaretRight 
} from "phosphor-react";

const StudentDashboard = () => {
  const stats = {
    attendance: 85.5,
    feesDue: 5000,
    assignmentsPending: 3,
    nextExam: "Maths (Monday)"
  };

  const homework = [
    { id: 1, subject: "Physics", title: "Chapter 4 Numericals", due: "Tomorrow" },
    { id: 2, subject: "English", title: "Essay Writing", due: "Friday" },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <StudentSidebar />
      
      <main className="flex-1 p-6 overflow-y-auto custom-scrollbar">
         {/* Header */}
         <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Hi, Rohan!</h1>
            <p className="text-sm text-gray-500">Keep up the good work.</p>
          </div>
          <button className="p-2 bg-white border border-gray-200 rounded-full relative hover:bg-gray-100">
            <Bell size={24} className="text-gray-600"/>
          </button>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
           {/* Attendance (Circular Progress Idea) */}
           <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
              <div>
                 <p className="text-xs font-bold text-gray-400 uppercase">Attendance</p>
                 <h3 className="text-2xl font-bold text-green-600 mt-1">{stats.attendance}%</h3>
              </div>
              <TrendUp size={32} className="text-green-500" weight="duotone"/>
           </div>
           
           <StatCard title="Fees Due" value={`₹${stats.feesDue}`} icon={<CurrencyInr size={32}/>} color="bg-red-100 text-red-600" />
           <StatCard title="Pending Tasks" value={stats.assignmentsPending} icon={<BookBookmark size={32}/>} color="bg-orange-100 text-orange-600" />
           <div className="bg-indigo-600 text-white p-5 rounded-2xl shadow-lg flex flex-col justify-center">
              <p className="text-xs font-bold opacity-80 uppercase">Next Exam</p>
              <h3 className="text-lg font-bold mt-1">{stats.nextExam}</h3>
           </div>
        </div>

        {/* Main Content Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           
           {/* Pending Homework */}
           <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                 <h3 className="font-bold text-gray-800 flex items-center gap-2"><BookBookmark size={20} className="text-indigo-500"/> Homework & Tasks</h3>
                 <button className="text-xs font-bold text-indigo-600 hover:underline">View All</button>
              </div>
              <div className="space-y-3">
                 {homework.map(hw => (
                    <div key={hw.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                       <div>
                          <h4 className="font-bold text-gray-800 text-sm">{hw.subject}: {hw.title}</h4>
                          <p className="text-xs text-red-500 font-bold mt-1 flex items-center gap-1">
                             <WarningCircle size={12}/> Due: {hw.due}
                          </p>
                       </div>
                       <button className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition">
                          Details
                       </button>
                    </div>
                 ))}
              </div>
           </div>

           {/* Fees & Notices */}
           <div className="space-y-6">
              {/* Fees Warning Card */}
              <div className="bg-red-50 p-6 rounded-2xl border border-red-100 relative overflow-hidden">
                 <div className="absolute top-0 right-0 -mt-2 -mr-2 w-20 h-20 bg-red-100 rounded-full opacity-50"></div>
                 <h3 className="font-bold text-red-800 mb-1 relative z-10">Fee Payment Due</h3>
                 <p className="text-xs text-red-600 mb-4 relative z-10">Please clear your pending dues of ₹{stats.feesDue} to avoid late charges.</p>
                 <button className="w-full py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 shadow-sm relative z-10">
                    Pay Now
                 </button>
              </div>

              {/* Recent Notice Snippet */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                 <h3 className="font-bold text-gray-800 mb-3 text-sm">Latest Notice</h3>
                 <p className="text-xs text-gray-500 leading-relaxed">
                    <span className="font-bold text-gray-700">Picnic on Saturday:</span> All students of Class 10 must submit consent forms by tomorrow.
                 </p>
                 <button className="mt-3 text-xs font-bold text-indigo-600 flex items-center gap-1">
                    Read More <CaretRight/>
                 </button>
              </div>
           </div>

        </div>
      </main>
    </div>
  );
};

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

export default StudentDashboard;
