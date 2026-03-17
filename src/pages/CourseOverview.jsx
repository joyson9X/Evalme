import React from 'react';

const CourseOverview = ({ navigateTo }) => {
  return (
    <div className="w-full bg-[#FAFAFA] relative min-h-[100dvh] font-sans">
      
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-blue-100 to-transparent opacity-50 blur-[100px] rounded-full pointer-events-none transform translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="max-w-5xl mx-auto px-6 py-12 relative z-10">
        
        {/* Navigation */}
        <button
          onClick={() => navigateTo('CODING_COURSES')}
          className="flex items-center gap-2 text-gray-400 hover:text-gray-900 font-bold transition-all border-none bg-transparent cursor-pointer text-sm mb-12 group"
        >
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Academy
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-12 items-start">
          
          {/* Main Content Left */}
          <div className="flex flex-col">
            <div className="flex items-center gap-5 mb-8">
              <div className="w-16 h-16 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center text-blue-500 shadow-sm shrink-0">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path></svg>
              </div>
              <div>
                <h1 className="text-4xl sm:text-5xl font-black text-[#111827] mb-2 tracking-tight">SQL Basics</h1>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Foundation Series &bull; 8 Lessons</p>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 sm:p-10 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-gray-100 mb-10 overflow-hidden relative">
              {/* Highlight bar */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-400 to-indigo-500"></div>

              <h3 className="text-xl font-black text-[#111827] mb-4">Course Description</h3>
              <p className="text-gray-600 leading-relaxed text-[15px] mb-10 border-b border-gray-100 pb-8">
                Master the language of data. This course takes you from scratch to writing complex queries, joining tables, and understanding database relationships. Designed for developers and analysts who want to build real-world skills.
              </p>

              <h3 className="text-lg font-black text-[#111827] mb-6 flex items-center gap-3">
                <div className="w-2.5 h-6 bg-blue-400 rounded-sm"></div>
                What you'll learn
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-4">
                {[
                  "Database Fundamentals",
                  "SELECT & Filtering Data",
                  "Joins & Relationships",
                  "Aggregate Functions",
                  "Subqueries & Grouping",
                  "Live SQL Challenges"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-[15px] font-bold text-gray-600">
                    <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <h3 className="text-2xl font-black text-[#111827] px-2 flex items-center gap-2 tracking-tight">
                 Curriculum Overview
              </h3>
              
              <div className="space-y-4 relative border-l-2 border-gray-100 ml-4 pl-8 py-2">
                 
                 {/* Timeline items */}
                <div className="relative group">
                  <div className="absolute -left-[41px] top-4 w-5 h-5 bg-white border-[4px] border-blue-500 rounded-full shadow-[0_0_0_4px_rgba(255,255,255,1)]"></div>
                  <div className="bg-white border border-blue-100 p-6 rounded-3xl flex items-center justify-between group-hover:border-blue-300 transition-all shadow-sm group-hover:shadow-[0_4px_20px_rgb(59,130,246,0.1)]">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-blue-50/50 rounded-2xl flex items-center justify-center font-black text-blue-200 italic text-xl">01</div>
                      <div>
                        <h4 className="font-bold text-[#111827] text-[15px] mb-1">Introduction to Databases</h4>
                        <p className="text-[13px] text-gray-500 font-medium font-sans">Core Concepts & Syntax</p>
                      </div>
                    </div>
                    <div className="bg-blue-50 text-blue-600 border border-blue-200 text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider hidden sm:block">Start</div>
                  </div>
                </div>

                <div className="relative opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                  <div className="absolute -left-[41px] top-4 w-5 h-5 bg-white border-[4px] border-gray-300 rounded-full shadow-[0_0_0_4px_rgba(255,255,255,1)]"></div>
                  <div className="bg-white border border-gray-100 p-6 rounded-3xl flex flex-col sm:flex-row gap-4 sm:gap-0 items-start sm:items-center justify-between transition-all">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center font-black text-gray-300 italic text-xl border border-gray-100">02</div>
                      <div>
                        <h4 className="font-bold text-gray-800 text-[15px] mb-1">Filtering & Sorting</h4>
                        <p className="text-[13px] text-gray-500 font-medium flex items-center gap-1.5">
                           <svg className="w-3.5 h-3.5 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                           Locked until Lesson 1 complete
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative opacity-50 grayscale">
                  <div className="absolute -left-[41px] top-4 w-5 h-5 bg-white border-[4px] border-gray-200 rounded-full shadow-[0_0_0_4px_rgba(255,255,255,1)]"></div>
                  <div className="bg-gray-50/50 border border-dashed border-gray-200 p-6 rounded-3xl flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-gray-200 italic text-xl border border-gray-100">03</div>
                      <div>
                        <h4 className="font-bold text-gray-400 text-[15px] mb-1">6 more lessons</h4>
                        <p className="text-[13px] text-gray-400 font-medium">Continue progressing to unlock</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Sidebar Right */}
          <div className="sticky top-[100px] bg-[#111827] rounded-[2.5rem] p-8 sm:p-10 text-white shadow-2xl flex flex-col items-center text-center overflow-hidden border border-gray-800 w-full relative z-20">
            {/* Ambient Background Effect */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/20 rounded-full blur-[40px] -translate-y-16 translate-x-16 pointer-events-none"></div>
            
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-8 border border-white/10 backdrop-blur-md shadow-inner">
              <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                 <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <h3 className="text-2xl font-black mb-4 tracking-tight leading-tight">Ready to master SQL?</h3>
            <p className="text-gray-400 text-[15px] leading-relaxed mb-10 px-2 font-medium">Begin your journey with our interactive environment and real-time feedback loop.</p>

            <button
              onClick={() => navigateTo('SQL_COURSE')}
              className="w-full bg-blue-500 text-white font-black py-4 px-6 rounded-2xl hover:bg-blue-400 transition-all cursor-pointer border-none shadow-[0_8px_20px_rgba(59,130,246,0.3)] active:scale-[0.98] text-base tracking-wide flex justify-center items-center gap-2 group"
            >
              Start First Lesson
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </button>

            <div className="mt-10 flex flex-col gap-4 w-full bg-black/20 rounded-2xl p-5 border border-white/5">
              <div className="flex items-center justify-between text-xs font-bold text-gray-500 border-b border-white/5 pb-4 px-1 uppercase tracking-widest">
                <span>Difficulty</span>
                <span className="text-blue-400 flex items-center gap-1.5 opacity-90">Beginner</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-gray-500 border-b border-white/5 pb-4 px-1 uppercase tracking-widest">
                <span>Duration</span>
                <span className="text-white opacity-90">~2 Hours</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-gray-500 px-1 uppercase tracking-widest">
                <span>Certificate</span>
                <span className="text-green-400 flex items-center gap-1 opacity-90">
                   Included
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
};

export default CourseOverview;
