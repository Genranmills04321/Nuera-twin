
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { UserProfile, ToolType, GenerationInput, Generation } from '../types.ts';
import { TOOL_CONFIGS, TONE_OPTIONS } from '../constants.tsx';
import { generateMarketingCopy, refineAsset } from '../services/geminiService.ts';

const ResultDisplay: React.FC<{ 
  type: ToolType; 
  data: any; 
  onRefine: (data: any) => void;
  onUpdate: (updatedData: any) => void;
  onSaveToVault: () => void;
}> = ({ type, data, onRefine, onUpdate, onSaveToVault }) => {
  const [localData, setLocalData] = useState(data);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setLocalData(data);
  }, [data]);

  if (!data) return null;

  const handleSaveEdit = () => {
    setIsEditing(false);
    onUpdate(localData);
  };

  const actionButtons = (
    <div className="space-y-3 mt-6">
      <div className="flex gap-2">
        <button 
          onClick={() => onRefine(localData)}
          className="flex-1 py-3 bg-white/10 hover:bg-indigo-600 text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all flex items-center justify-center group"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3.5 h-3.5 mr-2 group-hover:rotate-12 transition-transform">
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
          </svg>
          AI Refine
        </button>
        {!localData.image && (
          <button 
            onClick={() => isEditing ? handleSaveEdit() : setIsEditing(true)}
            className={`flex-1 py-3 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all flex items-center justify-center ${isEditing ? 'bg-emerald-600 text-white' : 'bg-white/5 text-slate-400 hover:text-white'}`}
          >
            {isEditing ? 'Save Edit' : 'Manual Edit'}
          </button>
        )}
      </div>
      <button 
        onClick={onSaveToVault}
        className="w-full py-4 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-400 hover:text-white font-black text-[10px] uppercase tracking-widest rounded-xl border border-indigo-500/30 transition-all flex items-center justify-center space-x-2"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
        <span>Save to Identity Vault</span>
      </button>
    </div>
  );

  if (localData.image) {
    return (
      <div className="space-y-6 animate-reveal">
        <div className="relative group overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl">
           <img src={localData.image} alt="Generated Asset" className="w-full h-auto object-contain bg-slate-900" />
           <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
              <button 
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = localData.image;
                  link.download = `neurotwin-${type}-${Date.now()}.png`;
                  link.click();
                }}
                className="px-6 py-3 bg-white text-slate-900 font-black text-xs uppercase rounded-full shadow-2xl active:scale-95 transition-transform"
              >
                Download HQ Asset
              </button>
           </div>
        </div>
        {localData.description && (
          <div className="p-5 bg-white/5 border border-white/10 rounded-2xl">
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2 block">AI Interpretation</span>
            <p className="text-slate-300 text-sm leading-relaxed italic">"{localData.description}"</p>
          </div>
        )}
        {actionButtons}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white/5 rounded-2xl border border-white/10 p-4 overflow-hidden min-h-[200px]">
           {isEditing ? (
             <textarea 
               className="w-full bg-transparent text-[11px] text-slate-200 font-mono h-64 focus:outline-none resize-none leading-relaxed"
               value={typeof localData === 'string' ? localData : JSON.stringify(localData, null, 2)}
               onChange={(e) => {
                 try {
                   const val = e.target.value;
                   if (val.trim().startsWith('{') || val.trim().startsWith('[')) {
                     setLocalData(JSON.parse(val));
                   } else {
                     setLocalData(val);
                   }
                 } catch (err) { setLocalData(e.target.value); }
               }}
             />
           ) : (
             <div className="text-[11px] text-slate-300 font-mono whitespace-pre-wrap leading-relaxed">
               {typeof localData === 'string' ? localData : JSON.stringify(localData, null, 2)}
             </div>
           )}
      </div>
      {actionButtons}
    </div>
  );
};

