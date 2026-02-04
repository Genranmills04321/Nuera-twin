
import React, { useState } from 'react';
import { Project, Template, UserProfile } from '../types.ts';
import { useNavigate } from 'react-router-dom';

const SYSTEM_TEMPLATES: Template[] = [
  {
    id: 'st_saas_classic',
    title: 'SaaS Disruptor',
    description: 'A high-converting long-form page for modern software products.',
    type: 'sales_page',
    category: 'saas',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&h=250',
    isSystem: true,
    popularityScore: 98,
    sections: [
      { id: '1', name: 'Identity Hero', category: 'hero', content: '' },
      { id: '2', name: 'The Manual Grind', category: 'problem', content: '' },
      { id: '3', name: 'Automated Freedom', category: 'solution', content: '' },
      { id: '4', name: 'Modular Features', category: 'solution', content: '' },
      { id: '5', name: 'Founder FAQ', category: 'faq', content: '' },
      { id: '6', name: 'The Final Close', category: 'cta', content: '' }
    ]
  },
  {
    id: 'st_ecom_luxury',
    title: 'Luxury E-Commerce',
    description: 'Visual-heavy storytelling for high-end physical products.',
    type: 'sales_page',
    category: 'ecommerce',
    thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=400&h=250',
    isSystem: true,
    popularityScore: 92,
    sections: [
      { id: '1', name: 'Elegant Entry', category: 'hero', content: '' },
      { id: '2', name: 'The Heritage Story', category: 'proof', content: '' },
      { id: '3', name: 'Product Deep Dive', category: 'solution', content: '' },
      { id: '4', name: 'The Guarantee', category: 'proof', content: '' }
    ]
  },
  {
    id: 'st_agency_minimal',
    title: 'Minimalist Agency',
    description: 'A professional, sophisticated layout for service-based businesses.',
    type: 'agency_site',
    category: 'service',
    thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&h=250',
    isSystem: true,
    popularityScore: 85,
    sections: [
      { id: '1', name: 'Agency Hero', category: 'hero', content: '' },
      { id: '2', name: 'Capabilities', category: 'solution', content: '' },
      { id: '3', name: 'Our Work', category: 'proof', content: '' },
      { id: '4', name: 'Contact Us', category: 'cta', content: '' }
    ]
  }
];

interface LibraryProps {
  user: UserProfile;
  projects: Project[];
  onSaveProject: (p: Project) => void;
}

const Library: React.FC<LibraryProps> = ({ projects }) => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'blueprints' | 'my_saved'>('blueprints');
  const [category, setCategory] = useState<string>('all');

  const filteredBlueprints = SYSTEM_TEMPLATES.filter(t => category === 'all' || t.category === category);
  const myTemplates = projects.filter(p => p.isUserTemplate);

  // Fix: Property 'type' does not exist on type 'Project'. Use 'projectType' instead when handling Project.
  const handleUseTemplate = (template: Template | Project) => {
    // Navigate to the builder with the template ID as a param
    const projectType = 'type' in template ? template.type : template.projectType;
    const path = projectType === 'sales_page' ? '/dashboard/build/sales-page' : '/dashboard/build/agency-site';
    navigate(`${path}/${template.id}`);
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Strategy Library</h1>
          <p className="text-slate-500">Pick a proven blueprint or reuse your own high-performing layouts.</p>
        </div>
        
        <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm w-fit">
          <button 
            onClick={() => setTab('blueprints')}
            className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${tab === 'blueprints' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-slate-900'}`}
          >
            Blueprints
          </button>
          <button 
            onClick={() => setTab('my_saved')}
            className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${tab === 'my_saved' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-slate-900'}`}
          >
            My Layouts
          </button>
        </div>
      </div>

      {tab === 'blueprints' && (
        <div className="flex items-center space-x-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
          {['all', 'saas', 'ecommerce', 'service', 'coaching'].map(cat => (
            <button 
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border transition-all ${category === cat ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-400'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tab === 'blueprints' ? (
          filteredBlueprints.map((template) => (
            <div key={template.id} className="group bg-white rounded-[2rem] overflow-hidden border border-slate-200 hover:shadow-2xl transition-all hover:-translate-y-2">
              <div className="relative h-48 overflow-hidden">
                <img src={template.thumbnail} alt={template.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex flex-col justify-end p-6">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-1 bg-white/20 backdrop-blur-md rounded text-[8px] font-black text-white uppercase tracking-widest">{template.category}</span>
                    <div className="flex items-center text-indigo-400 text-xs font-black">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                      {template.popularityScore}%
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-xl font-black text-slate-900 mb-2">{template.title}</h3>
                <p className="text-sm text-slate-500 mb-6 leading-relaxed font-medium">{template.description}</p>
                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{template.sections.length} Sections</span>
                   <button 
                    onClick={() => handleUseTemplate(template)}
                    className="px-6 py-2 bg-indigo-600 text-white font-black rounded-xl text-xs hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
                   >
                     Clone Blueprint
                   </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          myTemplates.length === 0 ? (
            <div className="col-span-full py-20 text-center">
               <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-10 h-10"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>
               </div>
               <h3 className="text-xl font-bold text-slate-900">No saved layouts</h3>
               <p className="text-slate-500 mt-2">Save a project as a template while editing to see it here.</p>
            </div>
          ) : (
            myTemplates.map((proj) => (
              <div key={proj.id} className="bg-white rounded-[2rem] p-8 border border-slate-200 hover:border-indigo-400 transition-all group">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /></svg>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-1">{proj.title}</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-6">{proj.projectType.replace('_', ' ')}</p>
                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{proj.sections.length} Sections</span>
                  <button 
                    onClick={() => handleUseTemplate(proj)}
                    className="px-6 py-2 bg-slate-900 text-white font-black rounded-xl text-xs hover:bg-slate-800 transition-all active:scale-95"
                  >
                    Reuse Layout
                  </button>
                </div>
              </div>
            ))
          )
        )}
      </div>
    </div>
  );
};

export default Library;
