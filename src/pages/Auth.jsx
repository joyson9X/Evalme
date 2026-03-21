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
    <div className="w-full min-h-[100dvh] flex flex-col justify-center items-center bg-black relative overflow-hidden font-sans selection:bg-white selection:text-black">
      
      {/* Absolute Minimalism - No Grid, No Blobs, Pure Black Background */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

      <div className="w-full max-w-[400px] px-6 z-10 relative flex flex-col items-center">
        
        {/* Floating Logo Above Card */}
        <div className="mb-10 flex flex-col items-center">
           <img src="/logo.svg" alt="Evalme Logo" className="h-[44px] object-contain mb-5 brightness-0 invert shadow-sm" />
           <p className="text-[#A1A1AA] text-sm font-semibold tracking-widest uppercase">Sign in to Evalme</p>
        </div>

        {/* The Monolithic Dark Card */}
        <div className="w-full bg-[#050505] border border-[#27272A] rounded-3xl p-8 sm:p-10 shadow-[0_30px_80px_rgba(255,255,255,0.02)] relative group/card">
          
          {/* Subtle responsive glow behind the card */}
          <div className="absolute -inset-0.5 bg-gradient-to-b from-white/10 to-transparent rounded-[1.6rem] opacity-0 group-hover/card:opacity-100 transition-opacity duration-1000 -z-10 blur-[3px]"></div>

          <button
            onClick={handleGoogleSignIn}
            className="w-full relative flex justify-center items-center gap-3 px-6 py-4 bg-white border-none rounded-xl cursor-pointer transition-all hover:bg-gray-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm"
          >
            <svg className="w-5 h-5 relative z-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#000"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#000"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#000"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#000"/>
            </svg>
            <span className="relative z-10 text-black font-black text-[15px] tracking-wide">Continue with Google</span>
          </button>

          <div className="relative my-8 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#27272A]"></div>
            </div>
            <span className="relative z-10 bg-[#050505] px-4 text-[10px] uppercase tracking-[0.2em] text-[#52525B] font-extrabold">
              Or strictly email
            </span>
          </div>

          <form className="space-y-6" onSubmit={handleEmailLogin}>
            <div className="group/input flex flex-col relative w-full">
              <input 
                type="email" 
                placeholder="developer@evalme.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full px-5 py-4 rounded-xl bg-black border border-[#27272A] text-white font-semibold placeholder-[#52525B] focus:bg-black focus:outline-none focus:ring-0 focus:border-white transition-all disabled:opacity-50"
                required
              />
            </div>
            
             <button 
                type="submit"
                disabled={loading || !email}
                className="w-full bg-[#18181B] border border-[#27272A] text-white font-bold py-4.5 rounded-xl hover:bg-white hover:text-black hover:border-white focus:ring-4 focus:ring-white/10 disabled:cursor-not-allowed disabled:opacity-50 transition-all flex items-center justify-center gap-2 group"
              >
                {loading ? (
                   <>
                      <div className="w-5 h-5 border-[2.5px] border-transparent border-t-current border-r-current rounded-full animate-spin"></div>
                      <span className="tracking-wide text-[15px] font-black">Connecting...</span>
                   </>
                ) : (
                   <span className="tracking-wide text-[15px] font-black flex items-center gap-2">
                     Get Magic Link 
                     <svg className="w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                   </span>
                )}
             </button>

             {message && (
                <div className={`text-center text-sm font-bold mt-2 px-4 py-4 rounded-xl border ${message.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-500' : 'bg-white/5 border-[#27272A] text-white'}`}>
                   {message.text}
                </div>
             )}
          </form>
        </div>

        {/* Footer Links */}
        <div className="mt-10 text-center flex flex-col items-center justify-center gap-3 text-xs font-semibold text-[#52525B]">
           <div className="flex gap-6 mb-1">
             <a href="#" className="hover:text-white transition-colors underline decoration-[#3F3F46] underline-offset-4">Privacy Policy</a>
             <a href="#" className="hover:text-white transition-colors underline decoration-[#3F3F46] underline-offset-4">Terms of Service</a>
           </div>
           <p className="tracking-wider">&copy; 2026 Evalme Inc.</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
