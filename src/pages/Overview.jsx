import React from 'react';

const Overview = ({ jobData, planData, navigateTo }) => {
  return (
    <div className="w-full min-h-[100dvh] bg-[#F9FAFB] relative font-sans overflow-hidden">
      
      {/* Dynamic Background */}
      <div className="absolute top-0 right-0 w-full h-[50vh] bg-gradient-to-b from-[#EBFF00]/10 to-transparent -z-10 pointer-events-none"></div>

      {/* Top Nav */}
      <nav className="w-full max-w-5xl mx-auto px-6 py-6 flex items-center justify-between relative z-20">
        <button
          onClick={() => navigateTo('HOME')}
          className="flex items-center gap-2 text-gray-500 hover:text-[#111827] font-bold transition-all bg-white px-5 py-2.5 rounded-full text-sm border border-gray-200 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5"
        >
          <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Dashboard
        </button>
        <img src="/logo.svg" alt="Evalme" className="h-8 object-contain drop-shadow-sm" />
        <div className="w-32 hidden sm:block"></div>
      </nav>

      <div className="w-full max-w-4xl mx-auto px-6 pt-8 pb-20 relative z-10">
        
        {/* Header Ribbon */}
        <div className="inline-flex flex-col mb-8 animate-fade-in">
          <span className="text-amber-600 font-extrabold text-[11px] uppercase tracking-widest bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200 shadow-sm w-max mb-3 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
            Generated Plan
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-[#111827] tracking-tight leading-[1.1] mb-2 font-display">
            {jobData?.role || 'Personalized Study Masterplan'}
          </h1>
          <p className="text-gray-500 text-lg font-medium max-w-2xl">
             Your personalized roadmap to master {jobData?.role || 'your target role'}. 
          </p>
        </div>

        {/* Global Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 w-full animate-fade-in-up" style={{ animationDelay: '100ms' }}>
           <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_4px_15px_rgb(0,0,0,0.03)] flex flex-col">
             <span className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
               <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
               Duration
             </span>
             <span className="text-2xl font-black text-[#111827]">{jobData?.duration || '7 Days'}</span>
           </div>
           
           <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_4px_15px_rgb(0,0,0,0.03)] flex flex-col">
             <span className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
               <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
               Role
             </span>
             <span className="text-lg font-bold text-[#111827] truncate" title={jobData?.role}>{jobData?.role || 'Custom Role'}</span>
           </div>

           <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_4px_15px_rgb(0,0,0,0.03)] flex flex-col sm:col-span-2">
             <span className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
               <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
               Core Focus
             </span>
             <div className="flex flex-wrap gap-2 mt-2">
                {planData?.slice(0, 3).map((m, i) => (
                  <span key={i} className="bg-gray-100 text-[#111827] text-xs font-semibold px-2.5 py-1 rounded-md border border-gray-200">
                    Module {m.day}
                  </span>
                ))}
                {planData?.length > 3 && (
                   <span className="bg-gray-50 text-gray-500 text-xs font-semibold px-2.5 py-1 rounded-md border border-gray-100">+{planData.length - 3} more</span>
                )}
             </div>
           </div>
        </div>

        {/* Start CTA */}
        <div className="bg-[#111827] rounded-[2rem] p-8 sm:p-10 text-white shadow-[0_20px_40px_rgba(17,24,39,0.15)] mb-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden animate-fade-in-up" style={{ animationDelay: '200ms' }}>
           {/* Decorative bg */}
           <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#EBFF00]/10 rounded-full blur-[50px] pointer-events-none"></div>

           <div className="relative z-10 flex-1">
             <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 leading-tight text-white">Your personalized plan is ready.</h2>
             <p className="text-gray-400 text-[15px] leading-relaxed max-w-lg mb-6">
                We've structured your study path from day one to the final interview. Stick to the daily breakdown and you'll be fully prepared.
             </p>
             <button
                onClick={() => navigateTo('PLAN')}
                className="w-full sm:w-auto bg-[#EBFF00] hover:bg-[#d4e600] text-[#111827] font-black px-8 py-4 rounded-xl flex items-center justify-center gap-3 transition-all cursor-pointer shadow-[0_0_0_0_rgba(235,255,0,0.5)] hover:shadow-[0_0_0_8px_rgba(235,255,0,0.2)] hover:-translate-y-1 active:scale-[0.98]"
              >
                <span>View Full Curriculum</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
             </button>
           </div>
           
           <div className="relative z-10 w-full md:w-auto flex justify-center perspective-1000 hidden md:block">
              {/* Decorative pseudo-card to simulate the curriculum document */}
              <div className="w-48 h-64 bg-white rounded-xl shadow-2xl rotate-y-[-15deg] rotate-x-[10deg] rotate-z-[5deg] p-4 flex flex-col gap-3 relative border border-gray-100 transform origin-bottom-right transition-transform hover:rotate-0">
                 <div className="w-1/2 h-4 bg-gray-200 rounded-md"></div>
                 <div className="w-3/4 h-3 bg-gray-100 rounded-md"></div>
                 <div className="w-ful h-20 bg-gray-50 rounded-lg mt-2 border border-dashed border-gray-200 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                 </div>
                 <div className="mt-auto flex gap-2">
                    <div className="w-full h-8 bg-amber-400/20 rounded-md"></div>
                 </div>
                 <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-amber-400 rounded-xl shadow-lg flex items-center justify-center text-[#111827] rotate-[10deg]">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  )
};

export default Overview;
