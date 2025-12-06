import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// --- CORE ---
import Login from './Components/Login/Login';

// --- ADMIN PAGES ---
import AdminDashboard from './Pages/Admin/Dashboard';
import AdminClasses from './Pages/Admin/Classes';
import AdminFaculty from './Pages/Admin/Faculty';
import AdminNotices from './Pages/Admin/Notices';
import AdminLeave from './Pages/Admin/Leave';
import AdminFinance from './Pages/Admin/Finance';
import AdminTimetable from './Pages/Admin/Timetable';
import AdminAttendance from './Pages/Admin/Attendance';
import AdminTransportation from './Pages/Admin/Transportation';

// --- CLERK PAGES ---
import ClerkDashboard from './Pages/Clerk/Dashboard';
import ClerkClasses from './Pages/Clerk/Classes';
import ClerkStudents from './Pages/Clerk/Students';
import ClerkFaculty from './Pages/Clerk/Faculty';
import ClerkTransportation from './Pages/Clerk/Transportation';
import ClerkTimetable from './Pages/Clerk/Timetable';
import ClerkNotices from './Pages/Clerk/Notices';
import ClerkExaminations from './Pages/Clerk/Examinations';

// --- TEACHER PAGES ---
import TeacherDashboard from './Pages/Teacher/Dashboard';
import TeacherClasses from './Pages/Teacher/Classes';
import TeacherAttendance from './Pages/Teacher/Attendance';
import TeacherTimetable from './Pages/Teacher/Timetable';
import TeacherAssignments from './Pages/Teacher/Assignments';
import TeacherExams from './Pages/Teacher/Examinations';
import TeacherLeaves from './Pages/Teacher/LeaveApplications';
import TeacherNotices from './Pages/Teacher/Notices';

// --- STUDENT PAGES ---
import StudentDashboard from './Pages/Students/Dashboard';
import StudentClasses from './Pages/Students/MyClasses';
import StudentAttendance from './Pages/Students/Attendance';
import StudentTimetable from './Pages/Students/Timetable';
import StudentAssignments from './Pages/Students/Assignments';
import StudentResults from './Pages/Students/Results';
import StudentFees from './Pages/Students/Fees';
import StudentLibrary from './Pages/Students/Library';
import StudentNotices from './Pages/Students/Notices';


const App = () => {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        
        {/* ======================================================
            DEFAULT LOGIN ROUTE
        ====================================================== */}
        <Route path="/" element={<Login />} />


        {/* ======================================================
            ADMIN ROUTES
        ====================================================== */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/classes" element={<AdminClasses />} />
        <Route path="/admin/faculty" element={<AdminFaculty />} />
        <Route path="/admin/notices" element={<AdminNotices />} />
        <Route path="/admin/leave" element={<AdminLeave />} />
        <Route path="/admin/finance" element={<AdminFinance />} />
        <Route path="/admin/timetable" element={<AdminTimetable />} />
        <Route path="/admin/attendance" element={<AdminAttendance />} />
        <Route path="/admin/transportation" element={<AdminTransportation />} />
        

        {/* ======================================================
            CLERK ROUTES
        ====================================================== */}
        <Route path="/clerk/dashboard" element={<ClerkDashboard />} />
        <Route path="/clerk/classes" element={<ClerkClasses />} />
        <Route path="/clerk/students" element={<ClerkStudents />} />
        <Route path="/clerk/faculty" element={<ClerkFaculty />} />
        <Route path="/clerk/transportation" element={<ClerkTransportation />} />
        <Route path="/clerk/timetable" element={<ClerkTimetable />} />
        <Route path="/clerk/notices" element={<ClerkNotices />} />
        <Route path="/clerk/examinations" element={<ClerkExaminations />} />


        {/* ======================================================
            TEACHER ROUTES
        ====================================================== */}
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/classes" element={<TeacherClasses />} />
        <Route path="/teacher/attendance" element={<TeacherAttendance />} />
        <Route path="/teacher/timetable" element={<TeacherTimetable />} />
        <Route path="/teacher/assignments" element={<TeacherAssignments />} />
        <Route path="/teacher/exams" element={<TeacherExams />} />
        <Route path="/teacher/leaves" element={<TeacherLeaves />} />
        <Route path="/teacher/notices" element={<TeacherNotices />} />


        {/* ======================================================
            STUDENT ROUTES
        ====================================================== */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/classes" element={<StudentClasses />} />
        <Route path="/student/attendance" element={<StudentAttendance />} />
        <Route path="/student/timetable" element={<StudentTimetable />} />
        <Route path="/student/assignments" element={<StudentAssignments />} />
        <Route path="/student/results" element={<StudentResults />} />
        <Route path="/student/fees" element={<StudentFees />} />
        <Route path="/student/library" element={<StudentLibrary />} />
        <Route path="/student/notices" element={<StudentNotices />} />

        {/* Catch-all: redirect unknown routes to login */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
};

export default App;
