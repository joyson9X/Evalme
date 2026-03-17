import React from 'react';

const Home = ({ session, isPremium, handleSignOut, navigateTo }) => {
  return (
    <div className="w-full min-h-[100dvh] bg-white relative overflow-hidden font-sans">
      
      {/* Background Graphic */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-[#ebff00]/10 to-transparent rounded-full blur-[100px] -z-10 translate-x-1/3 -translate-y-1/3"></div>

      {/* ─── TOP NAV BAR ─── */}
      <nav className="w-full max-w-6xl mx-auto px-6 py-5 flex items-center justify-between relative z-20">
        <img src="/logo.svg" alt="Evalme" className="h-[28px] md:h-[32px] object-contain drop-shadow-sm" />

        {session?.user && (
          <div className="flex items-center gap-3">
            {/* Premium Badge */}
            {isPremium && (
              <span className="hidden sm:inline-flex items-center gap-1.5 bg-[#111827] text-[#EBFF00] text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                PRO
              </span>
            )}

            {/* Avatar + Menu */}
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
                <span className="sm:hidden flex items-center text-amber-500">
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
          </div>
        )}
      </nav>

      {/* ─── HERO SECTION ─── */}
      <div className="w-full max-w-4xl mx-auto px-6 pt-12 pb-10 sm:pt-20 sm:pb-16 relative z-10 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#111827] tracking-tight leading-[1.1] mb-5">
          Your AI Career <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500">Accelerator</span>
        </h1>
        <p className="text-[#4B5563] text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
          Generate targeted study plans, practice live coding, and master the exact skills your dream role requires.
        </p>
      </div>

      {/* ─── FEATURE CARDS ─── */}
      <div className="w-full max-w-5xl mx-auto px-6 pb-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">

          {/* Card 1: Interview Prep */}
          <button
            onClick={() => navigateTo('GENERATOR')}
            className="group relative text-left bg-white rounded-3xl p-8 sm:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-200 transition-all duration-300 cursor-pointer hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 hover:border-gray-300 overflow-hidden flex flex-col"
          >
            {/* Subtle highlight */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform duration-500"></div>

            <div className="w-14 h-14 bg-[#111827] rounded-2xl flex items-center justify-center mb-6 text-[#EBFF00] shadow-md">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Interview Prep Planner</h2>
            <p className="text-gray-500 text-base leading-relaxed mb-8 flex-1">
              AI-generated day-by-day study plans crafted specifically for your target role and job description.
            </p>

            <span className="inline-flex items-center gap-2 text-[#111827] font-bold text-[15px] group-hover:gap-3 transition-all mt-auto">
              Start Building Let's Go
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </span>
          </button>

          {/* Card 2: Learn Coding */}
          <button
            onClick={() => isPremium ? navigateTo('CODING_COURSES') : navigateTo('PRICING')}
            className="group relative text-left bg-white rounded-3xl p-8 sm:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-200 transition-all duration-300 cursor-pointer hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 hover:border-gray-300 overflow-hidden flex flex-col"
          >
            {/* Subtle highlight */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform duration-500"></div>

            {!isPremium && (
              <div className="absolute top-6 right-6 z-20 bg-gradient-to-r from-gray-900 to-gray-800 text-[#EBFF00] text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                PRO
              </div>
            )}

            <div className="w-14 h-14 bg-gray-100/80 border border-gray-200 rounded-2xl flex items-center justify-center mb-6 text-gray-700">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Coding Academy</h2>
            <p className="text-gray-500 text-base leading-relaxed mb-8 flex-1">
              Interactive coding courses with live environments, real-world challenges, and AI-powered feedback.
            </p>

            <span className={`inline-flex items-center gap-2 font-bold text-[15px] group-hover:gap-3 transition-all mt-auto ${isPremium ? 'text-[#111827]' : 'text-gray-500'}`}>
              {isPremium ? 'Browse Courses' : 'Unlock with Premium'}
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </span>
          </button>
        </div>

        {/* Quick Actions Row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
          {!isPremium && (
            <button
              onClick={() => navigateTo('PRICING')}
              className="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-[#111827] text-white text-sm font-bold px-8 py-3.5 rounded-xl hover:bg-black transition-all cursor-pointer border-none shadow-[0_4px_14px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.2)] hover:-translate-y-0.5"
            >
              <svg className="w-4.5 h-4.5 text-[#EBFF00]" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              Upgrade to Premium
            </button>
          )}
          <button
            onClick={() => navigateTo('BLOGS')}
            className="w-full sm:w-auto inline-flex justify-center items-center gap-2.5 bg-white text-gray-700 text-sm font-bold px-8 py-3.5 rounded-xl border border-gray-200 hover:border-gray-300 hover:text-gray-900 transition-all cursor-pointer shadow-sm hover:shadow hover:bg-gray-50"
          >
            Read our Blog
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </button>
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
