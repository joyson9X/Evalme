import React, { useMemo, useState } from 'react';

const PlanDetails = ({ jobData, planData, navigateTo }) => {
  // State for Accordion
  const [expandedModules, setExpandedModules] = useState({});

  // Calculate total syllabus items across all modules (topics + quizzes)
  const totalItems = useMemo(() => {
    return planData?.reduce((acc, module) => {
      const topicsCount = module.topics?.length || 0;
      const quizCount = Array.isArray(module.quiz) && module.quiz.length > 0 ? 1 : 0;
      return acc + topicsCount + quizCount;
    }, 0) || 0;
  }, [planData]);

  // Handle course navigation
  const handleStart = () => {
    navigateTo('COURSE_PLAYER');
  };

  const toggleModule = (mIdx) => {
    setExpandedModules(prev => ({
      ...prev,
      [mIdx]: !prev[mIdx]
    }));
  };

  return (
    <div className="w-full min-h-[100dvh] bg-[#fafafa] relative font-sans text-gray-900 pb-24 selection:bg-[#EBFF00]/40 selection:text-[#111827]">
      
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-gray-100/80 to-[#fafafa] pointer-events-none opacity-50 z-0 overflow-hidden">
         <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-[#EBFF00]/10 blur-[100px] rounded-full mix-blend-multiply"></div>
         <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-blue-100/40 blur-[100px] rounded-full mix-blend-multiply"></div>
      </div>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 pt-6 md:pt-12 relative z-10 w-full">
        
        {/* Top Navbar / Back Link */}
        <button
          onClick={() => navigateTo('GENERATOR')}
          className="flex items-center gap-2 text-gray-500 hover:text-[#111827] font-bold text-xs uppercase tracking-[0.15em] transition-all bg-transparent border-none cursor-pointer mb-8 md:mb-12 group"
        >
          <div className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center font-bold text-gray-400 group-hover:border-gray-900 group-hover:text-gray-900 transition-colors shadow-sm">
             <svg className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </div>
          Back to Generator
        </button>

        {/* Header Hero Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 relative">
           <div className="max-w-2xl relative z-10">
              <div className="inline-flex items-center gap-2 bg-white border border-gray-200 shadow-sm text-[#111827] text-[10px] md:text-xs font-[900] uppercase tracking-widest px-3 py-1.5 rounded-md mb-5">
                 <span className="w-2 h-2 rounded-full bg-[#EBFF00] animate-pulse"></span>
                 {jobData?.duration || '3 DAYS'} INTENSIVE
              </div>
              <h1 className="text-4xl md:text-6xl font-[900] text-[#111827] tracking-tight mb-4 leading-[1.05]">
                 {jobData?.role || 'Analyst'}
              </h1>
              <p className="text-gray-500 font-medium text-lg md:text-xl leading-relaxed">
                 Your customized pathway to master <span className="text-gray-900 font-bold">{jobData?.role || 'Analyst'}</span> in {jobData?.duration || '3 Days'}.
              </p>
           </div>
           
           <button 
             onClick={handleStart}
             className="relative overflow-hidden group bg-[#111827] text-white font-[800] text-base px-8 py-4 md:py-5 rounded-[1.25rem] flex items-center justify-center gap-3 transition-all shadow-xl hover:shadow-[0_20px_40px_rgba(17,24,39,0.25)] hover:-translate-y-1 border border-transparent cursor-pointer flex-shrink-0 w-full md:w-auto z-10"
           >
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[150%] group-hover:animate-[shine_1.5s_ease-out]"></div>
              
              Start Preparation
              <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                 <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m-7-7H3" /></svg>
              </span>
           </button>
        </div>

        {/* Global Progress Card - Glassmorphism style */}
        <div className="w-full bg-white/80 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2rem] border border-gray-100 p-6 md:p-8 flex items-center gap-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-16 md:mb-20">
           {/* Circular Progress Indicator (0%) */}
           <div className="w-[70px] h-[70px] md:w-[80px] md:h-[80px] rounded-full bg-white border border-gray-100 flex items-center justify-center relative shrink-0 shadow-inner">
              <svg className="w-[85%] h-[85%] -rotate-90 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" viewBox="0 0 36 36">
                 <path
                   className="text-gray-100"
                   d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                   fill="none"
                   stroke="currentColor"
                   strokeWidth="3.5"
                 />
                 <path
                   className="text-[#EBFF00]"
                   strokeDasharray="0, 100" // Change this based on actual progress
                   d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                   fill="none"
                   stroke="currentColor"
                   strokeWidth="3.5"
                   strokeLinecap="round"
                 />
              </svg>
              <span className="font-extrabold text-[#111827] text-lg md:text-xl z-10 relative">0%</span>
           </div>

           <div className="flex-1 max-w-[500px]">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-3 gap-1">
                 <span className="font-[800] text-[#111827] text-lg">Overall Progress</span>
                 <span className="text-gray-400 font-bold text-sm bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100 w-max">
                   0 <span className="font-medium">of</span> {totalItems} <span className="font-medium">items</span>
                 </span>
              </div>
              <div className="w-full h-3 bg-gray-100/80 rounded-full overflow-hidden border border-gray-200/50 shadow-inner">
                 <div className="h-full bg-gradient-to-r from-[#111827] to-gray-700 rounded-full w-0 transition-all duration-700 ease-out relative">
                    <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-white/20"></div>
                 </div>
              </div>
           </div>
        </div>

        {/* Linear Timeline & Module Cards */}
        <div className="relative">
           {/* Vertical Timeline Line */}
           <div className="absolute left-[15px] md:left-[31px] top-8 bottom-0 w-0.5 bg-gradient-to-b from-gray-200 via-gray-200 to-transparent"></div>

           <div className="space-y-8 md:space-y-12 mt-6">
              {planData?.map((module, mIdx) => {
                 const isFirst = mIdx === 0;
                 const isExpanded = expandedModules[mIdx] !== false; // Default expanded

                 const topicsCount = module.topics?.length || 0;
                 const hasQuiz = Array.isArray(module.quiz) && module.quiz.length > 0;
                 const moduleTotalItems = topicsCount + (hasQuiz ? 1 : 0);

                 return (
                    <div key={mIdx} className="relative pl-[44px] md:pl-[80px]">
                       
                       {/* Timeline Marker */}
                       <div className={`absolute left-0 md:left-[16px] top-6 w-8 h-8 rounded-full border-[6px] border-[#fafafa] box-content bg-white z-10 flex items-center justify-center transition-all duration-300 ${isFirst ? 'shadow-[0_0_0_2px_#EBFF00]' : 'shadow-[0_0_0_1px_#e5e7eb]'} `}>
                          <div className={`w-3 h-3 rounded-full ${isFirst ? 'bg-[#111827]' : 'bg-gray-200'}`}></div>
                       </div>
                       
                       {/* Module Card */}
                       <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] group/card">
                          
                          {/* Module Header (Clickable for mobile Accordion) */}
                          <div 
                             onClick={() => toggleModule(mIdx)}
                             className="p-6 md:p-8 flex flex-col md:flex-row md:items-start justify-between gap-4 cursor-pointer relative"
                          >
                             {/* Subtle hover gradient */}
                             <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-gray-50 to-white opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
                             
                             <div className="pl-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <div className={`text-[10px] md:text-xs font-[900] uppercase tracking-[0.15em] px-2 py-1 rounded ${isFirst ? 'bg-[#EBFF00]/20 text-yellow-800' : 'bg-gray-100 text-gray-500'}`}>
                                     Day {module.day}
                                  </div>
                                </div>
                                <h2 className="text-xl md:text-3xl font-[900] text-[#111827] leading-tight max-w-[500px]">
                                   {module.title}
                                </h2>
                             </div>
                             
                             <div className="flex items-center gap-4 self-start">
                                <div className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 flex flex-col items-center min-w-[60px]">
                                   <span className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">Items</span>
                                   <span className="text-[14px] font-[800] text-gray-700 leading-none">0/{moduleTotalItems}</span>
                                </div>
                                {/* Accordion toggle icon */}
                                <div className={`w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 bg-gray-50/50 transition-transform duration-300 md:hidden ${isExpanded ? 'rotate-180' : 'rotate-0'}`}>
                                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                                </div>
                             </div>
                          </div>

                          {/* Syllabus List Container (Collapsible) */}
                          <div className={`transition-all duration-300 ease-in-out border-t border-gray-50 ${isExpanded ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                             <div className="p-4 md:p-8 md:pt-6 bg-gray-50/30">
                                
                                <div className="flex flex-col gap-2 md:gap-3">
                                   {module.topics?.map((topic, tIdx) => (
                                      <div 
                                        key={tIdx} 
                                        onClick={handleStart}
                                        className="flex items-center gap-4 p-4 md:p-5 bg-white border border-gray-100 rounded-xl hover:border-gray-200 hover:shadow-sm cursor-pointer group transition-all duration-200 hover:-translate-y-0.5"
                                      >
                                         <div className="w-[32px] h-[32px] rounded-full bg-[#fafafa] border border-gray-100 flex items-center justify-center shrink-0 group-hover:bg-gray-100 transition-colors">
                                            <span className="text-xs font-bold text-gray-400 group-hover:text-gray-600">{tIdx + 1}</span>
                                         </div>
                                         <div className="flex-1 font-[700] text-gray-700 text-[15px] md:text-[17px] group-hover:text-[#111827] transition-colors pr-2">
                                            {topic.name}
                                         </div>
                                         
                                         {/* Action icon */}
                                         <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-[#111827] group-hover:text-white transition-all opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 shrink-0 hidden md:flex">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                                         </div>
                                         {/* Mobile visible icon */}
                                         <svg className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors shrink-0 md:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>

                                      </div>
                                   ))}

                                   {/* Quiz Item (if exists) */}
                                   {hasQuiz && (
                                     <div 
                                      onClick={handleStart}
                                      className="flex items-center gap-4 p-4 md:p-5 bg-[#111827] border border-[#111827] rounded-xl hover:bg-gray-900 cursor-pointer group transition-all duration-200 hover:-translate-y-0.5 mt-2"
                                     >
                                       <div className="w-[32px] h-[32px] rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                          <svg className="w-4 h-4 text-[#EBFF00]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                       </div>
                                       <div className="flex-1 font-[700] text-white text-[15px] md:text-[17px] pr-2">
                                          Module {module.day} Quiz
                                       </div>
                                       <div className="text-xs font-bold text-gray-400 bg-white/5 px-2 py-1 rounded">
                                          {module.quiz.length} Questions
                                       </div>
                                     </div>
                                   )}
                                </div>
                             </div>
                          </div>
                          
                       </div>
                    </div>
                 );
              })}

           </div>
        </div>

      </div>
    </div>
  );
};

export default PlanDetails;
