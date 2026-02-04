
import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, ToolType, Project, ProjectSection, Template } from '../../types.ts';
import { generateMarketingCopy, refineAsset } from '../../services/geminiService.ts';
import { useNavigate, useParams } from 'react-router-dom';

const SalesPageBuilder: React.FC<{ user: UserProfile, onSave: (p: Project) => void, deductCredits: (a: number) => void }> = ({ user, onSave, deductCredits }) => {
  const navigate = useNavigate();
  const { templateId } = useParams();
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [isRefining, setIsRefining] = useState(false);
  const [refinementInput, setRefinementInput] = useState('');
  
  const [formData, setFormData] = useState({
    businessName: user.businessName || '',
    offer: '',
    painPoints: '',
    dreamOutcome: '',
    guarantee: '30-Day Money Back'
  });

  const [sections, setSections] = useState<ProjectSection[]>([
    { id: '1', name: 'Hero Identity', category: 'hero', content: '' },
    { id: '2', name: 'The Friction Point', category: 'problem', content: '' },
    { id: '3', name: 'The Breakthrough', category: 'solution', content: '' },
    { id: '4', name: 'Social Proof / FAQ', category: 'faq', content: '' },
    { id: '5', name: 'The Final Close', category: 'cta', content: '' }
  ]);

  const handleGenerateAll = async () => {
    if (user.creditsRemaining < 30) {
      alert("Insufficient credits (30 required).");
      return;
    }
    setIsGenerating(true);
    try {
      const result = await generateMarketingCopy(ToolType.SALES_PAGE, {
        ...formData,
        niche: user.niche || 'General',
        audience: user.defaultAudience || 'Target Customer',
        tone: 'Bold & Persuasive',
        offerDetails: `Offer: ${formData.offer}. Pain Points: ${formData.painPoints}. Outcome: ${formData.dreamOutcome}.`
      });

      const updated = sections.map(sec => {
        if (sec.category === 'hero') return { ...sec, content: `# ${result.headline}\n\n${result.subheadline}` };
        if (sec.category === 'problem') return { ...sec, content: result.storySection || '' };
        if (sec.category === 'solution') return { ...sec, content: result.benefits ? result.benefits.join('\n\n') : '' };
        if (sec.category === 'faq') return { ...sec, content: result.faq ? result.faq.map((f: any) => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n') : '' };
        if (sec.category === 'cta') return { ...sec, content: result.cta || '' };
        return sec;
      });
      setSections(updated);
      deductCredits(30);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRefineSection = async () => {
    if (!activeSectionId || !refinementInput.trim()) return;
    setIsRefining(true);
    try {
      const section = sections.find(s => s.id === activeSectionId);
      if (!section) return;
      
      const updatedOutput = await refineAsset(ToolType.SALES_PAGE, { content: section.content }, refinementInput, { ...formData, niche: '', audience: '', tone: '', offerDetails: '' });
      
      setSections(sections.map(s => s.id === activeSectionId ? { ...s, content: updatedOutput.content || updatedOutput.headline || updatedOutput.sections?.[0]?.content || section.content } : s));
      setRefinementInput('');
      setActiveSectionId(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRefining(false);
    }
  };

  const handleSave = () => {
    onSave({
      id: Math.random().toString(36).substr(2, 9),
      uid: user.uid,
      projectType: 'sales_page',
      title: `${formData.businessName || 'Brand'} Sales Page`,
      sections,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    navigate('/dashboard/projects');
  };

  return (
    <div className="fixed inset-0 top-16 bg-slate-50 flex overflow-hidden">
      {/* LEFT: Controls Panel */}
      <div className="w-[400px] border-r border-slate-200 bg-white flex flex-col h-full shadow-2xl z-20">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
           <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Sales Architect</h2>
              <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mt-1">Version 4.0 Neural Build</p>
           </div>
           <button onClick={handleSave} className="p-2 bg-slate-900 text-white rounded-lg hover:bg-indigo-600 transition-colors shadow-lg active:scale-95">
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
           </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
           <section className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Context</label>
              <input 
                placeholder="Product/Offer Name"
                className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-black text-slate-900"
                value={formData.offer}
                onChange={e => setFormData({...formData, offer: e.target.value})}
              />
              <textarea 
                placeholder="Core Problem/Pain Points..."
                className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium text-slate-600 h-24 resize-none"
                value={formData.painPoints}
                onChange={e => setFormData({...formData, painPoints: e.target.value})}
              />
              <button 
                onClick={handleGenerateAll}
                disabled={isGenerating}
                className="w-full py-4 bg-indigo-600 text-white font-black rounded-xl shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all flex items-center justify-center space-x-2"
              >
                {isGenerating ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></svg>
                    <span>Synthesize Canvas</span>
                  </>
                )}
              </button>
           </section>

           <div className="pt-8 border-t border-slate-100">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Architecture Blocks</label>
              <div className="space-y-2">
                 {sections.map((s, i) => (
                   <div key={s.id} onClick={() => setActiveSectionId(s.id)} className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all ${activeSectionId === s.id ? 'bg-indigo-50 border-2 border-indigo-200' : 'bg-white border border-slate-100 hover:border-indigo-200'}`}>
                      <div className="flex items-center space-x-3">
                         <span className="w-6 h-6 bg-slate-900 text-white rounded flex items-center justify-center text-[10px] font-black">{i+1}</span>
                         <span className="text-xs font-black text-slate-700">{s.name}</span>
                      </div>
                      {s.content ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4 text-emerald-500"><polyline points="20 6 9 17 4 12" /></svg>
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                      )}
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {activeSectionId && (
          <div className="p-8 border-t border-slate-100 bg-slate-50 animate-reveal">
             <div className="flex justify-between items-center mb-4">
               <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Section Refine</label>
               <button onClick={() => setActiveSectionId(null)} className="text-slate-400 hover:text-slate-900 transition-colors">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
               </button>
             </div>
             <textarea 
               placeholder="How should I change this block?"
               className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none text-xs font-medium h-24 resize-none mb-3 shadow-sm"
               value={refinementInput}
               onChange={e => setRefinementInput(e.target.value)}
             />
             <button 
               onClick={handleRefineSection}
               disabled={isRefining}
               className="w-full py-3 bg-slate-900 text-white font-black rounded-xl text-xs hover:bg-indigo-600 transition-all shadow-lg active:scale-95 flex items-center justify-center space-x-2"
             >
                {isRefining ? 'Updating...' : 'Update Block'}
             </button>
          </div>
        )}
      </div>

      {/* RIGHT: The Canvas */}
      <div className="flex-1 overflow-y-auto bg-slate-200 p-8 md:p-20 flex flex-col items-center custom-scrollbar">
         <div className="w-full max-w-4xl bg-white min-h-[1200px] shadow-[0_40px_100px_rgba(0,0,0,0.1)] rounded-[1rem] md:rounded-[2.5rem] overflow-hidden flex flex-col">
            {sections.map((section, idx) => (
              <div 
                key={section.id} 
                className={`group relative p-12 md:p-20 border-b border-slate-50 transition-all ${activeSectionId === section.id ? 'bg-indigo-50/30' : 'hover:bg-slate-50/50'}`}
              >
                {/* Floating Tooltips for Lovable Feel */}
                <div className="absolute -left-12 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity hidden lg:block">
                  <div className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest whitespace-nowrap shadow-xl">
                    {section.name}
                  </div>
                </div>

                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                   <button onClick={() => setActiveSectionId(section.id)} className="p-3 bg-white border border-slate-100 text-indigo-600 rounded-xl shadow-lg hover:scale-110 transition-transform active:scale-95">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></svg>
                   </button>
                </div>

                <div className="relative">
                  {section.content ? (
                    <div className="prose max-w-none animate-reveal">
                      <div className="text-slate-900 font-medium whitespace-pre-wrap leading-relaxed text-lg md:text-xl">
                        {section.content.startsWith('#') ? (
                          <div className="space-y-4">
                             <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-br from-slate-900 to-slate-600">{section.content.split('\n')[0].replace('# ', '')}</h1>
                             <p className="text-xl text-slate-500 font-medium max-w-2xl">{section.content.split('\n').slice(1).join('\n').trim()}</p>
                          </div>
                        ) : (
                          section.content
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
                       <div className="w-20 h-2 bg-slate-50 rounded-full overflow-hidden">
                          <div className="h-full bg-slate-100 animate-[scan_2s_infinite]"></div>
                       </div>
                       <p className="text-slate-300 font-black text-xs uppercase tracking-widest">Ghost Segment: {section.name}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            <div className="p-20 text-center bg-slate-50 border-t border-slate-100 flex flex-col items-center">
               <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 mb-6 group cursor-pointer hover:border-indigo-400 hover:text-indigo-600 transition-all">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-6 h-6"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
               </div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">End of Architecture</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default SalesPageBuilder;
