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
  hasError 
}) => {
  return (
    <div className="w-full min-h-[100dvh] bg-[#F9FAFB] relative overflow-hidden font-sans pb-12">
      
      {/* Background blobs */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-amber-400 opacity-10 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Top Nav */}
      <nav className="w-full max-w-5xl mx-auto px-6 py-6 flex items-center justify-between relative z-20">
        <button
          onClick={() => navigateTo('HOME')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold transition-all bg-white px-5 py-2.5 rounded-full text-sm border border-gray-200 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5"
        >
          <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Home
        </button>
        <img src="/logo.svg" alt="Evalme" className="h-8 object-contain drop-shadow-sm" />
        <div className="w-32 hidden sm:block"></div> {/* Spacer for center alignment */}
      </nav>

      {/* Form Container */}
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10 relative z-10">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-[#111827] text-white font-bold px-4 py-1.5 rounded-full text-[11px] uppercase tracking-widest mb-6 shadow-sm">
            <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>
            AI Study Plan Generator
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight mb-3 leading-tight">Craft Your Success Path</h1>
          <p className="text-gray-500 text-lg">Input your target role and JD to generate a hyper-personalized roadmap.</p>
        </div>

        <div className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">

          <form className="flex flex-col gap-8" onSubmit={e => e.preventDefault()}>
            
            {/* Job Role */}
            <div>
              <label className="block font-bold mb-2.5 text-[15px] text-gray-900">Target Role</label>
              <input
                type="text"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-[16px] text-gray-900 font-medium transition-all outline-none placeholder:text-gray-400 placeholder:font-normal focus:bg-white focus:border-amber-400 focus:shadow-[0_0_0_4px_rgba(251,191,36,0.15)]"
                placeholder="e.g. Senior Frontend Engineer"
                value={role}
                onChange={e => setRole(e.target.value)}
              />
            </div>

            {/* Job Requirement */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label className="block font-bold text-[15px] text-gray-900">Job Description (JD)</label>
                <div className="relative group cursor-pointer inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200 px-3 py-1.5 rounded-full transition-colors text-xs font-bold">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                  Upload File
                  <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={handleFileUpload} disabled={isParsing} />
                </div>
              </div>
              
              <div className="relative">
                <textarea
                  className={`w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 pb-14 text-[15px] text-gray-900 font-medium transition-all outline-none placeholder:text-gray-400 placeholder:font-normal hover:border-gray-300 focus:bg-white focus:border-amber-400 focus:shadow-[0_0_0_4px_rgba(251,191,36,0.1)] resize-none min-h-[180px] ${isParsing ? 'opacity-50 blur-[2px] pointer-events-none' : ''}`}
                  placeholder="Paste the full job description here..."
                  value={requirement}
                  onChange={e => setRequirement(e.target.value)}
                />
                
                {/* Embedded Upload Status / Loading */}
                <div className="absolute bottom-4 right-4 flex justify-end items-end pointer-events-none">
                  {isParsing && (
                    <div className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm pointer-events-auto">
                      <div className="w-3.5 h-3.5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                      Processing Document...
                    </div>
                  )}
                  {requirement && !isParsing && (
                    <div className="bg-green-50 text-green-700 text-[11px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-green-200 flex items-center gap-2 shadow-sm pointer-events-auto">
                      <svg className="w-3.h h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      Content Ready
                    </div>
                  )}
                </div>
              </div>
              {parseError && <p className="text-red-500 text-sm mt-3 font-semibold bg-red-50 px-4 py-2 rounded-lg border border-red-100 flex items-center gap-2"><svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>{parseError}</p>}
            </div>

            {/* Planner Duration Grid */}
            <div>
              <label className="block font-bold mb-3 text-[15px] text-gray-900">Intensity / Timeline</label>
              <div className="grid grid-cols-3 gap-3">
                {['3 Days', '7 Days', '10 Days'].map(duration => {
                  const isActive = planner === duration;
                  let colorClass = "";
                  let subtext = "";
                  if (duration === '3 Days') { colorClass = isActive ? "border-red-500 bg-red-50 text-red-900 shadow-md shadow-red-500/10" : "hover:border-red-300"; subtext = "Crash Course"; }
                  if (duration === '7 Days') { colorClass = isActive ? "border-blue-500 bg-blue-50 text-blue-900 shadow-md shadow-blue-500/10" : "hover:border-blue-300"; subtext = "Standard"; }
                  if (duration === '10 Days') { colorClass = isActive ? "border-green-500 bg-green-50 text-green-900 shadow-md shadow-green-500/10" : "hover:border-green-300"; subtext = "Deep Dive"; }
                  
                  return (
                    <button
                      key={duration}
                      type="button"
                      onClick={() => setPlanner(duration)}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all cursor-pointer ${isActive ? colorClass : 'bg-white border-gray-100 text-gray-500'}`}
                    >
                      <span className={`text-lg font-black ${isActive ? '' : 'text-gray-800'}`}>{duration}</span>
                      <span className={`text-[11px] font-bold uppercase tracking-wider mt-1 ${isActive ? 'opacity-80' : 'text-gray-400'}`}>{subtext}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Generate Button */}
            <div className="mt-4 pt-6 border-t border-gray-100">
               <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating || !role || !requirement || !planner}
                className={`w-full text-gray-900 font-black border-none rounded-2xl py-4 flex items-center justify-center gap-3 cursor-pointer transition-all shadow-[0_4px_20px_rgba(251,191,36,0.3)] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(251,191,36,0.4)] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:transform-none disabled:shadow-none bg-amber-400 ${hasError ? 'animate-shake bg-red-400 text-white shadow-red-400/30' : ''}`}
               >
                {!isGenerating ? (
                  <>
                    <svg className="w-5.5 h-5.5 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <path d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                    <span className="text-[16px] tracking-wide">Generate Study Plan</span>
                  </>
                ) : (
                  <>
                    <div className="w-5 h-5 border-[3px] border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-[16px] tracking-wide animate-pulse">Analyzing Requirements...</span>
                  </>
                )}
               </button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  )
};

export default Generator;
