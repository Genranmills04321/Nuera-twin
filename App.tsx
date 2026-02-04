
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { auth, db, mockOnAuthStateChanged, mockSignOut, mockGetDoc, mockSetDoc, mockDoc } from './lib/firebase.ts';
import { UserProfile, Generation, Project } from './types.ts';
import Sidebar from './components/Sidebar.tsx';
import Navbar from './components/Navbar.tsx';

// Pages
import Home from './pages/Home.tsx';
import Login from './pages/Login.tsx';
import Signup from './pages/Signup.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Generate from './pages/Generate.tsx';
import History from './pages/History.tsx';
import Projects from './pages/Projects.tsx';
import Library from './pages/Library.tsx';
import Settings from './pages/Settings.tsx';
import Billing from './pages/Billing.tsx';
import About from './pages/About.tsx';
import Contact from './pages/Contact.tsx';
import Pricing from './pages/Pricing.tsx';
import Profile from './pages/Profile.tsx';

// Builders
import SalesPageBuilder from './pages/builders/SalesPageBuilder.tsx';
import LandingPageBuilder from './pages/builders/LandingPageBuilder.tsx';
import AgencySiteBuilder from './pages/builders/AgencySiteBuilder.tsx';

interface ProtectedRouteProps {
  user: UserProfile | null;
  loading: boolean;
  logout: () => void;
  children: React.ReactNode;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ user, loading, logout, children, sidebarOpen, setSidebarOpen }) => {
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest text-center">Synchronizing Secure Session...</p>
      </div>
    </div>
  );
  
  if (!user) return <Navigate to="/login" replace />;
  
  return (
    <div className="flex min-h-screen bg-gray-50 relative overflow-x-hidden">
      <Sidebar user={user} logout={logout} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar user={user} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  // Auth & Data Hydration
  useEffect(() => {
    const unsubscribe = mockOnAuthStateChanged(auth, async (firebaseUser: any) => {
      setLoading(true);
      if (firebaseUser) {
        try {
          const userRef = mockDoc(db, 'users', firebaseUser.uid);
          const userSnap = await mockGetDoc(userRef);
          
          let profile: UserProfile;
          if (userSnap.exists()) {
            profile = userSnap.data() as UserProfile;
          } else {
            profile = {
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || (firebaseUser.isAnonymous ? 'Guest User' : 'Growth Architect'),
              email: firebaseUser.email || 'anonymous@user.com',
              businessName: 'My Brand',
              creditsRemaining: 100,
              createdAt: new Date().toISOString(),
            };
            await mockSetDoc(userRef, profile);
          }
          setUser(profile);

          const savedGens = localStorage.getItem(`gens_${firebaseUser.uid}`);
          const savedProjs = localStorage.getItem(`projs_${firebaseUser.uid}`);
          
          if (savedGens) setGenerations(JSON.parse(savedGens));
          else setGenerations([]);

          if (savedProjs) setProjects(JSON.parse(savedProjs));
          else setProjects([]);

        } catch (error) {
          console.error("Data Sync Error:", error);
        }
      } else {
        setUser(null);
        setGenerations([]);
        setProjects([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`gens_${user.uid}`, JSON.stringify(generations));
      localStorage.setItem(`projs_${user.uid}`, JSON.stringify(projects));
      
      const userRef = mockDoc(db, 'users', user.uid);
      mockSetDoc(userRef, user);
    }
  }, [generations, projects, user]);

  const handleLogout = async () => {
    await mockSignOut(auth).catch(() => {});
    setUser(null);
    setSidebarOpen(false);
  };

  const deductCredits = (amount: number) => {
    if (user) {
      setUser(prev => prev ? { ...prev, creditsRemaining: Math.max(0, prev.creditsRemaining - amount) } : null);
    }
  };

  const addGeneration = (gen: Generation) => {
    setGenerations(prev => [gen, ...prev]);
    deductCredits(10);
  };

  const addProject = (project: Project) => {
    setProjects(prev => {
      const existingIdx = prev.findIndex(p => p.id === project.id);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx] = project;
        return updated;
      }
      return [project, ...prev];
    });
  };

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/about" element={<About user={user} />} />
        <Route path="/contact" element={<Contact user={user} />} />
        <Route path="/pricing" element={<Pricing user={user} />} />
        
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup />} />
        
        <Route path="/dashboard" element={<ProtectedRoute user={user} loading={loading} logout={handleLogout} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}><Dashboard user={user!} generations={generations} projects={projects} /></ProtectedRoute>} />
        <Route path="/dashboard/generate" element={<ProtectedRoute user={user} loading={loading} logout={handleLogout} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}><Generate user={user!} onGenerate={addGeneration} /></ProtectedRoute>} />
        <Route path="/dashboard/history" element={<ProtectedRoute user={user} loading={loading} logout={handleLogout} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}><History generations={generations} onDelete={(id) => setGenerations(prev => prev.filter(g => g.id !== id))} /></ProtectedRoute>} />
        <Route path="/dashboard/projects" element={<ProtectedRoute user={user} loading={loading} logout={handleLogout} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}><Projects projects={projects} /></ProtectedRoute>} />
        <Route path="/dashboard/library" element={<ProtectedRoute user={user} loading={loading} logout={handleLogout} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}><Library user={user!} projects={projects} onSaveProject={addProject} /></ProtectedRoute>} />
        <Route path="/dashboard/settings" element={<ProtectedRoute user={user} loading={loading} logout={handleLogout} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}><Settings user={user!} onUpdate={setUser} /></ProtectedRoute>} />
        <Route path="/dashboard/billing" element={<ProtectedRoute user={user} loading={loading} logout={handleLogout} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}><Billing user={user!} /></ProtectedRoute>} />
        <Route path="/dashboard/profile" element={<ProtectedRoute user={user} loading={loading} logout={handleLogout} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}><Profile user={user!} generations={generations} projects={projects} /></ProtectedRoute>} />

        {/* Builder Routes */}
        <Route path="/dashboard/build/sales-page" element={<ProtectedRoute user={user} loading={loading} logout={handleLogout} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}><SalesPageBuilder user={user!} onSave={addProject} deductCredits={deductCredits} /></ProtectedRoute>} />
        <Route path="/dashboard/build/sales-page/:templateId" element={<ProtectedRoute user={user} loading={loading} logout={handleLogout} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}><SalesPageBuilder user={user!} onSave={addProject} deductCredits={deductCredits} /></ProtectedRoute>} />
        
        <Route path="/dashboard/build/landing-page" element={<ProtectedRoute user={user} loading={loading} logout={handleLogout} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}><LandingPageBuilder user={user!} onSave={addProject} deductCredits={deductCredits} /></ProtectedRoute>} />
        <Route path="/dashboard/build/landing-page/:templateId" element={<ProtectedRoute user={user} loading={loading} logout={handleLogout} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}><LandingPageBuilder user={user!} onSave={addProject} deductCredits={deductCredits} /></ProtectedRoute>} />
        
        <Route path="/dashboard/build/agency-site" element={<ProtectedRoute user={user} loading={loading} logout={handleLogout} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}><AgencySiteBuilder user={user!} onSave={addProject} deductCredits={deductCredits} /></ProtectedRoute>} />
        <Route path="/dashboard/build/agency-site/:templateId" element={<ProtectedRoute user={user} loading={loading} logout={handleLogout} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}><AgencySiteBuilder user={user!} onSave={addProject} deductCredits={deductCredits} /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
