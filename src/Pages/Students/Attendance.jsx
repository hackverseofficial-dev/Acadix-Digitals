import React from "react";
import StudentSidebar from "../../Components/Students/StudentSidebar";
import { CheckCircle, XCircle, CalendarCheck } from "phosphor-react";

const StudentAttendance = () => {
  const stats = { total: 120, present: 102, absent: 18, percentage: 85 };
  const history = [
    { date: "04 Oct", status: "Present", subject: "Full Day" },
    { date: "03 Oct", status: "Present", subject: "Full Day" },
    { date: "02 Oct", status: "Absent", subject: "Sick Leave" },
    { date: "01 Oct", status: "Present", subject: "Full Day" },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <StudentSidebar />
      <main className="flex-1 p-6 overflow-y-auto custom-scrollbar">
         <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2"><CalendarCheck size={32} className="text-green-600"/> My Attendance</h1>
         
         {/* Stats Card */}
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
               <div className="relative w-24 h-24 rounded-full flex items-center justify-center border-4 border-green-500">
                  <span className="text-xl font-bold text-gray-800">{stats.percentage}%</span>
               </div>
               <div>
                  <h3 className="text-lg font-bold text-gray-800">Overall Attendance</h3>
                  <p className="text-sm text-gray-500">Good Job! Keep it up.</p>
               </div>
            </div>
            <div className="flex gap-6 text-center">
               <div><p className="text-xs font-bold text-gray-400 uppercase">Present</p><p className="text-xl font-bold text-green-600">{stats.present}</p></div>
               <div><p className="text-xs font-bold text-gray-400 uppercase">Absent</p><p className="text-xl font-bold text-red-500">{stats.absent}</p></div>
               <div><p className="text-xs font-bold text-gray-400 uppercase">Total Days</p><p className="text-xl font-bold text-gray-800">{stats.total}</p></div>
            </div>
         </div>

         {/* History List */}
         <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200 font-bold text-gray-700">Recent Activity</div>
            <div className="divide-y divide-gray-100">
               {history.map((rec, i) => (
                  <div key={i} className="p-4 flex justify-between items-center hover:bg-gray-50">
                     <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${rec.status === 'Present' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                           {rec.status === 'Present' ? <CheckCircle weight="fill" size={20}/> : <XCircle weight="fill" size={20}/>}
                        </div>
                        <div>
                           <p className="font-bold text-gray-800">{rec.date}</p>
                           <p className="text-xs text-gray-500">{rec.subject}</p>
                        </div>
                     </div>
                     <span className={`text-xs font-bold px-3 py-1 rounded-full ${rec.status === 'Present' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{rec.status}</span>
                  </div>
               ))}
            </div>
         </div>
      </main>
    </div>
  );
};
export default StudentAttendance;
