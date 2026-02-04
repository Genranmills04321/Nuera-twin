
import React, { useState } from 'react';
import { UserProfile, ToolType, Project, ProjectSection } from '../../types';
import { generateMarketingCopy, refineAsset } from '../../services/geminiService';
import { useNavigate } from 'react-router-dom';

const LandingPageBuilder: React.FC<{ user: UserProfile, onSave: (p: Project) => void, deductCredits: (a: number) => void }> = ({ user, onSave, deductCredits }) => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [refinementInput, setRefinementInput] = useState('');
  const [isRefining, setIsRefining] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    purpose: 'Lead Gen',
    mainBenefit: '',
    audience: user.defaultAudience || ''
  });

  const [sections, setSections] = useState<ProjectSection[]>([
    { id: '1', name: 'Primary Hook', category: 'hero', content: '' },
    { id: '2', name: 'The Struggle', category: 'problem', content: '' },
    { id: '3', name: 'The New Reality', category: 'solution', content: '' },
    { id: '4', name: 'Immediate Action', category: 'cta', content: '' }
  ]);

  const handleGenerate = async () => {
    if (user.creditsRemaining < 20) {
      alert("Insufficient credits (20 required).");
      return;
    }
    setIsGenerating(true);
    try {
      const result = await generateMarketingCopy(ToolType.LANDING_PAGE, {
        ...formData,
        businessName: user.businessName || 'Brand',
        niche: user.niche || 'General',
        tone: 'Friendly & Bold',
        offerDetails: `Purpose: ${formData.purpose}. Main Benefit: ${formData.mainBenefit}.`
      });

      const updated = [
        { ...sections[0], content: result.heroHeadline || '' },
        { ...sections[1], content: result.problemDescription || '' },
        { ...sections[2], content: result.solutionDescription || '' },
        { ...sections[3], content: result.ctaText || '' }
      ];
      setSections(updated);
      deductCredits(20);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRefine = async () => {
    if (!activeSectionId || !refinementInput.trim()) return;
    setIsRefining(true);
    try {
      const section = sections.find(s => s.id === activeSectionId);
      if (!section) return;
      
      const res = await refineAsset(ToolType.LANDING_PAGE, { content: section.content }, refinementInput, { ...formData, niche: '', tone: '', offerDetails: '' });
      setSections(sections.map(s => s.id === activeSectionId ? { ...s, content: res.content || res.heroHeadline || res.ctaText || section.content } : s));
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
      projectType: 'landing_page',
      title: formData.title || 'Landing Project',
      sections,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    navigate('/dashboard/projects');
  };

  return (
    <div className="fixed inset-0 top-16 bg-slate-50 flex overflow-hidden">
      {/* LEFT: Mini Architect Panel */}
      <div className="w-[360px] border-r border-slate-200 bg-white flex flex-col h-full z-20">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
           <h2 className="text-lg font-black tracking-tight">Lead Creator</h2>
           <button onClick={handleSave} className="p-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20 active:scale-95">
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><polyline points="20 6 9 17 4 12" /></svg>
           </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
           <div className="space-y-4">
              <input 
                placeholder="Campaign Title"
                className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-black text-slate-900"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
              <textarea 
                placeholder="What is the #1 big benefit?"
                className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium text-slate-600 h-32 resize-none shadow-inner"
                value={formData.mainBenefit}
                onChange={e => setFormData({...formData, mainBenefit: e.target.value})}
              />
              <button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full py-4 bg-indigo-600 text-white font-black rounded-xl shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all flex items-center justify-center"
              >
                {isGenerating ? 'Synthesizing...' : 'Generate Lead Copy'}
              </button>
           </div>

           <div className="pt-8 border-t border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Architecture</p>
              <div className="space-y-2">
                 {sections.map(s => (
                   <div 
                    key={s.id} 
                    onClick={() => setActiveSectionId(s.id)} 
                    className={`flex items-center px-4 py-3 rounded-xl border transition-all cursor-pointer ${activeSectionId === s.id ? 'bg-indigo-50 border-indigo-200 shadow-md' : 'bg-white border-slate-100 hover:border-indigo-100'}`}
                   >
                     <span className={`w-2 h-2 rounded-full mr-3 ${s.content ? 'bg-emerald-500' : 'bg-slate-200'}`}></span>
                     <span className="text-xs font-black text-slate-700">{s.name}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {activeSectionId && (
          <div className="p-8 border-t border-slate-100 bg-indigo-50/50">
             <textarea 
               placeholder="Instruct the AI..."
               className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none text-xs font-medium h-24 resize-none mb-3 shadow-sm"
               value={refinementInput}
               onChange={e => setRefinementInput(e.target.value)}
             />
             <button 
               onClick={handleRefine}
               disabled={isRefining}
               className="w-full py-3 bg-slate-900 text-white font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all active:scale-95"
             >
                {isRefining ? 'Refining...' : 'Magic Update'}
             </button>
          </div>
        )}
      </div>

      {/* RIGHT: Live Preview Canvas */}
      <div className="flex-1 bg-slate-100 flex justify-center p-8 md:p-12 overflow-y-auto custom-scrollbar">
         <div className="w-full max-w-2xl bg-white shadow-2xl rounded-[2rem] overflow-hidden flex flex-col h-fit animate-reveal">
            {sections.map((section) => (
              <div 
                key={section.id} 
                className={`group relative p-12 md:p-16 transition-all border-b border-slate-50 ${activeSectionId === section.id ? 'bg-indigo-50/20 shadow-inner' : 'hover:bg-slate-50/30'}`}
              >
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button onClick={() => setActiveSectionId(section.id)} className="p-2 bg-indigo-600 text-white rounded-lg shadow-lg active:scale-90">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></svg>
                   </button>
                </div>
                
                {section.content ? (
                  <div className="animate-reveal">
                    {section.category === 'hero' ? (
                      <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">{section.content}</h1>
                    ) : (
                      <p className="text-slate-600 font-medium leading-relaxed">{section.content}</p>
                    )}
                  </div>
                ) : (
                  <div className="py-12 flex flex-col items-center justify-center opacity-10">
                    <div className="w-12 h-1 bg-slate-200 rounded-full mb-4"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest">{section.name}</span>
                  </div>
                )}
              </div>
            ))}
            
            <div className="p-16 bg-slate-50 text-center flex flex-col items-center">
               <div className="w-12 h-12 bg-white rounded-2xl border border-slate-200 flex items-center justify-center text-slate-300">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-6 h-6"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
               </div>
               <p className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Lead Secure Infrastructure</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default LandingPageBuilder;
