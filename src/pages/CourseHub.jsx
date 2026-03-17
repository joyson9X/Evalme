import React from 'react';

const CourseHub = ({ navigateTo }) => {
  return (
    <div className="w-full relative bg-[#F9FAFB] min-h-[100dvh] pt-12 pb-24 px-4 font-sans overflow-hidden">
      
      {/* Background blobs */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-400 opacity-10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-4xl mx-auto relative z-10 flex flex-col items-center">
        
        {/* Navigation */}
        <div className="w-full mb-12 flex justify-start">
          <button
            onClick={() => navigateTo('HOME')}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold transition-all bg-white px-5 py-2.5 rounded-full text-sm border border-gray-200 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Back to Home
          </button>
        </div>

        {/* Header Section */}
        <div className="text-center mb-16 max-w-2xl">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight text-gray-900 leading-tight">
             Coding Academy
          </h1>
          <p className="text-gray-500 text-lg sm:text-xl">
             Master essential engineering skills through interactive, hands-on courses.
          </p>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          
          {/* SQL Course Tile */}
          <button
            onClick={() => navigateTo('COURSE_OVERVIEW')}
            className="group relative text-left bg-white rounded-3xl p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 transition-all duration-300 cursor-pointer hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:-translate-y-2 hover:border-blue-200 overflow-hidden flex flex-col items-start h-full"
          >
            {/* Subtle highlight */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform duration-500"></div>

            <div className="w-16 h-16 shrink-0 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center text-blue-500 shadow-sm mb-6">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path></svg>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">SQL Mastery</h2>
            <p className="text-gray-500 text-[15px] leading-relaxed mb-8 flex-1">
              From absolute basics to advanced window functions. Learn to query like a data engineer.
            </p>

            <span className="inline-flex items-center gap-2 text-blue-600 font-bold text-[15px] group-hover:gap-3 transition-all mt-auto bg-blue-50 px-4 py-2 rounded-xl">
              Start Course
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </span>
          </button>

          {/* Coming Soon Tile */}
          <div className="relative text-left bg-gray-50 rounded-3xl p-8 border border-gray-200 overflow-hidden flex flex-col items-start h-full opacity-70">
            <div className="w-16 h-16 shrink-0 bg-gray-200 border border-gray-300 rounded-2xl flex items-center justify-center text-gray-400 mb-6">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">React Fundamentals</h2>
            <p className="text-gray-500 text-[15px] leading-relaxed mb-8 flex-1">
              Master modern React from components to hooks. Build an interactive web app from scratch.
            </p>

            <span className="inline-flex items-center gap-2 text-gray-500 font-bold text-[15px] mt-auto px-4 py-2 border border-gray-300 rounded-xl bg-white">
               Coming Soon
               <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </span>
          </div>

        </div>
      </div>
    </div>
  )
};

export default CourseHub;
