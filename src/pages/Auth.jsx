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
    <div className="w-full min-h-[100dvh] flex flex-col justify-center items-center bg-[#F3F4F6] relative overflow-hidden font-sans">
      
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#EBFF00] opacity-20 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400 opacity-10 blur-[120px] rounded-full"></div>
      </div>

      <div className="w-full max-w-[420px] px-6 z-10 relative">
        {/* Branding Container */}
        <div className="flex flex-col items-center mb-8 text-center mt-8">
           <img src="/logo.svg" alt="Evalme Logo" className="h-[42px] object-contain mb-6 drop-shadow-md" />
           <h1 className="text-3xl font-extrabold text-[#111827] tracking-tight mb-2">
            Welcome back
           </h1>
           <p className="text-[#4B5563] text-base font-medium">
             Log in to your Evalme account to continue.
           </p>
        </div>

        {/* Card Container */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-3xl p-8 sm:p-10 transition-all hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)]">
          
          <button
            onClick={handleGoogleSignIn}
            className="w-full group relative flex justify-center items-center gap-3 px-6 py-3.5 bg-white border border-gray-200 rounded-2xl cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-gray-300 active:scale-[0.98] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <svg className="w-5 h-5 relative z-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="relative z-10 text-[#1F2937] font-semibold text-base">Continue with Google</span>
          </button>

          <div className="relative my-6 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <span className="relative z-10 bg-white px-3 text-xs uppercase tracking-widest text-gray-400 font-bold">
              Or continue with email
            </span>
          </div>

          <form className="space-y-4" onSubmit={handleEmailLogin}>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
              <input 
                type="email" 
                placeholder="you@company.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EBFF00] focus:border-transparent transition-all disabled:opacity-50"
                required
              />
            </div>
            
             <button 
                type="submit"
                disabled={loading || !email}
                className="w-full bg-[#111827] text-white font-bold py-3.5 rounded-2xl hover:bg-black disabled:cursor-not-allowed disabled:opacity-70 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                   <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Sending Link...
                   </>
                ) : 'Sign In with Magic Link'}
             </button>

             {message && (
                <div className={`text-center text-sm font-bold mt-4 ${message.type === 'error' ? 'text-red-500' : 'text-emerald-600'}`}>
                   {message.text}
                </div>
             )}
          </form>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center pb-8 flex justify-center gap-4 text-sm font-medium text-gray-500">
           <a href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
           <span className="text-gray-300">•</span>
           <a href="#" className="hover:text-gray-900 transition-colors">Terms of Service</a>
        </div>
      </div>
    </div>
  );
};

export default Auth;
