import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/Admin/Sidebar";
import { db } from "../../firebase"; 
import { ref, onValue, push, remove, query, orderByChild, equalTo } from "firebase/database";
import { 
  Folder, Plus, ArrowLeft, ChalkboardTeacher, Users, X, Trash, 
  Student, UserCircle, EnvelopeSimple, UserPlus, GenderMale, GenderFemale 
} from "phosphor-react";

const Classes = () => {
  const [path, setPath] = useState([]); 
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [viewMode, setViewMode] = useState("FOLDERS"); 
  const [selectedClass, setSelectedClass] = useState(null);

  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  
  const [rawItems, setRawItems] = useState([]);
  const [facultyList, setFacultyList] = useState([]); // Full Faculty Data
  const [studentsList, setStudentsList] = useState([]); 
  const [activeTeacher, setActiveTeacher] = useState(null); // The matched teacher

  const [itemName, setItemName] = useState("");
  const [hasSection, setHasSection] = useState(false);
  
  // Student Form
  const initialStudentForm = {
    name: "", dob: "", father: "", mother: "", mobile: "", gender: "Male", rollNo: ""
  };
  const [studentForm, setStudentForm] = useState(initialStudentForm);

  // --- 1. FETCH DATA (Structure & Faculty) ---
  useEffect(() => {
    // 1. Structure
    const subStruct = onValue(ref(db, 'academic_structure'), (snapshot) => {
      const data = snapshot.val();
      if (data) setRawItems(Object.keys(data).map(key => ({ id: key, ...data[key] })));
      else setRawItems([]);
    });

    // 2. Faculty (Full List needed to match Class Teacher)
    const subFaculty = onValue(ref(db, 'faculty'), (snapshot) => {
       const data = snapshot.val();
       if(data) setFacultyList(Object.values(data));
       else setFacultyList([]);
    });

    return () => { subStruct(); subFaculty(); };
  }, []);

  // --- 2. FETCH STUDENTS ---
  useEffect(() => {
     if (viewMode === "STUDENTS" && selectedClass) {
        const q = query(ref(db, 'students'), orderByChild('classId'), equalTo(selectedClass.id));
        const sub = onValue(q, (snapshot) => {
           const data = snapshot.val();
           if (data) setStudentsList(Object.keys(data).map(key => ({ id: key, ...data[key] })));
           else setStudentsList([]);
        });
        return () => sub();
     }
  }, [viewMode, selectedClass]);

  // --- 3. HELPER: FIND CLASS TEACHER ---
  const findClassTeacher = (item) => {
      // 1. Construct Full Class Name: e.g. "Class 12th (Arts)"
      let fullName = item.name;
      if (item.parentId) {
          const parent = rawItems.find(i => i.id === item.parentId);
          if (parent) fullName = `${parent.name} (${item.name})`;
      }

      // 2. Find in Faculty List
      const teacher = facultyList.find(t => 
          t.role === 'Teacher' && 
          t.isClassTeacher === true && 
          t.classTeacherOf === fullName
      );

      setActiveTeacher(teacher || null);
  };

  // --- 4. NAVIGATION & HANDLERS ---
  const getCurrentContent = () => {
     if (path.length === 0) return rawItems.filter(item => !item.parentId);
     return rawItems.filter(item => item.parentId === currentFolderId);
  };

  const handleItemClick = (item) => {
    if (item.type === "group") {
      setPath([...path, item.name]);
      setCurrentFolderId(item.id);
    } else {
      setSelectedClass(item);
      findClassTeacher(item); // <--- Trigger Search Logic
      setViewMode("STUDENTS");
    }
  };

  const handleBack = () => {
     if(viewMode === "STUDENTS") {
         setViewMode("FOLDERS");
         setSelectedClass(null);
         setStudentsList([]);
         setActiveTeacher(null);
         return;
     }
     const newPath = path.slice(0, -1);
     setPath(newPath);
     if (newPath.length === 0) setCurrentFolderId(null);
     else {
        const parentName = newPath[newPath.length - 1];
        const parentFolder = rawItems.find(i => i.name === parentName);
        setCurrentFolderId(parentFolder ? parentFolder.id : null);
     }
  };

  const generateCredentials = (name, dob) => {
    if (!name || !dob) return { username: "", password: "" };
    const cleanName = name.trim();
    const parts = cleanName.split(" ");
    const firstName = parts[0];
    const surname = parts.length > 1 ? parts[parts.length - 1] : "Std";
    const year = new Date(dob).getFullYear();
    const username = `${firstName.slice(0,2)}${surname.slice(0,2)}${year}@acadix`; 
    const password = `${firstName}@${year}`; 
    return { username, password };
  };

  // --- ACTIONS ---
  const handleCreateClass = async () => {
     if(!itemName) return alert("Name Required");
     const newItem = {
        name: itemName,
        type: hasSection ? "group" : "class",
        parentId: currentFolderId || null,
        createdAt: new Date().toISOString()
     };
     try {
        await push(ref(db, 'academic_structure'), newItem);
        setIsClassModalOpen(false); setItemName(""); setHasSection(false);
     } catch (e) { alert(e.message); }
  };

  const handleAddStudent = async (e) => {
     e.preventDefault();
     if(!studentForm.name || !studentForm.dob || !studentForm.mobile) return alert("Missing Fields!");
     const creds = generateCredentials(studentForm.name, studentForm.dob);
     const newStudent = {
        ...studentForm, ...creds,
        classId: selectedClass.id, className: selectedClass.name,
        joinedAt: new Date().toISOString()
     };
     try {
        await push(ref(db, 'students'), newStudent);
        setIsStudentModalOpen(false); setStudentForm(initialStudentForm);
        alert(`Student Added!\nID: ${creds.username}`);
     } catch (e) { alert(e.message); }
  };

  const handleDeleteClass = async (e, id) => {
     e.stopPropagation();
     if(window.confirm("Delete Folder/Class?")) await remove(ref(db, `academic_structure/${id}`));
  };

  const handleDeleteStudent = async (id) => {
     if(window.confirm("Remove Student?")) await remove(ref(db, `students/${id}`));
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6 relative overflow-y-auto custom-scrollbar">
        
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6 sticky top-0 bg-gray-50 z-10 py-2">
           {(path.length > 0 || viewMode === "STUDENTS") && (
              <button onClick={handleBack} className="p-2 hover:bg-gray-200 rounded-full transition"><ArrowLeft size={24} className="text-gray-700" /></button>
           )}
           <div>
              <h1 className="text-2xl font-bold text-gray-800">
                 {viewMode === "STUDENTS" ? selectedClass?.name : (path.length === 0 ? "All Classes" : path.join(" > "))}
              </h1>
              {viewMode === "STUDENTS" && <p className="text-xs text-gray-500 font-bold uppercase">Student Management</p>}
           </div>
        </div>

        {/* --- VIEW 1: FOLDERS --- */}
        {viewMode === "FOLDERS" && (
           <>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                 {getCurrentContent().map((item) => (
                    <div key={item.id} onClick={() => handleItemClick(item)} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md cursor-pointer flex flex-col items-center justify-center gap-3 transition group relative">
                       <button onClick={(e) => handleDeleteClass(e, item.id)} className="absolute top-2 right-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"><Trash size={18} /></button>
                       {item.type === 'group' ? <Folder size={54} weight="duotone" className="text-blue-500" /> : <ChalkboardTeacher size={54} weight="duotone" className="text-green-500" />}
                       <div className="text-center"><h3 className="font-bold text-gray-800 text-lg">{item.name}</h3></div>
                    </div>
                 ))}
                 {getCurrentContent().length === 0 && <div className="col-span-full text-center py-10 text-gray-400 flex flex-col items-center"><Folder size={48} className="opacity-20 mb-2"/><p>Empty Folder</p></div>}
              </div>
              <button onClick={() => setIsClassModalOpen(true)} className="absolute bottom-8 right-8 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition transform hover:scale-105 z-20"><Plus size={24} weight="bold" /></button>
           </>
        )}

        {/* --- VIEW 2: STUDENTS --- */}
        {viewMode === "STUDENTS" && (
           <div className="animate-fade-in pb-20">
              
              {/* Teacher Banner (Dynamic) */}
              <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-lg mb-8 relative overflow-hidden">
                 <div className="relative z-10 flex items-center gap-6">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl font-bold shadow-inner uppercase">
                        {activeTeacher ? activeTeacher.name[0] : "?"}
                    </div>
                    <div>
                       <p className="text-indigo-200 text-xs font-bold uppercase mb-1">Class Teacher</p>
                       <h2 className="text-2xl font-bold mb-1">{activeTeacher ? activeTeacher.name : "Not Assigned"}</h2>
                       {activeTeacher ? (
                           <div className="flex gap-4 text-xs text-indigo-100">
                               <span className="flex items-center gap-1"><EnvelopeSimple/> {activeTeacher.email}</span>
                               <span className="flex items-center gap-1"><UserCircle/> {activeTeacher.phone}</span>
                           </div>
                       ) : (
                           <p className="text-indigo-300 text-sm italic">Assign a Class Teacher from 'Faculty' tab.</p>
                       )}
                    </div>
                 </div>
                 <ChalkboardTeacher size={150} className="absolute -right-6 -bottom-6 text-white/10 rotate-12" />
              </div>

              <div className="flex justify-between items-center mb-4">
                 <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2"><Student size={24} className="text-indigo-600"/> Class Students ({studentsList.length})</h3>
                 <button onClick={() => setIsStudentModalOpen(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 flex items-center gap-2"><UserPlus size={18}/> Add Student</button>
              </div>

              {studentsList.length > 0 ? (
                 <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                       <thead>
                          <tr className="bg-gray-50 text-gray-500 text-xs uppercase border-b border-gray-100"><th className="p-4">Roll No</th><th className="p-4">Name</th><th className="p-4">Login ID</th><th className="p-4">Phone</th><th className="p-4 text-right">Action</th></tr>
                       </thead>
                       <tbody className="text-sm text-gray-700">
                          {studentsList.map((s) => (
                             <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50"><td className="p-4 font-bold text-indigo-600">{s.rollNo}</td><td className="p-4 flex items-center gap-3"><div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${s.gender==='Male'?'bg-blue-500':'bg-pink-500'}`}>{s.name[0]}</div>{s.name}</td><td className="p-4 font-mono text-xs">{s.username}</td><td className="p-4">{s.mobile}</td><td className="p-4 text-right"><button onClick={()=>handleDeleteStudent(s.id)} className="text-red-400 hover:text-red-600"><Trash size={18}/></button></td></tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              ) : (
                 <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200"><Users size={48} className="mx-auto mb-2 opacity-30"/><p>No students enrolled yet.</p></div>
              )}
           </div>
        )}

        {/* --- MODALS (Create Class & Add Student) --- */}
        {isClassModalOpen && (
           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
              <div className="bg-white p-6 rounded-2xl w-96 animate-fade-in shadow-2xl">
                 <div className="flex justify-between mb-4"><h2 className="text-xl font-bold">New Item</h2><button onClick={()=>setIsClassModalOpen(false)}><X size={24}/></button></div>
                 <div className="space-y-4">
                    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg"><input type="checkbox" checked={hasSection} onChange={e=>setHasSection(e.target.checked)} className="w-5 h-5"/><label className="text-sm font-medium">Is Group/Folder?</label></div>
                    <input placeholder="Name (e.g. Class 10 or Section A)" value={itemName} onChange={e=>setItemName(e.target.value)} className="w-full border p-2 rounded-lg"/>
                    <button onClick={handleCreateClass} className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold">Create</button>
                 </div>
              </div>
           </div>
        )}

        {isStudentModalOpen && (
           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
              <div className="bg-white p-8 rounded-2xl w-full max-w-2xl animate-fade-in shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
                 <div className="flex justify-between mb-6 border-b pb-4"><h2 className="text-2xl font-bold">Add Student</h2><button onClick={()=>setIsStudentModalOpen(false)}><X size={24}/></button></div>
                 <form onSubmit={handleAddStudent} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2"><label className="label">Full Name</label><input required className="input" value={studentForm.name} onChange={e=>setStudentForm({...studentForm, name: e.target.value})}/></div>
                    <div><label className="label">DOB</label><input required type="date" className="input" value={studentForm.dob} onChange={e=>setStudentForm({...studentForm, dob: e.target.value})}/></div>
                    <div><label className="label">Roll No</label><input className="input" value={studentForm.rollNo} onChange={e=>setStudentForm({...studentForm, rollNo: e.target.value})}/></div>
                    <div><label className="label">Father's Name</label><input required className="input" value={studentForm.father} onChange={e=>setStudentForm({...studentForm, father: e.target.value})}/></div>
                    <div><label className="label">Mother's Name</label><input required className="input" value={studentForm.mother} onChange={e=>setStudentForm({...studentForm, mother: e.target.value})}/></div>
                    <div><label className="label">Mobile</label><input required type="tel" maxLength="10" className="input" value={studentForm.mobile} onChange={e=>setStudentForm({...studentForm, mobile: e.target.value})}/></div>
                    <div>
                        <label className="label">Gender</label>
                        <div className="flex gap-2 mt-1"><button type="button" onClick={()=>setStudentForm({...studentForm, gender: 'Male'})} className={`flex-1 py-2 rounded-lg border ${studentForm.gender==='Male'?'bg-blue-50 border-blue-500 text-blue-600':'text-gray-400'}`}>Male</button><button type="button" onClick={()=>setStudentForm({...studentForm, gender: 'Female'})} className={`flex-1 py-2 rounded-lg border ${studentForm.gender==='Female'?'bg-pink-50 border-pink-500 text-pink-600':'text-gray-400'}`}>Female</button></div>
                    </div>
                    <button className="col-span-2 w-full bg-indigo-600 text-white py-3 rounded-xl font-bold shadow-lg">Save Student</button>
                 </form>
              </div>
           </div>
        )}

      </main>
    </div>
  );
};

// Simple Styles
const label = "block text-xs font-bold text-gray-500 uppercase mb-1";
const input = "w-full border border-gray-300 p-2.5 rounded-lg outline-none focus:border-indigo-500 font-medium";

export default Classes;
