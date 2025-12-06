import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/Admin/Sidebar";
import { db } from "../../firebase";
import { ref, onValue, update, get, child } from "firebase/database";
import { 
  CheckSquareOffset, CalendarBlank, User, Check, X, Clock, ArrowLeft, FunnelSimple 
} from "phosphor-react";

const Attendance = () => {
  const [classes, setClasses] = useState([]); // List of classes e.g. "10-A"
  const [selectedClass, setSelectedClass] = useState(null); // Currently viewing class
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]); // Default Today
  
  const [students, setStudents] = useState([]); // List of students in selected class
  const [attendanceData, setAttendanceData] = useState({}); // { studentID: "Present" }
  const [loading, setLoading] = useState(false);

  // --- 1. FETCH CLASS LIST ---
  useEffect(() => {
    const fetchClasses = async () => {
      const snapshot = await get(child(ref(db), 'classes'));
      if (snapshot.exists()) {
        const list = Object.values(snapshot.val()).map(c => ({
           id: `${c.className}-${c.section}`, 
           name: `Class ${c.className}-${c.section}`,
           total: c.students || 0
        }));
        setClasses(list);
      }
    };
    fetchClasses();
  }, []);

  // --- 2. FETCH STUDENTS & ATTENDANCE ---
  useEffect(() => {
    if (!selectedClass) return;
    setLoading(true);

    // A. Fetch Students of this Class
    const studentsRef = ref(db, 'students'); // Ideally filter by class here
    // Note: For optimized query, you should use query(ref(db, 'students'), orderByChild('class'), equalTo(selectedClass))
    // For now, assuming 'students' node has all students. Fetching all and filtering (not efficient for large data but works for prototype)
    
    const unsubscribeStudents = onValue(studentsRef, (snapshot) => {
       const data = snapshot.val();
       if(data) {
          const classStudents = Object.keys(data)
             .map(key => ({ id: key, ...data[key] }))
             .filter(s => s.class === selectedClass); // Filter logic
          setStudents(classStudents);
       } else {
          setStudents([]);
       }
    });

    // B. Fetch Attendance for Selected Date
    const attendanceRef = ref(db, `attendance/${selectedClass}/${selectedDate}`);
    const unsubscribeAttendance = onValue(attendanceRef, (snapshot) => {
       setAttendanceData(snapshot.val() || {});
       setLoading(false);
    });

    return () => { unsubscribeStudents(); unsubscribeAttendance(); };
  }, [selectedClass, selectedDate]);

  // --- 3. MARK ATTENDANCE ---
  const handleMark = async (studentId, status) => {
     // status: "Present" | "Absent" | "Late"
     const updates = {};
     updates[`attendance/${selectedClass}/${selectedDate}/${studentId}`] = {
        status: status,
        timestamp: new Date().toISOString(),
        markedBy: "Admin"
     };
     await update(ref(db), updates);
  };

  // --- 4. STATS ---
  const presentCount = Object.values(attendanceData).filter(r => r.status === 'Present').length;
  const absentCount = Object.values(attendanceData).filter(r => r.status === 'Absent').length;
  const attendancePercent = students.length > 0 ? Math.round((presentCount / students.length) * 100) : 0;


  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />

      <main className="flex-1 p-6 overflow-hidden flex flex-col">
        
        {/* Header */}
        <header className="mb-6 shrink-0 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <CheckSquareOffset size={32} className="text-green-600" weight="duotone" />
              Attendance Tracker
            </h1>
            <p className="text-gray-500 text-sm mt-1">Monitor & Edit Daily Attendance</p>
          </div>
        </header>

        <section className="flex-1 overflow-hidden flex flex-col bg-white rounded-2xl shadow-sm border border-gray-200">
          
          {/* VIEW 1: CLASS SELECTOR */}
          {!selectedClass ? (
             <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                <h3 className="font-bold text-gray-700 mb-4">Select a Class</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                   {classes.map(cls => (
                      <div 
                         key={cls.id} 
                         onClick={() => setSelectedClass(cls.id)}
                         className="p-5 border border-gray-200 rounded-xl hover:border-green-500 hover:shadow-md cursor-pointer transition group bg-gray-50 hover:bg-green-50"
                      >
                         <div className="flex justify-between items-start mb-2">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-green-600 font-bold">
                               {cls.id.substring(0,2)}
                            </div>
                            <span className="text-xs font-bold bg-white px-2 py-1 rounded text-gray-500 group-hover:text-green-600">{cls.total} Students</span>
                         </div>
                         <h4 className="font-bold text-gray-800 text-lg">{cls.name}</h4>
                         <p className="text-xs text-gray-400 mt-1 group-hover:text-green-600 transition">Click to view →</p>
                      </div>
                   ))}
                   {classes.length === 0 && <div className="col-span-full text-center py-10 text-gray-400">Loading Classes...</div>}
                </div>
             </div>
          ) : (
             
             // VIEW 2: ATTENDANCE SHEET
             <div className="flex-1 flex flex-col overflow-hidden">
                
                {/* Toolbar */}
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                   <div className="flex items-center gap-4">
                      <button onClick={() => setSelectedClass(null)} className="p-2 hover:bg-white rounded-full text-gray-500"><ArrowLeft size={20} weight="bold"/></button>
                      <div>
                         <h3 className="font-bold text-gray-800 text-lg">Class {selectedClass}</h3>
                         <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>Total: {students.length}</span>
                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                            <span className="text-green-600 font-bold">{attendancePercent}% Present</span>
                         </div>
                      </div>
                   </div>

                   <div className="flex items-center gap-3">
                      {/* Date Picker */}
                      <div className="relative">
                         <CalendarBlank className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                         <input 
                            type="date" 
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 outline-none focus:border-green-500"
                         />
                      </div>
                      <button className="p-2 bg-white border rounded-lg text-gray-500 hover:text-green-600"><FunnelSimple size={20}/></button>
                   </div>
                </div>

                {/* Students List */}
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                   {loading ? (
                      <div className="text-center py-20 text-gray-400">Loading Data...</div>
                   ) : students.length === 0 ? (
                      <div className="text-center py-20 text-gray-400">No students found in this class.</div>
                   ) : (
                      <table className="w-full border-collapse">
                         <thead className="text-left sticky top-0 bg-white z-10">
                            <tr className="text-xs font-bold text-gray-400 border-b border-gray-100">
                               <th className="pb-3 pl-4">Student Name</th>
                               <th className="pb-3">Roll No</th>
                               <th className="pb-3 text-center">Status</th>
                               <th className="pb-3 text-right pr-4">Actions</th>
                            </tr>
                         </thead>
                         <tbody>
                            {students.map((student) => {
                               const record = attendanceData[student.id];
                               const status = record?.status || "Not Marked";
                               
                               return (
                                  <tr key={student.id} className="border-b border-gray-50 hover:bg-gray-50 transition group">
                                     <td className="py-3 pl-4">
                                        <div className="flex items-center gap-3">
                                           <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold">
                                              {student.name.charAt(0)}
                                           </div>
                                           <span className="font-bold text-sm text-gray-700">{student.name}</span>
                                        </div>
                                     </td>
                                     <td className="py-3 text-sm text-gray-500 font-mono">{student.rollNo || "N/A"}</td>
                                     <td className="py-3 text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold inline-block w-24 text-center ${
                                           status === 'Present' ? 'bg-green-100 text-green-700' :
                                           status === 'Absent' ? 'bg-red-100 text-red-700' :
                                           status === 'Late' ? 'bg-yellow-100 text-yellow-700' :
                                           'bg-gray-100 text-gray-400'
                                        }`}>
                                           {status}
                                        </span>
                                     </td>
                                     <td className="py-3 text-right pr-4">
                                        <div className="flex justify-end gap-1 opacity-100"> {/* Always visible for admin */}
                                           <button 
                                              onClick={() => handleMark(student.id, "Present")}
                                              title="Mark Present"
                                              className={`p-2 rounded-lg transition ${status === 'Present' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-400 hover:bg-green-50 hover:text-green-600'}`}
                                           >
                                              <Check size={16} weight="bold"/>
                                           </button>
                                           <button 
                                              onClick={() => handleMark(student.id, "Absent")}
                                              title="Mark Absent"
                                              className={`p-2 rounded-lg transition ${status === 'Absent' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-600'}`}
                                           >
                                              <X size={16} weight="bold"/>
                                           </button>
                                           <button 
                                              onClick={() => handleMark(student.id, "Late")}
                                              title="Mark Late"
                                              className={`p-2 rounded-lg transition ${status === 'Late' ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-400 hover:bg-yellow-50 hover:text-yellow-600'}`}
                                           >
                                              <Clock size={16} weight="bold"/>
                                           </button>
                                        </div>
                                     </td>
                                  </tr>
                               )
                            })}
                         </tbody>
                      </table>
                   )}
                </div>
             </div>
          )}

        </section>

      </main>
    </div>
  );
};

export default Attendance;
