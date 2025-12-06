import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../../Components/Admin/Sidebar";
import { db } from "../../firebase";
import { ref, onValue, push, update, serverTimestamp, get, child } from "firebase/database"; 
import { 
  MagnifyingGlass, PaperPlaneRight, Paperclip, DotsThreeVertical, Checks, Plus, X, Users, 
  UserPlus, ChalkboardTeacher, Student, CaretRight, Trash
} from "phosphor-react";

const Notices = () => {
  // --- STATES ---
  const [activeChatId, setActiveChatId] = useState(null);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const messagesEndRef = useRef(null);
  
  // --- SIDE PANEL STATES ---
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [panelTab, setPanelTab] = useState("MEMBERS"); // 'MEMBERS' | 'ADD'
  const [groupMembers, setGroupMembers] = useState([]); // List of current members

  // --- FILTER STATES (For Adding) ---
  const [addFilter, setAddFilter] = useState("INDIVIDUAL"); // 'CLASS' | 'FACULTY' | 'INDIVIDUAL'
  const [availableList, setAvailableList] = useState([]); // List to pick from (Students/Teachers)
  const [selectedToAdd, setSelectedToAdd] = useState([]); // IDs selected to add

  // --- 1. FETCH CHATS ---
  useEffect(() => {
    const unsubscribe = onValue(ref(db, 'chats'), (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const chatList = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setChats(chatList);
      } else setChats([]);
    });
    return () => unsubscribe();
  }, []);

  // --- 2. FETCH MESSAGES & MEMBERS ---
  useEffect(() => {
    if (!activeChatId) return;
    
    // Messages
    const unsubscribeMsg = onValue(ref(db, `chats/${activeChatId}/messages`), (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const msgList = Object.keys(data).map(key => ({ id: key, ...data[key] })).sort((a, b) => a.timestamp - b.timestamp);
        setMessages(msgList);
      } else setMessages([]);
    });

    // Members (Fetch current members list if exists)
    // Note: In real app, you'd fetch user details using IDs. Here assuming simple list for demo.
    const unsubscribeMembers = onValue(ref(db, `chats/${activeChatId}/members`), (snapshot) => {
       const data = snapshot.val();
       if(data) setGroupMembers(Object.values(data));
       else setGroupMembers([]);
    });

    return () => { unsubscribeMsg(); unsubscribeMembers(); };
  }, [activeChatId]);

  useEffect(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  // --- 3. FETCH AVAILABLE USERS (For Adding) ---
  const fetchAvailableUsers = async (type) => {
     setAvailableList([]); // Clear old list
     const dbRef = ref(db);
     let data = {};

     if (type === 'FACULTY') {
        const snap = await get(child(dbRef, 'faculty'));
        if(snap.exists()) data = snap.val();
     } 
     else if (type === 'INDIVIDUAL' || type === 'CLASS') {
        const snap = await get(child(dbRef, 'students')); // Assuming students node exists
        if(snap.exists()) data = snap.val();
     }

     // Transform to Array
     const list = Object.keys(data).map(key => ({ id: key, ...data[key] }));
     setAvailableList(list);
  };

  useEffect(() => {
     if(showInfoPanel && panelTab === 'ADD') fetchAvailableUsers(addFilter);
  }, [showInfoPanel, panelTab, addFilter]);


  // --- ACTIONS ---

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChatId) return;
    await push(ref(db, `chats/${activeChatId}/messages`), {
      text: newMessage,
      sender: "Admin",
      senderRole: "admin",
      timestamp: serverTimestamp(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    setNewMessage("");
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    const newChatRef = await push(ref(db, 'chats'), {
      title: newGroupName,
      role: "Official Group",
      initials: newGroupName.substring(0,2).toUpperCase(),
      color: "bg-indigo-100 text-indigo-700",
      createdAt: serverTimestamp()
    });
    // Add Admin as first member
    await push(child(newChatRef, 'members'), { name: "Admin", role: "admin" });
    
    setShowCreateModal(false);
    setNewGroupName("");
  };

  const handleAddMembers = async () => {
     if(selectedToAdd.length === 0) return;
     
     const chatMembersRef = ref(db, `chats/${activeChatId}/members`);
     
     // Add each selected user
     for (const userId of selectedToAdd) {
        const user = availableList.find(u => u.id === userId);
        await push(chatMembersRef, {
           name: user.name,
           role: addFilter === 'FACULTY' ? 'teacher' : 'student',
           id: user.id
        });
     }
     
     alert("Members Added!");
     setSelectedToAdd([]);
     setPanelTab("MEMBERS"); // Go back to list
  };

  const activeChatDetails = chats.find(c => c.id === activeChatId);

  return (
    <div className="flex h-screen bg-[#F3F4F6] overflow-hidden">
      <Sidebar />

      <main className="flex-1 flex gap-4 p-4 h-screen overflow-hidden relative">
        
        {/* LEFT: CHAT LIST */}
        <aside className="w-80 bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col shrink-0">
          {/* (Same as before) */}
          <div className="p-5 pb-2 border-b border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div><h2 className="text-xl font-bold text-gray-800">Messages</h2></div>
              <button onClick={() => setShowCreateModal(true)} className="bg-indigo-50 text-indigo-600 p-2 rounded-full"><Plus size={20} weight="bold" /></button>
            </div>
            <div className="relative mb-2">
              <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search chats..." className="w-full pl-10 p-2.5 bg-gray-50 rounded-xl text-sm outline-none" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
            {chats.map((chat) => (
              <div key={chat.id} onClick={() => {setActiveChatId(chat.id); setShowInfoPanel(false);}} className={`p-3 rounded-xl cursor-pointer border ${activeChatId === chat.id ? 'bg-indigo-50 border-indigo-100' : 'bg-white border-transparent hover:bg-gray-50'}`}>
                <div className="flex gap-3">
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${chat.color}`}>{chat.initials}</div>
                   <div><h3 className="text-sm font-bold text-gray-800">{chat.title}</h3><p className="text-xs text-gray-500">{chat.role}</p></div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* CENTER: CHAT BOX */}
        <section className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden relative">
          {activeChatDetails ? (
            <>
              <header className="h-16 border-b border-gray-100 flex items-center justify-between px-6 bg-white shrink-0">
                 <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${activeChatDetails.color}`}>{activeChatDetails.initials}</div>
                    <div><h3 className="text-gray-800 font-bold text-sm">{activeChatDetails.title}</h3></div>
                 </div>
                 <button onClick={() => setShowInfoPanel(!showInfoPanel)} className={`p-2 rounded-full transition ${showInfoPanel ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-50 text-gray-400'}`}><DotsThreeVertical size={20} weight="bold" /></button>
              </header>

              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#FAFAFA]">
                 {messages.map((msg) => (
                   <div key={msg.id} className={`flex ${msg.senderRole === 'admin' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] rounded-2xl px-5 py-3 text-sm shadow-sm border ${msg.senderRole === 'admin' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white text-gray-700 rounded-bl-none'}`}>
                         {!msg.senderRole === 'admin' && <p className="text-[10px] font-bold text-gray-400 mb-1">{msg.sender}</p>}
                         <p>{msg.text}</p>
                         <span className="text-[10px] opacity-70 block text-right mt-1">{msg.time}</span>
                      </div>
                   </div>
                 ))}
                 <div ref={messagesEndRef} />
              </div>

              <div className="p-4 bg-white border-t border-gray-100 shrink-0">
                 <form onSubmit={handleSendMessage} className="flex gap-2 bg-gray-50 p-2 rounded-xl border border-gray-200">
                    <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type message..." className="flex-1 bg-transparent outline-none text-sm px-2" />
                    <button className="p-2 bg-indigo-600 text-white rounded-lg"><PaperPlaneRight size={18} weight="fill" /></button>
                 </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">Select a chat</div>
          )}
        </section>

        {/* RIGHT: INFO PANEL (SLIDE IN) */}
        {showInfoPanel && activeChatId && (
           <aside className="w-80 bg-white rounded-2xl shadow-lg border border-gray-200 flex flex-col animate-slide-in-right">
              <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-2xl">
                 <h3 className="font-bold text-gray-800">Group Info</h3>
                 <button onClick={() => setShowInfoPanel(false)}><X size={20} className="text-gray-400"/></button>
              </div>

              {/* TABS */}
              <div className="flex border-b border-gray-100">
                 <button onClick={() => setPanelTab("MEMBERS")} className={`flex-1 py-3 text-xs font-bold ${panelTab === 'MEMBERS' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}>Members ({groupMembers.length})</button>
                 <button onClick={() => setPanelTab("ADD")} className={`flex-1 py-3 text-xs font-bold ${panelTab === 'ADD' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}>Add People</button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                 
                 {/* TAB 1: MEMBERS LIST */}
                 {panelTab === 'MEMBERS' && (
                    <div className="space-y-3">
                       {groupMembers.map((m, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                             <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold">{m.name[0]}</div>
                                <div><p className="text-sm font-bold text-gray-800">{m.name}</p><p className="text-[10px] text-gray-400 uppercase">{m.role}</p></div>
                             </div>
                             {m.role !== 'admin' && <button className="text-red-400 hover:text-red-600"><Trash size={16}/></button>}
                          </div>
                       ))}
                    </div>
                 )}

                 {/* TAB 2: ADD MEMBERS */}
                 {panelTab === 'ADD' && (
                    <div className="space-y-4">
                       {/* Filter Dropdown */}
                       <div>
                          <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Filter By</label>
                          <select value={addFilter} onChange={e => setAddFilter(e.target.value)} className="w-full border p-2 rounded-lg text-sm bg-white outline-none">
                             <option value="FACULTY">All Faculty</option>
                             <option value="CLASS">Whole Class</option>
                             <option value="INDIVIDUAL">Individual Student</option>
                          </select>
                       </div>

                       {/* List to Select */}
                       <div className="space-y-2">
                          {availableList.map((u) => (
                             <div key={u.id} 
                                onClick={() => setSelectedToAdd(prev => prev.includes(u.id) ? prev.filter(id => id !== u.id) : [...prev, u.id])}
                                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer border ${selectedToAdd.includes(u.id) ? 'bg-indigo-50 border-indigo-200' : 'border-transparent hover:bg-gray-50'}`}
                             >
                                <div className={`w-4 h-4 border rounded flex items-center justify-center ${selectedToAdd.includes(u.id) ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'}`}>
                                   {selectedToAdd.includes(u.id) && <Checks size={12} className="text-white"/>}
                                </div>
                                <span className="text-sm text-gray-700">{u.name}</span>
                             </div>
                          ))}
                          {availableList.length === 0 && <p className="text-xs text-gray-400 text-center">No users found.</p>}
                       </div>

                       <button onClick={handleAddMembers} disabled={selectedToAdd.length === 0} className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold disabled:opacity-50 text-sm">
                          Add Selected ({selectedToAdd.length})
                       </button>
                    </div>
                 )}
              </div>
           </aside>
        )}

        {/* CREATE GROUP MODAL (Same as before) */}
        {showCreateModal && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
               <form onSubmit={handleCreateGroup} className="bg-white p-6 rounded-2xl w-full max-w-sm">
                  <h3 className="font-bold mb-4">Create Group</h3>
                  <input autoFocus className="w-full border p-2 rounded mb-4" placeholder="Group Name" value={newGroupName} onChange={e=>setNewGroupName(e.target.value)}/>
                  <div className="flex gap-2"><button type="button" onClick={()=>setShowCreateModal(false)} className="flex-1 border py-2 rounded">Cancel</button><button className="flex-1 bg-indigo-600 text-white py-2 rounded">Create</button></div>
               </form>
            </div>
        )}

      </main>
    </div>
  );
};

export default Notices;
