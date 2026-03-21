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
    <div className="w-full min-h-[100dvh] flex flex-col justify-center items-center bg-white relative overflow-hidden font-sans selection:bg-black selection:text-white">
      
      {/* Background Elements - Minimalist Grid */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-white via-transparent to-white pointer-events-none"></div>

      <div className="w-full max-w-[400px] px-6 z-10 relative">
        {/* Branding Container */}
        <div className="flex flex-col items-center mb-8 text-center mt-8">
           <img src="/logo.svg" alt="Evalme Logo" className="h-[36px] object-contain mb-8 grayscale opacity-90" />
           <h1 className="text-3xl font-black text-black tracking-tight mb-2.5">
            Log in
           </h1>
           <p className="text-gray-500 text-sm font-semibold">
             Enter your details to access your account.
           </p>
        </div>

        {/* Card Container */}
        <div className="bg-white border border-gray-200 shadow-[0_20px_60px_rgba(0,0,0,0.03)] rounded-3xl p-8 transition-all hover:shadow-[0_25px_60px_rgba(0,0,0,0.05)]">
          
          <button
            onClick={handleGoogleSignIn}
            className="w-full group relative flex justify-center items-center gap-3 px-6 py-3.5 bg-white border border-gray-200 rounded-xl cursor-pointer transition-all hover:bg-gray-50 hover:border-gray-300 active:scale-[0.98] overflow-hidden"
          >
            <svg className="w-5 h-5 relative z-10 grayscale group-hover:grayscale-0 transition-all duration-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="relative z-10 text-black font-bold text-sm tracking-wide">Continue with Google</span>
          </button>

          <div className="relative my-7 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <span className="relative z-10 bg-white px-4 text-[10px] uppercase tracking-[0.2em] text-gray-400 font-extrabold">
              Or email
            </span>
          </div>

          <form className="space-y-5" onSubmit={handleEmailLogin}>
            <div className="group/input flex flex-col relative">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2.5 ml-1 transition-colors group-focus-within/input:text-black">
                Email Address
              </label>
              <input 
                type="email" 
                placeholder="you@company.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full px-5 py-4 rounded-xl bg-[#FAFAFA] border border-gray-200 text-black font-semibold placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-0 focus:border-black transition-all disabled:opacity-50"
                required
              />
            </div>
            
             <button 
                type="submit"
                disabled={loading || !email}
                className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-900 focus:ring-4 focus:ring-gray-200 disabled:cursor-not-allowed disabled:opacity-70 transition-all flex items-center justify-center gap-2 group"
              >
                {loading ? (
                   <>
                      <div className="w-5 h-5 border-2 border-transparent border-t-white border-r-white rounded-full animate-spin"></div>
                      <span className="tracking-wide text-sm">Sending Link...</span>
                   </>
                ) : (
                   <span className="tracking-wide text-sm flex items-center gap-2">
                     Sign In via Link 
                     <svg className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                   </span>
                )}
             </button>

             {message && (
                <div className={`text-center text-xs font-bold mt-2 px-2 py-3 rounded-lg border ${message.type === 'error' ? 'bg-red-50 border-red-200 text-red-600' : 'bg-gray-50 border-black text-black'}`}>
                   {message.text}
                </div>
             )}
          </form>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center pb-8 flex flex-col items-center justify-center gap-3 text-xs font-semibold text-gray-500">
           <div className="flex gap-4">
             <a href="#" className="hover:text-black transition-colors underline decoration-gray-300 underline-offset-4">Privacy</a>
             <span className="text-gray-300">•</span>
             <a href="#" className="hover:text-black transition-colors underline decoration-gray-300 underline-offset-4">Terms</a>
           </div>
           <p className="text-gray-400">&copy; 2026 Evalme Inc.</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
