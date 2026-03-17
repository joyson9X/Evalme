import React from 'react';

const CoursePlayer = ({ navigateTo }) => {
  return (
    <div className="w-full h-[100dvh] relative bg-white font-sans overflow-hidden">
      
      {/* Top Nav (Fixed) */}
      <nav className="absolute top-0 left-0 w-full px-6 py-4 flex items-center justify-between z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <button
          onClick={() => navigateTo('CODING_COURSES')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold transition-all bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-xl text-sm border border-gray-200 cursor-pointer shadow-sm active:scale-95"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Leave Course
        </button>
        <div className="flex items-center gap-3">
           <img src="/logo.svg" alt="Evalme" className="h-6 sm:h-7 object-contain drop-shadow-sm" />
           <span className="text-gray-300">|</span>
           <span className="font-bold text-gray-800 text-sm hidden sm:block tracking-tight">SQL Basics</span>
        </div>
        <div className="w-[120px] hidden sm:block"></div> {/* Spacer */}
      </nav>

      {/* Main Course Player Area */}
      <div className="w-full h-full pt-[72px] flex bg-gray-50">
         
         {/* Embed Container */}
         <div className="flex-1 h-full relative">
            {/* Loading placeholder visible briefly before iframe loads */}
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 -z-10">
               <div className="flex flex-col items-center gap-4">
                  <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
                  <p className="text-gray-500 font-medium text-sm animate-pulse">Loading interactive environment...</p>
               </div>
            </div>
            
            <iframe 
               src="/sql_course.html?v=v3-latest" 
               className="w-full h-full border-none m-0 p-0 block bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.02)] relative z-10" 
               title="SQL Interactive Course"
               allow="clipboard-write"
            ></iframe>
         </div>

      </div>
    </div>
  )
};

export default CoursePlayer;
