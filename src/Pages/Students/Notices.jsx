import React, { useState } from "react";
import StudentSidebar from "../../Components/Students/StudentSidebar";
import { MagnifyingGlass, Megaphone, PushPin, Clock, User } from "phosphor-react";

const StudentNotices = () => {
  const [activeNotice, setActiveNotice] = useState(1);

  // --- DUMMY DATA (Announcements) ---
  const notices = [
    {
      id: 1,
      title: "Principal's Office",
      sender: "Dr. A.K. Sharma",
      role: "Principal",
      preview: "Regarding upcoming Winter Vacation dates.",
      time: "10:30 AM",
      date: "Today",
      color: "bg-red-100 text-red-700",
      initials: "PO",
      content: [
        { id: 1, text: "Dear Students,\n\nThe school will remain closed for Winter Vacation from 25th Dec to 5th Jan. Classes will resume on 6th Jan at regular timings.\n\nEnjoy your holidays and stay safe.", time: "10:30 AM" }
      ]
    },
    {
      id: 2,
      title: "Class 10-A (Physics)",
      sender: "Suresh Singh",
      role: "Class Teacher",
      preview: "Chapter 4 Notes uploaded.",
      time: "Yesterday",
      date: "Yesterday",
      color: "bg-blue-100 text-blue-700",
      initials: "PHY",
      content: [
        { id: 1, text: "I have uploaded the revised notes for Chapter 4 (Magnetism). Please check the Assignments section and complete the worksheet by Monday.", time: "4:00 PM" }
      ]
    },
    {
      id: 3,
      title: "Sports Department",
      sender: "Coach Vikram",
      role: "Admin",
      preview: "Inter-house Cricket Tournament selection.",
      time: "2 Oct",
      date: "02 Oct",
      color: "bg-green-100 text-green-700",
      initials: "SD",
      content: [
        { id: 1, text: "Selections for the School Cricket Team will be held on Saturday, 10 AM at the main ground. Interested students please report in full kit.", time: "09:00 AM" }
      ]
    }
  ];

  const selectedNotice = notices.find(n => n.id === activeNotice);

  return (
    <div className="flex h-screen bg-[#F3F4F6] overflow-hidden">
      <StudentSidebar />

      <main className="flex-1 flex gap-4 p-4 h-screen overflow-hidden">
        
        {/* LEFT SIDE: LIST */}
        <aside className="w-80 bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col">
          <div className="p-5 pb-2 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-1 flex items-center gap-2">
               <Megaphone size={24} className="text-indigo-600" weight="duotone"/> Notices
            </h2>
            <p className="text-xs text-gray-400 mb-4">Official Announcements</p>
            
            <div className="relative mb-2">
              <MagnifyingGlass size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search notices..." className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-300 transition" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
            {notices.map((notice) => (
              <div key={notice.id} onClick={() => setActiveNotice(notice.id)} className={`p-3 rounded-xl cursor-pointer transition-all duration-200 border ${activeNotice === notice.id ? 'bg-indigo-50 border-indigo-100 shadow-sm' : 'bg-white border-transparent hover:bg-gray-50 hover:border-gray-200'}`}>
                <div className="flex gap-3">
                  <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${notice.color}`}>
                    {notice.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className={`text-sm font-bold truncate ${activeNotice === notice.id ? 'text-indigo-900' : 'text-gray-800'}`}>{notice.title}</h3>
                      <span className="text-[10px] text-gray-400">{notice.time}</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{notice.preview}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* RIGHT SIDE: CONTENT (READ ONLY) */}
        <section className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden relative">
          {selectedNotice ? (
            <>
              {/* Header */}
              <header className="h-20 border-b border-gray-100 flex items-center justify-between px-8 bg-white shrink-0">
                 <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold ${selectedNotice.color}`}>
                       {selectedNotice.initials}
                    </div>
                    <div>
                       <h3 className="text-gray-900 font-bold text-lg">{selectedNotice.title}</h3>
                       <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded"><User weight="fill"/> {selectedNotice.sender}</span>
                          <span className="flex items-center gap-1"><Clock weight="fill"/> {selectedNotice.date}</span>
                       </div>
                    </div>
                 </div>
                 <PushPin size={24} className="text-gray-300 transform rotate-45" weight="fill" />
              </header>

              {/* Content Body */}
              <div className="flex-1 overflow-y-auto p-8 bg-[#FAFAFA]">
                 {selectedNotice.content.map((msg) => (
                   <div key={msg.id} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-3xl">
                      <p className="text-gray-800 leading-loose whitespace-pre-wrap font-medium text-sm md:text-base">
                         {msg.text}
                      </p>
                      <div className="mt-6 text-right text-xs text-gray-400 font-bold flex justify-end items-center gap-1">
                         Sent at {msg.time}
                      </div>
                   </div>
                 ))}
              </div>

              {/* Footer (Read Only Message) */}
              <div className="p-4 bg-gray-50 border-t border-gray-200 text-center text-xs text-gray-400 font-bold uppercase tracking-wide">
                 This is a broadcast message. Replies are disabled.
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
               <Megaphone size={48} className="mb-2 opacity-20"/>
               <p>Select a notice to read</p>
            </div>
          )}
        </section>

      </main>
    </div>
  );
};

export default StudentNotices;
