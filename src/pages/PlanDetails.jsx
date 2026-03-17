import React, { useMemo, useState, useEffect } from 'react';

const PlanDetails = ({ jobData, planData, navigateTo }) => {
  const [activeModule, setActiveModule] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  // Track scroll for sticky header effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate total syllabus items across all modules
  const totalItems = useMemo(() => {
    return planData?.reduce((acc, module) => {
      const topicsCount = module.topics?.length || 0;
      const quizCount = Array.isArray(module.quiz) && module.quiz.length > 0 ? 1 : 0;
      return acc + topicsCount + quizCount;
    }, 0) || 0;
  }, [planData]);

  const handleStart = () => {
    navigateTo('COURSE_PLAYER');
  };

  return (
    <div className="w-full min-h-[100dvh] bg-[#0A0A0A] font-sans text-white pb-32 selection:bg-[#EBFF00] selection:text-black">
      
      {/* Abstract Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#EBFF00]/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#111827]/80 blur-[120px] rounded-full"></div>
      </div>

      {/* Sticky Top Nav */}
      <div className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#0A0A0A]/80 backdrop-blur-md border-b border-white/10 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-[1200px] mx-auto px-6 flex justify-between items-center">
          <button
            onClick={() => navigateTo('GENERATOR')}
            className="flex items-center gap-2 text-gray-400 hover:text-white font-bold text-xs uppercase tracking-widest transition-colors bg-transparent border-none cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </div>
            Planner
          </button>

          {scrolled && (
            <button 
              onClick={handleStart}
              className="bg-[#EBFF00] text-black font-bold text-sm px-6 py-2.5 rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(235,255,0,0.3)] duration-300"
            >
               Start Learning
            </button>
          )}
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-[1200px] mx-auto px-6 pt-32 relative z-10">
        
        {/* Header Section */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">
             <span className="w-2 h-2 rounded-full bg-[#EBFF00] animate-pulse"></span>
             {jobData?.duration || '3 DAYS'} Intensive Track
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-[900] text-white tracking-tighter mb-6 leading-none">
             {jobData?.role || 'Analyst'} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EBFF00] to-green-400">Mastery</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-gray-400 max-w-2xl font-light leading-relaxed mb-10">
             Your hyper-focused curriculum to conquer the {jobData?.role || 'Analyst'} interviews and requirements.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <button 
              onClick={handleStart}
              className="group relative bg-white text-black font-[900] text-base md:text-lg px-8 py-4 md:py-5 rounded-2xl flex items-center gap-3 transition-all hover:scale-[1.02] shadow-[0_0_40px_rgba(255,255,0,0.15)] overflow-hidden w-full sm:w-auto justify-center cursor-pointer border-none"
            >
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-[150%] group-hover:animate-[shine_1.5s_ease-out]"></div>
               Initialize Training
               <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m-7-7H3" /></svg>
               </div>
            </button>

            {/* Progress Stats */}
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 px-6 backdrop-blur-md w-full sm:w-auto">
              <div className="text-3xl font-black text-[#EBFF00]">0%</div>
              <div className="w-px h-10 bg-white/10"></div>
              <div>
                <div className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Items Completed</div>
                <div className="text-white font-bold">0 <span className="text-gray-500 font-normal">/ {totalItems}</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout for Curriculum */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start relative mt-10 md:mt-20">
          
          {/* Left Column: Module Navigation (Tabs on mobile, Sticky sidebar on desktop) */}
          <div className="lg:col-span-4 lg:sticky lg:top-32 space-y-3">
             <div className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-6 px-2 hidden lg:block">Syllabus Overview</div>
             
             {/* Mobile Module Selector Row */}
             <div className="flex lg:hidden overflow-x-auto gap-3 pb-4 mb-4 scrollbar-hide snap-x">
                {planData?.map((module, mIdx) => (
                  <button
                    key={mIdx}
                    onClick={() => setActiveModule(mIdx)}
                    className={`shrink-0 snap-start whitespace-nowrap px-6 py-3 rounded-xl border font-bold text-sm transition-colors duration-300 ${
                      activeModule === mIdx 
                      ? 'bg-white/10 border-white/20 text-white' 
                      : 'bg-transparent border-white/10 text-gray-400 hover:bg-white/5'
                    }`}
                  >
                    Day {module.day}
                  </button>
                ))}
             </div>

             {/* Desktop Module List */}
             <div className="hidden lg:flex flex-col gap-3">
               {planData?.map((module, mIdx) => (
                  <button
                    key={'lg-'+mIdx}
                    onClick={() => setActiveModule(mIdx)}
                    className={`w-full text-left p-5 rounded-2xl transition-all duration-300 border flex items-center justify-between group ${
                      activeModule === mIdx 
                      ? 'bg-white/10 border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.5)]' 
                      : 'bg-transparent border-transparent hover:bg-white/5 text-gray-400'
                    }`}
                  >
                    <div>
                      <div className={`text-[10px] font-bold uppercase tracking-widest mb-1 transition-colors ${activeModule === mIdx ? 'text-[#EBFF00]' : 'text-gray-500'}`}>
                        Day {module.day}
                      </div>
                      <div className={`font-bold text-lg transition-colors ${activeModule === mIdx ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                        {module.title}
                      </div>
                    </div>
                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${
                      activeModule === mIdx ? 'border-[#EBFF00]/30 bg-[#EBFF00]/10 text-[#EBFF00]' : 'border-white/10 bg-white/5 text-white/50 group-hover:bg-white/10 group-hover:text-white'
                    }`}>
                      <svg className={`w-4 h-4 transition-transform duration-300 ${activeModule === mIdx ? 'translate-x-0.5' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                    </div>
                  </button>
               ))}
             </div>
          </div>

          {/* Right Column: Active Module Content */}
          <div className="lg:col-span-8 min-h-[500px]">
             {planData?.map((module, mIdx) => {
                if (mIdx !== activeModule) return null;

                const hasQuiz = Array.isArray(module.quiz) && module.quiz.length > 0;

                return (
                  <div key={'content-'+mIdx} className="animate-[fade-in-up_0.4s_ease-out]">
                    
                    {/* Active Module Header */}
                    <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-[2rem] p-8 md:p-12 mb-6 md:mb-8 backdrop-blur-xl relative overflow-hidden group">
                      {/* Decorative large day number */}
                      <div className="absolute -right-8 -bottom-16 text-[150px] md:text-[200px] font-black text-white/5 leading-none select-none pointer-events-none group-hover:scale-105 transition-transform duration-700">
                        {module.day}
                      </div>

                      <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 bg-[#EBFF00]/10 text-[#EBFF00] border border-[#EBFF00]/20 text-[10px] md:text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
                           Day {module.day} Foundation
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-white leading-[1.1] mb-6 max-w-xl">
                          {module.title}
                        </h2>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                           <div className="flex items-center gap-2 text-gray-400 font-medium text-sm md:text-base">
                              <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                              {module.topics?.length} Essential Topics
                           </div>
                           {hasQuiz && (
                             <div className="flex items-center gap-2 text-gray-400 font-medium text-sm md:text-base">
                                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {module.quiz.length} Question Checkpoint
                             </div>
                           )}
                        </div>
                      </div>
                    </div>

                    {/* Topics List as Sleek Cards */}
                    <div className="space-y-4 md:space-y-5 relative">
                       {/* Subtle connecting line background for desktop */}
                       <div className="absolute left-[39px] top-10 bottom-10 w-px bg-white/5 hidden sm:block"></div>

                       {module.topics?.map((topic, tIdx) => (
                          <div 
                            key={'t-'+tIdx}
                            onClick={handleStart}
                            className="group flex flex-col sm:flex-row gap-4 sm:gap-6 bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-white/20 rounded-2xl p-4 sm:p-6 sm:pr-8 transition-all duration-300 cursor-pointer relative z-10"
                          >
                             {/* Number Badge */}
                             <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-black/50 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-[#EBFF00] group-hover:border-[#EBFF00] transition-all duration-300 shadow-inner group-hover:shadow-[0_0_15px_rgba(235,255,0,0.3)]">
                                <span className="font-black text-lg sm:text-xl text-gray-400 group-hover:text-black transition-colors">{tIdx + 1}</span>
                             </div>

                             <div className="flex-1 flex flex-col justify-center">
                                <h3 className="text-lg sm:text-xl font-bold text-gray-200 group-hover:text-white transition-colors mb-2 leading-snug">
                                  {topic.name}
                                </h3>
                                <p className="text-gray-500 text-xs sm:text-sm line-clamp-2 md:pr-8 md:leading-relaxed">
                                  {topic.readingMaterial ? topic.readingMaterial.substring(0, 150) + '...' : 'Dive deep into the core mechanics, practical applications, and industry best practices for this critical topic.'}
                                </p>
                             </div>

                             {/* Desktop hover arrow */}
                             <div className="hidden sm:flex items-center justify-center shrink-0 w-12 h-12 rounded-full bg-white/5 border border-white/10 group-hover:bg-white group-hover:text-black transition-all text-white/30 self-center">
                               <svg className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m-7-7H3" /></svg>
                             </div>
                             
                             {/* Mobile persistent arrow */}
                             <div className="absolute top-4 right-4 sm:hidden text-white/20 group-hover:text-white/50 transition-colors">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                             </div>
                          </div>
                       ))}

                       {/* Quiz Card */}
                       {hasQuiz && (
                         <div 
                            onClick={handleStart}
                            className="group flex flex-col sm:flex-row gap-4 sm:gap-6 bg-gradient-to-r from-[#EBFF00]/10 to-transparent border border-[#EBFF00]/30 hover:border-[#EBFF00]/60 rounded-2xl p-4 sm:p-6 transition-all duration-300 cursor-pointer relative z-10 mt-6 sm:mt-8"
                          >
                             <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#EBFF00] flex items-center justify-center shrink-0 text-black shadow-[0_0_20px_rgba(235,255,0,0.3)] group-hover:shadow-[0_0_30px_rgba(235,255,0,0.5)] transition-shadow">
                                <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                             </div>

                             <div className="flex-1 flex flex-col justify-center">
                                <div className="text-[#EBFF00] text-[10px] font-black uppercase tracking-widest mb-1 md:mb-2">Knowledge Verification</div>
                                <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
                                  Day {module.day} Mastery Quiz
                                </h3>
                                <p className="text-gray-400 text-xs sm:text-sm">
                                  Validate your understanding with {module.quiz.length} challenge questions.
                                </p>
                             </div>

                             <div className="hidden sm:flex items-center justify-center shrink-0 bg-[#EBFF00] text-black w-12 h-12 rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.3)] transition-transform group-hover:scale-110 self-center">
                               <svg className="w-5 h-5 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" /></svg>
                             </div>
                             
                             <div className="absolute top-4 right-4 sm:hidden text-[#EBFF00]/50 group-hover:text-[#EBFF00] transition-colors">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                             </div>
                          </div>
                       )}

                    </div>
                  </div>
                );
             })}
          </div>

        </div>
      </div>
      
      {/* Global simple keyframes injected via style tag for self-contained component */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
      `}} />
    </div>
  );
};

export default PlanDetails;
