import React, { useState, useEffect } from "react";
import ClerkSidebar from "../../Components/Clerk/ClerkSidebar";
import { db } from "../../firebase"; 
import { ref, onValue, push, remove, update, get, child } from "firebase/database";
import { 
  MagnifyingGlass, UserPlus, Trash, PencilSimple, X, 
  Envelope, Phone, IdentificationBadge, LockKey, 
  Eye, EyeSlash, PlusCircle 
} from "phosphor-react";

const Faculty = () => {
  const [teachers, setTeachers] = useState([]);
  const [classList, setClassList] = useState([]); 
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [visiblePasswords, setVisiblePasswords] = useState({});

  const initialForm = {
    name: "", email: "", phone: "", gender: "male", role: "Teacher", 
    isClassTeacher: false, classTeacherOf: "", 
    teachingSubjects: [] 
  };
  const [formData, setFormData] = useState(initialForm);
  const [tempSubject, setTempSubject] = useState({ class: "", subject: "" });

    // --- 1. FETCH DATA ---
  useEffect(() => {
    // Faculty Listener (Same as before)
    const unsubscribe = onValue(ref(db, 'faculty'), (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setTeachers(Object.keys(data).map(key => ({ id: key, ...data[key] })).reverse());
      } else setTeachers([]);
    });

    // --- UPDATED CLASS FETCHING LOGIC ---
    const fetchClasses = async () => {
       const structSnap = await get(child(ref(db), 'academic_structure'));
       
       let list = [];

       if(structSnap.exists()) {
          const data = structSnap.val(); // Ye poora object hai {id: {name:..., parentId:...}}
          
          // 1. Convert to Array for filtering
          const allItems = Object.values(data);

          // 2. Filter & Format
          list = allItems
            .filter(item => item.type === 'class') // Sirf Classes chahiye, Folders nahi
            .map(item => {
                // Agar iska koi Parent hai, to Parent ka naam dhundo
                if (item.parentId && data[item.parentId]) {
                    const parentName = data[item.parentId].name; // e.g. "Class 12th"
                    return `${parentName} (${item.name})`; // Result: "Class 12th (Arts)"
                }
                // Agar koi parent nahi hai (Direct Class), to sirf naam dikhao
                return item.name;
            })
            .sort(); // Alphabetical order
            
       } else {
          // Fallback for old structure (Optional)
          const classSnap = await get(child(ref(db), 'classes'));
          if(classSnap.exists()) {
             list = Object.values(classSnap.val()).map(c => `${c.className} (${c.section})`);
          }
       }
       
       setClassList(list);
    };
    fetchClasses();

    return () => unsubscribe();
  }, []);


  // --- 2. HELPERS ---
  const generateCredentials = (name, mobile) => {
    if(!name || !mobile || mobile.length < 4) return { username: "", password: "" };
    const cleanName = name.split(" ")[0].trim();
    const last4 = mobile.slice(-4);
    const base = `${cleanName}${last4}`;
    return { username: `${base}@acadix`, password: base };
  };

  const togglePassword = (id) => setVisiblePasswords(prev => ({...prev, [id]: !prev[id]}));

  // --- 3. HANDLERS ---
  const handleSave = async (e) => {
    e.preventDefault();
    if(!formData.name || !formData.email || !formData.phone) return alert("Fill basic details!");

    const creds = generateCredentials(formData.name, formData.phone);
    const payload = {
       ...formData,
       username: creds.username,
       password: creds.password,
       updatedAt: new Date().toISOString()
    };

    try {
      if(isEditing && editId) {
         await update(ref(db, `faculty/${editId}`), payload);
         alert("Staff Member Updated!");
      } else {
         payload.joinedAt = new Date().toISOString().split('T')[0];
         payload.status = 'Active';
         await push(ref(db, 'faculty'), payload);
         alert(`Staff Added!\nUsername: ${creds.username}`);
      }
      closeModal();
    } catch (error) { alert("Error: " + error.message); }
  };

  const handleDelete = async (id) => {
    if(window.confirm("Remove this staff member?")) await remove(ref(db, `faculty/${id}`));
  };

  const openEditModal = (member) => {
     setFormData({ ...member, gender: member.gender || "male", teachingSubjects: member.teachingSubjects || [] });
     setEditId(member.id); setIsEditing(true); setShowModal(true);
  };

  const closeModal = () => {
     setShowModal(false); setIsEditing(false); setEditId(null);
     setFormData(initialForm); setTempSubject({ class: "", subject: "" });
  };

  const addSubjectRow = () => {
     if(!tempSubject.class || !tempSubject.subject) return alert("Select Class and Enter Subject");
     setFormData({...formData, teachingSubjects: [...formData.teachingSubjects, tempSubject]});
     setTempSubject({class: "", subject: ""});
  };
  const removeSubjectRow = (index) => {
     setFormData({...formData, teachingSubjects: formData.teachingSubjects.filter((_, i) => i !== index)});
  };

  const filteredList = teachers.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <ClerkSidebar />
      <main className="flex-1 p-6 flex flex-col overflow-hidden">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-6 shrink-0">
          <div><h1 className="text-2xl font-bold text-gray-800">Faculty & Staff</h1><p className="text-sm text-gray-500">Manage teachers, clerks, and assignments</p></div>
          <button onClick={() => setShowModal(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"><UserPlus size={20} weight="bold"/> Add Staff</button>
        </header>

        {/* Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm mb-6 flex justify-between items-center shrink-0">
           <div className="relative w-full md:w-80">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
              <input type="text" placeholder="Search by name or role..." className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-indigo-500 text-sm" value={search} onChange={e => setSearch(e.target.value)} />
           </div>
        </div>

        {/* Grid List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-1">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-6">
              {filteredList.map(member => (
                 <div key={member.id} className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition relative h-fit flex flex-col gap-3">
                    {member.isClassTeacher && <span className="absolute top-3 right-3 bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-100">CT: {member.classTeacherOf}</span>}
                    <div className="flex items-start gap-3">
                       <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm uppercase shrink-0 ${member.role === 'Teacher' ? 'bg-indigo-500' : member.role === 'Clerk' ? 'bg-orange-500' : 'bg-green-600'}`}>{member.name[0]}</div>
                       <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-800 text-sm truncate" title={member.name}>{member.name}</h3>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase inline-block mt-0.5 ${member.role === 'Teacher' ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-100 text-gray-600'}`}>{member.role}</span>
                       </div>
                    </div>
                    <div className="space-y-1 text-xs text-gray-500">
                       <div className="flex items-center gap-2 truncate" title={member.email}><Envelope size={14}/> {member.email}</div>
                       <div className="flex items-center gap-2"><Phone size={14}/> {member.phone}</div>
                    </div>
                    <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                       <div className="flex justify-between items-center text-[9px] text-gray-400 uppercase font-bold mb-1"><span>Login Details</span> <LockKey size={12}/></div>
                       <div className="text-xs font-mono text-gray-700 flex items-center gap-2 truncate"><IdentificationBadge size={14} className="text-gray-400"/> <span className="truncate">{member.username}</span></div>
                       <div className="text-xs font-mono text-gray-700 flex items-center justify-between mt-1">
                          <div className="flex items-center gap-2"><LockKey size={14} className="text-gray-400"/> <span className="bg-white px-1.5 rounded border border-gray-200 min-w-[60px]">{visiblePasswords[member.id] ? member.password : "••••••"}</span></div>
                          <button onClick={() => togglePassword(member.id)} className="text-gray-400 hover:text-indigo-600 p-1">{visiblePasswords[member.id] ? <EyeSlash size={14}/> : <Eye size={14}/>}</button>
                       </div>
                    </div>
                    {member.role === 'Teacher' && member.teachingSubjects && member.teachingSubjects.length > 0 && (
                       <div className="flex flex-wrap gap-1">
                          {member.teachingSubjects.map((sub, i) => <span key={i} className="text-[9px] font-bold bg-gray-50 border border-gray-200 px-1.5 py-0.5 rounded text-gray-600 truncate max-w-[100px]">{sub.subject} ({sub.class})</span>)}
                       </div>
                    )}
                    <div className="flex gap-2 pt-2 border-t border-gray-50 mt-auto">
                       <button onClick={() => openEditModal(member)} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-bold text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 transition"><PencilSimple size={14} /> Edit</button>
                       <button onClick={() => handleDelete(member.id)} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-bold text-red-400 hover:bg-red-50 hover:text-red-600 transition"><Trash size={14} /> Remove</button>
                    </div>
                 </div>
              ))}
           </div>
        </div>

        {/* ADD / EDIT MODAL */}
        {showModal && (
           <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
              <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl w-full max-w-lg animate-fade-in flex flex-col max-h-[90vh]">
                 <div className="flex justify-between items-center mb-4 shrink-0">
                    <h3 className="font-bold text-xl text-gray-800">{isEditing ? "Edit Staff" : "Add Staff"}</h3>
                    <button type="button" onClick={closeModal}><X size={24} className="text-gray-400 hover:text-red-500"/></button>
                 </div>
                 <div className="overflow-y-auto custom-scrollbar pr-2 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                       <div><label className="text-xs font-bold text-gray-500 uppercase">Role</label><select className="w-full border p-2.5 rounded-xl mt-1 bg-white outline-none" value={formData.role} onChange={e=>setFormData({...formData, role: e.target.value})}><option value="Teacher">Teacher</option><option value="Clerk">Clerk</option><option value="Accountant">Accountant</option></select></div>
                       <div><label className="text-xs font-bold text-gray-500 uppercase">Gender</label><select className="w-full border p-2.5 rounded-xl mt-1 bg-white outline-none" value={formData.gender} onChange={e=>setFormData({...formData, gender: e.target.value})}><option value="male">Male</option><option value="female">Female</option></select></div>
                    </div>
                    <input required placeholder="Full Name" className="w-full border p-2.5 rounded-xl outline-none" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} />
                    <div className="grid grid-cols-2 gap-4">
                        <input required type="email" placeholder="Email" className="w-full border p-2.5 rounded-xl outline-none" value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} />
                        <input required type="tel" placeholder="Mobile" className="w-full border p-2.5 rounded-xl outline-none" value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})} />
                    </div>
                    <div className="bg-blue-50 p-3 rounded-xl text-xs text-blue-700 border border-blue-100"><p><b>Note:</b> Credentials auto-generated.</p></div>

                    {formData.role === 'Teacher' && (
                       <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 space-y-4">
                          <div className="flex items-center gap-3"><input type="checkbox" id="ct" className="w-4 h-4 accent-indigo-600" checked={formData.isClassTeacher} onChange={e=>setFormData({...formData, isClassTeacher: e.target.checked})} /><label htmlFor="ct" className="text-sm font-bold text-gray-700">Is Class Teacher?</label></div>
                          {formData.isClassTeacher && (
                             <select className="w-full border p-2 rounded-lg bg-white" value={formData.classTeacherOf} onChange={e=>setFormData({...formData, classTeacherOf: e.target.value})}>
                                <option value="">Select Class</option>
                                {classList.map(c => <option key={c} value={c}>{c}</option>)}
                             </select>
                          )}
                          <div>
                             <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Teaching Subjects</label>
                             <div className="flex flex-wrap gap-2 mb-2">
                                {formData.teachingSubjects.map((item, idx) => (
                                   <div key={idx} className="bg-white px-2 py-1 rounded border border-indigo-200 text-xs flex gap-2 items-center">{item.class} - <b>{item.subject}</b><button type="button" onClick={() => removeSubjectRow(idx)} className="text-red-500"><X size={12}/></button></div>
                                ))}
                             </div>
                             <div className="flex gap-2">
                                <select className="flex-1 border p-2 rounded-lg text-xs" value={tempSubject.class} onChange={e=>setTempSubject({...tempSubject, class: e.target.value})}><option value="">Class</option>{classList.map(c => <option key={c} value={c}>{c}</option>)}</select>
                                <input placeholder="Subject" className="flex-1 border p-2 rounded-lg text-xs" value={tempSubject.subject} onChange={e=>setTempSubject({...tempSubject, subject: e.target.value})} />
                                <button type="button" onClick={addSubjectRow} className="bg-indigo-600 text-white p-2 rounded-lg"><PlusCircle/></button>
                             </div>
                          </div>
                       </div>
                    )}
                 </div>
                 <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 mt-4 shrink-0 shadow-lg shadow-indigo-200">{isEditing ? "Update" : "Save"}</button>
              </form>
           </div>
        )}

      </main>
    </div>
  );
};

export default Faculty;
