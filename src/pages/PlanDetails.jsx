import React, { useMemo } from 'react';

const PlanDetails = ({ jobData, planData, navigateTo }) => {
  
  // Calculate total syllabus items across all modules
  const totalItems = useMemo(() => {
    return planData?.reduce((acc, module) => acc + (module.topics?.length || 0), 0) || 0;
  }, [planData]);

  // Handle course navigation
  const handleStart = () => {
    navigateTo('COURSE_PLAYER');
  };

  return (
    <div className="w-full min-h-[100dvh] bg-[#F9FAFB] relative font-sans text-gray-900 pb-24 selection:bg-[#EBFF00]/30 selection:text-[#111827]">
      
      {/* Top Background Mask */}
      <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-white to-[#F9FAFB] pointer-events-none"></div>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-6 pt-10 relative z-10 w-full">
        
        {/* Top Navbar / Back Link */}
        <button
          onClick={() => navigateTo('GENERATOR')}
          className="flex items-center gap-2 text-gray-500 hover:text-[#111827] font-bold text-[11px] uppercase tracking-widest transition-colors bg-transparent border-none cursor-pointer mb-10"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Generator
        </button>

        {/* Header Hero Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10">
           <div>
              <div className="bg-[#EBFF00] text-[#111827] text-[11px] font-[900] uppercase tracking-widest px-3 py-1.5 rounded inline-block mb-4">
                 {jobData?.duration || '3 DAYS'} INTENSIVE
              </div>
              <h1 className="text-4xl md:text-[56px] font-[900] text-[#111827] tracking-tight mb-3 leading-none">
                 {jobData?.role || 'Analyst'}
              </h1>
              <p className="text-gray-500 font-medium text-[17px] md:text-lg">
                 Your customized pathway to master {jobData?.role || 'Analyst'} in {jobData?.duration || '3 Days'}.
              </p>
           </div>
           
           <button 
             onClick={handleStart}
             className="bg-[#111827] text-white font-[800] text-[15px] px-8 py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-800 transition-colors shadow-[0_8px_20px_rgba(17,24,39,0.15)] hover:shadow-[0_12px_24px_rgba(17,24,39,0.2)] hover:-translate-y-0.5 cursor-pointer border-none flex-shrink-0"
           >
              Start Preparation
              <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m-7-7H3" /></svg>
           </button>
        </div>

        {/* Global Progress Card */}
        <div className="w-full bg-white rounded-2xl border border-gray-100 p-6 flex items-center gap-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] mb-14">
           {/* Circular Progress Indicator (0%) */}
           <div className="w-[60px] h-[60px] rounded-full bg-gray-50 flex items-center justify-center relative shrink-0">
              <svg className="w-full h-full -rotate-90 absolute top-0 left-0" viewBox="0 0 36 36">
                 <path
                   className="text-gray-200"
                   d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                   fill="none"
                   stroke="currentColor"
                   strokeWidth="3.5"
                 />
                 <path
                   className="text-[#111827]"
                   strokeDasharray="0, 100"
                   d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                   fill="none"
                   stroke="currentColor"
                   strokeWidth="3.5"
                   strokeLinecap="round"
                 />
              </svg>
              <span className="font-extrabold text-[#111827] text-[15px] z-10">0%</span>
           </div>

           <div className="flex-1">
              <div className="flex justify-between items-end mb-3">
                 <span className="font-[800] text-[#111827] text-[15px]">Overall Progress</span>
                 <span className="text-gray-500 text-[12px] font-bold">0 / {totalItems} items</span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                 <div className="h-full bg-[#111827] rounded-full w-0 transition-all duration-500"></div>
              </div>
           </div>
        </div>

        {/* Divider */}
        <div className="h-[1px] w-[130vw] -ml-[15vw] bg-gray-200/60 mb-14 relative z-0"></div>

        {/* Linear Timeline & Module Cards */}
        <div className="relative">
           {/* Vertical Timeline Line */}
           <div className="absolute left-[11px] md:left-[27px] top-8 bottom-0 w-px bg-gray-300"></div>

           <div className="space-y-10 md:space-y-16 mt-6">
              {planData?.map((module, mIdx) => {
                 const isFirst = mIdx === 0;

                 return (
                    <div key={mIdx} className="relative pl-10 md:pl-20">
                       
                       {/* Timeline Marker (Yellow & Black dot for active, solid gray for pending) */}
                       <div className={`absolute left-0 md:left-[16px] top-6 w-6 h-6 rounded-full border-[5px] border-[#F9FAFB] box-content bg-white z-10 flex items-center justify-center shadow-sm ${isFirst ? 'border-[#EBFF00]' : 'border-gray-300'}`}>
                          <div className={`w-2.5 h-2.5 rounded-full ${isFirst ? 'bg-[#111827]' : 'bg-transparent'}`}></div>
                       </div>
                       
                       {/* Module Card */}
                       <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] p-6 md:p-10">
                          
                          {/* Module Header */}
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
                             <div>
                                <div className="text-gray-400 text-[11px] font-[900] uppercase tracking-[0.15em] mb-3">Module {module.day}</div>
                                <h2 className="text-[22px] md:text-3xl font-[900] text-[#111827] leading-tight max-w-[500px]">{module.title}</h2>
                             </div>
                             
                             <div className="border border-gray-100 rounded-full px-4 py-1.5 text-[12px] font-[800] text-gray-500 shrink-0 self-start">
                                0 / {module.topics?.length || 0}
                             </div>
                          </div>

                          {/* Syllabus List Container */}
                          <div className="pt-2">
                             <div className="text-gray-400 text-[11px] font-[900] uppercase tracking-[0.15em] mb-4">Syllabus Items</div>
                             
                             <div className="flex flex-col">
                                {module.topics?.map((topic, tIdx) => (
                                   <div 
                                     key={tIdx} 
                                     onClick={handleStart}
                                     className="flex items-center gap-4 py-4 md:py-5 border-b border-gray-100 last:border-0 group cursor-pointer hover:bg-gray-50/80 transition-colors -mx-4 md:-mx-6 px-4 md:px-6 rounded-xl"
                                   >
                                      <div className="w-[28px] h-[28px] rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                         <div className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-gray-400 transition-colors"></div>
                                      </div>
                                      <div className="flex-1 font-[800] text-gray-800 text-[15px] md:text-[16px] group-hover:text-[#111827] transition-colors pr-4">
                                         {tIdx + 1}. {topic.name}
                                      </div>
                                      <svg className="w-[18px] h-[18px] text-gray-300 group-hover:text-gray-600 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                                   </div>
                                ))}
                             </div>
                          </div>
                          
                       </div>
                    </div>
                 );
              })}

              {/* End of Timeline marker dot */}
              <div className="absolute left-[11px] md:left-[27px] -bottom-[20px] w-0 pl-[0.5px]">
                 <div className="w-2 h-2 rounded-full bg-gray-300 -ml-1"></div>
              </div>

           </div>
        </div>

      </div>
    </div>
  );
};

export default PlanDetails;
