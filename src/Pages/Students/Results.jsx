import React from "react";
import StudentSidebar from "../../Components/Students/StudentSidebar";
import { Exam, Trophy } from "phosphor-react";

const StudentResults = () => {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <StudentSidebar />
      <main className="flex-1 p-6 overflow-y-auto custom-scrollbar">
         <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2"><Exam size={32} className="text-indigo-600"/> Exam Results</h1>
         
         {/* Unit Test 1 Card */}
         <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-6">
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
               <h2 className="text-lg font-bold text-gray-800">Unit Test 1</h2>
               <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">Passed</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <ResultItem subject="Physics" marks="18/20" grade="A" />
               <ResultItem subject="Chemistry" marks="15/20" grade="B+" />
               <ResultItem subject="Maths" marks="19/20" grade="A+" />
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
               <p className="text-sm font-bold text-gray-500">Total: 85%</p>
               <button className="text-indigo-600 text-xs font-bold hover:underline">Download Report</button>
            </div>
         </div>
      </main>
    </div>
  );
};

const ResultItem = ({ subject, marks, grade }) => (
   <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex justify-between items-center">
      <div>
         <p className="text-xs font-bold text-gray-400 uppercase">{subject}</p>
         <p className="text-lg font-bold text-gray-800">{marks}</p>
      </div>
      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center font-bold text-indigo-600 border border-gray-200 shadow-sm">{grade}</div>
   </div>
);

export default StudentResults;
