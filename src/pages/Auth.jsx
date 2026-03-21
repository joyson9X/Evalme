import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const Auth = ({ handleGoogleSignIn }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setMessage(null);
    
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin
      }
    });
    
    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: 'Check your email for the login link!' });
    }
    setLoading(false);
  };

  return (
    <div className="w-full min-h-[100dvh] flex flex-col lg:flex-row bg-white font-sans selection:bg-black selection:text-white">
      
      {/* ─── LEFT PANE: BRANDING (BLACK THEME) ─── */}
      <div className="hidden lg:flex w-1/2 bg-[#050505] text-white p-12 flex-col justify-between relative overflow-hidden border-r border-gray-900">
        {/* Background Mesh */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)', backgroundSize: '64px 64px' }}></div>
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505] pointer-events-none"></div>

        {/* Top: Logo */}
        <div className="relative z-10 flex items-center gap-4">
           {/* Pure white silhouette logo (using brightness-0 invert filter) */}
           <img src="/logo.svg" alt="Evalme" className="h-[28px] object-contain brightness-0 invert" />
           <span className="text-xl font-bold tracking-[0.2em] uppercase mt-0.5">Evalme</span>
        </div>

        {/* Center: Mission */}
        <div className="relative z-10 max-w-lg">
           <h1 className="text-5xl xl:text-7xl font-black mb-8 leading-[1.05] tracking-tight">
             Master your <br />
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-600">dream role.</span>
           </h1>
           <p className="text-gray-400 text-lg xl:text-xl font-medium leading-relaxed max-w-md border-l-2 border-gray-800 pl-6">
             Your AI-powered career accelerator. Generate targeted, day-by-day study blueprints to land the exact tech jobs you want.
           </p>
        </div>

        {/* Bottom: Footer */}
        <div className="relative z-10 flex items-center justify-between">
           <div className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">&copy; 2026 Evalme Inc.</div>
           <div className="flex gap-4">
             <a href="#" className="w-8 h-8 rounded-full border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-500 transition-colors">
               <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
             </a>
           </div>
        </div>
      </div>

      {/* ─── RIGHT PANE: LOGIN FORM (WHITE THEME) ─── */}
      <div className="w-full lg:w-1/2 min-h-[100dvh] flex flex-col justify-center items-center p-6 relative">
        <div className="w-full max-w-[420px] z-10">
          
          {/* Mobile Branding (Only visible on small screens) */}
          <div className="flex lg:hidden flex-col items-center mb-8 text-center mt-4">
             <img src="/logo.svg" alt="Evalme Logo" className="h-[32px] object-contain mb-6 grayscale opacity-90" />
             <h1 className="text-3xl font-black text-black tracking-tight mb-2">Log in</h1>
             <p className="text-gray-500 text-sm font-semibold">Enter your details to access your account.</p>
          </div>

          {/* Desktop Heading */}
          <div className="hidden lg:block mb-10">
             <h2 className="text-4xl font-black text-black tracking-tight mb-3">Welcome back</h2>
             <p className="text-gray-500 text-base font-semibold">Enter your details to get started.</p>
          </div>

          {/* Login Card/Container */}
          <div className="w-full">
            <button
              onClick={handleGoogleSignIn}
              className="w-full group relative flex justify-center items-center gap-3 px-6 py-4 bg-white border border-gray-200 shadow-sm rounded-xl cursor-pointer transition-all hover:bg-gray-50 hover:border-gray-300 hover:shadow-md active:scale-[0.98]"
            >
              <svg className="w-5 h-5 relative z-10 grayscale group-hover:grayscale-0 transition-all duration-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="relative z-10 text-black font-bold text-sm tracking-wide">Continue with Google</span>
            </button>

            <div className="relative my-8 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <span className="relative z-10 bg-white px-4 text-[11px] uppercase tracking-[0.2em] text-gray-400 font-extrabold">
                Or email
              </span>
            </div>

            <form className="space-y-6" onSubmit={handleEmailLogin}>
              <div className="group/input flex flex-col relative w-full">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2.5 ml-1 transition-colors group-focus-within/input:text-black">
                  Email Address
                </label>
                <input 
                  type="email" 
                  placeholder="you@company.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full px-5 py-4 rounded-xl bg-[#F8FAFC] border border-gray-200 shadow-sm text-black font-semibold placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-0 focus:border-black transition-all disabled:opacity-50"
                  required
                />
              </div>
              
               <button 
                  type="submit"
                  disabled={loading || !email}
                  className="w-full bg-[#050505] text-white font-bold py-4.5 rounded-xl shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:bg-gray-900 focus:ring-4 focus:ring-gray-200 disabled:cursor-not-allowed disabled:opacity-70 transition-all flex items-center justify-center gap-2 group overflow-hidden relative"
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  {loading ? (
                     <>
                        <div className="w-5 h-5 border-[2.5px] border-transparent border-t-white border-r-white rounded-full animate-spin"></div>
                        <span className="tracking-wide text-[15px] relative z-10">Sending Link...</span>
                     </>
                  ) : (
                     <span className="tracking-wide text-[15px] flex items-center gap-2 relative z-10">
                       Sign In via Link 
                       <svg className="w-4.5 h-4.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                     </span>
                  )}
               </button>

               {message && (
                  <div className={`text-center text-sm font-bold mt-2 px-4 py-4 rounded-xl border ${message.type === 'error' ? 'bg-red-50 border-red-200 text-red-600' : 'bg-gray-50 border-black text-black'}`}>
                     {message.text}
                  </div>
               )}
            </form>
          </div>

          {/* Footer Links */}
          <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col items-center justify-center gap-4 text-xs font-semibold text-gray-500">
             <div className="flex gap-6">
               <a href="#" className="hover:text-black transition-colors underline decoration-gray-300 underline-offset-4">Privacy Policy</a>
               <a href="#" className="hover:text-black transition-colors underline decoration-gray-300 underline-offset-4">Terms of Service</a>
             </div>
             <p className="text-gray-400 font-medium lg:hidden">&copy; 2026 Evalme Inc.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
