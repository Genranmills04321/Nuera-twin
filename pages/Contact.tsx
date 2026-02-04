
import React, { useState } from 'react';
import { UserProfile } from '../types.ts';
import { NavLink } from 'react-router-dom';

interface ContactProps {
  user: UserProfile | null;
}

const Contact: React.FC<ContactProps> = ({ user }) => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6 flex justify-between items-center bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
        <NavLink to="/" className="flex items-center space-x-2 group">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-lg md:text-xl text-white italic group-hover:scale-105 transition-transform shadow-lg shadow-indigo-600/20">A</div>
          <span className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter">AdCraft<span className="text-indigo-600">AI</span></span>
        </NavLink>
        <div className="hidden md:flex items-center space-x-6 text-sm font-bold text-slate-500">
          <NavLink to="/about" className="hover:text-indigo-600 transition-colors">About</NavLink>
          <NavLink to="/pricing" className="hover:text-indigo-600 transition-colors">Pricing</NavLink>
          <NavLink to="/contact" className="text-indigo-600">Contact</NavLink>
        </div>
        <div className="flex items-center space-x-2">
          {user ? (
            <NavLink to="/dashboard" className="bg-indigo-600 text-white px-6 py-3 rounded-full text-sm font-black">Dashboard</NavLink>
          ) : (
            <NavLink to="/signup" className="bg-slate-900 text-white px-6 py-3 rounded-full text-sm font-black">Get Started</NavLink>
          )}
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-4 py-24 flex flex-col md:flex-row gap-16">
        <div className="flex-1 space-y-10">
          <div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-tight">Get in <br /><span className="text-indigo-600">Touch.</span></h1>
            <p className="text-xl text-slate-500 mt-6 font-medium">Need help with your brand identity or custom agency pricing? We're here for you.</p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center space-x-4 p-6 bg-white rounded-3xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl">📧</div>
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Email Support</p>
                <p className="font-bold text-slate-900">support@adcraftai.com</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-6 bg-white rounded-3xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center text-2xl">🏢</div>
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Headquarters</p>
                <p className="font-bold text-slate-900">San Francisco, CA</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1">
          {submitted ? (
            <div className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-2xl text-center space-y-6">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-4xl">✓</div>
              <h2 className="text-3xl font-black text-slate-900">Message Sent!</h2>
              <p className="text-slate-500 font-medium">One of our brand experts will get back to you within 24 hours.</p>
              <button onClick={() => setSubmitted(false)} className="text-indigo-600 font-bold hover:underline">Send another message</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white p-10 md:p-12 rounded-[3rem] border border-slate-200 shadow-2xl space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">First Name</label>
                  <input required type="text" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Last Name</label>
                  <input required type="text" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Business Email</label>
                <input required type="email" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Message</label>
                <textarea required rows={5} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"></textarea>
              </div>
              <button type="submit" className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all text-lg">
                Send Message
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-16 text-center">
        <p className="text-sm font-black text-slate-300">© 2026 AdCraftAI Engine. Built for Scale.</p>
      </footer>
    </div>
  );
};

export default Contact;
