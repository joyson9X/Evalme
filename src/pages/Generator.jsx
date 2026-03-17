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
    <div className="w-full min-h-[100dvh] bg-[#F9FAFB] relative font-sans overflow-hidden flex flex-col items-center justify-center pb-12 pt-0 sm:pt-8">
      
      {/* Subtle Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-400 opacity-5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-indigo-400 opacity-[0.03] blur-[100px] rounded-full pointer-events-none"></div>

      {/* Main Card Container */}
      <div className="w-full max-w-[620px] mx-auto relative z-10 sm:px-6">

        {/* Top App Bar inside context, rather than edge-to-edge */}
        <div className="flex items-center justify-between mb-8 px-6 sm:px-0">
          <img src="/logo.svg" alt="Evalme" className="h-[28px] object-contain cursor-pointer opacity-90 transition-opacity hover:opacity-100" onClick={() => navigateTo('HOME')} />
          <button
            onClick={() => navigateTo('HOME')}
            className="flex items-center gap-1.5 text-gray-400 hover:text-gray-900 font-bold transition-all bg-transparent border-none cursor-pointer text-[13px] tracking-wide"
          >
            Cancel
          </button>
        </div>

        <div className="bg-white rounded-none sm:rounded-[2.5rem] p-8 sm:p-12 shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-gray-100 sm:border-gray-200/60 w-full">
          
          <div className="mb-10 text-center sm:text-left">
            <h1 className="text-[2rem] sm:text-[2.5rem] font-bold text-[#111827] tracking-tight leading-[1.1] mb-3">
              Generate Curriculum
            </h1>
            <p className="text-gray-500 text-[15px] sm:text-[16px] leading-relaxed max-w-md mx-auto sm:mx-0">
              Provide context about your target role to generate a hyper-personalized, day-by-day study plan.
            </p>
          </div>

          <form className="flex flex-col gap-8" onSubmit={e => e.preventDefault()}>
            
            {/* Target Role Field */}
            <div>
              <label className="block font-bold mb-2.5 text-[14px] text-gray-700 tracking-wide">Target Role Title</label>
              <input
                type="text"
                className="w-full bg-white border border-gray-200 rounded-[1.25rem] px-5 py-4 text-[16px] text-gray-900 font-medium transition-all outline-none placeholder:text-gray-400 placeholder:font-normal hover:border-gray-300 focus:bg-[#FAFAFA] focus:border-gray-800 focus:ring-4 focus:ring-gray-900/5 shadow-sm"
                placeholder="e.g. Senior Product Designer, React Developer"
                value={role}
                onChange={e => setRole(e.target.value)}
              />
            </div>

            {/* Job Description Field */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label className="block font-bold text-[14px] text-gray-700 tracking-wide">Job Description & Requirements</label>
                <div className="relative group cursor-pointer inline-flex items-center gap-1.5 text-[#111827] bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-full transition-colors font-bold text-[12px] border border-gray-200">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                  Upload JD Document
                  <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={handleFileUpload} disabled={isParsing} />
                </div>
              </div>
              
              <div className="relative rounded-[1.5rem] bg-white border border-gray-200 overflow-hidden shadow-sm transition-all focus-within:border-gray-800 focus-within:ring-4 focus-within:ring-gray-900/5 hover:border-gray-300">
                <textarea
                  className={`w-full bg-transparent border-none px-5 py-5 pb-16 text-[15px] text-gray-900 font-medium transition-all outline-none placeholder:text-gray-400 placeholder:font-normal resize-none min-h-[160px] ${isParsing ? 'opacity-50 blur-[2px] pointer-events-none' : ''}`}
                  placeholder="Paste the full job description or requirements context here..."
                  value={requirement}
                  onChange={e => setRequirement(e.target.value)}
                />
                
                {/* Floating Context Toolbar */}
                <div className="absolute bottom-3 right-3 flex justify-end items-end pointer-events-none">
                  {isParsing && (
                    <div className="bg-gray-900 text-white text-[12px] font-bold px-3 py-2 rounded-xl flex items-center gap-2 shadow-md pointer-events-auto">
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Processing File...
                    </div>
                  )}
                  {requirement && !isParsing && (
                    <div className="bg-green-50 text-green-700 text-[11px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border border-green-200 flex items-center gap-1.5 shadow-sm pointer-events-auto">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                      Ready
                    </div>
                  )}
                </div>
              </div>
              {parseError && (
                <p className="text-red-600 text-[13px] mt-3 font-semibold bg-red-50 px-4 py-2.5 rounded-xl border border-red-100 flex items-start gap-2.5 shadow-sm">
                  <svg className="w-4.5 h-4.5 shrink-0 mt-[1px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  {parseError}
                </p>
              )}
            </div>

            {/* Segmented Control for Duration */}
            <div>
              <div className="flex items-center justify-between mb-3">
                 <label className="block font-bold text-[14px] text-gray-700 tracking-wide m-0">Timeline Structure</label>
                 <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#111827] bg-gray-100 px-2.5 py-1 rounded-md">
                    {planner.split(' ')[0] || '7'} Modules
                 </span>
              </div>
              <div className="bg-gray-100 p-1.5 rounded-[1.25rem] flex items-center justify-between relative shadow-inner">
                {/* Sliding indicator */}
                <div 
                  className="absolute bg-white h-[calc(100%-12px)] top-[6px] rounded-[1rem] shadow-[0_2px_10px_rgba(0,0,0,0.06)] transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]"
                  style={{
                    width: 'calc(33.33% - 8px)',
                    left: `${planner === '3 Days' ? '6px' : planner === '7 Days' ? 'calc(33.33% + 4px)' : 'calc(66.66% + 2px)'}`
                  }}
                ></div>
                
                {['3 Days', '7 Days', '10 Days'].map(duration => {
                  const isActive = planner === duration;
                  let sublabel = duration === '3 Days' ? 'Crash' : duration === '7 Days' ? 'Standard' : 'Deep';
                  
                  return (
                    <button
                      key={duration}
                      type="button"
                      onClick={() => setPlanner(duration)}
                      className={`flex-1 flex flex-col items-center justify-center py-3.5 relative z-10 rounded-[1rem] transition-all cursor-pointer border-none bg-transparent ${isActive ? 'text-[#111827]' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      <span className={`text-[15px] ${isActive ? 'font-black' : 'font-semibold'}`}>{duration}</span>
                      <span className={`text-[11px] font-bold uppercase tracking-wider mt-0.5 ${isActive ? 'text-[#111827] opacity-60' : 'text-gray-400 opacity-0 hidden sm:block'}`}>{sublabel}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions Block */}
            <div className="pt-4 flex flex-col gap-3 border-t border-gray-100/60 mt-2">
               {/* Primary Generate Action */}
               <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating || !role || !requirement || !planner}
                className={`group w-full bg-[#111827] hover:bg-black text-white font-bold border-none rounded-[1.25rem] py-4.5 flex items-center justify-center gap-3 cursor-pointer transition-all shadow-[0_4px_14px_rgba(17,24,39,0.2)] active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none disabled:transform-none disabled:shadow-none ${hasError ? 'animate-shake bg-red-600 shadow-red-600/30' : ''}`}
               >
                {!isGenerating ? (
                  <>
                    <span className="text-[16px] tracking-wide">Generate Study Plan</span>
                    <div className="bg-white/10 p-1 rounded-full group-hover:bg-white/20 transition-colors">
                       <svg className="w-4.5 h-4.5 stroke-current stroke-2 transition-transform group-hover:translate-x-0.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" fill="none">
                         <path d="M5 12h14M12 5l7 7-7 7" />
                       </svg>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-5 h-5 flex space-x-1 items-center justify-center">
                       <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                       <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                       <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    <span className="text-[16px] tracking-wide">Orchestrating AI...</span>
                  </>
                )}
               </button>

               {/* Secondary Continue Previous Action (Only if plan data exists locally) */}
               {!isGenerating && jobData && (
                 <button
                   onClick={() => navigateTo('PLAN')}
                   className="w-full bg-white text-gray-700 font-bold py-3.5 rounded-[1.25rem] transition-all hover:bg-gray-50 hover:text-[#111827] border border-gray-200 cursor-pointer flex items-center justify-center gap-2 active:scale-[0.98] text-[14px]"
                 >
                   Restore previous plan ({jobData.role})
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
