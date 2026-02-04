
import React, { useState } from 'react';
import { UserProfile, ToolType, Project, ProjectSection } from '../../types';
import { generateMarketingCopy } from '../../services/geminiService';
import { useNavigate } from 'react-router-dom';

interface AgencySiteBuilderProps {
  user: UserProfile;
  onSave: (p: Project) => void;
  deductCredits: (amount: number) => void;
}

const AgencySiteBuilder: React.FC<AgencySiteBuilderProps> = ({ user, onSave, deductCredits }) => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [sections, setSections] = useState<ProjectSection[]>([
    { id: '1', name: 'Homepage Hero', category: 'hero', content: '' },
    { id: '2', name: 'Our Services', category: 'solution', content: '' },
    { id: '3', name: 'About the Agency', category: 'proof', content: '' },
    { id: '4', name: 'Contact Section', category: 'cta', content: '' }
  ]);

  const handleGenerate = async () => {
    if (user.creditsRemaining < 50) {
      alert("Insufficient credits for agency site synthesis (50 required).");
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateMarketingCopy(ToolType.AGENCY_SITE, {
        businessName: user.businessName || 'Creative Agency',
        niche: user.niche || 'Digital Marketing',
        audience: 'High-ticket B2B clients',
        tone: 'Sophisticated & Professional',
        offerDetails: 'Full-service digital growth agency providing custom marketing solutions.'
      });

      if (result.sections && Array.isArray(result.sections)) {
        setSections(result.sections.map((s: any, i: number) => ({
          id: String(i + 1),
          name: s.title || `Section ${i+1}`,
          category: 'custom',
          content: s.content || ''
        })));
        deductCredits(50);
      } else {
         // Fallback if schema differs
         setSections([
           { id: '1', name: 'Homepage Hero', category: 'hero', content: result.heroHeadline || result.headline || '' },
           { id: '2', name: 'Agency Strategy', category: 'solution', content: result.solutionDescription || result.storySection || '' },
           { id: '3', name: 'Service Modules', category: 'proof', content: result.benefits ? result.benefits.join('\n\n') : '' },
           { id: '4', name: 'Lead Acquisition', category: 'cta', content: result.ctaText || result.cta || '' }
         ]);
         deductCredits(50);
      }
    } catch (err) {
      console.error(err);
      alert("Site generation failed.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    onSave({
      id: Math.random().toString(36).substr(2, 9),
      uid: user.uid,
      projectType: 'agency_site',
      title: `${user.businessName || 'My Agency'} Website`,
      sections,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    navigate('/dashboard/projects');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="bg-slate-950 p-10 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl font-black tracking-tight">Agency Site Architect</h1>
          <p className="text-slate-400 mt-2 font-medium">Synthesizing full copy for a sophisticated professional presence.</p>
        </div>
        <div className="flex gap-4 relative z-10">
          <button onClick={handleGenerate} disabled={isGenerating} className="px-8 py-4 bg-white text-slate-900 font-black rounded-2xl hover:bg-slate-100 transition-all shadow-xl active:scale-95">
            {isGenerating ? 'Synthesizing...' : 'Generate Site Copy (50)'}
          </button>
          <button onClick={handleSave} className="px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-xl active:scale-95">
            Save Project
          </button>
        </div>
        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {sections.map((section, idx) => (
          <div key={section.id} className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm group hover:border-indigo-400 transition-all">
            <div className="bg-slate-50 px-8 py-5 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">{section.name}</h3>
              <span className="text-[10px] font-black text-indigo-400 uppercase">Module {idx+1}</span>
            </div>
            <textarea 
              className="w-full p-10 text-slate-950 font-black focus:outline-none min-h-[250px] leading-relaxed resize-none bg-transparent"
              value={section.content}
              onChange={(e) => {
                const s = [...sections];
                s[idx].content = e.target.value;
                setSections(s);
              }}
              placeholder="Click 'Generate Site Copy' to ignite the synthesis..."
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgencySiteBuilder;
