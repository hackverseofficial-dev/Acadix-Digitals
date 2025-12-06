import React, { useState, useEffect } from "react";
import ClerkSidebar from "../../Components/Clerk/ClerkSidebar";
import { db } from "../../firebase"; 
import { ref, onValue, push, remove, get, child } from "firebase/database";
import { FileXls, UserPlus, MagnifyingGlass, Trash, Funnel, Eye, EyeSlash, LockKey } from "phosphor-react";

const Students = () => {
  const [view, setView] = useState("LIST");
  const [studentsList, setStudentsList] = useState([]);
  const [classList, setClassList] = useState([]); 
  const [filterClass, setFilterClass] = useState("All");
  const [search, setSearch] = useState("");
  const [visiblePasswords, setVisiblePasswords] = useState({});

  // Added 'role' to initialForm
  const initialForm = { name: "", dob: "", classId: "", father: "", mother: "", mobile: "", gender: "Male", role: "Student" };
  const [formData, setFormData] = useState(initialForm);

  // --- 1. FETCH DATA ---
  useEffect(() => {
    const unsubscribe = onValue(ref(db, 'students'), (snapshot) => {
       const data = snapshot.val();
       if(data) setStudentsList(Object.keys(data).map(key => ({ id: key, ...data[key] })).reverse());
       else setStudentsList([]);
    });

    const fetchClasses = async () => {
       const snap = await get(child(ref(db), 'academic_structure'));
       if(snap.exists()) {
          const data = snap.val();
          const formatted = Object.values(data)
             .filter(item => item.type === 'class')
             .map(item => {
                let fullName = item.name;
                if(item.parentId && data[item.parentId]) fullName = `${data[item.parentId].name} (${item.name})`;
                return { id: item.id, name: fullName };
             })
             .sort((a,b) => a.name.localeCompare(b.name));
          setClassList(formatted);
       }
    };
    fetchClasses();
    return () => unsubscribe();
  }, []);

  // --- 2. CREDENTIALS (User: Rohan2005@acadix, Pass: RoSh@2005) ---
  const generateCredentials = (name, dob) => {
    if (!name || !dob) return { username: "", password: "" };
    const cleanName = name.trim();
    const parts = cleanName.split(" ");
    const firstName = parts[0];
    const surname = parts.length > 1 ? parts[parts.length - 1] : "Std";
    const year = new Date(dob).getFullYear();

    const username = `${firstName}${year}@acadix`; 
    const password = `${firstName.slice(0,2)}${surname.slice(0,2)}@${year}`;

    return { username, password };
  };

  const togglePassword = (id) => {
     setVisiblePasswords(prev => ({...prev, [id]: !prev[id]}));
  };

  // --- 3. HANDLERS ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.classId) return alert("Select a Class!");

    const creds = generateCredentials(formData.name, formData.dob);
    const selectedClassObj = classList.find(c => c.id === formData.classId);

    const newStudent = {
      ...formData,
      ...creds,
      role: "Student", // <--- FORCE ADDED ROLE HERE
      className: selectedClassObj ? selectedClassObj.name : "Unknown",
      joinedAt: new Date().toISOString()
    };

    try {
       await push(ref(db, 'students'), newStudent);
       alert(`Student Added!\nID: ${creds.username}\nPass: ${creds.password}`);
       setFormData(initialForm);
       setView("LIST");
    } catch (err) { alert(err.message); }
  };

  const handleDelete = async (id) => {
     if(window.confirm("Delete this student record?")) await remove(ref(db, `students/${id}`));
  };

  const filteredStudents = studentsList.filter(s => {
     const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || (s.username && s.username.toLowerCase().includes(search.toLowerCase()));
     const matchesClass = filterClass === "All" || s.classId === filterClass;
     return matchesSearch && matchesClass;
  });

  return (
    <div className="flex h-screen bg-gray-50">
      <ClerkSidebar />
      <main className="flex-1 p-6 overflow-y-auto custom-scrollbar">
        
        <header className="flex justify-between items-center mb-6">
           <div><h1 className="text-2xl font-bold text-gray-800">Students Directory</h1><p className="text-sm text-gray-500">Total Students: {studentsList.length}</p></div>
           <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg font-bold hover:bg-green-100 border border-green-200"><FileXls size={20} /> Import CSV</button>
              <button onClick={() => setView("ADD_SINGLE")} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200"><UserPlus size={20} /> Add Student</button>
           </div>
        </header>

        {/* ADD FORM */}
        {view === "ADD_SINGLE" && (
           <div className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl mx-auto animate-fade-in mb-10">
              <h2 className="text-xl font-bold mb-6 text-gray-700 border-b pb-2">Add New Student</h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
                 <div className="col-span-2"><label className="label">Full Name</label><input type="text" className="input" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
                 <div><label className="label">Date of Birth</label><input type="date" className="input" required value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} /></div>
                 <div>
                    <label className="label">Assign Class</label>
                    <select className="input bg-white" required value={formData.classId} onChange={e => setFormData({...formData, classId: e.target.value})}>
                       <option value="">Select Class</option>
                       {classList.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                 </div>
                 <div><label className="label">Father's Name</label><input type="text" className="input" required value={formData.father} onChange={e => setFormData({...formData, father: e.target.value})} /></div>
                 <div><label className="label">Mother's Name</label><input type="text" className="input" required value={formData.mother} onChange={e => setFormData({...formData, mother: e.target.value})} /></div>
                 <div className="col-span-2"><label className="label">Mobile Number</label><input type="tel" className="input" maxLength="10" required value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} /></div>
                 
                 {formData.name && formData.dob && (
                    <div className="col-span-2 bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex justify-between items-center">
                       <div><p className="text-xs text-indigo-400 font-bold uppercase">Username</p><p className="font-mono font-bold text-indigo-800">{generateCredentials(formData.name, formData.dob).username}</p></div>
                       <div className="text-right"><p className="text-xs text-indigo-400 font-bold uppercase">Password</p><p className="font-mono font-bold text-indigo-800">{generateCredentials(formData.name, formData.dob).password}</p></div>
                    </div>
                 )}
                 <div className="col-span-2 flex gap-4 mt-4"><button type="button" onClick={() => setView("LIST")} className="flex-1 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100">Cancel</button><button type="submit" className="flex-1 py-3 rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg">Save Student</button></div>
              </form>
           </div>
        )}

        {/* LIST VIEW */}
        {view === "LIST" && (
           <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
                 <div className="relative w-full md:w-80"><MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/><input type="text" placeholder="Search by name or ID..." value={search} onChange={e=>setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-indigo-500 text-sm"/></div>
                 <div className="flex items-center gap-2 w-full md:w-auto"><Funnel size={18} className="text-gray-400"/><select className="bg-gray-50 border border-gray-200 text-sm font-bold text-gray-600 py-2 px-3 rounded-lg outline-none w-full" value={filterClass} onChange={e=>setFilterClass(e.target.value)}><option value="All">All Classes</option>{classList.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="bg-gray-50 text-gray-500 text-xs uppercase border-b border-gray-100">
                          <th className="p-4 font-bold">Name</th>
                          <th className="p-4 font-bold">Class</th>
                          <th className="p-4 font-bold">Login Details</th>
                          <th className="p-4 font-bold text-right">Action</th>
                       </tr>
                    </thead>
                    <tbody className="text-sm text-gray-700">
                       {filteredStudents.length > 0 ? filteredStudents.map(student => (
                          <tr key={student.id} className="border-b border-gray-50 hover:bg-gray-50">
                             <td className="p-4 font-medium flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${student.gender==='Male'?'bg-blue-500':'bg-pink-500'}`}>{student.name[0]}</div>
                                <div><p>{student.name}</p><p className="text-xs text-gray-400">{student.mobile}</p></div>
                             </td>
                             <td className="p-4"><span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold">{student.className}</span></td>
                             <td className="p-4">
                                <div className="flex flex-col gap-1">
                                   <span className="font-mono text-xs text-gray-600 font-bold">{student.username}</span>
                                   <div className="flex items-center gap-2">
                                      <LockKey size={14} className="text-gray-400"/>
                                      <span className="font-mono text-xs bg-gray-50 px-1 rounded border border-gray-200 min-w-[60px]">{visiblePasswords[student.id] ? student.password : "••••••"}</span>
                                      <button onClick={() => togglePassword(student.id)} className="text-gray-400 hover:text-indigo-600">{visiblePasswords[student.id] ? <EyeSlash size={14}/> : <Eye size={14}/>}</button>
                                   </div>
                                </div>
                             </td>
                             <td className="p-4 text-right"><button onClick={()=>handleDelete(student.id)} className="p-2 hover:bg-red-50 text-red-400 hover:text-red-600 rounded-full transition"><Trash size={18}/></button></td>
                          </tr>
                       )) : (
                          <tr><td colSpan="5" className="p-10 text-center text-gray-400">No students found.</td></tr>
                       )}
                    </tbody>
                 </table>
              </div>
           </div>
        )}
      </main>
    </div>
  );
};

// Styles
const label = "block text-xs font-bold text-gray-500 uppercase mb-1";
const input = "w-full border border-gray-300 p-2.5 rounded-lg outline-none focus:border-indigo-500 font-medium";

export default Students;
