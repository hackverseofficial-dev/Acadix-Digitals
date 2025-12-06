import React, { useState } from "react";
import ClerkSidebar from "../../Components/Clerk/ClerkSidebar";
import { MagnifyingGlass, PaperPlaneRight, Paperclip, DotsThreeVertical, Checks } from "phosphor-react";

const Notices = () => {
  const [activeNotice, setActiveNotice] = useState(1);

  // Dummy Data
  const chats = [
    {
      id: 1,
      title: "Admin Office",
      role: "Official",
      preview: "Please collect the fee register.",
      time: "10:30 AM",
      initials: "AO",
      color: "bg-purple-100 text-purple-700",
      messages: [
        { id: 1, sender: "Admin", text: "Good morning.", time: "10:28 AM", isMe: false },
        { id: 2, sender: "Admin", text: "Please collect the fee register from Principal's desk.", time: "10:30 AM", isMe: false },
      ]
    },
    {
      id: 2,
      title: "Class 10 Teachers",
      role: "Group",
      preview: "Marksheet submission deadline is tomorrow.",
      time: "Yesterday",
      initials: "10T",
      color: "bg-blue-100 text-blue-700",
      messages: [
        { id: 1, sender: "You", text: "Is the format finalized?", time: "9:00 AM", isMe: true },
        { id: 2, sender: "HOD Math", text: "Yes, check the attached file.", time: "11:15 AM", isMe: false },
      ]
    },
  ];

  const selectedChat = chats.find(c => c.id === activeNotice);

  return (
    <div className="flex h-screen bg-[#F3F4F6] overflow-hidden">
      <ClerkSidebar />

      <main className="flex-1 flex gap-4 p-4 h-screen overflow-hidden">
        
        {/* LEFT CARD: List */}
        <aside className="w-80 bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col">
          <div className="p-5 pb-2 border-b border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Messages</h2>
                <p className="text-xs text-gray-400 mt-1">Clerk Communication</p>
              </div>
              <button className="text-gray-400 hover:bg-gray-100 p-2 rounded-full transition">
                <DotsThreeVertical size={24} weight="bold" />
              </button>
            </div>
            <div className="relative mb-2">
              <MagnifyingGlass size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search..." className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-300 transition" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
            {chats.map((chat) => (
              <div key={chat.id} onClick={() => setActiveNotice(chat.id)} className={`p-3 rounded-xl cursor-pointer transition-all duration-200 border ${activeNotice === chat.id ? 'bg-purple-50 border-purple-100 shadow-sm' : 'bg-white border-transparent hover:bg-gray-50 hover:border-gray-200'}`}>
                <div className="flex gap-3">
                  <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${chat.color}`}>
                    {chat.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className={`text-sm font-bold truncate ${activeNotice === chat.id ? 'text-purple-900' : 'text-gray-800'}`}>{chat.title}</h3>
                      <span className="text-[10px] text-gray-400">{chat.time}</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{chat.preview}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* RIGHT CARD: Chat */}
        <section className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
          <header className="h-16 border-b border-gray-100 flex items-center justify-between px-6 bg-white">
             <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${selectedChat?.color}`}>{selectedChat?.initials}</div>
                <div>
                   <h3 className="text-gray-800 font-bold text-sm">{selectedChat?.title}</h3>
                   <span className="text-[10px] text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md font-medium">{selectedChat?.role}</span>
                </div>
             </div>
             <button className="p-2 hover:bg-gray-50 rounded-full text-gray-400"><DotsThreeVertical size={20} /></button>
          </header>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#FAFAFA]">
             {selectedChat?.messages.map((msg) => (
               <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] rounded-2xl px-5 py-3 text-sm shadow-sm border ${msg.isMe ? 'bg-purple-600 text-white border-purple-600 rounded-br-none' : 'bg-white text-gray-700 border-gray-200 rounded-bl-none'}`}>
                     <p className="leading-relaxed">{msg.text}</p>
                     <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${msg.isMe ? 'text-purple-200' : 'text-gray-400'}`}>
                        <span>{msg.time}</span>
                        {msg.isMe && <Checks size={14} weight="bold" />}
                     </div>
                  </div>
               </div>
             ))}
          </div>

          <div className="p-4 bg-white border-t border-gray-100">
             <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-200 focus-within:border-purple-300 focus-within:ring-2 focus-within:ring-purple-50 transition-all">
                <button className="p-2 text-gray-400 hover:text-gray-600"><Paperclip size={20} /></button>
                <input type="text" placeholder="Type your message..." className="flex-1 bg-transparent outline-none text-sm text-gray-700 px-2" />
                <button className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 shadow-sm"><PaperPlaneRight size={18} weight="fill" /></button>
             </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Notices;
