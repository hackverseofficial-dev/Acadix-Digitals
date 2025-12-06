import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  SquaresFour, 
  Student, 
  Users, 
  Notebook, 
  CalendarBlank, 
  CurrencyInr, 
  Clock, 
  CheckSquare,
  User,
  Bus
} from "phosphor-react";

const Sidebar = () => {
  const location = useLocation();

  // Function to check active status
  const isActive = (path) => {
    return location.pathname === path 
      ? "bg-gray-700 text-white shadow-md" 
      : "text-gray-300 hover:bg-gray-800 hover:text-white";
  };

  return (
    <aside className="w-64 bg-gray-900 text-white h-screen flex flex-col sticky top-0 left-0 overflow-y-auto no-scrollbar border-r border-gray-800">
      
      {/* Profile / Header Section */}
      <div className="p-6 flex flex-col items-center border-b border-gray-800">
        <div className="w-20 h-20 bg-gray-700 rounded-full mb-4 flex items-center justify-center text-gray-300">
          <User size={40} weight="fill" />
        </div>
        <h2 className="text-xl font-semibold">Teacher Dashboard</h2>
        <p className="text-gray-400 text-xs mt-1">Early Warning System</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <Link
              to="/admin/dashboard"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive("/admin/dashboard")}`}
            >
              <SquaresFour size={24} />
              <span className="font-medium">Dashboard</span>
            </Link>
          </li>

          <li>
            <Link
              to="/admin/classes"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive("/admin/classes")}`}
            >
              <Student size={24} />
              <span className="font-medium">Classes</span>
            </Link>
          </li>

          <li>
            <Link
              to="/admin/faculty"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive("/admin/faculty")}`}
            >
              <Users size={24} />
              <span className="font-medium">Faculty</span>
            </Link>
          </li>

          <li>
            <Link
              to="/admin/notices"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive("/admin/notices")}`}
            >
              <Notebook size={24} />
              <span className="font-medium">Notices</span>
            </Link>
          </li>

          <li>
            <Link
              to="/admin/leave"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive("/admin/leave")}`}
            >
              <CalendarBlank size={24} />
              <span className="font-medium">Leave Applications</span>
            </Link>
          </li>

          <li>
            <Link
              to="/admin/finance"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive("/admin/finance")}`}
            >
              <CurrencyInr size={24} />
              <span className="font-medium">Finance</span>
            </Link>
          </li>

          <li>
           <Link
            to="/admin/transportation"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive("/admin/transportation")}`}
          >
           <Bus size={24} />
           <span className="font-medium">Transportation</span>
           </Link>
          </li>

          <li>
            <Link
              to="/admin/timetable"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive("/admin/timetable")}`}
            >
              <Clock size={24} />
              <span className="font-medium">Timetable</span>
            </Link>
          </li>

          <li>
            <Link
              to="/admin/attendance"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive("/admin/attendance")}`}
            >
              <CheckSquare size={24} />
              <span className="font-medium">Attendance</span>
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

export default Sidebar;
