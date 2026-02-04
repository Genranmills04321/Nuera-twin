
import React from 'react';
import { UserProfile } from '../types';

interface BillingProps {
  user: UserProfile;
}

const Billing: React.FC<BillingProps> = ({ user }) => {
  const plans = [
    { name: 'Starter', price: '$29', credits: '100/mo', features: ['All generation tools', 'Standard support', 'History access'] },
    { name: 'Professional', price: '$79', credits: '500/mo', features: ['Priority generation', 'Advanced builders', 'Brand presets', 'Email support'], popular: true },
    { name: 'Agency', price: '$199', credits: 'Unlimited*', features: ['White-label results', 'Team access', 'API access', 'Dedicated manager'] },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Simple, Transparent Pricing</h1>
        <p className="text-slate-500 text-lg">Choose the plan that fits your business growth.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div key={plan.name} className={`bg-white rounded-3xl p-8 border ${plan.popular ? 'border-indigo-500 ring-4 ring-indigo-500/10 shadow-2xl relative' : 'border-slate-200 shadow-sm'}`}>
            {plan.popular && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">Most Popular</span>
            )}
            <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
            <div className="flex items-baseline mb-6">
              <span className="text-4xl font-black text-slate-900">{plan.price}</span>
              <span className="text-slate-400 ml-1 text-sm">/month</span>
            </div>
            <div className="flex items-center text-indigo-600 font-bold text-sm mb-6 bg-indigo-50 px-3 py-1.5 rounded-lg w-fit">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4 mr-2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>
              {plan.credits}
            </div>
            <ul className="space-y-4 mb-8">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center text-slate-600 text-sm">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4 mr-3 text-green-500"><polyline points="20 6 9 17 4 12" /></svg>
                  {feature}
                </li>
              ))}
            </ul>
            <button className={`w-full py-3 font-bold rounded-xl transition-all ${plan.popular ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}>
              {plan.name === 'Professional' ? 'Current Plan' : 'Select Plan'}
            </button>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 rounded-3xl p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <h4 className="text-2xl font-bold mb-2">Need a custom enterprise solution?</h4>
          <p className="text-slate-400">We offer high-volume generation for agencies managing 50+ clients.</p>
        </div>
        <button className="px-10 py-4 bg-white text-slate-900 font-black rounded-xl hover:bg-slate-100 transition-all whitespace-nowrap">
          Contact Sales
        </button>
      </div>
    </div>
  );
};

export default Billing;
