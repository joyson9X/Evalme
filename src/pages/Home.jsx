import React from 'react';

const Home = ({ 
  session, 
  isPremium, 
  handleSignOut, 
  navigateTo,
  role,
  setRole,
  requirement,
  setRequirement,
  planner,
  setPlanner,
  handleGenerate,
  isGenerating,
  hasError,
  handleFileUpload,
  isParsing,
  parseError 
}) => {
  return (
    <div className="w-full min-h-[100dvh] bg-white relative overflow-hidden font-sans">
      
      {/* Background Graphic */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-[#ebff00]/10 to-transparent rounded-full blur-[100px] -z-10 translate-x-1/3 -translate-y-1/3"></div>

      {/* ─── TOP NAV BAR ─── */}
      <nav className="w-full max-w-6xl mx-auto px-6 py-5 flex items-center justify-between relative z-20">
        <img src="/logo.svg" alt="Evalme" className="h-[28px] md:h-[32px] object-contain drop-shadow-sm" />

        <div className="flex items-center gap-3">
          {!isPremium && (
            <button
              onClick={() => navigateTo('PRICING')}
              className="hidden sm:inline-flex bg-[#111827] text-white text-[12px] font-bold uppercase tracking-wider px-5 py-2 rounded-full cursor-pointer border-none hover:bg-black transition-colors"
            >
              Upgrade
            </button>
          )}

          {session?.user && (
            <div className="flex items-center gap-2.5 bg-gray-50/80 backdrop-blur-md pl-1.5 pr-4 py-1.5 rounded-full border border-gray-200 shadow-sm transition-all hover:bg-white hover:border-gray-300">
              {session.user.user_metadata?.avatar_url ? (
                <img src={session.user.user_metadata.avatar_url} alt="" className="w-8 h-8 rounded-full shadow-sm" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#111827] text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                  {session.user.email?.[0]}
                </div>
              )}
              <span className="text-sm font-semibold text-gray-800 hidden sm:block max-w-[120px] truncate">
                {session.user.user_metadata?.full_name || session.user.email.split('@')[0]}
              </span>
              <div className="w-px h-4 bg-gray-300 mx-1 hidden sm:block"></div>
              {isPremium && (
                <span className="flex items-center text-amber-500">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                </span>
              )}
              <button
                onClick={handleSignOut}
                className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer border-none bg-transparent ml-1 outline-none"
                title="Sign out"
              >
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* ─── HERO SECTION ─── */}
      <div className="w-full max-w-4xl mx-auto px-6 pt-12 pb-10 sm:pt-20 sm:pb-16 relative z-10 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#111827] tracking-tight leading-[1.1] mb-5">
          Your AI Career <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500">Accelerator</span>
        </h1>
        <p className="text-[#4B5563] text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed font-medium mb-12">
          Generate targeted, day-by-day study plans to master the exact skills your dream role requires.
        </p>
      </div>

        {/* ─── INTEGRATED GENERATOR ─── */}
      <div className="w-full max-w-3xl mx-auto px-6 pb-24 relative z-10">
        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.04)] border border-white/60 relative overflow-hidden group/card shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
          {/* Subtle meshed glow backdrops */}
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-[#EBFF00]/20 to-transparent rounded-full blur-[80px] pointer-events-none opacity-50 group-hover/card:opacity-100 transition-opacity duration-1000"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-gray-200/50 to-transparent rounded-full blur-[80px] pointer-events-none opacity-50 group-hover/card:opacity-100 transition-opacity duration-1000"></div>

          <form className="flex flex-col gap-8 sm:gap-10 relative z-10" onSubmit={e => e.preventDefault()}>
            
            {/* 1. Target Role */}
            <div className="group/input relative flex flex-col">
              <label className="flex items-center gap-2 text-[11px] font-[800] text-gray-400 uppercase tracking-[0.15em] mb-4 transition-colors group-focus-within/input:text-gray-900">
                <svg className="w-4 h-4 text-gray-300 group-focus-within/input:text-[#EBFF00] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                Target Role
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full bg-transparent border-0 border-b-2 border-gray-100 pb-3 text-3xl sm:text-[40px] font-bold text-gray-900 leading-none transition-all outline-none placeholder:text-gray-200 focus:border-gray-900 focus:ring-0"
                  placeholder="e.g. Senior Data Analyst"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                />
              </div>
            </div>

            {/* 2. Job Context */}
            <div className="group/textarea flex flex-col pt-2">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
                <label className="flex items-center gap-2 text-[11px] font-[800] text-gray-400 uppercase tracking-[0.15em] transition-colors group-focus-within/textarea:text-gray-900">
                  <svg className="w-4 h-4 text-gray-300 group-focus-within/textarea:text-gray-900 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  Job Requirements
                </label>
                
                <div className="relative overflow-hidden cursor-pointer flex items-center gap-2 text-gray-500 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200/80 px-4 py-2 rounded-xl transition-all text-xs font-bold shadow-sm whitespace-nowrap">
                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                   Upload PDF / DOCX
                   <input type="file" className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={handleFileUpload} disabled={isParsing} />
                </div>
              </div>

              <div className={`relative rounded-2xl bg-gray-50/50 border-2 transition-all focus-within:bg-white focus-within:border-gray-900 focus-within:shadow-[0_0_0_4px_rgba(17,24,39,0.05)] ${hasError && !requirement ? 'border-red-300 bg-red-50/30' : 'border-gray-100 hover:border-gray-200'}`}>
                <textarea
                  className={`w-full bg-transparent border-none p-5 sm:p-6 text-sm sm:text-base leading-relaxed text-gray-800 font-medium transition-all outline-none placeholder:text-gray-300 resize-none min-h-[150px] custom-scrollbar focus:ring-0 ${isParsing ? 'opacity-30 blur-[2px] pointer-events-none' : ''}`}
                  placeholder="Paste the full job description or core skills you need to master..."
                  value={requirement}
                  onChange={e => setRequirement(e.target.value)}
                />

                {/* Overlays inside textarea */}
                <div className="absolute bottom-4 right-4 flex items-center gap-2 pointer-events-none">
                   {isParsing && (
                      <div className="bg-gray-900 text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest px-4 py-2.5 rounded-xl flex items-center gap-2.5 shadow-xl animate-fade-in pointer-events-auto">
                         <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                         Extracting...
                      </div>
                   )}
                   {requirement && !isParsing && (
                      <div className="bg-white text-gray-800 border-2 border-gray-100 text-[10px] sm:text-xs font-black uppercase tracking-widest px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm animate-fade-in pointer-events-auto">
                         <span className="w-2 h-2 bg-[#EBFF00] rounded-full shadow-[0_0_8px_rgba(235,255,0,0.8)] animate-pulse"></span>
                         Context Loaded
                      </div>
                   )}
                </div>
              </div>

              {parseError && (
                 <div className="mt-3 text-red-500 text-[13px] font-bold flex items-center gap-1.5 px-2">
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    {parseError}
                 </div>
              )}
            </div>

            <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent my-1"></div>

            {/* 3. Timeline Segmented Control (Fluid) */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
               <div className="shrink-0 flex items-center gap-2">
                 <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                 </div>
                 <div>
                   <label className="block text-[11px] font-[800] text-gray-400 uppercase tracking-widest mb-0.5">Timeline</label>
                   <p className="text-sm font-bold text-gray-900 m-0">Prep Duration</p>
                 </div>
               </div>

               <div className="w-full sm:w-auto relative flex bg-gray-50/80 p-1.5 rounded-2xl border border-gray-100 shadow-inner">
                  {/* Sliding pill background */}
                  <div 
                    className="absolute top-1.5 bottom-1.5 w-[calc(33.33%-4px)] bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-gray-200/60 transition-transform duration-300 ease-out z-0"
                    style={{
                      transform: `translateX(${(() => {
                        const idx = ['3 Days', '7 Days', '10 Days'].indexOf(planner);
                        return idx === 1 ? '100%' : idx === 2 ? '200%' : '0%';
                      })()})`,
                      marginLeft: ['3 Days', '7 Days', '10 Days'].indexOf(planner) === 1 ? '4px' : ['3 Days', '7 Days', '10 Days'].indexOf(planner) === 2 ? '8px' : '0'
                    }}
                  ></div>

                  {['3 Days', '7 Days', '10 Days'].map((duration) => {
                     const isActive = planner === duration;
                     return (
                        <button
                          key={duration}
                          type="button"
                          onClick={() => setPlanner(duration)}
                          className={`flex-1 sm:w-28 py-2.5 sm:py-3 px-4 rounded-xl text-sm font-black transition-colors duration-300 whitespace-nowrap relative z-10 border-none bg-transparent cursor-pointer ${isActive ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                           {duration}
                        </button>
                     );
                  })}
               </div>
            </div>

            {/* Action Button */}
            <div className="pt-6">
               <button
                 type="button"
                 onClick={handleGenerate}
                 disabled={isGenerating || !role || !requirement || !planner}
                 className={`relative w-full overflow-hidden rounded-[1.25rem] h-[64px] sm:h-[72px] flex items-center justify-center gap-3 transition-all duration-500 group border-none ${hasError ? 'animate-shake' : ''} ${isGenerating ? 'bg-gray-100 text-gray-400 cursor-wait' : (!role || !requirement || !planner ? 'bg-gray-50 shadow-inner border border-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#111827] text-white cursor-pointer shadow-[0_8px_30px_rgba(17,24,39,0.2)] hover:shadow-[0_15px_40px_rgba(17,24,39,0.3)] hover:-translate-y-1')}`}
               >
                  {!isGenerating ? (
                     <>
                        <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full transition-all duration-1000 ${(!role || !requirement || !planner) ? '' : 'group-hover:animate-[shine_1.5s_ease-out]'}`}></div>
                        <svg className={`w-5 h-5 sm:w-6 sm:h-6 shrink-0 transition-transform duration-300 ${(!role || !requirement || !planner) ? 'opacity-40' : 'text-[#EBFF00] group-hover:rotate-12 group-hover:scale-110'}`} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>
                        <span className="font-[800] text-[17px] sm:text-[19px] tracking-wide relative z-10 transition-colors">Start Building Plan</span>
                     </>
                  ) : (
                     <div className="flex items-center gap-3 z-10">
                        <div className="w-4 h-4 border-[2.5px] border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                        <span className="font-[800] text-[17px] sm:text-[19px] tracking-wide text-gray-600">Initializing...</span>
                     </div>
                  )}
               </button>
            </div>
          </form>
        </div>
      </div>

      {/* ─── FOOTER ─── */}
      <footer className="w-full max-w-6xl mx-auto px-6 pb-10 relative z-10">
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-gray-500 text-sm font-medium">&copy; 2026 Evalme. Built for the future of work.</p>
          <div className="flex items-center gap-6">
            <a href="https://www.producthunt.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 transition-colors text-sm font-semibold no-underline">Product Hunt</a>
            <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
            <button onClick={() => navigateTo('BLOGS')} className="text-gray-500 hover:text-gray-900 transition-colors text-sm font-semibold border-none bg-transparent cursor-pointer">Blog</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
