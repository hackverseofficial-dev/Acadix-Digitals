import React, { useState } from "react";
import ClerkSidebar from "../../Components/Clerk/ClerkSidebar";
import TimetableClassCard from "../../Components/Admin/TimetableClassCard"; // Reusing Admin Component
import TimetableView from "../../Components/Admin/TimetableView"; // Reusing Admin Component
import { CalendarCheck } from "phosphor-react";

const Timetable = () => {
  const [selectedClass, setSelectedClass] = useState(null);

  // Dummy Classes Data (Baad mein Firebase se aayega)
  const classes = [
    { id: 1, className: "10-A", students: 40, classTeacher: "Mr. Rakesh", periodsPerDay: 8 },
    { id: 2, className: "10-B", students: 38, classTeacher: "Mrs. Sunita", periodsPerDay: 8 },
    { id: 3, className: "12-Sci", students: 35, classTeacher: "Mr. Vikram", periodsPerDay: 9 },
    { id: 4, className: "9-A", students: 45, classTeacher: "Ms. Priya", periodsPerDay: 7 },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <ClerkSidebar />

      <main className="flex-1 p-6 overflow-hidden flex flex-col">
        <header className="mb-6 shrink-0">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <CalendarCheck size={32} className="text-purple-600" weight="duotone" />
            Timetable Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">View and edit class schedules</p>
        </header>

        <section className="flex-1 overflow-y-auto custom-scrollbar">
          {selectedClass ? (
            <TimetableView 
               classData={selectedClass} 
               onBack={() => setSelectedClass(null)} 
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
              {classes.map((cls) => (
                <TimetableClassCard 
                  key={cls.id} 
                  classData={cls} 
                  onClick={() => setSelectedClass(cls)} 
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Timetable;
