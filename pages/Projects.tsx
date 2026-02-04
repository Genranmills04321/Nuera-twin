
import React from 'react';
import { Project } from '../types';
import { NavLink } from 'react-router-dom';

interface ProjectsProps {
  projects: Project[];
}

const Projects: React.FC<ProjectsProps> = ({ projects }) => {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Your Projects</h1>
          <p className="text-slate-500">Full-scale pages and sites built with our creators.</p>
        </div>
        <div className="flex space-x-3">
           <NavLink to="/dashboard/build/sales-page" className="px-4 py-2 bg-white border border-slate-200 text-slate-900 font-bold rounded-lg hover:border-indigo-400 transition-all text-sm">
             + New Sales Page
           </NavLink>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-20 text-center">
          <div className="w-20 h-20 bg-indigo-50 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-6">
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">No projects yet</h3>
          <p className="text-slate-500 max-w-sm mx-auto mt-2">Use our guided builders to create full sales pages, landing pages, and agency websites.</p>
          <div className="mt-8 flex justify-center space-x-4">
            <NavLink to="/dashboard/build/sales-page" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all">
              Build Sales Page
            </NavLink>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
               <div className="h-32 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10"></div>
                  <div className="text-indigo-600 opacity-20 group-hover:opacity-40 transition-opacity">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-20 h-20"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
                  </div>
                  <span className="absolute top-3 right-3 px-2 py-1 bg-white text-[10px] font-black uppercase rounded shadow-sm text-indigo-600">
                    {project.projectType.replace('_', ' ')}
                  </span>
               </div>
               <div className="p-6">
                  <h3 className="font-black text-slate-900 text-lg mb-1">{project.title}</h3>
                  <p className="text-xs text-slate-400 mb-4">Last edited: {new Date(project.updatedAt).toLocaleDateString()}</p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                    <span className="text-xs font-bold text-slate-600">{project.sections.length} Sections</span>
                    <button className="text-indigo-600 text-sm font-bold hover:underline flex items-center">
                      Open Builder
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 ml-1"><polyline points="9 18 15 12 9 6" /></svg>
                    </button>
                  </div>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
