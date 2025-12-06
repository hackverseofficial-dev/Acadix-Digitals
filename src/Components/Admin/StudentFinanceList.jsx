import React, { useState } from "react";
import { MagnifyingGlass, PaperPlaneTilt, PencilSimple, ArrowLeft, CurrencyInr } from "phosphor-react";

const StudentFinanceList = ({ classData, onBack }) => {
  // Dummy students data for the selected class
  // Real app mein ye data prop se aayega ya API call se
  const [students, setStudents] = useState([
    { id: 1, name: "Rohan Sharma", roll: "101", total: 50000, paid: 30000, due: 20000 },
    { id: 2, name: "Priya Patel", roll: "102", total: 50000, paid: 50000, due: 0 },
    { id: 3, name: "Amit Verma", roll: "103", total: 50000, paid: 10000, due: 40000 },
    { id: 4, name: "Sneha Gupta", roll: "104", total: 50000, paid: 45000, due: 5000 },
  ]);

  // Handle "Send All SMS"
  const handleSendAllSMS = () => {
    const dueStudents = students.filter(s => s.due > 0);
    alert(`Sending SMS to ${dueStudents.length} students with due fees.`);
  };

  // Handle "Single SMS"
  const handleSingleSMS = (name, amount) => {
    alert(`SMS sent to ${name} for pending amount ₹${amount}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full animate-fade-in">
      
      {/* Header */}
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Class {classData.className} - Fee Status</h2>
            <p className="text-xs text-gray-500 mt-0.5">Manage individual student fees</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={handleSendAllSMS}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition text-sm font-semibold"
          >
            <PaperPlaneTilt size={18} weight="fill" />
            Remind All Due
          </button>
        </div>
      </div>

      {/* Search Bar (Optional) */}
      <div className="p-4 bg-gray-50 border-b border-gray-100">
         <div className="relative max-w-md">
            <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
            <input 
               type="text" 
               placeholder="Search student by name or roll no..." 
               className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-indigo-300"
            />
         </div>
      </div>

      {/* Table List */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Fees</th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Paid</th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Due</th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50 transition">
                <td className="p-4">
                  <p className="font-bold text-gray-800 text-sm">{student.name}</p>
                  <p className="text-xs text-gray-400">Roll: {student.roll}</p>
                </td>
                <td className="p-4 text-sm text-gray-600 font-medium">
                   ₹{student.total.toLocaleString()}
                </td>
                <td className="p-4 text-sm text-green-600 font-medium">
                   ₹{student.paid.toLocaleString()}
                </td>
                <td className="p-4">
                   {student.due > 0 ? (
                      <span className="bg-red-50 text-red-600 px-2 py-1 rounded text-xs font-bold border border-red-100">
                         ₹{student.due.toLocaleString()}
                      </span>
                   ) : (
                      <span className="bg-green-50 text-green-600 px-2 py-1 rounded text-xs font-bold border border-green-100">
                         Paid
                      </span>
                   )}
                </td>
                <td className="p-4 text-right space-x-2">
                  {/* Send SMS Button */}
                  {student.due > 0 && (
                    <button 
                      onClick={() => handleSingleSMS(student.name, student.due)}
                      title="Send Reminder SMS"
                      className="p-2 text-indigo-600 bg-indigo-50 rounded hover:bg-indigo-100 transition"
                    >
                      <PaperPlaneTilt size={18} />
                    </button>
                  )}
                  
                  {/* Edit Button */}
                  <button 
                    title="Edit Fees"
                    className="p-2 text-gray-500 bg-gray-100 rounded hover:bg-gray-200 transition"
                  >
                    <PencilSimple size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentFinanceList;
