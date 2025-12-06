import React, { useState, useEffect } from "react";
import TeacherSidebar from "../../Components/Teacher/TeacherSidebar";
import { db } from "../../firebase"; 
import { ref, onValue, get, child, query, orderByChild, equalTo } from "firebase/database";
import { 
  ChalkboardTeacher, Users, BookOpen, CaretRight, 
  ArrowLeft, DotsThree, Spinner 
} from "phosphor-react";

const TeacherClasses = () => {
  const [loading, setLoading] = useState(true);
  const [teacherData, setTeacherData] = useState(null);
  const [myClasses, setMyClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [studentsList, setStudentsList] = useState([]);

  // --- 1. FETCH TEACHER & CLASSES (With Duplicate Logic) ---
  useEffect(() => {
    const fetchMyData = async () => {
       const userId = localStorage.getItem("userId");
       if(!userId) return alert("Please Login First!");

       const snapshot = await get(child(ref(db), `faculty/${userId}`));
       if(snapshot.exists()) {
          const tData = snapshot.val();
          setTeacherData(tData);

          let classesArr = [];
          let addedClassNames = new Set(); 

          // A. If Class Teacher (Priority)
          if(tData.isClassTeacher && tData.classTeacherOf) {
             classesArr.push({
                id: "ct-main",
                name: tData.classTeacherOf,
                subject: "Class Teacher", 
                type: "Class Teacher",
                room: "Main Classroom",
                isClassTeacher: true
             });
             addedClassNames.add(tData.classTeacherOf);
          }

          // B. Subject Classes
          if(tData.teachingSubjects && tData.teachingSubjects.length > 0) {
             tData.teachingSubjects.forEach((sub, idx) => {
                if (addedClassNames.has(sub.class)) {
                    // Update existing to show both roles
                    const existingIndex = classesArr.findIndex(c => c.name === sub.class);
                    if (existingIndex !== -1) {
                        classesArr[existingIndex].subject += ` & ${sub.subject}`;
                    }
                } else {
                    classesArr.push({
                       id: `sub-${idx}`,
                       name: sub.class,
                       subject: sub.subject,
                       type: "Subject Teacher",
                       room: "Assigned Period",
                       isClassTeacher: false
                    });
                    addedClassNames.add(sub.class);
                }
             });
          }
          setMyClasses(classesArr);
       }
       setLoading(false);
    };

    fetchMyData();
  }, []);

  // --- 2. FETCH STUDENTS (When Class Selected) ---
  useEffect(() => {
     if(selectedClass) {
        // Query Students by 'className' 
        const q = query(ref(db, 'students'), orderByChild('className'), equalTo(selectedClass.name));
        const unsubscribe = onValue(q, (snapshot) => {
            const data = snapshot.val();
            if(data) setStudentsList(Object.keys(data).map(key => ({ id: key, ...data[key] })));
            else setStudentsList([]);
        });
        return () => unsubscribe();
     }
  }, [selectedClass]);


  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <TeacherSidebar />
      
      <main className="flex-1 p-6 overflow-y-auto custom-scrollbar">
        
        {/* Loading State */}
        {loading && (
           <div className="flex justify-center items-center h-full"><Spinner className="animate-spin text-indigo-600" size={32}/></div>
        )}

        {!loading && (
           <>
              {/* Header */}
              <div className="flex items-center gap-4 mb-8">
                 {selectedClass && (
                    <button onClick={() => setSelectedClass(null)} className="p-2 hover:bg-gray-200 rounded-full transition text-gray-600">
                       <ArrowLeft size={24} />
                    </button>
                 )}
                 <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                       {selectedClass ? selectedClass.name : "My Classes"}
                    </h1>
                    <p className="text-sm text-gray-500">
                       {selectedClass ? `Subject: ${selectedClass.subject} • ${selectedClass.type}` : "Manage your assigned classes & students"}
                    </p>
                 </div>
              </div>

              {/* VIEW 1: GRID OF CLASSES */}
              {!selectedClass && (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myClasses.length > 0 ? (
                       myClasses.map((cls) => (
                          <div 
                             key={cls.id} 
                             onClick={() => setSelectedClass(cls)}
                             className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-indigo-200 transition cursor-pointer group relative overflow-hidden"
                          >
                             <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${cls.type==='Class Teacher' ? 'from-indigo-500 to-purple-500' : 'from-orange-400 to-red-400'}`}></div>

                             <div className="flex justify-between items-start mb-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md ${cls.type === 'Class Teacher' ? 'bg-indigo-600' : 'bg-orange-500'}`}>
                                   <ChalkboardTeacher size={24} weight="duotone" />
                                </div>
                                {cls.type === 'Class Teacher' && (
                                   <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase rounded border border-indigo-100">Class Teacher</span>
                                )}
                             </div>

                             <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-indigo-700 transition">{cls.name}</h3>
                             <p className="text-sm text-gray-500 font-medium flex items-center gap-2">
                                <BookOpen size={16} className="text-indigo-400"/> {cls.subject}
                             </p>

                             <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                                <div className="flex items-center gap-2 text-gray-600 text-sm font-bold">
                                   <Users size={18} /> View Students
                                </div>
                                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition">
                                   <CaretRight size={16} weight="bold"/>
                                </div>
                             </div>
                          </div>
                       ))
                    ) : (
                       <div className="col-span-full text-center py-20 text-gray-400"><ChalkboardTeacher size={48} className="mx-auto mb-2 opacity-20"/><p>No classes assigned to you yet.</p></div>
                    )}
                 </div>
              )}

              {/* VIEW 2: SELECTED CLASS DETAIL (Only Student List Now) */}
              {selectedClass && (
                 <div className="animate-fade-in">
                    
                    {/* Student List */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                       <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                          <h3 className="font-bold text-gray-700">Student List</h3>
                          <span className="text-xs font-bold bg-white px-2 py-1 rounded border border-gray-200 text-gray-500">Total: {studentsList.length}</span>
                       </div>
                       
                       {studentsList.length > 0 ? (
                          <div className="divide-y divide-gray-100">
                             {studentsList.map((student) => (
                                <div key={student.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition">
                                   <div className="flex items-center gap-4">
                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${student.gender==='Male'?'bg-blue-500':'bg-pink-500'}`}>
                                         {student.name[0]}
                                      </div>
                                      <div>
                                         <h4 className="font-bold text-gray-800 text-sm">{student.name}</h4>
                                         <p className="text-xs text-gray-400">Roll No: {student.rollNo || "-"}</p>
                                      </div>
                                   </div>
                                   <div className="flex items-center gap-4">
                                      {/* Dummy Status for now */}
                                      <span className="text-xs font-bold px-2 py-1 rounded text-green-600 bg-green-50">Present</span>
                                      <button className="text-gray-400 hover:text-indigo-600 p-2"><DotsThree size={24} weight="bold"/></button>
                                   </div>
                                </div>
                             ))}
                          </div>
                       ) : (
                          <div className="p-10 text-center text-gray-400 text-sm">No students found in this class.</div>
                       )}
                    </div>

                 </div>
              )}
           </>
        )}
      </main>
    </div>
  );
};

export default TeacherClasses;
