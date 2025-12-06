import React, { useState } from "react";
import StudentSidebar from "../../Components/Students/StudentSidebar";
import { Folder, ChalkboardTeacher, ArrowLeft, User, BookOpen } from "phosphor-react";

const StudentClasses = () => {
  const [path, setPath] = useState([]); // Breadcrumbs logic
  
  // --- DUMMY DATA (Student's View) ---
  // Sirf wahi classes jo student ko assigned hain
  const myStructure = [
    { 
      id: 1, 
      name: "Class 10 - Sec A", 
      type: "group", 
      teacher: "Ramesh Gupta (Class Teacher)",
      children: [
        { id: 101, name: "Mathematics", type: "subject", teacher: "Ramesh Gupta" },
        { id: 102, name: "Physics", type: "subject", teacher: "Suresh Singh" },
        { id: 103, name: "English", type: "subject", teacher: "Anjali Mam" },
        { id: 104, name: "Computer Science", type: "subject", teacher: "Vikram Sir" }
      ]
    },
    // Extra Curricular Group example
    {
      id: 2,
      name: "Robotics Club",
      type: "group",
      teacher: "Vikram Sir (In-charge)",
      children: [
        { id: 201, name: "Project Alpha", type: "subject", teacher: "Team Lead" }
      ]
    }
  ];

  // Helper to get current folder content
  const getCurrentContent = () => {
    let current = myStructure;
    path.forEach(folderName => {
      const folder = current.find(item => item.name === folderName);
      if (folder && folder.children) current = folder.children;
    });
    return current;
  };

  const handleItemClick = (item) => {
    if (item.type === "group") {
      setPath([...path, item.name]);
    } else {
      alert(`Opening details for subject: ${item.name}\nTeacher: ${item.teacher}`);
      // Future: Open Subject Detail Page (Syllabus, Notes, etc.)
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <StudentSidebar />
      
      <main className="flex-1 p-6 overflow-y-auto custom-scrollbar">
        
        {/* Header with Breadcrumbs */}
        <div className="flex items-center gap-3 mb-8">
           {path.length > 0 && (
              <button onClick={() => setPath(path.slice(0, -1))} className="p-2 hover:bg-gray-200 rounded-full transition">
                 <ArrowLeft size={20} className="text-gray-600" />
              </button>
           )}
           <div>
              <h1 className="text-2xl font-bold text-gray-800">
                 {path.length === 0 ? "My Classrooms" : path.join(" > ")}
              </h1>
              <p className="text-sm text-gray-500">
                 {path.length === 0 ? "Access your enrolled subjects & groups" : "Subject Details"}
              </p>
           </div>
        </div>

        {/* Grid View */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
           {getCurrentContent().map((item) => (
              <div 
                key={item.id} 
                onClick={() => handleItemClick(item)}
                className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-indigo-200 cursor-pointer flex flex-col items-center justify-center gap-4 transition duration-300 group"
              >
                 <div className={`w-16 h-16 rounded-full flex items-center justify-center ${item.type === 'group' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                    {item.type === 'group' ? (
                       <Folder size={32} weight="duotone" />
                    ) : (
                       <BookOpen size={32} weight="duotone" />
                    )}
                 </div>
                 
                 <div className="text-center">
                    <h3 className="font-bold text-gray-800 text-lg group-hover:text-indigo-700 transition">{item.name}</h3>
                    <div className="flex items-center justify-center gap-1.5 mt-1 text-xs text-gray-500 font-medium bg-gray-50 py-1 px-2 rounded-full mx-auto w-max">
                       <User size={12} weight="fill" />
                       <span>{item.teacher}</span>
                    </div>
                 </div>
              </div>
           ))}
        </div>

        {/* Empty State (Agar koi class na ho) */}
        {getCurrentContent().length === 0 && (
           <div className="text-center py-20 opacity-50">
              <Folder size={48} className="mx-auto mb-2 text-gray-400"/>
              <p>No items found in this folder.</p>
           </div>
        )}

      </main>
    </div>
  );
};

export default StudentClasses;