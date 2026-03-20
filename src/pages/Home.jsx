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
        <div className="bg-white rounded-[2rem] p-6 sm:p-10 shadow-[0_8px_40px_rgba(0,0,0,0.06)] border border-gray-100 text-left relative overflow-hidden">
          {/* Subtle glow inside card */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#EBFF00]/20 to-transparent rounded-bl-full pointer-events-none"></div>

          <form className="flex flex-col gap-8 relative z-10" onSubmit={e => e.preventDefault()}>
            
            {/* 1. Target Role */}
            <div className="group">
              <label className="block text-xs font-[800] text-gray-400 uppercase tracking-widest mb-3 transition-colors group-focus-within:text-gray-900">Target Role</label>
              <input
                type="text"
                className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-4 text-xl font-bold text-gray-900 transition-all outline-none placeholder:text-gray-300 focus:bg-white focus:border-gray-900 focus:shadow-sm"
                placeholder="e.g. Senior Product Manager"
                value={role}
                onChange={e => setRole(e.target.value)}
              />
            </div>

            {/* 2. Job Context */}
            <div className="group">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-xs font-[800] text-gray-400 uppercase tracking-widest transition-colors group-focus-within:text-gray-900">Job Requirements</label>
                <div className="relative overflow-hidden cursor-pointer flex items-center gap-1.5 text-gray-500 hover:text-gray-900 bg-gray-100/80 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-all text-xs font-bold">
                   <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                   Upload PDF/DOCX
                   <input type="file" className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={handleFileUpload} disabled={isParsing} />
                </div>
              </div>

              <div className={`relative rounded-xl bg-gray-50/50 border border-gray-200 transition-all focus-within:bg-white focus-within:border-gray-900 focus-within:shadow-sm ${hasError && !requirement ? 'border-red-400 bg-red-50/30' : ''}`}>
                <textarea
                  className={`w-full bg-transparent border-none px-4 py-4 text-sm sm:text-base leading-relaxed text-gray-900 font-medium transition-all outline-none placeholder:text-gray-400 resize-none min-h-[160px] custom-scrollbar focus:ring-0 ${isParsing ? 'opacity-30 blur-[2px] pointer-events-none' : ''}`}
                  placeholder="Paste the full job description or core requirements here..."
                  value={requirement}
                  onChange={e => setRequirement(e.target.value)}
                />

                {/* Parsing Overlays */}
                <div className="absolute bottom-3 right-3 flex items-center gap-2 pointer-events-none">
                   {isParsing && (
                      <div className="bg-gray-900 text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-lg animate-fade-in pointer-events-auto">
                         <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                         Reading...
                      </div>
                   )}
                   {requirement && !isParsing && (
                      <div className="bg-white text-emerald-600 border border-emerald-100 text-[10px] sm:text-xs font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm animate-fade-in pointer-events-auto">
                         <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                         Logged
                      </div>
                   )}
                </div>
              </div>

              {parseError && (
                 <div className="mt-2 text-red-600 text-xs font-bold flex items-center gap-1.5 px-2">
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    {parseError}
                 </div>
              )}
            </div>

            {/* 3. Duration Cards */}
            <div>
               <label className="block text-xs font-[800] text-gray-400 uppercase tracking-widest mb-3">Preparation Timeline</label>
               <div className="grid grid-cols-3 gap-3">
                  {['3 Days', '7 Days', '10 Days'].map(duration => {
                     const isActive = planner === duration;
                     return (
                        <button
                          key={duration}
                          type="button"
                          onClick={() => setPlanner(duration)}
                          className={`flex flex-col items-center justify-center py-3 sm:py-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${isActive ? 'bg-gray-900 border-gray-900 text-[#EBFF00] shadow-[0_8px_20px_rgba(17,24,39,0.15)] -translate-y-1' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'}`}
                        >
                           <span className={`text-base sm:text-lg ${isActive ? 'font-black' : 'font-bold'}`}>{duration.split(' ')[0]}</span>
                           <span className={`text-[10px] sm:text-xs uppercase tracking-wider mt-0.5 ${isActive ? 'font-bold text-gray-300' : 'font-semibold text-gray-400'}`}>{duration.split(' ')[1]}</span>
                        </button>
                     );
                  })}
               </div>
            </div>

            {/* Action Button */}
            <div className="pt-2">
               <button
                 type="button"
                 onClick={handleGenerate}
                 disabled={isGenerating || !role || !requirement || !planner}
                 className={`w-full border-none rounded-xl h-[56px] sm:h-[64px] flex items-center justify-center gap-3 transition-all ${hasError ? 'animate-shake' : ''} ${isGenerating ? 'bg-gray-800 text-white cursor-wait' : (!role || !requirement || !planner ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#EBFF00] text-gray-900 hover:bg-[#d8eb00] cursor-pointer shadow-[0_4px_20px_rgba(235,255,0,0.3)] hover:-translate-y-1')}`}
               >
                  {!isGenerating ? (
                     <>
                        <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>
                        <span className="font-extrabold text-base sm:text-lg tracking-wide">Generate Study Plan</span>
                     </>
                  ) : (
                     <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span className="font-extrabold text-base sm:text-lg tracking-wide text-white">Generating...</span>
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
