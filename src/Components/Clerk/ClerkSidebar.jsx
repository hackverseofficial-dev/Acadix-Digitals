import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  SquaresFour, 
  Student, 
  Users, 
  Bus, 
  Clock, 
  Megaphone, // Notice icon change kiya hai taaki alag lage
  Exam,      // Examinations ke liye
  User
} from "phosphor-react";

const ClerkSidebar = () => {
  const location = useLocation();

  // Function to check active status
  const isActive = (path) => {
    return location.pathname === path 
      ? "bg-gray-700 text-white shadow-md" 
      : "text-gray-300 hover:bg-gray-800 hover:text-white";
  };

  return (
    <aside className="w-64 bg-gray-900 text-white h-screen flex flex-col sticky top-0 left-0 overflow-y-none no-scrollbar border-r border-gray-800">
      
      {/* Header / Branding */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">A</div>
        <span className="text-xl font-bold text-white tracking-tight">Acadix<span className="text-indigo-400">.</span></span>
      </div>

      {/* Profile Section */}
      <div className="p-6 flex flex-col items-center border-b border-gray-800">
        <div className="w-20 h-20 bg-gray-700 rounded-full mb-4 flex items-center justify-center text-gray-300 overflow-hidden border-2 border-gray-600">
           {/* Agar image lagani hai to yahan <img> tag use karo */}
           <img src="https://ui-avatars.com/api/?name=Rakesh+Kumar&background=4F46E5&color=fff" alt="Clerk" className="w-full h-full object-cover"/>
        </div>
        <h2 className="text-xl font-semibold">Clerk Portal</h2>
        <p className="text-gray-400 text-xs mt-1">Rakesh Kumar</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          <li>
            <Link
              to="/clerk/dashboard"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive("/clerk/dashboard")}`}
            >
              <SquaresFour size={24} />
              <span className="font-medium">Dashboard</span>
            </Link>
          </li>

          <li>
            <Link
              to="/clerk/classes"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive("/clerk/classes")}`}
            >
              <Student size={24} /> {/* Using Student icon for Classes/Chalkboard context */}
              <span className="font-medium">Classes</span>
            </Link>
          </li>

          <li>
            <Link
              to="/clerk/students"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive("/clerk/students")}`}
            >
              <Users size={24} />
              <span className="font-medium">Students</span>
            </Link>
          </li>

          <li>
            <Link
              to="/clerk/faculty"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive("/clerk/faculty")}`}
            >
              <User size={24} />
              <span className="font-medium">Faculty</span>
            </Link>
          </li>

          <li>
            <Link
              to="/clerk/transportation"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive("/clerk/transportation")}`}
            >
              <Bus size={24} />
              <span className="font-medium">Transportation</span>
            </Link>
          </li>

          <li>
            <Link
              to="/clerk/timetable"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive("/clerk/timetable")}`}
            >
              <Clock size={24} />
              <span className="font-medium">Timetable</span>
            </Link>
          </li>

          <li>
            <Link
              to="/clerk/notices"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive("/clerk/notices")}`}
            >
              <Megaphone size={24} />
              <span className="font-medium">Notices</span>
            </Link>
          </li>

          <li>
            <Link
              to="/clerk/examinations"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive("/clerk/examinations")}`}
            >
              <Exam size={24} />
              <span className="font-medium">Examinations</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Logout Section */}
      <div className="p-4 border-t border-gray-800">
        <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors font-medium flex justify-center items-center gap-2">
           Logout
        </button>
      </div>
    </aside>
  );
};

export default ClerkSidebar;
