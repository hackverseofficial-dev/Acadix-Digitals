import React from "react";
import { Users, ChartPieSlice, ArrowRight } from "phosphor-react";

const AttendanceClassCard = ({ classData, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md hover:border-green-200 cursor-pointer transition-all group"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Class {classData.className}</h3>
          <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
             <Users size={14} /> {classData.totalStudents} Students
          </div>
        </div>
        <div className="bg-green-50 text-green-600 p-2 rounded-full group-hover:bg-green-600 group-hover:text-white transition-colors">
          <ArrowRight size={20} />
        </div>
      </div>

      {/* Attendance Quick Stats */}
      <div className="space-y-2">
         <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-500">Today's Avg</span>
            <span className="font-bold text-gray-800">{classData.todayAvg}%</span>
         </div>
         <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div className="bg-green-500 h-full rounded-full" style={{ width: `${classData.todayAvg}%` }}></div>
         </div>
      </div>
    </div>
  );
};

export default AttendanceClassCard;
