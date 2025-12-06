import React from "react";
import ClerkSidebar from "../../Components/Clerk/ClerkSidebar";
import { Exam, RocketLaunch } from "phosphor-react";

const Examinations = () => {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <ClerkSidebar />

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center relative">
        
        {/* Background Decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-10">
           <div className="absolute top-10 left-10 w-64 h-64 bg-indigo-300 rounded-full filter blur-3xl"></div>
           <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-300 rounded-full filter blur-3xl"></div>
        </div>

        <div className="relative z-10 bg-white p-2 rounded-3xl shadow-xl border border-gray-100 max-w-lg w-full animate-fade-in">
           
           <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-600">
              <RocketLaunch size={40} weight="fill" />
           </div>

           <h1 className="text-3xl font-bold text-gray-800 mb-3">Examinations Module</h1>
           <h2 className="text-xl font-semibold text-indigo-600 mb-6">Coming Soon!</h2>
           
           <p className="text-gray-500 mb-8 leading-relaxed">
              We are building a comprehensive exam management system. <br/>
              Soon you will be able to:
           </p>

           <div className="space-y-3 text-left max-w-xs mx-auto mb-8">
              <FeatureItem text="Schedule Exams & Tests" />
              <FeatureItem text="Generate Hall Tickets" />
              <FeatureItem text="Upload & Manage Marks" />
              <FeatureItem text="Print Result Cards" />
           </div>

           <button className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition shadow-lg">
              Notify Me When Ready
           </button>
        </div>

        <p className="text-gray-400 text-sm mt-8 z-10">Acadix ERP • Version 1.0.0</p>

      </main>
    </div>
  );
};

const FeatureItem = ({ text }) => (
  <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
     <div className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0">
        <Exam size={12} weight="bold" />
     </div>
     <span className="text-sm font-medium">{text}</span>
  </div>
);

export default Examinations;
