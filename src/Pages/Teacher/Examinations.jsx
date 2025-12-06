import React, { useState } from "react";
import TeacherSidebar from "../../Components/Teacher/TeacherSidebar";
import { Exam, Plus, UploadSimple, DownloadSimple, CaretDown } from "phosphor-react";

const TeacherExams = () => {
  // Dummy Data
  const [exams, setExams] = useState([
    { id: 1, title: "Unit Test 1", class: "10-A", subject: "Physics", date: "15 Oct 2025", status: "Scheduled" },
    { id: 2, title: "Chapter 4 Quiz", class: "12-Sci", subject: "Physics", date: "10 Oct 2025", status: "Completed" },
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [newExam, setNewExam] = useState({ title: "", class: "", date: "", type: "Unit Test" });

  const handleCreate = () => {
    setExams([...exams, { ...newExam, id: Date.now(), subject: "Physics", status: "Scheduled" }]);
    setIsCreating(false);
    setNewExam({ title: "", class: "", date: "", type: "Unit Test" });
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <TeacherSidebar />
      
      <main className="flex-1 p-6 overflow-y-auto custom-scrollbar">
         
         <header className="flex justify-between items-center mb-8">
            <div>
               <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Exam size={32} className="text-indigo-600" weight="duotone" />
                  Examinations & Marks
               </h1>
               <p className="text-sm text-gray-500 mt-1">Schedule tests and manage results</p>
            </div>
            <button 
               onClick={() => setIsCreating(true)}
               className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold shadow-lg hover:bg-indigo-700 flex items-center gap-2 transition"
            >
               <Plus size={20} weight="bold"/> Schedule Exam
            </button>
         </header>

         {/* CREATE EXAM MODAL */}
         {isCreating && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
               <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md animate-fade-in">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Schedule New Exam</h3>
                  
                  <div className="space-y-4">
                     <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Exam Title</label>
                        <input type="text" className="w-full border p-2 rounded-lg mt-1 outline-none focus:border-indigo-500" placeholder="e.g. Surprise Test"
                           value={newExam.title} onChange={e => setNewExam({...newExam, title: e.target.value})} />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="text-xs font-bold text-gray-500 uppercase">Class</label>
                           <select className="w-full border p-2 rounded-lg mt-1 outline-none bg-white"
                              value={newExam.class} onChange={e => setNewExam({...newExam, class: e.target.value})}>
                              <option value="">Select</option>
                              <option value="10-A">10-A</option>
                              <option value="12-Sci">12-Sci</option>
                           </select>
                        </div>
                        <div>
                           <label className="text-xs font-bold text-gray-500 uppercase">Date</label>
                           <input type="date" className="w-full border p-2 rounded-lg mt-1 outline-none"
                              value={newExam.date} onChange={e => setNewExam({...newExam, date: e.target.value})} />
                        </div>
                     </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                     <button onClick={() => setIsCreating(false)} className="flex-1 py-2 text-gray-500 font-bold hover:bg-gray-100 rounded-lg">Cancel</button>
                     <button onClick={handleCreate} className="flex-1 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700">Schedule</button>
                  </div>
               </div>
            </div>
         )}

         {/* EXAM LIST */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* UPCOMING */}
            <div>
               <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span> Upcoming / Scheduled
               </h3>
               <div className="space-y-3">
                  {exams.filter(e => e.status === 'Scheduled').map(exam => (
                     <div key={exam.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition">
                        <div className="flex justify-between items-start mb-2">
                           <div>
                              <h4 className="font-bold text-gray-800">{exam.title}</h4>
                              <p className="text-xs text-gray-500">Class: {exam.class} • {exam.date}</p>
                           </div>
                           <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-1 rounded uppercase">{exam.status}</span>
                        </div>
                        <div className="flex gap-2 mt-4">
                           <button className="flex-1 py-1.5 text-xs font-bold bg-indigo-50 text-indigo-600 rounded hover:bg-indigo-100">Edit</button>
                           <button className="flex-1 py-1.5 text-xs font-bold bg-red-50 text-red-500 rounded hover:bg-red-100">Cancel</button>
                        </div>
                     </div>
                  ))}
                  {exams.filter(e => e.status === 'Scheduled').length === 0 && <p className="text-gray-400 text-sm italic">No upcoming exams.</p>}
               </div>
            </div>

            {/* COMPLETED / MARKS ENTRY */}
            <div>
               <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span> Completed (Enter Marks)
               </h3>
               <div className="space-y-3">
                  {exams.filter(e => e.status === 'Completed').map(exam => (
                     <div key={exam.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                           <div>
                              <h4 className="font-bold text-gray-800">{exam.title}</h4>
                              <p className="text-xs text-gray-500">Held on {exam.date}</p>
                           </div>
                           <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded uppercase">Completed</span>
                        </div>
                        
                        {/* Marks Actions */}
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex items-center justify-between gap-2">
                           <button className="flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-indigo-600 bg-white border border-gray-200 px-3 py-2 rounded-lg flex-1 justify-center hover:border-indigo-300 transition">
                              <UploadSimple size={16}/> Upload Excel
                           </button>
                           <button className="flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-indigo-600 bg-white border border-gray-200 px-3 py-2 rounded-lg flex-1 justify-center hover:border-indigo-300 transition">
                              <CaretDown size={16}/> Enter Manually
                           </button>
                        </div>
                        <div className="mt-2 text-right">
                           <button className="text-[10px] text-indigo-500 font-bold hover:underline flex items-center justify-end gap-1">
                              <DownloadSimple/> Download Result Sheet
                           </button>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

         </div>
      </main>
    </div>
  );
};

export default TeacherExams;
