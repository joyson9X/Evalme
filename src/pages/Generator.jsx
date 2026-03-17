import React from 'react';

const Generator = ({ 
  navigateTo, 
  role, 
  setRole, 
  requirement, 
  setRequirement, 
  isParsing, 
  handleFileUpload, 
  parseError, 
  planner, 
  setPlanner, 
  handleGenerate, 
  isGenerating, 
  hasError,
  jobData
}) => {
  return (
    <div className="min-h-screen bg-[#FDFDFE] text-gray-900 font-sans selection:bg-[#EBFF00]/30 selection:text-gray-900 flex flex-col items-center justify-center p-4 sm:p-8 relative">
      
      {/* Absolute Ambient Backgrounds */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-[#EBFF00]/5 to-transparent rounded-full blur-[100px] -z-10 pointer-events-none"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-gray-200/40 to-transparent rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      {/* Main Container */}
      <div className="w-full max-w-[640px] relative z-10 flex flex-col gap-6 sm:gap-8 mx-auto mt-4 sm:mt-12 mb-12">
        
        {/* Navigation / Header */}
        <div className="flex items-center justify-between px-2">
          <button
            onClick={() => navigateTo('HOME')}
             className="group flex items-center justify-center w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300 hover:shadow-sm transition-all active:scale-95"
          >
             <svg className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          
          <img src="/logo.svg" alt="Evalme" className="h-[24px] object-contain cursor-pointer opacity-90 hover:opacity-100 transition-opacity" onClick={() => navigateTo('HOME')} />
        </div>

        {/* The Card */}
        <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 shadow-[0_2px_40px_-12px_rgba(0,0,0,0.08)] border border-gray-100 w-full relative overflow-hidden flex flex-col gap-8">
           
           {/* Subtle top highlight */}
           <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

           {/* Title Section */}
           <div className="text-center sm:text-left pt-2 pb-2">
              <h1 className="text-3xl sm:text-[34px] font-black tracking-tight text-[#111827] mb-2 font-display leading-tight">
                Architect your path.
              </h1>
              <p className="text-gray-500 text-[15px] max-w-[90%] mx-auto sm:mx-0 font-medium">
                Give us the role and the JD. We'll generate a day-by-day roadmap optimized for success.
              </p>
           </div>

           <form className="flex flex-col gap-7" onSubmit={e => e.preventDefault()}>
             
             {/* 1. The Role */}
             <div className="group">
               <label className="block text-[13px] font-bold text-gray-700 uppercase tracking-widest mb-2.5 ml-1">Target Role</label>
               <input
                 type="text"
                 className="w-full bg-[#F4F5F7] border border-transparent rounded-[1rem] px-5 py-4 text-[16px] text-gray-900 font-medium transition-all outline-none placeholder:text-gray-400 focus:bg-white focus:border-[#111827] focus:ring-4 focus:ring-gray-900/5 hover:bg-gray-100/80 shadow-inner shadow-gray-200/20"
                 placeholder="e.g. Senior Product Designer"
                 value={role}
                 onChange={e => setRole(e.target.value)}
               />
             </div>

             {/* 2. The Context (JD) */}
             <div>
               <div className="flex items-center justify-between mb-2.5 ml-1">
                 <label className="block text-[13px] font-bold text-gray-700 uppercase tracking-widest">Job Context</label>
                 
                 <div className="relative overflow-hidden cursor-pointer inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-900 bg-white border border-gray-200 px-3 py-1.5 rounded-full transition-all text-[12px] font-bold shadow-sm hover:shadow active:scale-[0.98]">
                   <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                   Attach JD
                   <input type="file" className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={handleFileUpload} disabled={isParsing} />
                 </div>
               </div>
               
               <div className={`relative rounded-[1rem] bg-[#F4F5F7] border border-transparent transition-all shadow-inner shadow-gray-200/20 focus-within:bg-white focus-within:border-[#111827] focus-within:ring-4 focus-within:ring-gray-900/5 hover:bg-gray-100/80 ${hasError && !requirement ? 'ring-2 ring-red-500 bg-red-50' : ''}`}>
                 <textarea
                   className={`w-full bg-transparent border-none px-5 py-4 pb-12 text-[15px] leading-relaxed text-gray-900 font-medium transition-all outline-none placeholder:text-gray-400/80 resize-none min-h-[140px] custom-scrollbar ${isParsing ? 'opacity-40 blur-[1px] pointer-events-none' : ''}`}
                   placeholder="Paste the requirements, tech stack, or full job description..."
                   value={requirement}
                   onChange={e => setRequirement(e.target.value)}
                 />
                 
                 {/* State Indicators inside Textarea */}
                 <div className="absolute bottom-3 right-3 flex items-center gap-2 pointer-events-none">
                    {isParsing && (
                       <div className="bg-[#111827] text-white text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-md flex items-center gap-2 shadow-lg animate-fade-in pointer-events-auto">
                         <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                         Reading...
                       </div>
                    )}
                    {requirement && !isParsing && (
                       <div className="bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[11px] font-bold uppercase tracking-widest px-2.5 py-1.5 rounded-md flex items-center gap-1.5 animate-fade-in pointer-events-auto">
                         <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                       </div>
                    )}
                 </div>
               </div>
               
               {parseError && (
                 <div className="mt-2 text-red-600 text-[12px] font-bold flex items-center gap-1.5 px-1 animate-fade-in">
                   <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                   {parseError}
                 </div>
               )}
             </div>

             {/* 3. Duration Selector (Refined segmented control) */}
             <div>
               <div className="flex items-center justify-between mb-2.5 ml-1">
                  <label className="block text-[13px] font-bold text-gray-700 uppercase tracking-widest m-0">Timeline</label>
               </div>
               
               <div className="flex bg-[#F4F5F7] p-1.5 rounded-[1rem] relative shadow-inner shadow-gray-200/20">
                  {/* The sliding active pill */}
                  <div 
                    className="absolute bg-white top-[6px] bottom-[6px] rounded-[10px] shadow-[0_1px_8px_rgba(0,0,0,0.06)] border border-gray-100/50 transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{
                      width: 'calc(33.33% - 8px)',
                      left: planner === '3 Days' ? '6px' : planner === '7 Days' ? 'calc(33.33% + 4px)' : 'calc(66.66% + 2px)'
                    }}
                  ></div>
                  
                  {['3 Days', '7 Days', '10 Days'].map(duration => {
                    const isActive = planner === duration;
                    return (
                      <button
                        key={duration}
                        type="button"
                        onClick={() => setPlanner(duration)}
                        className={`flex-1 flex items-center justify-center py-3 relative z-10 rounded-[10px] transition-colors duration-200 cursor-pointer border-none bg-transparent ${isActive ? 'text-[#111827]' : 'text-gray-500 hover:text-gray-900'}`}
                      >
                        <span className={`text-[14px] ${isActive ? 'font-black' : 'font-bold'}`}>{duration}</span>
                      </button>
                    );
                  })}
               </div>
             </div>

             {/* Final Action */}
             <div className="mt-4 flex flex-col gap-3">
                 <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={isGenerating || !role || !requirement || !planner}
                  className={`relative overflow-hidden group w-full bg-[#111827] text-white font-extrabold border-none rounded-[1rem] h-[58px] flex items-center justify-center gap-2 cursor-pointer transition-all shadow-[0_4px_14px_rgba(17,24,39,0.2)] hover:shadow-[0_8px_24px_rgba(17,24,39,0.3)] hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none disabled:transform-none disabled:shadow-none ${hasError ? 'animate-shake bg-red-600 shadow-red-600/30' : ''}`}
                 >
                  {/* Subtle shine effect on hover */}
                  <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"></div>

                  {!isGenerating ? (
                    <>
                      <span className="text-[16px] tracking-wide">Generate Syllabus</span>
                      <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-1.5">
                         <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                         <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                         <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                      <span className="text-[16px] tracking-wide ml-2">Building your plan...</span>
                    </>
                  )}
                 </button>

                 {/* Recovery Link */}
                 {!isGenerating && jobData && (
                   <button
                     type="button"
                     onClick={() => navigateTo('PLAN')}
                     className="w-full text-gray-500 font-bold py-3 text-[13px] transition-colors duration-200 hover:text-[#111827] bg-transparent border-none cursor-pointer flex items-center justify-center gap-1.5 underline underline-offset-4 decoration-gray-300 hover:decoration-[#111827]"
                   >
                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" /></svg>
                     Resume previous plan session
                   </button>
                 )}
             </div>

           </form>
        </div>
      </div>
    </div>
  )
};

export default Generator;
