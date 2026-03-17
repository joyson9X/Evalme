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
    <div className="flex flex-col lg:flex-row min-h-[100dvh] w-full bg-white font-sans selection:bg-[#EBFF00]/30 overflow-x-hidden">
      
      {/* Left Column - Branding (Immersive Dark) */}
      <div className="lg:w-5/12 bg-[#0A0A0B] text-white p-8 lg:p-16 flex flex-col justify-between relative overflow-hidden shrink-0">
        
        {/* Glow Effects */}
        <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#EBFF00]/10 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="relative z-10 flex items-center justify-between lg:block">
           {/* Logo acts as Home button */}
           <div 
             onClick={() => navigateTo('HOME')} 
             className="text-2xl font-black tracking-tighter cursor-pointer flex items-baseline hover:opacity-80 transition-opacity lg:mb-20"
           >
             Evalme<span className="text-[#FFDE00]">.</span>
           </div>
           
           {/* Mobile Back Button (only shows on mobile header) */}
           <button 
             onClick={() => navigateTo('HOME')}
             className="lg:hidden text-gray-400 hover:text-white text-sm font-bold flex items-center gap-2 border-none bg-transparent"
           >
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
           </button>
        </div>

        <div className="relative z-10 mt-8 lg:mt-0 lg:flex-1 lg:flex lg:flex-col lg:justify-center lg:-translate-y-12">
           <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-black tracking-tighter leading-[1.05] text-white mb-6">
             Architect your<br className="hidden lg:block"/> ultimate strategy.
           </h1>
           <p className="text-gray-400 text-lg max-w-sm leading-relaxed font-medium">
             Feed us the role and the JD. Our engines will synthesize a hyper-personalized, day-by-day roadmap optimized for success.
           </p>
        </div>

        {/* Feature blocks (Desktop only) */}
        <div className="relative z-10 hidden lg:flex flex-col gap-6 mt-12">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-sm">
                 <svg className="w-6 h-6 text-[#EBFF00]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
               </div>
               <div>
                  <div className="font-bold text-white text-[15px]">AI Synthesis</div>
                  <div className="text-gray-500 text-[13px] font-medium">Context-aware curriculum generation</div>
               </div>
            </div>
            
             <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-sm">
                 <svg className="w-6 h-6 text-[#EBFF00]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
               </div>
               <div>
                  <div className="font-bold text-white text-[15px]">Interview Ready</div>
                  <div className="text-gray-500 text-[13px] font-medium">Granular daily objectives</div>
               </div>
            </div>
        </div>
      </div>

      {/* Right Column - The Interactive Form */}
      <div className="lg:w-7/12 bg-white flex flex-col relative w-full translate-y-[-20px] rounded-t-3xl lg:translate-y-0 lg:rounded-none shadow-[0_-20px_40px_rgba(0,0,0,0.1)] lg:shadow-none">
        
        {/* Desktop Cancel Button */}
        <button 
           onClick={() => navigateTo('HOME')}
           className="hidden lg:flex absolute top-10 right-10 text-gray-400 hover:text-gray-900 font-bold items-center gap-2 group transition-colors text-[14px] border-none bg-transparent cursor-pointer"
        >
           Cancel
           <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="flex-1 max-w-2xl w-full mx-auto p-6 sm:p-10 lg:p-20 flex flex-col justify-center pt-10 lg:pt-20">
            
            <form className="flex flex-col gap-10 lg:gap-14" onSubmit={e => e.preventDefault()}>
               
               {/* 1. Target Role (Underline Style) */}
               <div className="group">
                  <label className="block text-[12.5px] font-[800] text-gray-400 uppercase tracking-[0.15em] mb-4 transition-colors group-focus-within:text-[#111827]">Target Role</label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full bg-transparent border-0 border-b border-gray-200 pb-3 sm:pb-4 text-3xl sm:text-[40px] font-bold text-[#111827] leading-none transition-all outline-none placeholder:text-gray-200 focus:border-[#111827] focus:ring-0"
                      placeholder="e.g. Senior UX Designer"
                      value={role}
                      onChange={e => setRole(e.target.value)}
                    />
                  </div>
               </div>

               {/* 2. Job Context (Minimal Box) */}
               <div className="group">
                 <div className="flex items-end justify-between mb-4">
                    <label className="block text-[12.5px] font-[800] text-gray-400 uppercase tracking-[0.15em] transition-colors group-focus-within:text-[#111827]">Job Context</label>
                    
                    <div className="relative overflow-hidden cursor-pointer flex items-center gap-1.5 text-gray-500 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-3.5 py-1.5 rounded-full transition-all text-[12px] font-bold">
                       <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                       Attach Document
                       <input type="file" className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={handleFileUpload} disabled={isParsing} />
                    </div>
                 </div>

                 <div className={`relative rounded-3xl bg-gray-50/50 border border-gray-200 transition-all focus-within:bg-white focus-within:border-[#111827] focus-within:shadow-[0_4px_20px_rgba(0,0,0,0.04)] ${hasError && !requirement ? 'border-red-400 bg-red-50/30' : ''}`}>
                    <textarea
                      className={`w-full bg-transparent border-none p-6 pb-16 text-[16px] leading-relaxed text-gray-900 font-medium transition-all outline-none placeholder:text-gray-300 resize-none min-h-[180px] custom-scrollbar focus:ring-0 ${isParsing ? 'opacity-30 blur-[2px] pointer-events-none' : ''}`}
                      placeholder="Paste the full job description or requirements here..."
                      value={requirement}
                      onChange={e => setRequirement(e.target.value)}
                    />

                    {/* Integrated State Indicators */}
                    <div className="absolute bottom-4 right-4 flex items-center gap-2 pointer-events-none">
                       {isParsing && (
                          <div className="bg-[#111827] text-white text-[11px] font-bold uppercase tracking-widest px-4 py-2 rounded-xl flex items-center gap-2.5 shadow-lg animate-fade-in pointer-events-auto">
                             <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                             Reading...
                          </div>
                       )}
                       {requirement && !isParsing && (
                          <div className="bg-white text-emerald-600 border border-emerald-100 text-[11px] font-black uppercase tracking-widest px-3 py-1.5 rounded-[10px] flex items-center gap-1.5 shadow-sm animate-fade-in pointer-events-auto">
                             <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                             Logged
                          </div>
                       )}
                    </div>
                 </div>

                 {parseError && (
                    <div className="mt-3 text-red-600 text-[13px] font-bold flex items-center gap-1.5 px-2 animate-fade-in">
                       <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                       {parseError}
                    </div>
                 )}
               </div>

               {/* 3. Duration Cards */}
               <div>
                  <label className="block text-[12.5px] font-[800] text-gray-400 uppercase tracking-[0.15em] mb-4">Timeline</label>
                  <div className="grid grid-cols-3 gap-3">
                     {['3 Days', '7 Days', '10 Days'].map(duration => {
                        const isActive = planner === duration;
                        return (
                           <button
                             key={duration}
                             type="button"
                             onClick={() => setPlanner(duration)}
                             className={`flex flex-col items-center justify-center p-4 rounded-[1.25rem] border-2 transition-all duration-200 cursor-pointer ${isActive ? 'bg-[#111827] border-[#111827] text-white shadow-[0_8px_20px_rgba(17,24,39,0.15)] -translate-y-1' : 'bg-white border-gray-100 text-gray-500 hover:border-gray-300 hover:bg-gray-50'}`}
                           >
                              <span className={`text-[16px] sm:text-[18px] ${isActive ? 'font-black' : 'font-bold'}`}>{duration.split(' ')[0]}</span>
                              <span className={`text-[11px] uppercase tracking-wider mt-1 ${isActive ? 'font-bold opacity-80' : 'font-semibold opacity-60'}`}>{duration.split(' ')[1]}</span>
                           </button>
                        );
                     })}
                  </div>
               </div>

               {/* Giant Action Button */}
               <div className="mt-4 pt-4">
                  <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={isGenerating || !role || !requirement || !planner}
                    className={`magic-btn w-full border-none rounded-full h-[60px] sm:h-[68px] flex items-center justify-center gap-3 ${hasError ? 'animate-shake' : ''} ${isGenerating ? 'is-generating cursor-wait' : (!role || !requirement || !planner ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer')}`}
                  >
                     {!isGenerating ? (
                        <>
                           <svg height={24} width={24} viewBox="0 0 24 24" data-name="Layer 1" id="Layer_1" className="magic-sparkle shrink-0">
                             <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z" />
                           </svg>
                           <span className="magic-text font-bold text-[17px] sm:text-[19px] tracking-wide relative top-[1px]">Generate</span>
                        </>
                     ) : (
                        <>
                           <div className="flex items-center gap-1.5 pt-[2px]">
                             <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                             <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                             <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                           </div>
                           <span className="magic-text font-bold text-[17px] sm:text-[19px] tracking-wide ml-2 relative top-[1px]">Generating...</span>
                        </>
                     )}
                  </button>

                  <div className="mt-6 text-center">
                    {!isGenerating && jobData && (
                       <button
                         type="button"
                         onClick={() => navigateTo('PLAN')}
                         className="text-gray-400 hover:text-gray-900 font-bold text-[13px] underline underline-offset-4 decoration-gray-200 hover:decoration-gray-900 transition-colors cursor-pointer bg-transparent border-none"
                       >
                         Or continue to previous plan 
                       </button>
                    )}
                  </div>
               </div>

            </form>
        </div>
      </div>
    </div>
  )
};

export default Generator;
