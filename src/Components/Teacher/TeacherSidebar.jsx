import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  SquaresFour, 
  Student, 
  CheckSquare, 
  Clock, 
  Exam, 
  Notebook, 
  Megaphone, 
  SignOut,
  ChalkboardTeacher,
  CalendarBlank
} from "phosphor-react";

const TeacherSidebar = () => {
  const location = useLocation();

  // Function to check active status
  const isActive = (path) => {
    return location.pathname === path 
      ? "bg-gray-700 text-white shadow-md" 
      : "text-gray-300 hover:bg-gray-800 hover:text-white";
  };

  return (
    <aside className="w-64 bg-gray-900 text-white h-screen flex flex-col sticky top-0 left-0 overflow-y-auto no-scrollbar border-r border-gray-800">
      
      {/* Header / Branding */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">A</div>
        <span className="text-xl font-bold text-white tracking-tight">Acadix<span className="text-indigo-400">.</span></span>
      </div>

      {/* Profile Section */}
      <div className="p-6 flex flex-col items-center border-b border-gray-800">
        <div className="w-20 h-20 bg-gray-700 rounded-full mb-4 flex items-center justify-center text-gray-300 overflow-hidden border-2 border-gray-600">
           <ChalkboardTeacher size={40} weight="fill" />
        </div>
        <h2 className="text-xl font-semibold">Teacher Portal</h2>
        <p className="text-gray-400 text-xs mt-1">Suresh Singh</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          <li>
            <Link
              to="/teacher/dashboard"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive("/teacher/dashboard")}`}
            >
              <SquaresFour size={24} />
              <span className="font-medium">Dashboard</span>
            </Link>
          </li>

          <li>
            <Link
              to="/teacher/classes"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive("/teacher/classes")}`}
            >
              <Student size={24} />
              <span className="font-medium">My Classes</span>
            </Link>
          </li>

          <li>
            <Link
              to="/teacher/attendance"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive("/teacher/attendance")}`}
            >
              <CheckSquare size={24} />
              <span className="font-medium">Attendance</span>
            </Link>
          </li>

          <li>
            <Link
              to="/teacher/timetable"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive("/teacher/timetable")}`}
            >
              <Clock size={24} />
              <span className="font-medium">My Timetable</span>
            </Link>
          </li>

          <li>
            <Link
              to="/teacher/leaves"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive("/teacher/leaves")}`}
            >
              <CalendarBlank size={24} />
              <span className="font-medium">Leave Applications</span>
            </Link>
          </li>

          <li>
            <Link
              to="/teacher/exams"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive("/teacher/exams")}`}
            >
              <Exam size={24} />
              <span className="font-medium">Examinations</span>
            </Link>
          </li>

          <li>
            <Link
              to="/teacher/assignments"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive("/teacher/assignments")}`}
            >
              <Notebook size={24} />
              <span className="font-medium">Assignments</span>
            </Link>
          </li>

          <li>
            <Link
              to="/teacher/notices"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive("/teacher/notices")}`}
            >
              <Megaphone size={24} />
              <span className="font-medium">Notices</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Logout Section */}
      <div className="p-4 border-t border-gray-800">
        <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors font-medium flex justify-center items-center gap-2">
           <SignOut size={20} />
           Logout
        </button>
      </div>
    </aside>
  );
};

export default TeacherSidebar;
