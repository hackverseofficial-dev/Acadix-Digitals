import React from "react";
import { Users, CurrencyInr, ArrowRight } from "phosphor-react";

const ClassCard = ({ classData, onClick }) => {
  const { className, totalStudents, totalFees, paidFees, dueFees } = classData;

  // Calculate percentages for progress bar
  const paidPercentage = (paidFees / totalFees) * 100;

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-200 cursor-pointer transition-all group"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Class {className}</h3>
          <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
            <Users size={14} />
            <span>{totalStudents} Students</span>
          </div>
        </div>
        <div className="bg-indigo-50 text-indigo-600 p-2 rounded-full group-hover:bg-indigo-600 group-hover:text-white transition-colors">
          <ArrowRight size={20} />
        </div>
      </div>

      {/* Financial Stats */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Total Expected</span>
          <span className="font-bold text-gray-800">₹{totalFees.toLocaleString()}</span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
           <div 
              className="bg-green-500 h-full rounded-full" 
              style={{ width: `${paidPercentage}%` }}
           ></div>
        </div>

        <div className="flex justify-between items-center pt-1">
           <div>
              <p className="text-xs text-gray-400">Collected</p>
              <p className="text-sm font-bold text-green-600 flex items-center">
                 <CurrencyInr size={12} /> {paidFees.toLocaleString()}
              </p>
           </div>
           <div className="text-right">
              <p className="text-xs text-gray-400">Pending</p>
              <p className="text-sm font-bold text-red-500 flex items-center justify-end">
                 <CurrencyInr size={12} /> {dueFees.toLocaleString()}
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ClassCard;
