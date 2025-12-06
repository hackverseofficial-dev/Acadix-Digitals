import React from "react";
import StudentSidebar from "../../Components/Students/StudentSidebar";
import { Books, Book } from "phosphor-react";

const StudentLibrary = () => {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <StudentSidebar />
      <main className="flex-1 p-6 overflow-y-auto custom-scrollbar">
         <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2"><Books size={32} className="text-orange-600"/> Library</h1>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex gap-4">
               <div className="w-16 h-24 bg-gray-200 rounded flex items-center justify-center text-gray-400"><Book size={32}/></div>
               <div>
                  <h3 className="font-bold text-gray-800">Concepts of Physics</h3>
                  <p className="text-xs text-gray-500 mb-2">H.C. Verma</p>
                  <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-1 rounded">Due: 10 Oct</span>
               </div>
            </div>
         </div>
      </main>
    </div>
  );
};
export default StudentLibrary;