const Generate: React.FC<{ user: UserProfile, onGenerate: (gen: Generation) => void }> = ({ user, onGenerate }) => {
  const location = useLocation();
  const [activeTool, setActiveTool] = useState<ToolType>(() => (localStorage.getItem('adcraft_preselect') as ToolType) || ToolType.FACEBOOK_ADS);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [refinementTarget, setRefinementTarget] = useState<any | null>(null);
  const [refinementInput, setRefinementInput] = useState('');
  const [showSuccessBadge, setShowSuccessBadge] = useState(false);

  const [formData, setFormData] = useState<GenerationInput>({
    businessName: user.businessName || '',
    niche: user.niche || '',
    audience: user.defaultAudience || '',
    tone: user.defaultTone || TONE_OPTIONS[0],
    offerDetails: '',
    logoStyle: 'minimalist',
    logoColors: '',
    logoIcons: '',
    aspectRatio: '1:1',
    stylePreset: 'Photorealistic'
  });
  const [result, setResult] = useState<any | null>(null);

  const handleInputChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const output = await generateMarketingCopy(activeTool, formData);
      setResult(output);
      // Auto-save initial generation
      saveToHistory(output);
    } catch (err) { alert("Generation failed."); } finally { setIsGenerating(false); }
  };

  const saveToHistory = (output: any) => {
    const genId = Math.random().toString(36).substr(2, 9);
    onGenerate({ 
      id: genId, 
      uid: user.uid, 
      type: activeTool, 
      inputs: { ...formData }, 
      output, 
      createdAt: new Date().toISOString() 
    });
    setShowSuccessBadge(true);
    setTimeout(() => setShowSuccessBadge(false), 3000);
  };

  const handleRefineSubmit = async () => {
    if (!refinementInput.trim()) return;
    setIsGenerating(true);
    setIsRefining(false);
    try {
      const output = await refineAsset(activeTool, refinementTarget, refinementInput, formData);
      setResult(output);
      setRefinementInput('');
    } catch (err) { alert("Refinement failed."); } finally { setIsGenerating(false); }
  };

  const isLogoTool = activeTool === ToolType.LOGO_GENERATOR;
  const isGenericImageTool = [ToolType.IMAGE_GENERATOR, ToolType.ADS_CREATIVE].includes(activeTool);

  return (
    <div className="max-w-7xl mx-auto pb-20 px-4 md:px-0">
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Creative Studio</h1>
          <p className="text-sm text-slate-500 font-medium">Neural identity synthesis powered by Gemini 2.5.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-3 lg:sticky lg:top-24 z-20">
          <div className="bg-white border border-slate-200 rounded-[2rem] p-4 shadow-sm">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 ml-3">Engines</p>
            <div className="space-y-1">
              {[ToolType.FACEBOOK_ADS, ToolType.ADS_CREATIVE, ToolType.LOGO_GENERATOR, ToolType.IMAGE_GENERATOR].map(type => (
                <button
                  key={type}
                  onClick={() => { setActiveTool(type); setResult(null); }}
                  className={`w-full flex items-center px-4 py-3 rounded-xl transition-all text-xs font-bold ${activeTool === type ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 mr-3">{TOOL_CONFIGS[type]?.icon}</svg>
                  {TOOL_CONFIGS[type]?.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
            <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 mr-3 text-indigo-600">{TOOL_CONFIGS[activeTool]?.icon}</svg>
              Architect: {TOOL_CONFIGS[activeTool]?.title}
            </h2>

            <form onSubmit={handleGenerate} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Business</label>
                  <input name="businessName" value={formData.businessName} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm font-black outline-none shadow-inner" required />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Niche</label>
                  <input name="niche" value={formData.niche} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm font-black outline-none shadow-inner" />
                </div>
              </div>

              {isLogoTool && (
                <div className="space-y-4 pt-4 border-t border-slate-50 animate-reveal">
                  <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Logo Identity Core</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Visual Style</label>
                      <select name="logoStyle" value={formData.logoStyle} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm font-black text-slate-950 outline-none shadow-sm">
                        <option value="minimalist">Minimalist</option>
                        <option value="emblem">Emblem / Badge</option>
                        <option value="wordmark">Wordmark / Typographic</option>
                        <option value="abstract">Abstract Mark</option>
                        <option value="vintage">Vintage / Retro</option>
                        <option value="modern-tech">Modern Tech</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Color Palette</label>
                      <input name="logoColors" value={formData.logoColors} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm font-black text-slate-950 outline-none shadow-inner" placeholder="e.g. Navy & Gold" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Icons / Symbols</label>
                    <input name="logoIcons" value={formData.logoIcons} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm font-black text-slate-950 outline-none shadow-inner" placeholder="e.g. A mountain, a lion, a circle..." />
                  </div>
                </div>
              )}

              {isGenericImageTool && (
                <div className="space-y-6 pt-4 border-t border-slate-50 animate-reveal">
                  <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Visual Composition</p>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block">Aspect Ratio</label>
                    <div className="flex gap-2">
                      {["1:1", "16:9", "9:16", "4:3", "3:4"].map(ratio => (
                        <button 
                          key={ratio} type="button" 
                          onClick={() => setFormData({...formData, aspectRatio: ratio as any})}
                          className={`flex-1 py-2 border rounded-lg text-[10px] font-black transition-all ${formData.aspectRatio === ratio ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-slate-50 border-slate-200 text-slate-500'}`}
                        >
                          {ratio}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block">Artistic Preset</label>
                    <div className="flex flex-wrap gap-2">
                      {["Photorealistic", "Minimalist Vector", "3D Render", "Cyberpunk", "Vintage Oil"].map(style => (
                        <button 
                          key={style} type="button" 
                          onClick={() => setFormData({...formData, stylePreset: style})}
                          className={`px-3 py-1.5 border rounded-full text-[9px] font-black uppercase tracking-wider transition-all ${formData.stylePreset === style ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white border-slate-200 text-slate-400'}`}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Creative Brief / Prompt</label>
                <textarea name="offerDetails" value={formData.offerDetails} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm font-black h-32 outline-none resize-none shadow-inner" placeholder="Describe your creative vision..." required />
              </div>
              <button type="submit" disabled={isGenerating} className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-xl hover:bg-indigo-700 transition-all disabled:opacity-50">
                {isGenerating ? 'Accessing Neural Nodes...' : 'Generate Identity Asset'}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-4 lg:sticky lg:top-24">
          <div className="bg-slate-950 text-white rounded-[2.5rem] p-8 min-h-[500px] shadow-2xl relative flex flex-col border border-white/5 overflow-hidden">
             <div className="flex items-center justify-between mb-8">
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 flex items-center">
                 <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse mr-2"></div>
                 Nano Banana Synthesis
               </span>
               {showSuccessBadge && <span className="text-[9px] font-black text-emerald-400 uppercase animate-reveal">Vault Updated</span>}
             </div>

             <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center h-full space-y-6 animate-pulse">
                    <div className="w-20 h-20 bg-indigo-600/10 rounded-[2rem] flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-indigo-500/20 animate-ping"></div>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-8 h-8 text-indigo-400 animate-spin"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83" /></svg>
                    </div>
                    <div className="text-center space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Rendering Identity...</p>
                      <p className="text-[9px] font-medium text-slate-500 italic max-w-[200px]">Synthesizing brand DNA markers for accurate projection.</p>
                    </div>
                  </div>
                ) : result ? (
                  <ResultDisplay 
                    type={activeTool} data={result} 
                    onRefine={(d) => { setRefinementTarget(d); setIsRefining(true); }} 
                    onUpdate={(updated) => setResult(updated)}
                    onSaveToVault={() => saveToHistory(result)}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full opacity-10 grayscale text-center py-20">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-24 h-24 mb-6"><circle cx="12" cy="12" r="10" /><path d="m12 8 4 4-4 4M8 12h8" /></svg>
                    <p className="text-[10px] font-black uppercase tracking-widest">Input Parameters Required</p>
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>

      {/* Identity Refinement Modal */}
      {isRefining && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-md animate-reveal" onClick={() => setIsRefining(false)}></div>
          <div className="relative w-full max-w-lg bg-white rounded-[3rem] p-10 animate-reveal shadow-[0_0_100px_rgba(99,102,241,0.2)] border border-white/10">
            <div className="flex justify-between items-start mb-8">
               <div>
                 <h3 className="text-2xl font-black text-slate-900 tracking-tight">Refinement Protocol</h3>
                 <p className="text-sm text-slate-500 font-medium">Command your Twin to tweak this specific asset.</p>
               </div>
               <button onClick={() => setIsRefining(false)} className="p-2 text-slate-300 hover:text-slate-900 transition-colors">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
               </button>
            </div>
            
            <textarea 
              value={refinementInput} 
              onChange={(e) => setRefinementInput(e.target.value)} 
              className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-slate-950 font-black h-40 outline-none resize-none mb-8 shadow-inner" 
              placeholder="e.g. 'Make it more luxurious', 'Add a vibrant red background', 'Make the text bolder'..." 
              autoFocus 
            />
            
            <div className="flex gap-4">
              <button onClick={() => setIsRefining(false)} className="flex-1 py-4 bg-slate-50 text-slate-500 font-black rounded-2xl hover:bg-slate-100 transition-colors">Discard</button>
              <button onClick={handleRefineSubmit} className="flex-1 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all flex items-center justify-center">
                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4 mr-2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></svg>
                 Synthesize Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Generate;
