import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/Admin/Sidebar";
import { db } from "../../firebase";
import { ref, onValue, update, push, get, child } from "firebase/database";
import { 
  Wallet, TrendUp, TrendDown, CurrencyInr, Users, ArrowLeft, CheckCircle, XCircle, Plus, X
} from "phosphor-react";

const Finance = () => {
  const [classes, setClasses] = useState([]); // List of classes with calculated totals
  const [selectedClass, setSelectedClass] = useState(null); // Selected class ID
  const [classStudents, setClassStudents] = useState([]); // Students of selected class
  const [financeRecords, setFinanceRecords] = useState({}); // { studentID: [transactions] }
  const [loading, setLoading] = useState(true);
  
  // Add Payment Modal
  const [showModal, setShowModal] = useState(false);
  const [paymentForm, setPaymentForm] = useState({ studentId: "", amount: "", type: "Tuition Fee", method: "Cash" });

  // --- 1. FETCH DATA & CALCULATE STATS ---
  useEffect(() => {
    setLoading(true);
    const dbRef = ref(db);

    // Fetch Classes & Finance Records in Parallel
    Promise.all([
       get(child(dbRef, 'classes')),
       get(child(dbRef, 'finance')) // Assuming 'finance' node has all transactions
    ]).then(([classSnap, financeSnap]) => {
       
       const financeData = financeSnap.exists() ? financeSnap.val() : {};
       const classData = classSnap.exists() ? classSnap.val() : {};
       
       // Store raw finance records for drill-down
       // Structure: financeData = { txnId: { studentId: "...", classId: "...", amount: 1000, status: "Completed" } }
       setFinanceRecords(financeData);

       // Calculate Class-wise Totals
       const classList = Object.keys(classData).map(classKey => {
          const cls = classData[classKey];
          const classId = `${cls.className}-${cls.section}`; // e.g. 10-A

          // Filter transactions for this class
          const classTxns = Object.values(financeData).filter(t => t.classId === classId);
          
          const paid = classTxns.filter(t => t.status === 'Completed').reduce((sum, t) => sum + Number(t.amount), 0);
          const pending = classTxns.filter(t => t.status === 'Pending').reduce((sum, t) => sum + Number(t.amount), 0);
          
          return {
             id: classId,
             className: cls.className,
             section: cls.section,
             totalStudents: cls.students || 0,
             paidFees: paid,
             dueFees: pending
          };
       });

       setClasses(classList);
       setLoading(false);
    });

  }, []); // Refresh on mount (real-time listeners can be added if needed)

  // --- 2. LOAD STUDENTS WHEN CLASS SELECTED ---
  useEffect(() => {
     if (!selectedClass) return;

     // In a real app, you'd fetch students for this specific class
     // Here simulating by filtering all students (optimize this with query in production)
     const fetchStudents = async () => {
        const snap = await get(child(ref(db), 'students'));
        if (snap.exists()) {
           const allStudents = snap.val();
           const filtered = Object.keys(allStudents)
              .map(key => ({ id: key, ...allStudents[key] }))
              .filter(s => s.class === selectedClass.id);
           
           setClassStudents(filtered);
        }
     };
     fetchStudents();
  }, [selectedClass]);

  // --- 3. VERIFY PAYMENT ACTION ---
  const handleVerify = async (txnId, status) => {
     try {
        await update(ref(db, `finance/${txnId}`), {
           status: status,
           verifiedBy: "Admin",
           verifiedAt: new Date().toISOString()
        });
        // Refresh Data (Simple reload for now)
        window.location.reload(); 
     } catch (error) {
        alert("Update Failed");
     }
  };

  // --- 4. MANUAL PAYMENT ---
  const handleAddPayment = async (e) => {
     e.preventDefault();
     if (!selectedClass) return;
     
     try {
        await push(ref(db, 'finance'), {
           ...paymentForm,
           classId: selectedClass.id,
           date: new Date().toISOString().split('T')[0],
           status: "Completed", // Admin entry is auto-completed
           source: "Manual Admin Entry"
        });
        setShowModal(false);
        alert("Payment Recorded!");
        window.location.reload();
     } catch (error) {
        alert("Failed");
     }
  };

  // Totals for Header
  const totalCollection = classes.reduce((acc, curr) => acc + curr.paidFees, 0);
  const totalDue = classes.reduce((acc, curr) => acc + curr.dueFees, 0);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />

      <main className="flex-1 p-6 overflow-hidden flex flex-col">
        
        {/* Header Stats (Always Visible) */}
        <header className="mb-6 flex flex-col md:flex-row justify-between items-end gap-4 shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
               <Wallet size={32} className="text-indigo-600" weight="duotone" />
               Finance Management
            </h1>
            <p className="text-gray-500 text-sm mt-1">Track fees, dues, and collections</p>
          </div>

          <div className="flex gap-4">
             <div className="bg-white px-5 py-3 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-lg text-green-600"><TrendUp size={24} weight="bold" /></div>
                <div>
                   <p className="text-xs text-gray-400 uppercase font-bold">Total Collected</p>
                   <p className="text-lg font-bold text-gray-800">₹{(totalCollection / 100000).toFixed(2)} L</p>
                </div>
             </div>
             <div className="bg-white px-5 py-3 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
                <div className="p-2 bg-red-50 rounded-lg text-red-500"><TrendDown size={24} weight="bold" /></div>
                <div>
                   <p className="text-xs text-gray-400 uppercase font-bold">Total Pending</p>
                   <p className="text-lg font-bold text-gray-800">₹{(totalDue / 100000).toFixed(2)} L</p>
                </div>
             </div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto custom-scrollbar">
          
          {selectedClass ? (
            // VIEW 2: STUDENT LIST (Inside Selected Class)
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 min-h-full flex flex-col">
               
               {/* Toolbar */}
               <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-2xl">
                  <div className="flex items-center gap-4">
                     <button onClick={() => setSelectedClass(null)} className="p-2 hover:bg-white rounded-full text-gray-500"><ArrowLeft size={20} weight="bold"/></button>
                     <div>
                        <h3 className="font-bold text-gray-800 text-lg">Class {selectedClass.id}</h3>
                        <p className="text-xs text-gray-500">{selectedClass.totalStudents} Students • ₹{selectedClass.dueFees} Pending</p>
                     </div>
                  </div>
                  <button onClick={() => setShowModal(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-indigo-700 transition">
                     <Plus weight="bold"/> Record Payment
                  </button>
               </div>

               {/* Table */}
               <div className="flex-1 overflow-y-auto p-4">
                  <table className="w-full text-left border-collapse">
                     <thead className="sticky top-0 bg-white z-10">
                        <tr className="text-xs text-gray-400 uppercase border-b border-gray-100">
                           <th className="py-3 pl-2">Student</th>
                           <th className="py-3">Pending Dues</th>
                           <th className="py-3">Last Payment</th>
                           <th className="py-3 text-right pr-2">Action</th>
                        </tr>
                     </thead>
                     <tbody>
                        {classStudents.map(student => {
                           // Find transactions for this student
                           const studentTxns = Object.entries(financeRecords)
                              .map(([id, data]) => ({ id, ...data }))
                              .filter(t => t.studentId === student.id);
                           
                           const pendingTxns = studentTxns.filter(t => t.status === 'Pending');
                           const pendingAmount = pendingTxns.reduce((sum, t) => sum + Number(t.amount), 0);
                           const lastTxn = studentTxns.filter(t => t.status === 'Completed').pop();

                           return (
                              <tr key={student.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                                 <td className="py-3 pl-2 font-bold text-gray-700 text-sm">{student.name}</td>
                                 <td className="py-3">
                                    {pendingAmount > 0 ? (
                                       <span className="bg-red-50 text-red-600 px-2 py-1 rounded text-xs font-bold">₹{pendingAmount}</span>
                                    ) : <span className="text-green-500 text-xs font-bold flex items-center gap-1"><CheckCircle weight="fill"/> Clear</span>}
                                 </td>
                                 <td className="py-3 text-xs text-gray-500">
                                    {lastTxn ? `₹${lastTxn.amount} (${lastTxn.date})` : "No History"}
                                 </td>
                                 <td className="py-3 text-right pr-2">
                                    {pendingTxns.length > 0 ? (
                                       <div className="flex justify-end gap-2">
                                          <button 
                                             onClick={() => handleVerify(pendingTxns[0].id, 'Completed')} // Verifying first pending for demo
                                             className="text-green-600 hover:bg-green-100 p-1.5 rounded border border-green-200 text-xs font-bold"
                                          >
                                             Verify ₹{pendingTxns[0].amount}
                                          </button>
                                       </div>
                                    ) : (
                                       <span className="text-gray-300 text-xs">No Actions</span>
                                    )}
                                 </td>
                              </tr>
                           )
                        })}
                     </tbody>
                  </table>
                  {classStudents.length === 0 && <div className="text-center py-10 text-gray-400">No students found.</div>}
               </div>
            </div>

          ) : (
            // VIEW 1: CLASS CARDS GRID
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
              {loading ? <div className="col-span-full text-center py-20 text-gray-400">Loading Financial Data...</div> : classes.map((cls) => (
                <div 
                   key={cls.id} 
                   onClick={() => setSelectedClass(cls)}
                   className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer group relative overflow-hidden"
                >
                   <div className="flex justify-between items-start mb-4">
                      <div className="bg-indigo-50 text-indigo-600 p-3 rounded-xl font-bold text-lg">{cls.className} <span className="text-sm font-normal text-gray-500">{cls.section}</span></div>
                      <div className="text-right">
                         <p className="text-xs text-gray-400 uppercase font-bold">Students</p>
                         <p className="text-sm font-bold text-gray-700 flex items-center justify-end gap-1"><Users size={14}/> {cls.totalStudents}</p>
                      </div>
                   </div>
                   
                   <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                         <span className="text-gray-500">Collected</span>
                         <span className="font-bold text-green-600">₹{cls.paidFees.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                         <div className="bg-green-500 h-full rounded-full" style={{ width: `${(cls.paidFees / (cls.paidFees + cls.dueFees || 1)) * 100}%` }}></div>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                         <span className="text-gray-500">Pending</span>
                         <span className="font-bold text-red-500">₹{cls.dueFees.toLocaleString()}</span>
                      </div>
                   </div>
                   
                   <div className="mt-4 pt-3 border-t border-gray-100 text-center text-xs font-bold text-indigo-600 opacity-0 group-hover:opacity-100 transition">
                      Manage Class Finance →
                   </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ADD PAYMENT MODAL */}
        {showModal && (
           <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
              <form onSubmit={handleAddPayment} className="bg-white p-6 rounded-2xl w-full max-w-md space-y-4 animate-fade-in">
                 <div className="flex justify-between"><h3 className="font-bold text-lg">Add Payment</h3><button type="button" onClick={()=>setShowModal(false)}><X size={24}/></button></div>
                 
                 <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Student</label>
                    <select className="w-full border p-2 rounded-lg mt-1 bg-white" value={paymentForm.studentId} onChange={e=>setPaymentForm({...paymentForm, studentId: e.target.value})}>
                       <option value="">Select Student</option>
                       {classStudents.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                 </div>

                 <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Amount (₹)</label>
                    <input type="number" required className="w-full border p-2 rounded-lg mt-1" value={paymentForm.amount} onChange={e=>setPaymentForm({...paymentForm, amount: e.target.value})}/>
                 </div>

                 <div className="grid grid-cols-2 gap-3">
                    <div>
                       <label className="text-xs font-bold text-gray-500 uppercase">Type</label>
                       <select className="w-full border p-2 rounded-lg mt-1 bg-white" value={paymentForm.type} onChange={e=>setPaymentForm({...paymentForm, type: e.target.value})}>
                          <option>Tuition Fee</option><option>Transport</option><option>Exam</option>
                       </select>
                    </div>
                    <div>
                       <label className="text-xs font-bold text-gray-500 uppercase">Method</label>
                       <select className="w-full border p-2 rounded-lg mt-1 bg-white" value={paymentForm.method} onChange={e=>setPaymentForm({...paymentForm, method: e.target.value})}>
                          <option>Cash</option><option>Cheque</option><option>UPI</option>
                       </select>
                    </div>
                 </div>

                 <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 mt-2">Save Record</button>
              </form>
           </div>
        )}

      </main>
    </div>
  );
};

export default Finance;
