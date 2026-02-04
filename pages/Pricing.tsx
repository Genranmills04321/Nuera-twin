
import React from 'react';
import { UserProfile } from '../types.ts';
import { NavLink } from 'react-router-dom';

interface PricingProps {
  user: UserProfile | null;
}

const Pricing: React.FC<PricingProps> = ({ user }) => {
  const plans = [
    { 
      name: 'Starter', 
      price: '$29', 
      credits: '100 Credits', 
      desc: 'Perfect for solo-founders just starting out.',
      features: ['All generation tools', 'Standard support', 'History access', '5 Brand Twin slots'] 
    },
    { 
      name: 'Professional', 
      price: '$79', 
      credits: '500 Credits', 
      desc: 'The best value for growing brands and small teams.',
      features: ['Priority generation', 'Advanced builders', 'Brand presets', 'Email support', 'Unlimited Brand Twins'],
      popular: true 
    },
    { 
      name: 'Agency', 
      price: '$199', 
      credits: '2000 Credits', 
      desc: 'Scale multiple client identities with ease.',
      features: ['White-label results', 'Team access', 'API access (Beta)', 'Dedicated manager', 'Bulk generation'] 
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6 flex justify-between items-center bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
        <NavLink to="/" className="flex items-center space-x-2 group">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-lg md:text-xl text-white italic group-hover:scale-105 transition-transform shadow-lg shadow-indigo-600/20">A</div>
          <span className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter">AdCraft<span className="text-indigo-600">AI</span></span>
        </NavLink>
        <div className="hidden md:flex items-center space-x-6 text-sm font-bold text-slate-500">
          <NavLink to="/about" className="hover:text-indigo-600 transition-colors">About</NavLink>
          <NavLink to="/pricing" className="text-indigo-600">Pricing</NavLink>
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

      <section className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="max-w-3xl mx-auto mb-20 space-y-6">
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-tight">Simple Pricing, <br /><span className="text-indigo-600">Exponential Growth.</span></h1>
          <p className="text-xl text-slate-500 font-medium leading-relaxed">Choose the fuel your brand needs to scale. All plans include our proprietary Identity-First AI Engine.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div key={plan.name} className={`bg-white rounded-[2.5rem] p-10 border-2 transition-all ${plan.popular ? 'border-indigo-600 shadow-2xl scale-105 relative z-10' : 'border-slate-100 shadow-sm hover:border-indigo-200'}`}>
              {plan.popular && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-6 py-2 rounded-full">Recommended</span>
              )}
              <h3 className="text-2xl font-black text-slate-900 mb-2">{plan.name}</h3>
              <p className="text-sm text-slate-400 font-medium mb-8 leading-relaxed">{plan.desc}</p>
              
              <div className="mb-8 p-6 bg-slate-50 rounded-3xl text-left">
                <p className="text-5xl font-black text-slate-900">{plan.price}<span className="text-sm text-slate-400 font-bold ml-1">/mo</span></p>
                <p className="text-indigo-600 font-black text-sm uppercase tracking-widest mt-2">{plan.credits}</p>
              </div>

              <ul className="space-y-4 mb-10 text-left">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center text-slate-600 font-medium text-sm">
                    <svg className="w-5 h-5 mr-3 text-indigo-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                    {f}
                  </li>
                ))}
              </ul>

              <NavLink 
                to="/signup" 
                className={`w-full py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center ${plan.popular ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 hover:bg-indigo-700' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
              >
                Choose {plan.name}
              </NavLink>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-16 text-center">
        <p className="text-sm font-black text-slate-300">© 2026 AdCraftAI Engine. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Pricing;
