
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInAnonymously, sendPasswordResetEmail } from 'firebase/auth';
import { auth, googleProvider, mockSignInWithPopup } from '../lib/firebase.ts';

const Login: React.FC = () => {
  const [view, setView] = useState<'login' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      // Note: If using real Firebase, this will still fail without a real key, 
      // but mock functionality handles Popup and Anonymous login better for demos.
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      if ('signInAnonymously' in auth) {
        await auth.signInAnonymously();
      } else {
        await signInAnonymously(auth);
      }
      navigate('/dashboard');
    } catch (err: any) {
      console.error("Firebase Guest access failed:", err);
      setError("Anonymous sign-in failed. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess('Password reset link sent! Please check your inbox.');
      setTimeout(() => setView('login'), 5000);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await mockSignInWithPopup(auth, googleProvider);
      navigate('/dashboard');
    } catch (err: any) {
      console.error("Google login error:", err);
      setError(err.message || 'Google sign-in failed. Popup might be blocked.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100 transition-all duration-300">
        <div className="text-center mb-8">
          <NavLink to="/" className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-xl text-white italic mx-auto mb-4 cursor-pointer hover:scale-105 transition-transform shadow-lg">A</NavLink>
          <h1 className="text-2xl font-black text-slate-900">
            {view === 'login' ? 'Welcome Back' : 'Reset Password'}
          </h1>
          <p className="text-slate-500 mt-2 text-sm">
            {view === 'login' 
              ? 'Log in to your AdCraftAI account' 
              : 'Enter your email to receive a recovery link'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl font-medium animate-reveal">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-100 text-green-600 text-sm rounded-xl font-medium">
            {success}
          </div>
        )}

        {view === 'login' ? (
          <div className="space-y-4">
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Email Address</label>
                <input 
                  type="email" required placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
                  <button 
                    type="button"
                    onClick={() => setView('reset')}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <input 
                  type="password" required placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all"
                />
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:bg-slate-800 transition-all disabled:opacity-50 active:scale-95"
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest"><span className="bg-white px-4 text-slate-400 font-bold tracking-widest">Or try our sandbox</span></div>
            </div>

            <button 
              onClick={handleGuestLogin}
              disabled={loading}
              className="w-full py-4 bg-indigo-50 border-2 border-indigo-100 text-indigo-700 font-black rounded-xl hover:bg-indigo-100/50 hover:border-indigo-200 transition-all disabled:opacity-50 active:scale-95 flex items-center justify-center group"
            >
              <span className="mr-2">⚡️</span>
              Quick Demo Access
            </button>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Email Address</label>
              <input 
                type="email" required placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all"
              />
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all disabled:opacity-50 active:scale-95"
            >
              {loading ? 'Sending link...' : 'Send Recovery Link'}
            </button>
            <button 
              type="button"
              onClick={() => setView('login')}
              className="w-full text-center text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
            >
              Back to Login
            </button>
          </form>
        )}

        {view === 'login' && (
          <>
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest"><span className="bg-white px-4 text-slate-400 font-bold">Social Login</span></div>
            </div>

            <button 
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl flex items-center justify-center hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5 mr-3" />
              {loading ? 'Wait...' : 'Google'}
            </button>
          </>
        )}

        <div className="mt-8 pt-8 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-500">Don't have an account? <NavLink to="/signup" className="text-indigo-600 font-bold hover:underline">Sign Up</NavLink></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
