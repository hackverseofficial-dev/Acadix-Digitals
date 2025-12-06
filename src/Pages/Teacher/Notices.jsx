import React, { useState } from "react";
import TeacherSidebar from "../../Components/Teacher/TeacherSidebar";
import { 
  MagnifyingGlass, PaperPlaneRight, Paperclip, DotsThreeVertical, 
  Checks, Plus, Users, X 
} from "phosphor-react";

const TeacherNotices = () => {
  const [activeNotice, setActiveNotice] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupType, setGroupType] = useState("CLASS"); // CLASS | STUDENTS

  // --- DUMMY DATA ---
  const [chats, setChats] = useState([
    {
      id: 1,
      title: "Admin Office",
      role: "Official",
      preview: "Please submit class attendance logs.",
      time: "10:30 AM",
      initials: "AO",
      color: "bg-purple-100 text-purple-700",
      messages: [
        { id: 1, sender: "Admin", text: "Good morning sir.", time: "10:28 AM", isMe: false },
        { id: 2, sender: "Admin", text: "Please submit class attendance logs by 2 PM.", time: "10:30 AM", isMe: false },
      ]
    },
    {
      id: 2,
      title: "Class 10-A (Physics)",
      role: "My Group",
      preview: "Notes uploaded for Chapter 4.",
      time: "Yesterday",
      initials: "10A",
      color: "bg-blue-100 text-blue-700",
      messages: [
        { id: 1, sender: "You", text: "Students, I have uploaded the notes.", time: "4:00 PM", isMe: true },
        { id: 2, sender: "Rohan", text: "Thank you sir!", time: "4:05 PM", isMe: false },
      ]
    },
  ]);

  // Teacher's Assigned Classes (For Group Creation)
  const myClasses = [
    { id: "10A", name: "Class 10 - Sec A" },
    { id: "10B", name: "Class 10 - Sec B" },
  ];

  // Students List (Dummy)
  const classStudents = [
    { id: 101, name: "Rohan Sharma", class: "10A" },
    { id: 102, name: "Priya Patel", class: "10A" },
    { id: 103, name: "Amit Verma", class: "10B" },
  ];

  // Form States
  const [groupName, setGroupName] = useState("");
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);

  // --- HANDLERS ---
  const toggleClass = (id) => {
    if (selectedClasses.includes(id)) setSelectedClasses(selectedClasses.filter(c => c !== id));
    else setSelectedClasses([...selectedClasses, id]);
  };

  const toggleStudent = (id) => {
    if (selectedStudents.includes(id)) setSelectedStudents(selectedStudents.filter(s => s !== id));
    else setSelectedStudents([...selectedStudents, id]);
  };

  const handleCreateGroup = () => {
    const newChat = {
      id: Date.now(),
      title: groupName || "New Group",
      role: "My Group",
      preview: "Group created. Admin added automatically.",
      time: "Just Now",
      initials: groupName ? groupName.substring(0,2).toUpperCase() : "NG",
      color: "bg-green-100 text-green-700",
      messages: [
        { id: 1, sender: "System", text: `Group Created. Participants: ${groupType === 'CLASS' ? selectedClasses.join(', ') : selectedStudents.length + ' Students'}. Admin added for monitoring.`, time: "Now", isMe: false }
      ]
    };

    setChats([newChat, ...chats]);
    setIsModalOpen(false);
    setGroupName(""); setSelectedClasses([]); setSelectedStudents([]);
    alert("Group Created! Admin added automatically.");
  };

  const selectedChat = chats.find(c => c.id === activeNotice);

  return (
    <div className="flex h-screen bg-[#F3F4F6] overflow-hidden">
      <TeacherSidebar />

      <main className="flex-1 flex gap-4 p-4 h-screen overflow-hidden relative">
        
        {/* LEFT SIDE: LIST */}
        <aside className="w-80 bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col">
          <div className="p-5 pb-2 border-b border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Notices</h2>
                <p className="text-xs text-gray-400 mt-1">School Communications</p>
              </div>
              
              {/* CREATE GROUP BUTTON */}
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full transition shadow-lg"
                title="Create New Group"
              >
                <Plus size={20} weight="bold" />
              </button>
            </div>

            <div className="relative mb-2">
              <MagnifyingGlass size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search..." className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-300 transition" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
            {chats.map((chat) => (
              <div key={chat.id} onClick={() => setActiveNotice(chat.id)} className={`p-3 rounded-xl cursor-pointer transition-all duration-200 border ${activeNotice === chat.id ? 'bg-indigo-50 border-indigo-100 shadow-sm' : 'bg-white border-transparent hover:bg-gray-50 hover:border-gray-200'}`}>
                <div className="flex gap-3">
                  <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${chat.color}`}>
                    {chat.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className={`text-sm font-bold truncate ${activeNotice === chat.id ? 'text-indigo-900' : 'text-gray-800'}`}>{chat.title}</h3>
                      <span className="text-[10px] text-gray-400">{chat.time}</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{chat.preview}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* RIGHT SIDE: CHAT */}
        <section className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
          {selectedChat ? (
            <>
              <header className="h-16 border-b border-gray-100 flex items-center justify-between px-6 bg-white">
                 <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${selectedChat.color}`}>{selectedChat.initials}</div>
                    <div>
                       <h3 className="text-gray-800 font-bold text-sm">{selectedChat.title}</h3>
                       <span className="text-[10px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md font-medium">{selectedChat.role}</span>
                    </div>
                 </div>
                 <button className="p-2 hover:bg-gray-50 rounded-full text-gray-400"><DotsThreeVertical size={20} /></button>
              </header>

              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#FAFAFA]">
                 {selectedChat.messages.map((msg) => (
                   <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] rounded-2xl px-5 py-3 text-sm shadow-sm border ${msg.isMe ? 'bg-indigo-600 text-white border-indigo-600 rounded-br-none' : 'bg-white text-gray-700 border-gray-200 rounded-bl-none'}`}>
                         <p className="leading-relaxed">{msg.text}</p>
                         <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${msg.isMe ? 'text-indigo-200' : 'text-gray-400'}`}>
                            <span>{msg.time}</span>
                            {msg.isMe && <Checks size={14} weight="bold" />}
                         </div>
                      </div>
                   </div>
                 ))}
              </div>

              <div className="p-4 bg-white border-t border-gray-100">
                 <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-200 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-50 transition-all">
                    <button className="p-2 text-gray-400 hover:text-gray-600"><Paperclip size={20} /></button>
                    <input type="text" placeholder="Type your message..." className="flex-1 bg-transparent outline-none text-sm text-gray-700 px-2" />
                    <button className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm"><PaperPlaneRight size={18} weight="fill" /></button>
                 </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">Select a chat to start messaging</div>
          )}
        </section>

        {/* --- CREATE GROUP MODAL --- */}
        {isModalOpen && (
           <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
                 
                 <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h2 className="text-lg font-bold text-gray-800">Create New Group</h2>
                    <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500"><X size={24} weight="bold"/></button>
                 </div>

                 <div className="p-6 overflow-y-auto custom-scrollbar">
                    <div className="mb-4">
                       <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Group Name</label>
                       <input type="text" className="w-full border border-gray-300 p-2 rounded-lg" 
                          placeholder="e.g. Physics Doubts" value={groupName} onChange={e => setGroupName(e.target.value)} />
                    </div>

                    <div className="mb-4">
                       <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Scope</label>
                       <div className="grid grid-cols-2 gap-2">
                          <button onClick={() => setGroupType("CLASS")} className={`py-2 rounded-lg text-xs font-bold border ${groupType === 'CLASS' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600'}`}>Whole Classes</button>
                          <button onClick={() => setGroupType("STUDENTS")} className={`py-2 rounded-lg text-xs font-bold border ${groupType === 'STUDENTS' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600'}`}>Specific Students</button>
                       </div>
                    </div>

                    {/* Select Classes */}
                    <div className="mb-4">
                       <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Select Your Class</label>
                       <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-2">
                          {myClasses.map(cls => (
                             <div key={cls.id} onClick={() => toggleClass(cls.id)} className={`flex items-center gap-3 p-2 rounded cursor-pointer ${selectedClasses.includes(cls.id) ? 'bg-indigo-50 border border-indigo-200' : 'hover:bg-gray-50'}`}>
                                <div className={`w-4 h-4 rounded border flex items-center justify-center ${selectedClasses.includes(cls.id) ? 'bg-indigo-600 border-indigo-600' : 'border-gray-400'}`}>
                                   {selectedClasses.includes(cls.id) && <div className="w-2 h-2 bg-white rounded-sm"></div>}
                                </div>
                                <span className="text-sm text-gray-700 font-medium">{cls.name}</span>
                             </div>
                          ))}
                       </div>
                    </div>

                    {/* Select Students (Conditional) */}
                    {groupType === 'STUDENTS' && selectedClasses.length > 0 && (
                       <div className="mb-4">
                          <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Select Students</label>
                          <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-2 bg-gray-50">
                             {classStudents.filter(s => selectedClasses.includes(s.class)).map(student => (
                                <div key={student.id} onClick={() => toggleStudent(student.id)} className={`flex items-center gap-3 p-2 rounded cursor-pointer bg-white border ${selectedStudents.includes(student.id) ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-gray-200 hover:border-gray-400'}`}>
                                   <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">{student.name[0]}</div>
                                   <div><p className="text-sm font-bold text-gray-800">{student.name}</p></div>
                                   {selectedStudents.includes(student.id) && <div className="ml-auto text-indigo-600"><Checks weight="fill"/></div>}
                                </div>
                             ))}
                          </div>
                       </div>
                    )}

                    <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 flex gap-2 items-start">
                       <div className="mt-0.5 text-yellow-600"><Users weight="fill"/></div>
                       <p className="text-xs text-yellow-700"><span className="font-bold">Note:</span> Admin will be automatically added to this group.</p>
                    </div>
                 </div>

                 <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                    <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-500 font-bold hover:bg-gray-200 rounded-lg">Cancel</button>
                    <button onClick={handleCreateGroup} className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 shadow-md">Create Group</button>
                 </div>
              </div>
           </div>
        )}

      </main>
    </div>
  );
};

export default TeacherNotices;
