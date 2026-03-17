import React from 'react';

const Blogs = ({ navigateTo }) => {
  const blogs = [
    {
      id: 'product-hunt-launch',
      category: 'Announcements',
      title: "Evalme is Live on Product Hunt! 🚀",
      date: 'March 16, 2026',
      readTime: '5 min read',
      content: (
        <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed text-[1.05rem]">
          <p className="mb-8 text-xl text-gray-900 font-medium leading-relaxed">
            Today marks a massive milestone for us. Evalme has officially launched on Product Hunt, and we couldn't be more excited to share our vision for the future of career preparation with the world.
          </p>

          <h2 className="text-3xl font-black text-gray-900 mt-16 mb-8 tracking-tight flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 border border-indigo-100">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             </div>
             What is Evalme?
          </h2>
          <p className="mb-10">
            Evalme is more than just an interview prep tool. It's a personalized career accelerator. We noticed that candidates often feel overwhelmed by the sheer volume of "study materials" available online. Our solution? Use AI to filter out the noise and focus on exactly what you need to know for your next role.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-lg transition-all">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                 <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                 Core Features
              </h3>
              <ul className="space-y-4 text-sm font-medium text-gray-700">
                <li className="flex items-center gap-3"><div className="w-2 h-2 bg-[#EBFF00] rounded-full shadow-[0_0_0_2px_rgba(235,255,0,0.4)]"></div> AI-Driven JD Analysis</li>
                <li className="flex items-center gap-3"><div className="w-2 h-2 bg-[#EBFF00] rounded-full shadow-[0_0_0_2px_rgba(235,255,0,0.4)]"></div> Dynamic Study Plans</li>
                <li className="flex items-center gap-3"><div className="w-2 h-2 bg-[#EBFF00] rounded-full shadow-[0_0_0_2px_rgba(235,255,0,0.4)]"></div> Interactive Code Challenges</li>
                <li className="flex items-center gap-3"><div className="w-2 h-2 bg-[#EBFF00] rounded-full shadow-[0_0_0_2px_rgba(235,255,0,0.4)]"></div> Mock Interview Simulations</li>
              </ul>
            </div>
            <div className="bg-[#111827] p-8 rounded-3xl text-white shadow-xl relative overflow-hidden group hover:-translate-y-1 transition-transform">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-amber-400/20 blur-[30px] rounded-full group-hover:scale-150 transition-transform duration-700"></div>
              <h3 className="text-xl font-bold mb-4 relative z-10 flex items-center gap-2">
                 <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                 Launch Day Offer
              </h3>
              <p className="text-gray-400 text-sm mb-8 leading-relaxed relative z-10">Support our journey on Product Hunt today and unlock exclusive launch-day bonuses for your career growth.</p>
              <a href="https://www.producthunt.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 w-full bg-white text-[#111827] font-black px-6 py-3.5 rounded-xl transition-all cursor-pointer border-none shadow-md hover:shadow-lg active:scale-[0.98] relative z-10">
                Support on Product Hunt
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </a>
            </div>
          </div>

          <h2 className="text-3xl font-black text-gray-900 mt-16 mb-8 tracking-tight flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-500 border border-green-100">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
             </div>
             Our Growth Plans
          </h2>
          <p className="mb-10">
            Launching on Product Hunt is just Phase 1. Over the next 6 months, we are expanding Evalme into a full-scale talent ecosystem.
          </p>

          <div className="space-y-6 mb-16 relative">
            {/* Connecting line */}
            <div className="absolute left-[31px] top-4 bottom-4 w-0.5 bg-gray-100 z-0"></div>

            {[
              { title: "Community Interview Hubs", desc: "Connect with peers preparing for the same roles at companies like TCS, Google, or Zomato." },
              { title: "Live AI Coaching", desc: "Real-time voice-based mock interviews that simulate the stress and flow of a real technical round." },
              { title: "Global Expansion", desc: "Localized prep material for over 50+ countries, starting with a deep-focus on the Asian job market." }
            ].map((milestone, idx) => (
              <div key={idx} className="flex gap-6 items-start relative z-10 group">
                <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shrink-0 font-black text-xl text-gray-300 border-2 border-gray-100 shadow-sm transition-all group-hover:border-amber-400 group-hover:text-amber-500 group-hover:scale-110">
                   0{idx + 1}
                </div>
                <div className="pt-2">
                  <h4 className="text-lg font-bold text-gray-900 mb-2">{milestone.title}</h4>
                  <p className="text-[15px] text-gray-500 m-0 leading-relaxed">{milestone.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 text-center">
             <p className="text-gray-700 font-medium italic mb-0">
               "We're building Evalme for you—the freshers landing their first big break, and the professionals breaking through to senior leadership. Join us on this journey."
             </p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="w-full relative bg-white pb-24 font-sans min-h-[100dvh]">
      
      {/* Abstract Background Top */}
      <div className="absolute top-0 left-0 w-full h-[50dvh] bg-gradient-to-b from-gray-50 to-white -z-10 pointer-events-none border-b border-gray-100/50"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#ebff00]/10 to-transparent -z-10 blur-[80px] pointer-events-none rounded-full translate-x-1/3 -translate-y-1/3"></div>

      <nav className="w-full max-w-5xl mx-auto px-6 py-8 flex items-center justify-between relative z-20">
        <button
          onClick={() => navigateTo('HOME')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold transition-all bg-white px-5 py-2.5 rounded-full text-sm border border-gray-200 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5"
        >
          <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Home
        </button>
        <img src="/logo.svg" alt="Evalme" className="h-[28px] object-contain drop-shadow-sm" />
        <div className="w-32 hidden sm:block"></div>
      </nav>

      <div className="w-full max-w-3xl mx-auto px-6 relative z-10 pt-8">
        {blogs.map(blog => (
          <article key={blog.id} className="w-full animate-fade-in-up">
            
            <header className="mb-14 text-center">
              <div className="inline-flex justify-center items-center gap-3 mb-6">
                <span className="bg-amber-100/50 text-amber-700 border border-amber-200/50 font-black text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full">
                  {blog.category}
                </span>
                <span className="text-gray-300">&bull;</span>
                <span className="text-gray-500 text-sm font-semibold">{blog.readTime}</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-[3.5rem] font-black text-[#111827] tracking-tight leading-[1.1] mb-6">
                 {blog.title}
              </h1>
              <div className="flex items-center justify-center gap-4 text-gray-500 text-[15px]">
                <div className="flex items-center gap-2 font-medium">
                   <div className="w-8 h-8 rounded-full bg-gray-200/80 p-0.5 border border-white shadow-sm overflow-hidden">
                      <img src="/logo.svg" className="w-full h-full object-contain mix-blend-multiply" alt="Author" style={{ padding: '4px' }}/>
                   </div>
                   Evalme Team
                </div>
                <span className="text-gray-300">&bull;</span>
                <time>{blog.date}</time>
              </div>
            </header>
            
            <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-12"></div>

            <div className="w-full selection:bg-[#EBFF00]/30 selection:text-[#111827]">
              {blog.content}
            </div>

            {/* Author / Footer info */}
            <div className="mt-20 pt-10 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
               <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 p-2 shadow-inner border border-gray-200/50">
                     <img src="/logo.svg" className="w-full h-full object-contain grayscale opacity-50" alt="Evalme" />
                  </div>
                  <div>
                     <div className="font-bold text-gray-900 mb-0.5">Written by Evalme</div>
                     <p className="text-sm text-gray-500">Empowering the next generation of builders.</p>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <button className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#1DA1F2] hover:border-[#1DA1F2] hover:bg-blue-50 transition-all cursor-pointer">
                     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                  </button>
                  <button className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#0A66C2] hover:border-[#0A66C2] hover:bg-blue-50 transition-all cursor-pointer">
                     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  </button>
               </div>
            </div>

          </article>
        ))}
      </div>
    </div>
  );
};

export default Blogs;
