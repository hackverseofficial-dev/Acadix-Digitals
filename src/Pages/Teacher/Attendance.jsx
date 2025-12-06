import React, { useState } from "react";
import TeacherSidebar from "../../Components/Teacher/TeacherSidebar";
import { CheckSquare, CaretRight } from "phosphor-react";
import AttendanceView from "../../Components/Admin/AttendanceView"; // Reusing the Component we made earlier

const TeacherAttendance = () => {
  const [selectedClass, setSelectedClass] = useState(null);

  // Only Assigned Classes
  const myClasses = [
    { id: 1, className: "10-A", subject: "Class Teacher", students: 42 },
    { id: 2, className: "12-Sci", subject: "Physics", students: 35 },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <TeacherSidebar />
      <main className="flex-1 p-6 overflow-hidden flex flex-col">
         
         <header className="mb-6 shrink-0">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
               <CheckSquare size={32} className="text-green-600" weight="duotone" />
               Mark Attendance
            </h1>
            <p className="text-sm text-gray-500 mt-1">Daily register for your classes</p>
         </header>

         <div className="flex-1 overflow-y-auto custom-scrollbar">
            {selectedClass ? (
               <AttendanceView 
                  classData={selectedClass} 
                  onBack={() => setSelectedClass(null)} 
               />
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myClasses.map((cls) => (
                     <div 
                        key={cls.id} onClick={() => setSelectedClass(cls)}
                        className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-green-200 cursor-pointer transition group"
                     >
                        <div className="flex justify-between items-start mb-4">
                           <h3 className="text-xl font-bold text-gray-800">{cls.className}</h3>
                           <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition">
                              <CaretRight size={20} weight="bold"/>
                           </div>
                        </div>
                        <p className="text-sm text-gray-500 font-bold mb-1">{cls.subject}</p>
                        <p className="text-xs text-gray-400">{cls.students} Students</p>
                     </div>
                  ))}
               </div>
            )}
         </div>

      </main>
    </div>
  );
};

export default TeacherAttendance;
