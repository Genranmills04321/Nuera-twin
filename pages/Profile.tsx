
import React from 'react';
import { UserProfile, Generation, Project } from '../types.ts';
import { NavLink } from 'react-router-dom';
import { TOOL_CONFIGS } from '../constants.tsx';

interface ProfileProps {
  user: UserProfile;
  generations: Generation[];
  projects: Project[];
}

const Profile: React.FC<ProfileProps> = ({ user, generations, projects }) => {
  const recentGens = generations.slice(0, 3);
  const recentProjs = projects.slice(0, 2);

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-reveal">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left: User Card */}
        <div className="lg:w-1/3 space-y-8">
          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform"></div>
            
            <div className="relative z-10 text-center">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 p-1 mb-6 shadow-2xl">
                 <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-4xl font-black text-slate-900 border-2 border-white overflow-hidden">
                    {user.name.charAt(0)}
                 </div>
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">{user.name}</h2>
              <p className="text-sm text-slate-500 font-medium mb-2">{user.email}</p>
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-50 rounded-full text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-8">
                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
                <span>Pro Growth Tier</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-left border-t border-slate-50 pt-8 mt-4">
                 <div className="p-4 bg-slate-50 rounded-2xl">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Credits Left</p>
                    <p className="text-xl font-black text-indigo-600">{user.creditsRemaining}</p>
                 </div>
                 <div className="p-4 bg-slate-50 rounded-2xl">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Projects</p>
                    <p className="text-xl font-black text-slate-900">{projects.length}</p>
                 </div>
              </div>

              <div className="mt-8 space-y-3">
                 <NavLink to="/dashboard/settings" className="w-full flex items-center justify-center py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg active:scale-95">
                   Account Settings
                 </NavLink>
                 <NavLink to="/dashboard/billing" className="w-full flex items-center justify-center py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95">
                   Billing & Plans
                 </NavLink>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
            <h3 className="text-lg font-black mb-6 flex items-center">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3 font-black text-xs italic">N</div>
              Identity Snapshot
            </h3>
            <div className="space-y-6">
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Primary Voice</p>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-xs font-medium text-slate-200">
                    {user.brandVoice || "Identity sync required to clone voice traits."}
                  </div>
               </div>
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Visual Style</p>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-xs font-medium text-slate-200">
                    {user.visualDNA || "Photorealistic, Modern, Minimal."}
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Right: Dashboard Summary */}
        <div className="flex-1 space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <section className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
                 <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-black text-slate-900">Recent Projects</h3>
                    <NavLink to="/dashboard/projects" className="text-xs font-bold text-indigo-600 hover:underline">View All</NavLink>
                 </div>
                 <div className="space-y-4">
                    {recentProjs.length === 0 ? (
                      <p className="text-slate-400 text-sm font-medium py-10 text-center">No active projects created yet.</p>
                    ) : (
                      recentProjs.map(p => (
                        <div key={p.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group hover:border-indigo-300 transition-all">
                           <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-600">
                                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /></svg>
                              </div>
                              <div>
                                 <p className="font-black text-slate-900 text-sm">{p.title}</p>
                                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{p.projectType.replace('_', ' ')}</p>
                              </div>
                           </div>
                           <NavLink to={`/dashboard/projects`} className="opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-indigo-600 text-white rounded-lg">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><polyline points="9 18 15 12 9 6" /></svg>
                           </NavLink>
                        </div>
                      ))
                    )}
                 </div>
              </section>

              <section className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
                 <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-black text-slate-900">Recent Neural Assets</h3>
                    <NavLink to="/dashboard/history" className="text-xs font-bold text-indigo-600 hover:underline">History</NavLink>
                 </div>
                 <div className="space-y-4">
                    {recentGens.length === 0 ? (
                      <p className="text-slate-400 text-sm font-medium py-10 text-center">No assets generated recently.</p>
                    ) : (
                      recentGens.map(g => (
                        <div key={g.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group hover:border-indigo-300 transition-all">
                           <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 bg-slate-900 text-white rounded-xl shadow-sm flex items-center justify-center">
                                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                                    {TOOL_CONFIGS[g.type]?.icon}
                                 </svg>
                              </div>
                              <div>
                                 <p className="font-black text-slate-900 text-sm truncate max-w-[120px]">{g.inputs.businessName}</p>
                                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{TOOL_CONFIGS[g.type]?.title}</p>
                              </div>
                           </div>
                           <div className="text-[9px] font-black text-slate-300">{new Date(g.createdAt).toLocaleDateString()}</div>
                        </div>
                      ))
                    )}
                 </div>
              </section>
           </div>

           <section className="bg-indigo-50 border border-indigo-100 rounded-[2.5rem] p-12 relative overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                 <div className="text-center md:text-left">
                    <h3 className="text-3xl font-black text-indigo-900 tracking-tight mb-2">The Lab is Ready.</h3>
                    <p className="text-indigo-600 font-medium max-w-sm">Launch a new neural synthesis to scale your brand identity today.</p>
                 </div>
                 <NavLink to="/dashboard/generate" className="px-12 py-5 bg-indigo-600 text-white font-black rounded-[2rem] shadow-2xl shadow-indigo-600/30 hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95 text-lg">
                    New Generation
                 </NavLink>
              </div>
              <div className="absolute top-0 right-0 p-8 opacity-10">
                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-40 h-40"><circle cx="12" cy="12" r="10" /><path d="m12 8 4 4-4 4M8 12h8" /></svg>
              </div>
           </section>
        </div>
      </div>
    </div>
  );
};

export default Profile;
