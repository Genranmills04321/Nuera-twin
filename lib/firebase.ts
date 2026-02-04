
import { initializeApp, getApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, Auth, User } from "firebase/auth";
import { getFirestore, Firestore, doc, getDoc, setDoc } from "firebase/firestore";

const key = process.env.API_KEY;

const firebaseConfig = {
  apiKey: key,
  authDomain: "adcraft-ai.firebaseapp.com",
  projectId: "adcraft-ai",
  storageBucket: "adcraft-ai.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

// --- Mock Implementation for Sandbox Environment ---
class MockAuth {
  private listeners: ((user: any) => void)[] = [];
  private currentUser: any = null;

  constructor() {
    const savedUser = localStorage.getItem('adcraft_mock_user');
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
    }
  }

  onAuthStateChanged(callback: (user: any) => void) {
    this.listeners.push(callback);
    setTimeout(() => callback(this.currentUser), 0);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  async signInWithPopup() {
    this.currentUser = {
      uid: 'mock-user-123',
      displayName: 'Growth Architect',
      email: 'demo@adcraftai.com',
      photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    };
    localStorage.setItem('adcraft_mock_user', JSON.stringify(this.currentUser));
    this.notify();
    return { user: this.currentUser };
  }

  async signInAnonymously() {
    this.currentUser = {
      uid: 'guest-' + Math.random().toString(36).substr(2, 9),
      displayName: 'Guest User',
      email: 'guest@adcraftai.com',
      isAnonymous: true
    };
    localStorage.setItem('adcraft_mock_user', JSON.stringify(this.currentUser));
    this.notify();
    return { user: this.currentUser };
  }

  async signOut() {
    this.currentUser = null;
    localStorage.removeItem('adcraft_mock_user');
    this.notify();
  }

  private notify() {
    this.listeners.forEach(l => l(this.currentUser));
  }
}

class MockFirestore {
  async getDoc(docRef: any) {
    const data = localStorage.getItem(`fs_${docRef.path}`);
    return {
      exists: () => !!data,
      data: () => data ? JSON.parse(data) : null
    };
  }

  async setDoc(docRef: any, data: any) {
    localStorage.setItem(`fs_${docRef.path}`, JSON.stringify(data));
  }

  doc(_db: any, collection: string, id: string) {
    return { path: `${collection}/${id}` };
  }
}

// --- Initialization Logic ---
let authInstance: any;
let dbInstance: any;
let isMock = false;

try {
  // We check if the key is obviously a placeholder or if it fails during a quick init test
  if (!key || key.includes("API_KEY")) throw new Error("Invalid Key");
  
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  authInstance = getAuth(app);
  dbInstance = getFirestore(app);
  console.log("Firebase initialized successfully.");
} catch (e) {
  console.warn("Firebase Auth failed (likely invalid API key). Falling back to Local Mock Auth.");
  isMock = true;
  authInstance = new MockAuth();
  dbInstance = new MockFirestore();
}

// Custom wrapper to handle both real and mock
export const auth = authInstance;
export const db = dbInstance;
export const googleProvider = new GoogleAuthProvider();

// Export wrapped functions to ensure compatibility
export const mockSignInWithPopup = async (authObj: any, provider: any) => {
  if (isMock) return authObj.signInWithPopup();
  return signInWithPopup(authObj, provider);
};

export const mockSignOut = async (authObj: any) => {
  if (isMock) return authObj.signOut();
  return signOut(authObj);
};

export const mockOnAuthStateChanged = (authObj: any, callback: any) => {
  if (isMock) return authObj.onAuthStateChanged(callback);
  return onAuthStateChanged(authObj, callback);
};

export const mockGetDoc = async (docRef: any) => {
  if (isMock) return dbInstance.getDoc(docRef);
  return getDoc(docRef);
};

export const mockSetDoc = async (docRef: any, data: any) => {
  if (isMock) return dbInstance.setDoc(docRef, data);
  return setDoc(docRef, data);
};

export const mockDoc = (dbObj: any, collection: string, id: string) => {
  if (isMock) return dbInstance.doc(dbObj, collection, id);
  return doc(dbObj, collection, id);
};
