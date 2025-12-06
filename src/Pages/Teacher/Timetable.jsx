import React from "react";
import TeacherSidebar from "../../Components/Teacher/TeacherSidebar";
import { Clock } from "phosphor-react";

const TeacherTimetable = () => {
  // Static Timetable Data
  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const periods = [
    { time: "09:00 - 10:00", mon: "10-A (Phy)", tue: "12-Sci (Phy)", wed: "Free", thu: "10-A (Phy)", fri: "10-B (Phy)", sat: "Meeting" },
    { time: "10:00 - 11:00", mon: "Free", tue: "10-A (Lab)", wed: "12-Sci (Lab)", thu: "Free", fri: "10-A (Lab)", sat: "Activity" },
    // ... add more rows
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <TeacherSidebar />
      <main className="flex-1 p-6 overflow-hidden flex flex-col">
         
         <header className="mb-6 shrink-0">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
               <Clock size={32} className="text-blue-600" weight="duotone" />
               My Timetable
            </h1>
         </header>

         <div className="flex-1 overflow-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-4 custom-scrollbar">
            <table className="w-full text-sm text-left text-gray-600">
               <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                  <tr>
                     <th className="px-6 py-4 font-bold">Time / Day</th>
                     {weekDays.map(day => <th key={day} className="px-6 py-4 font-bold text-center">{day}</th>)}
                  </tr>
               </thead>
               <tbody>
                  {periods.map((row, idx) => (
                     <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition">
                        <th className="px-6 py-4 font-bold text-gray-800 bg-gray-50/50 whitespace-nowrap">{row.time}</th>
                        {weekDays.map(day => (
                           <td key={day} className="px-6 py-4 text-center font-medium">
                              {row[day.toLowerCase().substring(0,3)] !== "Free" ? (
                                 <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg font-bold text-xs shadow-sm block w-max mx-auto">
                                    {row[day.toLowerCase().substring(0,3)]}
                                 </span>
                              ) : (
                                 <span className="text-gray-300">-</span>
                              )}
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

export default TeacherTimetable;
