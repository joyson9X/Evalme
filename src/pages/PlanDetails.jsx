import React from 'react';
import Mermaid from 'react-mermaid2';

const PlanDetails = ({ courseData, navigateTo }) => {
  return (
    <div className="w-full min-h-[100dvh] bg-[#F9FAFB] relative font-sans overflow-hidden">
      
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-[60vh] bg-gradient-to-b from-gray-100 to-transparent -z-10 pointer-events-none"></div>

      {/* Top Nav */}
      <nav className="w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between relative z-20 sticky top-0 bg-[#F9FAFB]/90 backdrop-blur-md border-b border-gray-200/50">
        <button
          onClick={() => navigateTo('OVERVIEW')}
          className="flex items-center gap-2 text-gray-500 hover:text-[#111827] font-bold transition-all bg-white px-5 py-2.5 rounded-full text-sm border border-gray-200 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5"
        >
          <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Overview
        </button>
        <img src="/logo.svg" alt="Evalme" className="h-8 object-contain drop-shadow-sm" />
        <div className="w-32 hidden sm:block"></div>
      </nav>

      <div className="w-full max-w-5xl mx-auto px-6 pt-10 pb-24 relative z-10 flex flex-col md:flex-row gap-10">
        
        {/* Left Column - Main Details */}
        <div className="flex-1 w-full flex flex-col gap-10">
           
           <div className="bg-white rounded-[2rem] p-8 sm:p-10 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 relative overflow-hidden group">
              {/* Highlight bar */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
              
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 border border-blue-100">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                 </div>
                 <div>
                    <h2 className="text-2xl font-black text-[#111827] tracking-tight">{courseData.role_targeted}</h2>
                    <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">{courseData.duration} Intensive Plan</p>
                 </div>
              </div>

              <div className="border-t border-gray-100 pt-6 mt-2">
                 <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"></path></svg>
                    Job Description Context
                 </h3>
                 <div className="bg-gray-50 rounded-xl p-5 text-[15px] text-gray-700 font-medium whitespace-pre-wrap leading-relaxed max-h-[300px] overflow-y-auto border border-gray-200/60 custom-scrollbar">
                    {courseData.jd_context}
                 </div>
              </div>
           </div>

           {courseData.course_architecture_mermaid && (
               <div className="bg-white rounded-[2rem] p-8 sm:p-10 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100">
                  <h3 className="text-2xl font-black text-[#111827] mb-6 flex items-center gap-3 tracking-tight">
                    <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center text-amber-500 border border-amber-100">
                       <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
                    </div>
                    Curriculum Architecture
                  </h3>
                  <div className="w-full overflow-x-auto pb-4 bg-gray-50 rounded-xl border border-gray-100 p-4 flex justify-center">
                    <Mermaid chart={courseData.course_architecture_mermaid} />
                  </div>
               </div>
           )}

        </div>

        {/* Right Column - Timeline / Modules */}
        <div className="w-full md:w-[400px] flex-shrink-0">
           <div className="bg-[#111827] rounded-[2rem] p-8 shadow-[0_20px_40px_rgba(17,24,39,0.15)] sticky top-[100px] border border-gray-800">
              <h3 className="text-xl font-bold text-white mb-6 tracking-tight flex items-center justify-between">
                 Study Modules
                 <span className="bg-gray-800 text-gray-300 text-[10px] uppercase font-black tracking-widest px-2.5 py-1 rounded-md">{courseData.course_contents?.length} Days</span>
              </h3>
              
              <div className="relative border-l-2 border-gray-800 ml-4 pb-4 space-y-8 mt-8">
                 {courseData.course_contents.map((week, index) => (
                    <div key={index} className="relative pl-8">
                       {/* Timeline Dot */}
                       <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-[#111827] border-4 border-[#EBFF00] z-10 shadow-[0_0_0_4px_rgba(17,24,39,1)]"></div>
                       
                       <div className="bg-gray-800/50 hover:bg-gray-800 transition-colors p-5 rounded-2xl border border-gray-700/50 group cursor-pointer">
                          <h4 className="font-extrabold text-[15px] text-white flex items-center justify-between mb-2">
                            Day {week.week_number}
                            <svg className="w-4 h-4 text-gray-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                          </h4>
                          
                          <div className="space-y-1.5 mt-3">
                             {week.topics?.slice(0,2).map((t, i) => (
                                <div key={i} className="text-gray-400 text-sm font-medium flex items-start gap-2 line-clamp-1">
                                  <span className="text-[#EBFF00] mt-0.5">&bull;</span> {t}
                                </div>
                             ))}
                             {week.topics?.length > 2 && (
                                <div className="text-gray-500 text-xs font-bold italic pt-1 pl-3">
                                   + {week.topics.length - 2} more topics
                                </div>
                             )}
                          </div>
                          
                          <button 
                            onClick={() => navigateTo('COURSE_PLAYER')}
                            className="mt-5 w-full bg-white text-[#111827] font-bold py-2.5 rounded-xl text-sm transition-all hover:bg-[#EBFF00] border-none cursor-pointer"
                          >
                            Start Module
                          </button>
                       </div>
                    </div>
                 ))}
                 
                 {/* End of timeline marker */}
                 <div className="absolute -left-[5px] -bottom-2 w-2 h-2 rounded-full bg-gray-700"></div>
              </div>
           </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #E5E7EB; border-radius: 10px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background-color: #D1D5DB; }
      `}} />
    </div>
  )
};

export default PlanDetails;
