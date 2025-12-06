import React, { useState } from "react";
import TeacherSidebar from "../../Components/Teacher/TeacherSidebar";
import { Notebook, Plus, DownloadSimple, Trash } from "phosphor-react";

const TeacherAssignments = () => {
  // Dummy Assignments
  const [assignments, setAssignments] = useState([
    { id: 1, title: "Chapter 4 Notes", class: "10-A", type: "Notes", date: "04 Oct 2025" },
    { id: 2, title: "Numericals Worksheet", class: "12-Sci", type: "Homework", date: "03 Oct 2025" },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: "", class: "", type: "Homework" });

  const handleAdd = () => {
     setAssignments([...assignments, { ...formData, id: Date.now(), date: "Today" }]);
     setShowForm(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <TeacherSidebar />
      <main className="flex-1 p-6 overflow-y-auto custom-scrollbar">
         
         <header className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
               <Notebook size={32} className="text-purple-600" weight="duotone" />
               Assignments & Notes
            </h1>
            <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-xl font-bold shadow-lg hover:bg-purple-700 transition">
               <Plus size={20} weight="bold" /> Create New
            </button>
         </header>

         {/* Form Modal */}
         {showForm && (
            <div className="mb-6 bg-white p-6 rounded-2xl shadow-lg border border-purple-100 animate-fade-in">
               <h3 className="font-bold text-gray-800 mb-4">Create New Assignment</h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <input type="text" placeholder="Title / Topic" className="input border p-2 rounded" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})}/>
                  <select className="input border p-2 rounded" value={formData.class} onChange={e=>setFormData({...formData, class: e.target.value})}>
                     <option value="">Select Class</option>
                     <option value="10-A">10-A</option>
                     <option value="12-Sci">12-Sci</option>
                  </select>
                  <select className="input border p-2 rounded" value={formData.type} onChange={e=>setFormData({...formData, type: e.target.value})}>
                     <option value="Homework">Homework</option>
                     <option value="Notes">Notes / Material</option>
                  </select>
               </div>
               <div className="flex gap-3">
                  <button onClick={handleAdd} className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold">Upload</button>
                  <button onClick={() => setShowForm(false)} className="text-gray-500 font-bold px-4 py-2">Cancel</button>
               </div>
            </div>
         )}

         {/* List */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignments.map((item) => (
               <div key={item.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition relative group">
                  <span className={`absolute top-4 right-4 text-[10px] font-bold px-2 py-1 rounded uppercase ${item.type === 'Homework' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                     {item.type}
                  </span>
                  <h3 className="font-bold text-gray-800 text-lg mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-500 mb-4">Class: {item.class} • {item.date}</p>
                  
                  <div className="flex gap-2 border-t border-gray-50 pt-3">
                     <button className="flex-1 flex items-center justify-center gap-1 text-xs font-bold text-gray-500 hover:text-purple-600 bg-gray-50 py-2 rounded hover:bg-purple-50">
                        <DownloadSimple size={16}/> View File
                     </button>
                     <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded">
                        <Trash size={16}/>
                     </button>
                  </div>
               </div>
            ))}
         </div>

      </main>
    </div>
  );
};

export default TeacherAssignments;
