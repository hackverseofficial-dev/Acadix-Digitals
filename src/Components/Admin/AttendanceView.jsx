import React, { useState } from "react";
import { ArrowLeft, CaretLeft, CaretRight, CalendarBlank, ChartPieSlice, CheckCircle, XCircle, WarningCircle } from "phosphor-react";

const AttendanceView = ({ classData, onBack }) => {
  const [view, setView] = useState("REGISTER"); // 'REGISTER' | 'STUDENT_DETAIL'
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  // Two Date States: One for Class Register, One for Student Detail View
  const [registerDate, setRegisterDate] = useState(new Date());
  const [studentDetailDate, setStudentDetailDate] = useState(new Date());

  // --- DATA ---
  const students = [
    { id: 1, name: "Rohan Sharma", roll: 101, status: "P" },
    { id: 2, name: "Priya Patel", roll: 102, status: "A" }, 
    { id: 3, name: "Amit Verma", roll: 103, status: "P" },
  ];

  // Student Overall Stats
  const studentStats = {
    present: 85,
    total: 100,
    subjects: [
      { name: "Mathematics", present: 40, total: 45 },
      { name: "Physics", present: 35, total: 45 },
      { name: "English", present: 28, total: 30 },
    ]
  };

  // Single Day Detailed Attendance (For Student Detail View)
  // Real app me ye date ke hisaab se change hoga
  const dailyAttendance = [
    { period: 1, time: "09:00 - 10:00", subject: "Mathematics", status: "P" },
    { period: 2, time: "10:00 - 11:00", subject: "Physics", status: "A" },
    { period: 3, time: "11:15 - 12:15", subject: "English", status: "P" },
    { period: 4, time: "12:15 - 01:15", subject: "Chemistry", status: "P" },
  ];

  // --- HELPERS ---
  const formatDate = (date) => date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });

  const changeDate = (dateState, setDateState, days) => {
    const newDate = new Date(dateState);
    newDate.setDate(newDate.getDate() + days);
    setDateState(newDate);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full animate-fade-in overflow-hidden">
      
      {/* HEADER */}
      <div className="p-6 border-b border-gray-100 flex items-center gap-4 shrink-0 bg-white z-10">
        <button 
           onClick={view === 'STUDENT_DETAIL' ? () => setView("REGISTER") : onBack} 
           className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition"
        >
           <ArrowLeft size={24} />
        </button>
        <div>
           <h2 className="text-xl font-bold text-gray-800">
              {view === 'STUDENT_DETAIL' ? selectedStudent.name : `Class ${classData.className}`}
           </h2>
           <p className="text-xs text-gray-500">
              {view === 'STUDENT_DETAIL' ? `Roll: ${selectedStudent.roll}` : "Attendance Register"}
           </p>
        </div>
      </div>

      {/* === VIEW 1: CLASS REGISTER === */}
      {view === "REGISTER" && (
        <div className="flex flex-col h-full overflow-hidden">
           
           {/* Date Shifter */}
           <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-b border-gray-100">
              <button onClick={() => changeDate(registerDate, setRegisterDate, -1)} className="p-2 hover:bg-white rounded-full text-gray-500 transition"><CaretLeft size={20} /></button>
              <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-3 py-1 rounded">
                 <CalendarBlank size={18} className="text-indigo-500"/>
                 <span className="text-sm font-bold text-gray-700">{formatDate(registerDate)}</span>
              </div>
              <button onClick={() => changeDate(registerDate, setRegisterDate, 1)} className="p-2 hover:bg-white rounded-full text-gray-500 transition"><CaretRight size={20} /></button>
           </div>

           {/* List */}
           <div className="overflow-y-auto p-4 space-y-2 flex-1">
              {students.map((student) => (
                 <div key={student.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:shadow-sm transition bg-white">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => {setSelectedStudent(student); setView("STUDENT_DETAIL");}}>
                       <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                          {student.roll}
                       </div>
                       <div>
                          <h4 className="font-bold text-sm text-gray-800">{student.name}</h4>
                          <p className="text-[10px] text-gray-400">View History</p>
                       </div>
                    </div>
                    <div className="flex gap-1">
                       {['P', 'A', 'L'].map((s) => (
                          <button key={s} className={`w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center ${student.status === s ? (s === 'P' ? 'bg-green-500 text-white' : s === 'A' ? 'bg-red-500 text-white' : 'bg-orange-400 text-white') : 'bg-gray-50 text-gray-400'}`}>
                             {s}
                          </button>
                       ))}
                    </div>
                 </div>
              ))}
           </div>
        </div>
      )}

      {/* === VIEW 2: STUDENT DETAIL (DEEP OPTIMIZED) === */}
      {view === "STUDENT_DETAIL" && (
        <div className="flex flex-col h-full overflow-hidden bg-gray-50">
           
           {/* 1. OVERALL SUBJECT STATS (Horizontal Scroll) */}
           <div className="bg-white p-4 border-b border-gray-200">
              <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Overall Performance</h4>
              <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                 {studentStats.subjects.map((sub, i) => (
                    <div key={i} className="min-w-[120px] bg-gray-50 p-2 rounded-lg border border-gray-100 flex flex-col items-center">
                       <span className="text-xs font-bold text-gray-600">{sub.name}</span>
                       <span className={`text-sm font-bold ${((sub.present/sub.total)*100) < 75 ? 'text-red-500' : 'text-green-600'}`}>
                          {Math.round((sub.present/sub.total)*100)}%
                       </span>
                       <span className="text-[10px] text-gray-400">{sub.present}/{sub.total}</span>
                    </div>
                 ))}
              </div>
           </div>

           {/* 2. DATE SHIFTER (Timeline Control) */}
           <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-100 shadow-sm z-10">
              <button onClick={() => changeDate(studentDetailDate, setStudentDetailDate, -1)} className="p-2 hover:bg-gray-50 rounded-full text-gray-500"><CaretLeft size={20} /></button>
              
              {/* Calendar Trigger */}
              <div className="flex flex-col items-center cursor-pointer group">
                 <span className="text-sm font-bold text-indigo-600 group-hover:underline decoration-indigo-300 underline-offset-2">
                    {formatDate(studentDetailDate)}
                 </span>
                 <span className="text-[10px] text-gray-400">Tap to jump date</span>
              </div>

              <button onClick={() => changeDate(studentDetailDate, setStudentDetailDate, 1)} className="p-2 hover:bg-gray-50 rounded-full text-gray-500"><CaretRight size={20} /></button>
           </div>

           {/* 3. DAY-WISE PERIOD LIST */}
           <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {dailyAttendance.map((slot, index) => (
                 <div key={index} className="bg-white p-3 rounded-xl border border-gray-200 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                       <div className="bg-gray-100 w-10 h-10 flex flex-col items-center justify-center rounded-lg text-gray-600">
                          <span className="text-[10px] font-bold">Pd</span>
                          <span className="text-sm font-bold">{slot.period}</span>
                       </div>
                       <div>
                          <h4 className="font-bold text-sm text-gray-800">{slot.subject}</h4>
                          <p className="text-xs text-gray-500">{slot.time}</p>
                       </div>
                    </div>

                    {/* Status Badge */}
                    <div className={`px-3 py-1 rounded-lg font-bold text-xs flex items-center gap-1 border ${
                       slot.status === 'P' 
                       ? 'bg-green-50 text-green-700 border-green-100' 
                       : 'bg-red-50 text-red-700 border-red-100'
                    }`}>
                       {slot.status === 'P' ? <CheckCircle size={14} weight="fill" /> : <XCircle size={14} weight="fill" />}
                       {slot.status === 'P' ? 'Present' : 'Absent'}
                    </div>
                 </div>
              ))}
              
              {/* Note if no data */}
              {/* <div className="text-center text-gray-400 text-xs mt-10">No classes scheduled for this day.</div> */}
           </div>
           
        </div>
      )}

    </div>
  );
};

export default AttendanceView;
