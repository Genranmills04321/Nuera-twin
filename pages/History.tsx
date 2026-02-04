
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Generation, ToolType } from '../types.ts';
import { TOOL_CONFIGS } from '../constants.tsx';

interface HistoryProps {
  generations: Generation[];
  onDelete: (id: string) => void;
}

const History: React.FC<HistoryProps> = ({ generations, onDelete }) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filtered = generations.filter(g => {
    const matchesFilter = filter === 'all' || g.type === filter;
    const matchesSearch = g.inputs.businessName?.toLowerCase().includes(search.toLowerCase()) || 
                         TOOL_CONFIGS[g.type]?.title.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Generation History</h1>
          <p className="text-slate-500 mt-1 font-medium">Manage and refine your previously generated marketing assets.</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm w-fit overflow-x-auto no-scrollbar">
          {['all', ToolType.FACEBOOK_ADS, ToolType.LOGO_GENERATOR, ToolType.IMAGE_GENERATOR].map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === f ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-900'}`}
            >
              {f === 'all' ? 'All' : TOOL_CONFIGS[f as ToolType]?.title.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
        <input 
          type="text" placeholder="Search by business name or tool..." 
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-[1.5rem] focus:ring-2 focus:ring-indigo-500/20 outline-none font-black text-slate-900 shadow-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-10 h-10"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><polyline points="13 2 13 9 20 9" /></svg>
             </div>
             <h3 className="text-xl font-black text-slate-900">No matching assets found.</h3>
             <p className="text-slate-500 mt-2 font-medium">Try a different search or start a new generation.</p>
          </div>
        ) : (
          filtered.map((gen) => (
            <div key={gen.id} className="group bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-2xl transition-all hover:-translate-y-1 flex flex-col">
              <div className="h-40 bg-slate-50 relative flex items-center justify-center overflow-hidden border-b border-slate-100">
                 {gen.output.image ? (
                   <img src={gen.output.image} alt="Thumbnail" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                 ) : (
                   <div className="text-slate-300">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12 opacity-50">
                        {TOOL_CONFIGS[gen.type]?.icon}
                      </svg>
                   </div>
                 )}
                 <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[8px] font-black text-slate-900 uppercase tracking-widest border border-slate-100 shadow-sm">
                      {TOOL_CONFIGS[gen.type]?.title}
                    </span>
                    {gen.parentId && (
                      <span className="px-3 py-1 bg-indigo-600 text-white rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg">Refined</span>
                    )}
                 </div>
              </div>
              
              <div className="p-8 flex-1 flex flex-col">
                 <h4 className="font-black text-slate-900 text-lg line-clamp-1">{gen.inputs.businessName}</h4>
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                   {new Date(gen.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                 </p>
                 
                 <div className="mt-8 flex gap-2 pt-6 border-t border-slate-50">
                    <button 
                      onClick={() => navigate('/dashboard/generate', { state: { refineItem: gen } })}
                      className="flex-1 py-3 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-indigo-600 transition-all active:scale-95 flex items-center justify-center"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3.5 h-3.5 mr-2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></svg>
                      Refine
                    </button>
                    <button 
                      onClick={() => onDelete(gen.id)}
                      className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                    </button>
                 </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default History;
