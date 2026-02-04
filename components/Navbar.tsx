
import React from 'react';
import { NavLink } from 'react-router-dom';
import { UserProfile } from '../types.ts';

interface NavbarProps {
  user: UserProfile;
  onMenuClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onMenuClick }) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 glass-effect sticky top-0 z-30">
      <div className="flex items-center">
        <button 
          className="md:hidden p-2 mr-2 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 rounded-lg transition-all active:scale-95 group"
          onClick={onMenuClick}
          aria-label="Open Menu"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6 transition-transform group-hover:scale-110">
            <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <NavLink to="/" className="flex items-center md:hidden group">
          <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center font-bold text-white italic transition-transform group-hover:scale-110 shadow-lg shadow-indigo-600/20">N</div>
          <span className="ml-2 font-black text-slate-900 tracking-tighter group-hover:text-indigo-600 transition-colors">NeuroTwin</span>
        </NavLink>
        <div className="hidden md:block">
          <h2 className="text-sm font-medium text-slate-500">Welcome back, <span className="text-slate-900 font-bold">{user.name}</span></h2>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <button className="p-2 text-slate-400 hover:text-indigo-600 relative transition-all active:scale-90 group">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 transition-transform group-hover:scale-110 group-hover:rotate-12">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full border border-white"></span>
        </button>
        
        <NavLink to="/dashboard/profile" className="flex items-center space-x-2 md:space-x-3 border-l border-slate-200 pl-3 md:pl-4 group cursor-pointer">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-slate-900 truncate max-w-[100px] group-hover:text-indigo-600 transition-colors">{user.businessName || 'My Brand'}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-[10px] font-black border-2 border-white shadow-sm ring-1 ring-slate-100 transition-all group-hover:scale-110 group-hover:ring-indigo-300 group-hover:shadow-md">
            {user.name.charAt(0)}
          </div>
        </NavLink>
      </div>
    </header>
  );
};

export default Navbar;
