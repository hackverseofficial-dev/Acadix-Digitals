import React from "react";
import { Users, ChalkboardTeacher, ArrowRight, Clock } from "phosphor-react";

const TimetableClassCard = ({ classData, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md hover:border-purple-200 cursor-pointer transition-all group"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Class {classData.className}</h3>
          <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
            <Users size={14} />
            <span>{classData.students} Students</span>
          </div>
        </div>
        <div className="bg-purple-50 text-purple-600 p-2 rounded-full group-hover:bg-purple-600 group-hover:text-white transition-colors">
          <ArrowRight size={20} />
        </div>
      </div>

      <div className="space-y-2 border-t border-gray-100 pt-3">
         <div className="flex items-center gap-2 text-sm text-gray-600">
            <ChalkboardTeacher size={18} className="text-purple-500" />
            <span className="font-medium">Class Teacher:</span>
            <span>{classData.classTeacher}</span>
         </div>
         <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock size={18} className="text-blue-500" />
            <span className="font-medium">Avg Periods:</span>
            <span>{classData.periodsPerDay} / Day</span>
         </div>
      </div>
    </div>
  );
};

export default TimetableClassCard;
