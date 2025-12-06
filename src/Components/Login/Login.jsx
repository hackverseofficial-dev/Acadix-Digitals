import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase"; // Adjust path
import { ref, get, query, orderByChild, equalTo } from "firebase/database";
import { Eye, EyeSlash, Spinner } from "phosphor-react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Search in Faculty Table (Admin, Clerk, Teacher)
      const facultyRef = query(ref(db, 'faculty'), orderByChild('username'), equalTo(username));
      const facultySnap = await get(facultyRef);

      if (facultySnap.exists()) {
        const userKey = Object.keys(facultySnap.val())[0];
        const userData = facultySnap.val()[userKey];

        if (userData.password === password) {
          loginUser(userKey, userData.role, userData.name);
          return;
        } else {
          setError("Invalid Password for Staff.");
          setLoading(false);
          return;
        }
      }

      // 2. Search in Students Table (If not found in Faculty)
      const studentRef = query(ref(db, 'students'), orderByChild('username'), equalTo(username));
      const studentSnap = await get(studentRef);

      if (studentSnap.exists()) {
        const userKey = Object.keys(studentSnap.val())[0];
        const userData = studentSnap.val()[userKey];

        if (userData.password === password) {
          loginUser(userKey, "Student", userData.name); // Force Role 'Student' if missing
          return;
        } else {
          setError("Invalid Password for Student.");
          setLoading(false);
          return;
        }
      }

      // 3. User Not Found in Both Tables
      setError("User not found. Check username.");
      setLoading(false);

    } catch (err) {
      console.error(err);
      setError("Login Error: " + err.message);
      setLoading(false);
    }
  };

  const loginUser = (id, role, name) => {
    localStorage.setItem("userId", id);
    localStorage.setItem("userRole", role);
    localStorage.setItem("userName", name);

    // Redirect based on Role
    if (role === 'Admin') navigate('/admin/dashboard');
    else if (role === 'Clerk') navigate('/clerk/dashboard');
    else if (role === 'Teacher') navigate('/teacher/dashboard');
    else if (role === 'Student') navigate('/student/dashboard');
    else setError("Unknown Role assigned.");
    
    setLoading(false);
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 p-4">
      <div className="flex w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex-col md:flex-row">
        
        {/* Left Side (Banner) */}
        <div className="w-full md:w-1/2 bg-indigo-600 p-12 text-white flex flex-col justify-center items-center text-center relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
           <h1 className="text-4xl font-bold mb-2 z-10">Acadix.</h1>
           <p className="text-indigo-200 z-10">Empowering Education</p>
        </div>

        {/* Right Side (Form) */}
        <div className="w-full md:w-1/2 p-12 flex flex-col justify-center">
           <h2 className="text-2xl font-bold text-gray-800 mb-1">Welcome Back</h2>
           <p className="text-sm text-gray-400 mb-8">Enter your credentials to access</p>

           <form onSubmit={handleLogin} className="space-y-5">
              <div>
                 <label className="text-xs font-bold text-gray-500 uppercase">Username</label>
                 <input 
                    type="text" 
                    required
                    className="w-full border border-gray-200 p-3 rounded-xl mt-1 outline-none focus:border-indigo-500 transition font-medium"
                    placeholder="e.g. Rohan2005@acadix"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                 />
              </div>

              <div>
                 <label className="text-xs font-bold text-gray-500 uppercase">Password</label>
                 <div className="relative">
                    <input 
                       type={showPassword ? "text" : "password"}
                       required
                       className="w-full border border-gray-200 p-3 rounded-xl mt-1 outline-none focus:border-indigo-500 transition font-medium"
                       placeholder="••••••••"
                       value={password}
                       onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute right-3 top-4 text-gray-400 hover:text-indigo-600">
                       {showPassword ? <EyeSlash size={20}/> : <Eye size={20}/>}
                    </button>
                 </div>
              </div>

              {error && (
                 <div className="p-3 bg-red-50 text-red-500 text-sm rounded-lg font-medium border border-red-100 animate-pulse">
                    {error}
                 </div>
              )}

              <button disabled={loading} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 flex justify-center items-center">
                 {loading ? <Spinner className="animate-spin" size={20} /> : "Login"}
              </button>
           </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
