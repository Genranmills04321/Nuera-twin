
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { UserProfile, Generation, ToolType, Project } from '../types.ts';
import { TOOL_CONFIGS } from '../constants.tsx';
import { generateMarketingCopy } from '../services/geminiService.ts';

interface DashboardProps {
  user: UserProfile;
  generations: Generation[];
  projects: Project[];
}

const Dashboard: React.FC<DashboardProps> = ({ user, generations = [], projects = [] }) => {
  const [quickPrompt, setQuickPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [quickResult, setQuickResult] = useState<string | null>(null);

  const handleQuickCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPrompt.trim()) return;
    
    setIsProcessing(true);
    setQuickResult(null);
    try {
      const response = await generateMarketingCopy(ToolType.BRAND_STRATEGY, {
        businessName: user.businessName || 'My Brand',
        niche: user.niche || 'General',
        audience: user.defaultAudience || 'Target Audience',
        tone: 'Direct & Persuasive',
        offerDetails: `Quick Request: ${quickPrompt}`
      });
      setQuickResult(response.uniqueSellingProposition || response.missionStatement || response.suggestedBusinessName || "Insight generated.");
    } catch (err) {
      setQuickResult("Unable to connect to AI brain. Check configuration.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-20 animate-reveal px-4 md:px-0">
      {/* 1. Global Intelligence Bar */}
      <section className="mb-12">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative bg-white border border-slate-100 rounded-[2.5rem] p-4 md:p-6 shadow-2xl">
            <form onSubmit={handleQuickCommand} className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex-1 w-full relative">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-indigo-500">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5 animate-pulse"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.63M16.24 7.76l2.83-2.83" /></svg>
                </div>
                <input 
                  type="text" 
                  value={quickPrompt}
                  onChange={(e) => setQuickPrompt(e.target.value)}
                  placeholder="Command the NeuroTwin: 'Headline for luxury gym' or 'Hook for eco-packaging'..." 
                  className="w-full bg-slate-50 border-none rounded-[1.5rem] py-4 pl-16 pr-6 font-black text-slate-900 focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm md:text-base"
                />
              </div>
              <button 
                type="submit"
                disabled={isProcessing}
                className="w-full md:w-auto px-8 py-4 bg-slate-900 text-white font-black rounded-[1.5rem] hover:bg-indigo-600 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center min-w-[160px]"
              >
                {isProcessing ? 'Thinking...' : 'Sync Brain'}
              </button>
            </form>

            {isProcessing && (
              <div className="mt-6 p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-3">
                 <div className="h-4 bg-slate-200 rounded w-1/4 animate-pulse"></div>
                 <div className="h-8 bg-slate-200 rounded w-full animate-pulse"></div>
              </div>
            )}

            {quickResult && (
              <div className="mt-6 p-8 bg-indigo-600 text-white rounded-[2rem] shadow-xl animate-reveal relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4">
                   <button onClick={() => setQuickResult(null)} className="text-white/40 hover:text-white transition-colors">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                   </button>
                </div>
                <div className="relative z-10">
                  <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] mb-3">Neural Clone Result</p>
                  <p className="text-white font-black text-xl md:text-2xl leading-relaxed italic">"{quickResult}"</p>
                  <div className="mt-6 flex flex-wrap gap-3">
                     <button onClick={() => {navigator.clipboard.writeText(quickResult); alert("Copied!");}} className="text-[10px] font-black uppercase text-indigo-600 bg-white px-5 py-2 rounded-full shadow-lg hover:bg-indigo-50 active:scale-95 transition-all">Copy Result</button>
                     <NavLink to="/dashboard/generate" className="text-[10px] font-black uppercase text-white bg-white/10 px-5 py-2 rounded-full border border-white/10 hover:bg-white/20 transition-all">Open Full Lab</NavLink>
                  </div>
                </div>
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. Intelligence Engines & Identity Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        <div className="lg:col-span-8 space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Brand Twin */}
              <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl group hover:scale-[1.01] transition-all cursor-pointer">
                <div className="relative z-10">
                   <div className="flex justify-between items-start mb-12">
                      <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center font-black text-xl italic shadow-lg shadow-indigo-600/20 group-hover:rotate-6 transition-transform relative overflow-hidden">
                        <span className="relative z-10">N</span>
                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/40 to-transparent"></div>
                      </div>
                   </div>
                   <h3 className="text-2xl font-black mb-2 tracking-tight">NeuroTwin™</h3>
                   <p className="text-slate-400 text-sm font-medium mb-8 leading-relaxed">Identity Cloning Engine.</p>
                   <NavLink to="/dashboard/generate" onClick={() => localStorage.setItem('adcraft_preselect', ToolType.BRAND_TWIN)} className="inline-block text-[10px] font-black uppercase tracking-widest text-white bg-indigo-600 px-6 py-3 rounded-xl hover:bg-white hover:text-indigo-600 transition-all">Tune Identity</NavLink>
                </div>
              </div>

              {/* Logo Engine */}
              <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 relative overflow-hidden shadow-sm group hover:border-indigo-400 transition-all cursor-pointer">
                <div className="relative z-10 h-full flex flex-col">
                  <div className="flex justify-between items-start mb-12">
                     <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path d="M12 3v19" /><path d="M5 8h14" /><circle cx="12" cy="8" r="5" /></svg>
                     </div>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Logo Architect</h3>
                  <p className="text-slate-500 text-sm font-medium mb-8">Neural Brand Marks.</p>
                  <div className="mt-auto">
                    <NavLink to="/dashboard/generate" onClick={() => localStorage.setItem('adcraft_preselect', ToolType.LOGO_GENERATOR)} className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-slate-900 transition-colors border-b-2 border-indigo-100 pb-1">Create Logo →</NavLink>
                  </div>
                </div>
              </div>

              {/* Brand Imagery */}
              <div className="bg-indigo-50 border border-indigo-100 rounded-[2.5rem] p-8 relative overflow-hidden shadow-sm group hover:border-indigo-400 transition-all cursor-pointer">
                <div className="relative z-10 h-full flex flex-col">
                  <div className="flex justify-between items-start mb-12">
                     <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
                     </div>
                  </div>
                  <h3 className="text-2xl font-black text-indigo-900 mb-2 tracking-tight">Image Studio</h3>
                  <p className="text-indigo-600 text-sm font-medium mb-8">Visual DNA Synthesis.</p>
                  <div className="mt-auto">
                    <NavLink to="/dashboard/generate" onClick={() => localStorage.setItem('adcraft_preselect', ToolType.IMAGE_GENERATOR)} className="text-[10px] font-black uppercase tracking-widest text-indigo-900 hover:text-indigo-600 transition-colors border-b-2 border-indigo-200 pb-1">Synthesize Assets →</NavLink>
                  </div>
                </div>
              </div>
           </div>

           {/* Conversion Tools Grid */}
           <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-xl font-black text-slate-900">Neural Conversion Engines</h2>
                <NavLink to="/dashboard/generate" className="text-xs font-bold text-indigo-600 hover:underline">Explore Full Lab</NavLink>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[ToolType.FACEBOOK_ADS, ToolType.ADS_CREATIVE, ToolType.SALES_PAGE, ToolType.NEWSLETTER].map((type) => (
                  <NavLink 
                    key={type} 
                    to="/dashboard/generate" 
                    onClick={() => localStorage.setItem('adcraft_preselect', type)}
                    className="bg-white p-6 rounded-[2rem] border border-slate-100 hover:border-indigo-400 hover:shadow-2xl transition-all group active:scale-95"
                  >
                    <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-all group-hover:scale-110">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
                        {TOOL_CONFIGS[type]?.icon}
                      </svg>
                    </div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900 line-clamp-1">{TOOL_CONFIGS[type]?.title}</h4>
                  </NavLink>
                ))}
              </div>
           </div>
        </div>

        {/* Sidebar: Pulse & Quick Build */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden">
              <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] mb-10">Neural Fidelity Report</h4>
              <div className="space-y-10">
                 <div>
                    <div className="flex justify-between items-center mb-3">
                       <span className="text-[10px] font-black uppercase text-slate-900">Voice Integrity</span>
                       <span className="text-xs font-black text-indigo-600">92%</span>
                    </div>
                    <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden">
                       <div className="h-full bg-indigo-600 rounded-full shadow-[0_0_8px_rgba(79,70,229,0.3)] transition-all duration-1000" style={{ width: '92%' }}></div>
                    </div>
                 </div>
                 <div>
                    <div className="flex justify-between items-center mb-3">
                       <span className="text-[10px] font-black uppercase text-slate-900">Creative Velocity</span>
                       <span className="text-xs font-black text-emerald-500">Peak</span>
                    </div>
                    <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden">
                       <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: '88%' }}></div>
                    </div>
                 </div>
              </div>
              
              <div className="mt-12 pt-10 border-t border-slate-50">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-6">Recent Deployments</p>
                 <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                       <div className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5 ring-4 ring-indigo-50"></div>
                       <p className="text-xs font-bold text-slate-700 leading-snug">Synced Neural Copy <span className="block text-[10px] font-medium text-slate-400 mt-0.5">Just now</span></p>
                    </div>
                    <div className="flex items-start space-x-4">
                       <div className="w-2 h-2 rounded-full bg-slate-200 mt-1.5 ring-4 ring-slate-50"></div>
                       <p className="text-xs font-bold text-slate-400 leading-snug">Visual DNA Snapshot <span className="block text-[10px] font-medium text-slate-300 mt-0.5">Yesterday</span></p>
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-indigo-600 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl group hover:scale-[1.01] transition-transform">
              <h4 className="text-2xl font-black mb-3 tracking-tight">Full-Page Architect</h4>
              <p className="text-indigo-100 text-sm font-medium mb-8 leading-relaxed opacity-80">Synthesize abstract brand concepts into full-scale conversion sites.</p>
              <NavLink to="/dashboard/build/sales-page" className="inline-block px-8 py-4 bg-white text-indigo-600 font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-indigo-50 shadow-xl transition-all active:scale-95">Launch Builder</NavLink>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
