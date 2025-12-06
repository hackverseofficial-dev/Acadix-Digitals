import React, { useState } from "react";
import StudentSidebar from "../../Components/Students/StudentSidebar";
import { CurrencyInr, Receipt, WarningCircle, QrCode, X } from "phosphor-react";

const StudentFees = () => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  // --- RAZORPAY INTEGRATION LOGIC ---
  const loadRazorpay = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpay = async (amount, method = "") => {
    const res = await loadRazorpay("https://checkout.razorpay.com/v1/checkout.js");

    if (!res) {
      alert("Razorpay SDK failed to load.");
      return;
    }

    const options = {
      key: "rzp_test_YOUR_KEY_HERE", // Replace with Test Key
      amount: amount * 100,
      currency: "INR",
      name: "Acadix ERP",
      description: "Fee Payment",
      image: "https://via.placeholder.com/150",
      // prefill helps auto-select method if specified (e.g. UPI)
      prefill: {
        name: "Rohan Sharma",
        email: "rohan@acadix.com",
        contact: "9999999999",
        method: method // 'upi', 'card', etc. (Optional hint)
      },
      theme: { color: "#4F46E5" },
      handler: function (response) {
        alert(`Payment ID: ${response.razorpay_payment_id}\nSuccess!`);
        setShowPaymentModal(false);
      },
    };

    const rzp = new window.Razorpay(options);
    
    // If specific method logic needed (Razorpay handles internal UI best)
    rzp.open();
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <StudentSidebar />
      <main className="flex-1 p-6 overflow-y-auto custom-scrollbar relative">
         <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2"><CurrencyInr size={32} className="text-green-600"/> Fees Portal</h1>
         
         {/* Due Banner */}
         <div className="bg-red-50 border border-red-200 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 mb-8 shadow-sm">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center animate-pulse"><WarningCircle size={32} weight="fill"/></div>
               <div>
                  <h3 className="text-lg font-bold text-red-800">Pending Dues: ₹5,000</h3>
                  <p className="text-sm text-red-600">Please clear your 2nd Quarter fees.</p>
               </div>
            </div>
            <button 
               onClick={() => setShowPaymentModal(true)} 
               className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-red-700 transition transform hover:scale-105"
            >
               Pay Now
            </button>
         </div>

         {/* PAYMENT MODAL */}
         {showPaymentModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
               <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                  <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                     <h3 className="font-bold text-gray-800">Choose Payment Method</h3>
                     <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-red-500"><X size={24} weight="bold"/></button>
                  </div>
                  
                  <div className="p-6 space-y-4">
                     <div className="text-center mb-6">
                        <p className="text-sm text-gray-500 uppercase font-bold">Total Payable</p>
                        <h2 className="text-3xl font-bold text-gray-800">₹5,000</h2>
                     </div>

                     {/* UPI APPS GRID */}
                     <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => handleRazorpay(5000, 'upi')} className="payment-btn border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700">
                           <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Google_Pay_Logo.svg/512px-Google_Pay_Logo.svg.png" alt="GPay" className="h-6 object-contain"/>
                           <span className="text-xs font-bold mt-1">Google Pay</span>
                        </button>
                        <button onClick={() => handleRazorpay(5000, 'upi')} className="payment-btn border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700">
                           <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/PhonePe_Logo.svg/1200px-PhonePe_Logo.svg.png" alt="PhonePe" className="h-6 object-contain"/>
                           <span className="text-xs font-bold mt-1">PhonePe</span>
                        </button>
                        <button onClick={() => handleRazorpay(5000, 'upi')} className="payment-btn border-sky-200 bg-sky-50 hover:bg-sky-100 text-sky-700">
                           <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/2560px-Paytm_Logo_%28standalone%29.svg.png" alt="Paytm" className="h-5 object-contain"/>
                           <span className="text-xs font-bold mt-1">Paytm</span>
                        </button>
                        <button onClick={() => handleRazorpay(5000)} className="payment-btn border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700">
                           <span className="text-xl font-bold">Cards</span>
                           <span className="text-xs font-bold mt-1">Credit / Debit</span>
                        </button>
                     </div>

                     <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                        <div className="relative flex justify-center"><span className="bg-white px-2 text-xs text-gray-400 font-bold uppercase">OR Scan QR</span></div>
                     </div>

                     {/* QR CODE SECTION */}
                     <button onClick={() => handleRazorpay(5000)} className="w-full border-2 border-dashed border-indigo-300 bg-indigo-50 rounded-xl p-4 flex flex-col items-center justify-center hover:bg-indigo-100 transition cursor-pointer group">
                        <QrCode size={48} className="text-indigo-600 mb-2 group-hover:scale-110 transition"/>
                        <span className="text-sm font-bold text-indigo-700">Generate UPI QR Code</span>
                        <span className="text-[10px] text-indigo-400">Scan with any UPI App</span>
                     </button>

                  </div>
                  
                  <div className="p-4 bg-gray-50 text-center text-[10px] text-gray-400 font-bold border-t border-gray-100">
                     Secured by Razorpay • 100% Safe Transaction
                  </div>
               </div>
            </div>
         )}

         {/* History */}
         <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="p-4 border-b border-gray-100 font-bold text-gray-700">Payment History</div>
            <div className="divide-y divide-gray-100">
               <PaymentRow id="#TXN1029" date="10 Aug 2025" amount="15,000" status="Paid" desc="1st Quarter Fee" />
            </div>
         </div>
      </main>
    </div>
  );
};

const PaymentRow = ({ id, date, amount, status, desc }) => (
   <div className="p-4 flex justify-between items-center hover:bg-gray-50 transition">
      <div>
         <p className="font-bold text-gray-800">{desc}</p>
         <p className="text-xs text-gray-500">{date} • {id}</p>
      </div>
      <div className="text-right">
         <p className="font-bold text-gray-800">₹{amount}</p>
         <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold uppercase flex items-center gap-1 justify-end mt-1">
            <Receipt size={12} weight="bold"/> {status}
         </span>
      </div>
   </div>
);

export default StudentFees;
