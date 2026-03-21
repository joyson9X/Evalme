import React, { useState } from 'react';
import { Mail, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function Auth({ handleGoogleSignIn }) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleMagicLinkSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    setErrorMessage(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin
      }
    });

    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error.message);
    } else {
      setIsSent(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-yellow-200 selection:text-yellow-900 relative overflow-hidden">
      <style>
        {`
          @keyframes morph {
            0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
            50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
          }
          @keyframes float-1 {
            0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); opacity: 0.5; }
            33% { transform: translate(8vw, -8vh) scale(1.2) rotate(120deg); opacity: 0.8; }
            66% { transform: translate(-4vw, 4vh) scale(0.8) rotate(240deg); opacity: 0.6; }
          }
          @keyframes float-2 {
            0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); opacity: 0.4; }
            33% { transform: translate(-8vw, 8vh) scale(1.3) rotate(-120deg); opacity: 0.7; }
            66% { transform: translate(4vw, -4vh) scale(0.9) rotate(-240deg); opacity: 0.5; }
          }
          @keyframes float-3 {
            0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); opacity: 0.6; }
            50% { transform: translate(6vw, 6vh) scale(1.1) rotate(180deg); opacity: 0.8; }
          }
          @keyframes electric-flash {
            0%, 95%, 100% { opacity: 0; }
            96% { opacity: 0.2; }
            97% { opacity: 0; }
            98% { opacity: 0.4; }
          }
          .animate-fluid-1 { animation: morph 8s ease-in-out infinite, float-1 15s ease-in-out infinite; }
          .animate-fluid-2 { animation: morph 10s ease-in-out infinite reverse, float-2 18s ease-in-out infinite; }
          .animate-fluid-3 { animation: morph 9s ease-in-out infinite, float-3 14s ease-in-out infinite alternate; }
          .animate-flash { animation: electric-flash 8s infinite linear; }
        `}
      </style>

      {/* Decorative Background Blobs - Live & Electric */}
      <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] bg-yellow-400 blur-[80px] sm:blur-[120px] pointer-events-none animate-fluid-1" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] bg-amber-400 blur-[80px] sm:blur-[120px] pointer-events-none animate-fluid-2" />
      <div className="absolute top-[20%] right-[10%] w-[40vw] h-[40vw] max-w-[400px] max-h-[400px] bg-yellow-300 blur-[60px] sm:blur-[90px] pointer-events-none animate-fluid-3" style={{ animationDelay: '-4s' }} />
      <div className="absolute bottom-[20%] left-[10%] w-[45vw] h-[45vw] max-w-[450px] max-h-[450px] bg-yellow-200 blur-[70px] sm:blur-[100px] pointer-events-none animate-fluid-1" style={{ animationDelay: '-8s' }} />
      
      {/* Subtle Lightning Flash Effect */}
      <div className="absolute inset-0 bg-white pointer-events-none animate-flash z-0" />

      <div className="sm:mx-auto sm:w-full sm:max-w-[420px] relative z-10">
        <div className="bg-white/80 backdrop-blur-xl py-10 px-8 sm:px-10 shadow-2xl shadow-yellow-900/5 sm:rounded-[2rem] border border-white/50">
          
          <h2 className="text-center text-3xl font-bold text-gray-900 tracking-tight">
            Welcome back
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500 mb-8">
            Sign in to your Evalme account
          </p>
          
          {/* Google Sign In Button */}
          <div>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full flex justify-center items-center gap-3 py-3.5 px-4 border-2 border-gray-100 rounded-full bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-200 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-gray-100 active:scale-[0.98]"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
          </div>

          {/* Divider */}
          <div className="mt-7 mb-7 flex items-center text-sm">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="px-4 text-gray-400 bg-transparent">
              or continue with email
            </span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {/* Magic Link Form */}
          {isSent ? (
            <div className="rounded-2xl bg-yellow-50 p-5 border border-yellow-100 animate-[fade-in_0.3s_ease-out]">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center mb-3">
                  <CheckCircle2 className="h-6 w-6 text-yellow-600" aria-hidden="true" />
                </div>
                <h3 className="text-base font-semibold text-yellow-900">Check your inbox</h3>
                <p className="mt-2 text-sm text-yellow-800">
                  We sent a magic link to <span className="font-semibold">{email}</span>
                </p>
                <button
                  type="button"
                  onClick={() => setIsSent(false)}
                  className="mt-5 text-sm font-medium text-yellow-700 hover:text-yellow-600 transition-colors"
                >
                  Use a different email
                </button>
              </div>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={handleMagicLinkSubmit}>
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-full text-gray-900 placeholder-gray-400 focus:bg-white focus:border-yellow-400 focus:ring-0 sm:text-sm transition-all duration-200 outline-none shadow-sm"
                    placeholder="name@company.com"
                  />
                </div>
                {errorMessage && (
                   <p className="text-red-500 text-xs font-bold mt-2 text-center">{errorMessage}</p>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || !email}
                  className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-full text-sm font-bold text-gray-900 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 shadow-lg shadow-yellow-500/30 hover:shadow-xl hover:shadow-yellow-500/40 focus:outline-none focus:ring-4 focus:ring-yellow-500/20 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98]"
                >
                  {isSubmitting ? (
                    <div className="h-5 w-5 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />
                  ) : (
                    <>
                      Get Magic Link
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
          
          {/* Footer Link */}
          <p className="mt-8 text-center text-xs text-gray-400">
            By continuing, you agree to Evalme's{' '}
            <a href="#" className="font-medium text-gray-600 hover:text-yellow-600 transition-colors">
              Terms
            </a>{' '}
            and{' '}
            <a href="#" className="font-medium text-gray-600 hover:text-yellow-600 transition-colors">
              Privacy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
