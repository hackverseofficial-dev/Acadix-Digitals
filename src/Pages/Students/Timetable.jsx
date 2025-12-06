import React from "react";
import StudentSidebar from "../../Components/Students/StudentSidebar";
import { Clock } from "phosphor-react";

const StudentTimetable = () => {
  const periods = [
    { time: "09:00 - 10:00", mon: "Maths", tue: "Physics", wed: "Maths", thu: "Chemistry", fri: "English", sat: "PT" },
    { time: "10:00 - 11:00", mon: "Physics", tue: "Chemistry", wed: "English", thu: "Maths", fri: "Physics", sat: "Library" },
  ];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <StudentSidebar />
      <main className="flex-1 p-6 overflow-auto custom-scrollbar">
         <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2"><Clock size={32} className="text-blue-600"/> Class Timetable</h1>
         <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-sm text-left text-gray-600">
               <thead className="bg-gray-50 text-gray-700 font-bold uppercase text-xs">
                  <tr>
                     <th className="px-6 py-4">Time</th>
                     {days.map(d => <th key={d} className="px-6 py-4 text-center">{d}</th>)}
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                  {periods.map((row, i) => (
                     <tr key={i} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-bold text-gray-800 whitespace-nowrap">{row.time}</td>
                        {days.map(d => (
                           <td key={d} className="px-6 py-4 text-center">
                              <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded font-bold text-xs">{row[d.toLowerCase()]}</span>
                           </td>
                        ))}
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </main>
    </div>
  );
};
export default StudentTimetable;
