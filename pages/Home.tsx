
import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types.ts';
import { NavLink } from 'react-router-dom';

const VideoDemoModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(0);
  const steps = [
    {
      title: "Cloning Your Voice",
      desc: "Our neural engine scans your best writing samples to build a high-fidelity 'Linguistic Twin' that speaks exactly like you.",
      icon: "🧬",
      visual: (
        <div className="relative w-full h-full flex items-center justify-center">
           <div className="absolute inset-0 bg-indigo-500/10 rounded-full animate-pulse blur-3xl"></div>
           <div className="space-y-3 w-full max-w-xs bg-slate-800/50 p-6 rounded-2xl border border-white/10 backdrop-blur-xl">
             <div className="h-2 w-3/4 bg-indigo-400 rounded-full overflow-hidden relative">
               <div className="absolute inset-0 bg-white w-1/3 animate-[progress-line_1s_infinite]"></div>
             </div>
             <div className="h-2 w-full bg-slate-700 rounded-full"></div>
             <div className="h-2 w-1/2 bg-slate-700 rounded-full"></div>
             <div className="pt-2 text-[10px] font-mono text-indigo-300 animate-pulse">DNA SEQUENCE: SYNCED</div>
           </div>
        </div>
      )
    },
    {
      title: "Synthesizing Assets",
      desc: "Generate full ad campaigns, landing pages, and logos that stay 100% true to your brand's unique identity.",
      icon: "🧠",
      visual: (
        <div className="relative w-full h-full flex flex-col items-center justify-center p-8">
           <div className="grid grid-cols-2 gap-4 w-full h-full">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col space-y-2 animate-reveal" style={{ animationDelay: `${i * 0.1}s` }}>
                   <div className="h-3 w-1/2 bg-indigo-500/30 rounded-full"></div>
                   <div className="h-1.5 w-full bg-white/5 rounded-full"></div>
                </div>
              ))}
           </div>
        </div>
      )
    }
  ];

  useEffect(() => {
    if (!isOpen) {
      setStep(0);
      return;
    }
    const timer = setInterval(() => {
      setStep(prev => (prev + 1) % steps.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isOpen, steps.length]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-2xl animate-reveal" onClick={onClose} />
      <div className="relative w-full max-w-5xl bg-slate-900 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl border border-white/5 animate-reveal flex flex-col md:flex-row h-[85vh] md:h-[500px]">
        <div className="h-1/2 md:h-full md:flex-1 bg-slate-950 relative overflow-hidden flex items-center justify-center">
           {steps[step].visual}
        </div>
        <div className="h-1/2 md:h-full w-full md:w-[400px] p-8 md:p-16 flex flex-col justify-center relative bg-slate-900">
           <button onClick={onClose} className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white transition-colors">
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
           </button>
           <div key={step} className="animate-reveal">
              <div className="text-4xl mb-4">{steps[step].icon}</div>
              <h3 className="text-2xl md:text-3xl font-black text-white mb-4 tracking-tight">{steps[step].title}</h3>
              <p className="text-slate-400 font-medium leading-relaxed text-base md:text-lg">{steps[step].desc}</p>
           </div>
           <div className="mt-8 flex space-x-4">
              <NavLink to="/signup" className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-black text-sm text-center shadow-xl hover:bg-indigo-700 transition-all">Start Now</NavLink>
           </div>
        </div>
      </div>
    </div>
  );
};

interface HomeProps {
  user: UserProfile | null;
}

const Home: React.FC<HomeProps> = ({ user }) => {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [showVideoDemo, setShowVideoDemo] = useState(false);

  const features = [
    { title: "Voice Cloning", desc: "Our engine scans your writing samples to build an AI twin that writes exactly like you—quirks and all.", icon: "🧬" },
    { title: "Visual DNA", desc: "Generate professional logos and brand imagery that automatically match your aesthetic and color palette.", icon: "🎨" },
    { title: "Sales Architect", desc: "Build high-converting sales pages based on frameworks that have generated millions in revenue.", icon: "📐" },
    { title: "Ad Generator", desc: "Create high-performing ads for Facebook, TikTok, and Google that stop the scroll instantly.", icon: "🚀" },
    { title: "Identity Vault", desc: "Securely store multiple brand personas. Switch between client voices with a single click.", icon: "🔒" },
    { title: "Neural Refine", desc: "Not quite right? Just tell the AI what to change, and it refines your assets in real-time.", icon: "🧠" }
  ];

  const motionAssets = [
    { title: "Logo Synthesis", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80" },
    { title: "Ad Creative", url: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=400&q=80" },
    { title: "Visual Texture", url: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=400&q=80" },
    { title: "Abstract Concept", url: "https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?auto=format&fit=crop&w=400&q=80" }
  ];

  return (
    <div className="min-h-screen bg-white selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-6 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <NavLink to="/" className="flex items-center space-x-2 group">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-lg md:text-xl text-white italic transition-transform group-hover:rotate-6">N</div>
          <span className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter">Neuro<span className="text-indigo-600">Twin</span></span>
        </NavLink>
        <div className="flex items-center space-x-4">
          {user ? (
            <NavLink to="/dashboard" className="bg-indigo-600 text-white px-5 py-2.5 rounded-full text-xs font-black shadow-lg">Dashboard</NavLink>
          ) : (
            <>
              <NavLink to="/login" className="hidden sm:block text-slate-900 font-black text-sm hover:text-indigo-600">Login</NavLink>
              <NavLink to="/signup" className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-xs font-black shadow-lg hover:bg-indigo-600">Get Started</NavLink>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="motion-bg-hero min-h-[85vh] flex flex-col items-center justify-center text-center px-4 py-20">
        <div className="blob hidden md:block" style={{ top: '-10%', left: '-5%' }}></div>
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 animate-reveal">
            <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></span>
            <span className="text-indigo-900">Experience Identity-First AI</span>
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-[7rem] font-black text-slate-900 tracking-tightest mb-8 leading-[1] md:leading-[0.9] animate-reveal">
            Your Brand Has a Soul.<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Now It Has a Twin.</span>
          </h1>
          <p className="text-lg md:text-2xl text-slate-500 max-w-3xl mx-auto mb-10 leading-relaxed font-medium animate-reveal delay-100">
            Generic AI sounds like everyone else. NeuroTwin clones your unique creative voice to generate high-converting marketing that actually sounds like <span className="text-slate-900 font-bold underline decoration-indigo-500/30 decoration-4">you.</span>
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 animate-reveal delay-200">
            <NavLink to="/signup" className="w-full sm:w-auto px-10 py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-xl hover:bg-indigo-700 hover:scale-105 transition-all text-lg">Start Free Trial</NavLink>
            <button onClick={() => setShowVideoDemo(true)} className="w-full sm:w-auto px-10 py-5 bg-white text-slate-900 border-2 border-slate-100 font-black rounded-2xl hover:border-indigo-100 transition-all text-lg flex items-center justify-center group">
              See the Magic
              <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center ml-3 transition-transform group-hover:scale-110">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="w-2.5 h-2.5 text-white ml-0.5"><polygon points="5 3 19 12 5 21 5 3" /></svg>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Pain & Solution Section */}
      <section className="py-20 md:py-32 bg-slate-900 text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center mb-16 md:mb-24">
             <h2 className="text-xs font-black text-indigo-400 uppercase tracking-[0.4em] mb-4">The Evolution</h2>
             <h3 className="text-3xl md:text-5xl font-black tracking-tight">Generic AI vs. <span className="text-indigo-400 italic">NeuroTwin.</span></h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10 rounded-3xl md:rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
            {/* PAIN */}
            <div className="p-8 md:p-16 bg-slate-900 space-y-10">
               <div className="flex items-center space-x-3 text-red-500">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                  <span className="text-[10px] font-black uppercase tracking-widest">The "Generic AI" Problem</span>
               </div>
               <div className="space-y-8">
                  {[
                    { t: "The Bot-Radar", d: "Customers ignore content that feels automated or generic." },
                    { t: "Soulless Copy", d: "Standard models miss your brand's unique humor and energy." },
                    { t: "No Visual DNA", d: "Stock-looking graphics that don't match your existing aesthetic." }
                  ].map((item, i) => (
                    <div key={i}>
                       <h4 className="text-xl font-black mb-1">{item.t}</h4>
                       <p className="text-slate-500 font-medium leading-relaxed">{item.d}</p>
                    </div>
                  ))}
               </div>
            </div>

            {/* SOLUTION */}
            <div className="p-8 md:p-16 bg-indigo-600 space-y-10">
               <div className="flex items-center space-x-3 text-white">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5"><circle cx="12" cy="12" r="10"/><polyline points="16 12 12 8 8 12"/><line x1="12" y1="16" x2="12" y2="8"/></svg>
                  <span className="text-[10px] font-black uppercase tracking-widest">The NeuroTwin Solution</span>
               </div>
               <div className="space-y-8">
                  {[
                    { t: "Identity Cloning", d: "Your Twin mimics your specific vocabulary and tone with 98% accuracy." },
                    { t: "Conversion Guardrails", d: "Assets are built on frameworks designed to actually close the sale." },
                    { t: "Visual Synergy", d: "Logo and imagery generation that reflects your true visual DNA." }
                  ].map((item, i) => (
                    <div key={i}>
                       <h4 className="text-xl font-black mb-1">{item.t}</h4>
                       <p className="text-indigo-100 font-medium leading-relaxed">{item.d}</p>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Explanation */}
      <section id="features" className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16 md:mb-24">
             <h2 className="text-xs font-black text-indigo-600 uppercase tracking-[0.4em] mb-4">Precision Instruments</h2>
             <h3 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Scale Your <span className="italic">Creative Genius.</span></h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
             {features.map((f, i) => (
               <div key={i} className="p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] bg-slate-50 border border-slate-100 hover:border-indigo-400 hover:shadow-2xl transition-all group flex flex-col">
                  <div className="text-4xl mb-6 group-hover:scale-110 transition-transform inline-block">{f.icon}</div>
                  <h4 className="text-xl md:text-2xl font-black text-slate-900 mb-4">{f.title}</h4>
                  <p className="text-slate-500 font-medium leading-relaxed mb-6 flex-1">{f.desc}</p>
                  <NavLink to="/signup" className="text-[10px] font-black text-indigo-600 uppercase tracking-widest border-b-2 border-indigo-100 pb-1 w-fit group-hover:border-indigo-600 transition-colors">Launch Module →</NavLink>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Introducing Section */}
      <section className="py-20 md:py-32 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="relative order-2 lg:order-1">
                 <div className="bg-slate-900 rounded-3xl md:rounded-[3rem] p-8 md:p-12 text-white shadow-2xl">
                    <h4 className="text-2xl font-black mb-8 flex items-center">
                      <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center mr-3 font-black text-xs italic">N</div>
                      Meet Your Clone
                    </h4>
                    <div className="space-y-6">
                       <div className="p-5 bg-white/5 border border-white/10 rounded-2xl animate-reveal">
                          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Synthesizing Voice...</p>
                          <p className="text-sm text-slate-300 font-mono italic">"The core problem isn't traffic. It's the soul-crushing boredom of average marketing..."</p>
                       </div>
                       <div className="p-5 bg-white/5 border border-white/10 rounded-2xl">
                          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Status</p>
                          <p className="text-sm text-emerald-400 font-black">98.4% Match to Founder DNA</p>
                       </div>
                    </div>
                 </div>
              </div>
              <div className="space-y-8 order-1 lg:order-2 text-center lg:text-left">
                 <h2 className="text-xs font-black text-indigo-600 uppercase tracking-[0.4em]">The Engine</h2>
                 <h3 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">Introducing the <br /><span className="text-indigo-600">NeuroTwin Lab.</span></h3>
                 <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed">
                   Stop treating AI like a chatbot and start treating it like a strategic partner. Our Identity Engine allows you to automate high-level marketing without losing the human spark that built your brand.
                 </p>
                 <NavLink to="/signup" className="inline-block px-8 py-4 bg-slate-900 text-white font-black rounded-xl hover:bg-indigo-600 transition-colors">Enter the Lab</NavLink>
              </div>
           </div>
        </div>
      </section>

      {/* Motion Gallery */}
      <section className="py-20 md:py-32 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16 md:mb-24">
             <h2 className="text-xs font-black text-indigo-600 uppercase tracking-[0.4em] mb-4">Visual Synthesis</h2>
             <h3 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Behold the Gallery of <span className="italic">Possibilities.</span></h3>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
             {motionAssets.map((asset, i) => (
               <div key={i} className="group relative aspect-[3/4] rounded-2xl md:rounded-[2rem] overflow-hidden bg-slate-100 shadow-lg">
                  <img src={asset.url} alt={asset.title} className="w-full h-full object-cover transition-transform duration-[8s] group-hover:scale-125 group-hover:rotate-2" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent opacity-60"></div>
                  <div className="absolute bottom-6 left-6">
                     <p className="text-white font-black text-sm md:text-lg">{asset.title}</p>
                     <div className="h-0.5 w-0 bg-indigo-500 group-hover:w-full transition-all duration-500 rounded-full mt-2"></div>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section id="testimonials" className="py-20 md:py-32 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
           <div className="text-center mb-16 md:mb-24">
              <h2 className="text-xs font-black text-indigo-600 uppercase tracking-[0.4em] mb-4">Wall of Love</h2>
              <h3 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Built by Founders, <br />for Founders.</h3>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { n: "Marcus Thorne", r: "CEO, GrowthMetric", c: "NeuroTwin is the first AI that doesn't sound like a bot. My ad CTR jumped by 40% in two weeks.", a: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus" },
                { n: "Sarah Chen", r: "Founder, Aura Skincare", c: "indistinguishable from my own writing. I spent $5k/mo on copywriters before this. Now I spend $79.", a: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
                { n: "David V.", r: "Agency Director", c: "Managing 12 different brand voices was a nightmare. Now it's a breeze with the Identity Vault.", a: "https://api.dicebear.com/7.x/avataaars/svg?seed=David" }
              ].map((t, i) => (
                <div key={i} className="bg-white p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] border border-slate-100 shadow-sm flex flex-col">
                   <p className="text-lg text-slate-600 font-medium italic mb-8 flex-1">"{t.c}"</p>
                   <div className="flex items-center space-x-4">
                      <img src={t.a} className="w-12 h-12 rounded-full border-2 border-indigo-50" alt={t.n} />
                      <div>
                         <p className="font-black text-slate-900 text-sm">{t.n}</p>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.r}</p>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-16">
             <h3 className="text-3xl font-black text-slate-900 tracking-tight">Frequent Queries.</h3>
          </div>
          <div className="space-y-4">
             {[
               { q: "Is this just a ChatGPT wrapper?", a: "No. While we utilize advanced LLMs, our proprietary 'Identity Engine' layer ensures the output overrides generic AI patterns with your specific linguistic DNA." },
               { q: "How many writing samples do I need?", a: "You can start with just 3-5 high-performing samples. Our engine analyzes syntax, rhythm, and vocabulary to extrapolate your unique voice." },
               { q: "Can I use this for client work?", a: "Absolutely. Our Agency plan allows you to manage multiple brand identities separately, keeping each client's 'Twin' in their own vault." },
               { q: "Is my data secure?", a: "Security is foundational. Your writing samples and brand data are encrypted and never used to train global AI models. Your Clone belongs only to you." }
             ].map((item, i) => (
               <div key={i} className="bg-slate-50 rounded-2xl overflow-hidden transition-all border border-slate-100">
                  <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} className="w-full px-8 py-6 text-left flex justify-between items-center group">
                    <span className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{item.q}</span>
                    <span className={`text-xl font-black transition-transform duration-300 ${faqOpen === i ? 'rotate-45 text-indigo-600' : ''}`}>+</span>
                  </button>
                  {faqOpen === i && (
                    <div className="px-8 pb-8 text-slate-500 font-medium leading-relaxed animate-reveal">
                      {item.a}
                    </div>
                  )}
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-32 bg-indigo-600 relative overflow-hidden text-center text-white">
        <div className="max-w-4xl mx-auto px-4 relative z-10">
           <h3 className="text-4xl md:text-7xl font-black tracking-tight mb-10 leading-[1.1] md:leading-[0.9]">Stop guessing. <br />Start Cloning.</h3>
           <p className="text-xl text-indigo-100 font-medium mb-12 max-w-2xl mx-auto">Join thousands of founders who have reclaimed their time and multiplied their ROI with NeuroTwin.</p>
           <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <NavLink to="/signup" className="w-full sm:w-auto px-12 py-5 bg-white text-indigo-600 font-black rounded-2xl shadow-xl hover:bg-indigo-50 transition-all text-xl">Create Your Twin</NavLink>
              <NavLink to="/pricing" className="w-full sm:w-auto px-12 py-5 bg-indigo-700 text-white font-black rounded-2xl hover:bg-indigo-800 transition-all text-xl border border-white/10">View Plans</NavLink>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
           <NavLink to="/" className="flex items-center justify-center space-x-2 mb-8">
             <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center font-bold text-white italic">N</div>
             <span className="text-xl font-black text-slate-900 tracking-tighter">NeuroTwin</span>
           </NavLink>
           <p className="text-sm font-black text-slate-300 uppercase tracking-widest">© 2026 NeuroTwin Neural Engine. Scale with Soul.</p>
        </div>
      </footer>

      {/* Video Demo */}
      <VideoDemoModal isOpen={showVideoDemo} onClose={() => setShowVideoDemo(false)} />
    </div>
  );
};

export default Home;
