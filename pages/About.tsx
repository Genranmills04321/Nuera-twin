
import React from 'react';
import { UserProfile } from '../types.ts';
import { NavLink } from 'react-router-dom';

interface AboutProps {
  user: UserProfile | null;
}

const About: React.FC<AboutProps> = ({ user }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-md z-50 border-b border-slate-50 md:border-none">
        <NavLink to="/" className="flex items-center space-x-2 group">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-lg md:text-xl text-white italic group-hover:scale-105 transition-transform shadow-lg shadow-indigo-600/20">A</div>
          <span className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter">AdCraft<span className="text-indigo-600">AI</span></span>
        </NavLink>
        <div className="hidden md:flex items-center space-x-6 text-sm font-bold text-slate-500">
          <NavLink to="/about" className="text-indigo-600">About</NavLink>
          <NavLink to="/pricing" className="hover:text-indigo-600 transition-colors">Pricing</NavLink>
          <NavLink to="/contact" className="hover:text-indigo-600 transition-colors">Contact</NavLink>
        </div>
        <div className="flex items-center space-x-2">
          {user ? (
            <NavLink to="/dashboard" className="bg-indigo-600 text-white px-6 py-3 rounded-full text-sm font-black">Dashboard</NavLink>
          ) : (
            <NavLink to="/signup" className="bg-slate-900 text-white px-6 py-3 rounded-full text-sm font-black">Get Started</NavLink>
          )}
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-8">Our Mission: <br /><span className="text-indigo-600">Identity First.</span></h1>
          <p className="text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto font-medium">
            In a world flooded with generic AI content, we believe the only way to win is to be authentically you. AdCraftAI was built to bridge the gap between AI speed and human soul.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-slate-900">The Problem with "Generic AI"</h2>
            <p className="text-slate-600 leading-relaxed font-medium">
              Most marketing AI tools use general models that make every business sound the same. They miss the nuances, the vocabulary, and the "energy" that makes your brand unique. This leads to high bounce rates and low trust.
            </p>
            <h2 className="text-3xl font-black text-slate-900">Our Solution: Brand Twin™</h2>
            <p className="text-slate-600 leading-relaxed font-medium">
              We spent two years developing proprietary Brand Twin™ technology. It doesn't just "write"; it analyzes your linguistic DNA to clone your voice. When you use AdCraftAI, the output sounds exactly like you—only faster.
            </p>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-indigo-100 blur-3xl rounded-full opacity-50"></div>
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&h=800" 
              alt="Team collaboration" 
              className="relative rounded-3xl shadow-2xl"
            />
          </div>
        </div>

        <div className="mt-32 p-12 bg-slate-900 rounded-[3rem] text-white text-center">
          <h2 className="text-4xl font-black mb-8">By founders, for founders.</h2>
          <p className="text-indigo-100 text-lg max-w-2xl mx-auto mb-10 font-medium">
            We started as a boutique marketing agency struggling to keep up with content demands. We built the tools we needed to survive, and now we're sharing them with the world.
          </p>
          <div className="flex justify-center space-x-12 grayscale opacity-50">
            <span className="font-black italic text-xl">2026 VISION</span>
            <span className="font-black italic text-xl">TRUSTED TECH</span>
            <span className="font-black italic text-xl">ROI ENGINE</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm font-black text-slate-300">© 2026 AdCraftAI Engine. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default About;
