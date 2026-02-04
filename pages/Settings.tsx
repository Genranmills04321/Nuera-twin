
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { TONE_OPTIONS } from '../constants';

interface SettingsProps {
  user: UserProfile;
  onUpdate: (user: UserProfile) => void;
}

const Settings: React.FC<SettingsProps> = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState<UserProfile>({ ...user });

  const handleSave = () => {
    onUpdate(formData);
    alert("Settings updated successfully!");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Brand Settings</h1>
        <p className="text-slate-500">Save your defaults to make generation even faster.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-8 space-y-8">
          <section>
             <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4">Profile Info</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Full Name</label>
                  <input 
                    type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Email Address</label>
                  <input 
                    type="email" value={formData.email} disabled
                    className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-400 cursor-not-allowed"
                  />
                </div>
             </div>
          </section>

          <hr className="border-slate-100" />

          <section>
             <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4">Brand Identity</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Business Name</label>
                  <input 
                    type="text" value={formData.businessName || ''} onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="e.g. Acme Corp"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Niche/Industry</label>
                  <input 
                    type="text" value={formData.niche || ''} onChange={(e) => setFormData({...formData, niche: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="e.g. Organic Skincare"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Default Audience</label>
                  <input 
                    type="text" value={formData.defaultAudience || ''} onChange={(e) => setFormData({...formData, defaultAudience: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="e.g. Eco-conscious women 25-40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Default Tone</label>
                  <select 
                    value={formData.defaultTone || ''} onChange={(e) => setFormData({...formData, defaultTone: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    {TONE_OPTIONS.map(tone => <option key={tone} value={tone}>{tone}</option>)}
                  </select>
                </div>
             </div>
          </section>
        </div>
        <div className="bg-slate-50 p-6 flex justify-end">
           <button 
             onClick={handleSave}
             className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all"
           >
             Save Changes
           </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
