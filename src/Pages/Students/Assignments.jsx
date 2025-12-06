import React from "react";
import StudentSidebar from "../../Components/Students/StudentSidebar";
import { Notebook, FileText, CheckCircle, Clock } from "phosphor-react";

const StudentAssignments = () => {
  const tasks = [
    { id: 1, subject: "Physics", title: "Chapter 4 Notes", status: "Pending", due: "Tomorrow" },
    { id: 2, subject: "English", title: "Essay Writing", status: "Submitted", due: "Yesterday" },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <StudentSidebar />
      <main className="flex-1 p-6 overflow-y-auto custom-scrollbar">
         <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2"><Notebook size={32} className="text-purple-600"/> Assignments</h1>
         <div className="grid gap-4">
            {tasks.map(task => (
               <div key={task.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center">
                  <div className="flex items-center gap-4">
                     <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${task.status === 'Pending' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                        <FileText weight="duotone"/>
                     </div>
                     <div>
                        <h3 className="font-bold text-gray-800">{task.title}</h3>
                        <p className="text-xs text-gray-500">{task.subject} • Due: {task.due}</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <span className={`text-xs font-bold px-2 py-1 rounded uppercase flex items-center gap-1 ${task.status === 'Pending' ? 'text-orange-600 bg-orange-50' : 'text-green-600 bg-green-50'}`}>
                        {task.status === 'Pending' ? <Clock/> : <CheckCircle/>} {task.status}
                     </span>
                     {task.status === 'Pending' && <button className="mt-2 text-xs bg-indigo-600 text-white px-3 py-1.5 rounded font-bold hover:bg-indigo-700">Upload</button>}
                  </div>
               </div>
            ))}
         </div>
      </main>
    </div>
  );
};
export default StudentAssignments;
