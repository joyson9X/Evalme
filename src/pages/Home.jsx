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
    <div className="w-full min-h-[100dvh] bg-[#FAFAFA] relative overflow-hidden font-sans flex flex-col">
      
      {/* Decorative background meshes */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-br from-gray-200 to-transparent rounded-full blur-[100px] opacity-50 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-gradient-to-tl from-[#EBFF00]/20 to-transparent rounded-full blur-[120px] pointer-events-none"></div>

      {/* ─── TOP NAV BAR ─── */}
      <nav className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-20">
        <img src="/logo.svg" alt="Evalme" className="h-[32px] object-contain drop-shadow-sm" />

        <div className="flex items-center gap-4">
          {!isPremium && (
            <button
              onClick={() => navigateTo('PRICING')}
              className="hidden sm:inline-flex bg-white text-[#111827] border border-gray-200 shadow-sm text-[12px] font-extrabold uppercase tracking-widest px-5 py-2 rounded-full cursor-pointer hover:border-gray-300 hover:shadow-md transition-all"
            >
              Upgrade Pro
            </button>
          )}

          {session?.user ? (
            <div className="flex items-center gap-3 bg-white pl-1.5 pr-5 py-1.5 rounded-full border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all cursor-pointer">
              {session.user.user_metadata?.avatar_url ? (
                <img src={session.user.user_metadata.avatar_url} alt="" className="w-8 h-8 rounded-full shadow-sm border border-gray-100" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#111827] text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                  {session.user.email?.[0]}
                </div>
              )}
              <span className="text-sm font-bold text-gray-900 hidden sm:block max-w-[120px] truncate">
                {session.user.user_metadata?.full_name || session.user.email.split('@')[0]}
              </span>
              <div className="w-px h-4 bg-gray-200 mx-1 hidden sm:block"></div>
              <button
                onClick={(e) => { e.stopPropagation(); handleSignOut(); }}
                className="text-gray-400 hover:text-red-500 transition-colors border-none bg-transparent outline-none flex items-center"
                title="Sign out"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              </button>
            </div>
          ) : null}
        </div>
      </nav>

      {/* ─── SPLIT MAIN CONTENT ─── */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-6 py-10 lg:py-16 flex flex-col lg:flex-row items-center gap-12 lg:gap-20 relative z-10">
        
        {/* LEFT COLUMN: HERO TEXT */}
        <div className="flex-1 w-full text-center lg:text-left flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm w-max mx-auto lg:mx-0 mb-8">
             <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EBFF00] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
             </span>
             <span className="text-xs font-extrabold text-gray-600 uppercase tracking-widest">Evalme Engine 2.0</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-[5.5rem] font-black text-[#111827] tracking-tight leading-[1.05] mb-6">
            Master your <br className="hidden lg:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500">dream role.</span>
          </h1>
          
          <p className="text-gray-500 text-lg sm:text-xl lg:text-2xl max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium mb-10">
            Upload any job description and instantly generate a <strong>hyper-targeted</strong>, day-by-day study plan. No fluff, just the exact skills you need to get hired.
          </p>

          <div className="flex items-center justify-center lg:justify-start gap-5">
             <div className="flex -space-x-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center overflow-hidden shadow-sm">
                     <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" className="w-full h-full object-cover" />
                  </div>
                ))}
             </div>
             <div className="flex flex-col text-left">
                <div className="flex items-center gap-1 text-amber-400">
                   {[1,2,3,4,5].map(i => <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
                </div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-0.5">Top Rated Tools</span>
             </div>
          </div>
        </div>

        {/* RIGHT COLUMN: GENERATOR FORM */}
        <div className="w-full max-w-xl lg:w-[550px] shrink-0">
          <div className="bg-white rounded-[2.5rem] p-8 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-gray-100 flex flex-col gap-8 relative overflow-hidden group">
            
            {/* Form Background Accent */}
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-[#EBFF00]/10 to-transparent rounded-full blur-[60px] pointer-events-none"></div>

            {/* Target Role Input */}
            <div className="flex flex-col relative z-10">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2.5 ml-1">Target Role</label>
               <input
                  type="text"
                  className="w-full bg-[#F4F5F7] border border-gray-200 hover:border-gray-300 focus:bg-white focus:border-[#111827] focus:shadow-[0_0_0_4px_rgba(17,24,39,0.05)] rounded-2xl px-5 py-4 text-xl font-bold text-gray-900 transition-all outline-none placeholder:text-gray-400 focus:ring-0"
                  placeholder="e.g. Senior Data Analyst"
                  value={role}
                  onChange={e => setRole(e.target.value)}
               />
            </div>

            {/* Job Requirements Input */}
            <div className="flex flex-col relative z-10">
               <div className="flex items-center justify-between mb-2.5 ml-1">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Job Context</label>
                 <div className="relative overflow-hidden cursor-pointer flex items-center gap-1.5 text-gray-500 hover:text-[#111827] transition-colors text-[10px] font-black uppercase tracking-wider">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                    Upload File
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept=".pdf,.docx,application/pdf" onChange={handleFileUpload} disabled={isParsing} />
                 </div>
               </div>
               
               <div className="relative w-full">
                  <textarea
                    className={`w-full bg-[#F4F5F7] border border-gray-200 hover:border-gray-300 focus:bg-white focus:border-[#111827] focus:shadow-[0_0_0_4px_rgba(17,24,39,0.05)] rounded-2xl px-5 py-5 text-sm sm:text-base font-medium text-gray-800 transition-all outline-none placeholder:text-gray-400 resize-none min-h-[140px] custom-scrollbar focus:ring-0 ${hasError && !requirement ? 'border-red-300 bg-red-50 focus:border-red-500 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.1)]' : ''} ${isParsing ? 'opacity-40 blur-[2px] pointer-events-none' : ''}`}
                    placeholder="Paste the full job description, skills required, or interview format here..."
                    value={requirement}
                    onChange={e => setRequirement(e.target.value)}
                  />
                  {/* Parsing Overlays */}
                  <div className="absolute bottom-4 right-4 flex items-center gap-2 pointer-events-none">
                     {isParsing && (
                        <div className="bg-[#111827] text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest px-4 py-2.5 rounded-xl flex items-center gap-2.5 shadow-xl animate-fade-in pointer-events-auto">
                           <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                           Extracting...
                        </div>
                     )}
                     {requirement && !isParsing && (
                        <div className="bg-white/90 backdrop-blur-sm text-gray-800 border border-gray-200 text-[10px] sm:text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-sm animate-fade-in pointer-events-auto">
                           <span className="w-2 h-2 bg-[#EBFF00] rounded-full"></span>
                           Context Loaded
                        </div>
                     )}
                  </div>
               </div>
               
               {parseError && (
                  <div className="mt-2 text-red-500 text-xs font-bold flex items-center gap-1.5 ml-1">
                     <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                     {parseError}
                  </div>
               )}
            </div>

            {/* Timeline Input */}
            <div className="flex flex-col relative z-10 -mt-2">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2.5 ml-1">Timeline</label>
               <div className="w-full relative flex bg-[#F4F5F7] p-1.5 rounded-2xl border border-gray-200 shadow-inner">
                  {/* Sliding pill */}
                  <div 
                    className="absolute top-1.5 bottom-1.5 w-[calc(33.33%-4px)] bg-white rounded-xl shadow-sm border border-gray-200/60 transition-all duration-300 ease-out z-0"
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
                          className={`flex-1 py-3 px-4 rounded-xl text-sm font-black transition-colors duration-300 whitespace-nowrap relative z-10 border-none bg-transparent cursor-pointer outline-none ${isActive ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                           {duration}
                        </button>
                     );
                  })}
               </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2 relative z-10">
               <button
                 type="button"
                 onClick={handleGenerate}
                 disabled={isGenerating || !role || !requirement || !planner}
                 className={`w-full relative overflow-hidden rounded-2xl h-[64px] flex items-center justify-center gap-3 transition-all duration-300 group border-none ${hasError ? 'animate-shake' : ''} ${isGenerating ? 'bg-gray-100 text-gray-400 cursor-wait' : (!role || !requirement || !planner ? 'bg-gray-50 text-gray-400 border border-gray-200 cursor-not-allowed' : 'bg-[#EBFF00] text-[#111827] cursor-pointer shadow-[0_8px_20px_rgba(235,255,0,0.3)] hover:-translate-y-1 hover:shadow-[0_12px_25px_rgba(235,255,0,0.4)]')}`}
               >
                  {!isGenerating ? (
                     <>
                        <div className={`absolute inset-0 bg-white/20 -translate-x-full transition-all duration-700 ${(!role || !requirement || !planner) ? '' : 'group-hover:animate-[shine_1.5s_ease-out]'}`}></div>
                        <svg className={`w-5 h-5 shrink-0 transition-transform duration-300 ${(!role || !requirement || !planner) ? 'opacity-40' : 'group-hover:rotate-12 group-hover:scale-110'}`} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>
                        <span className="font-[800] text-[17px] tracking-wide relative z-10">Generate Blueprint</span>
                     </>
                  ) : (
                     <div className="flex items-center gap-3 z-10">
                        <div className="w-4 h-4 border-[2.5px] border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                        <span className="font-[800] text-[17px] tracking-wide text-gray-500">Processing...</span>
                     </div>
                  )}
               </button>
            </div>

          </div>
        </div>

      </div>

      {/* ─── FOOTER ─── */}
      <footer className="w-full max-w-7xl mx-auto px-6 pb-8 relative z-10 mt-auto">
        <div className="border-t border-gray-200/60 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-gray-400 text-sm font-semibold">&copy; 2026 Evalme. Built for the future of work.</p>
          <div className="flex items-center gap-6">
            <a href="https://www.producthunt.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900 transition-colors text-sm font-bold no-underline">Product Hunt</a>
            <span className="w-1.5 h-1.5 bg-gray-200 rounded-full"></span>
            <button onClick={() => navigateTo('BLOGS')} className="text-gray-400 hover:text-gray-900 transition-colors text-sm font-bold border-none bg-transparent cursor-pointer">Blog</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
