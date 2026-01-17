'use client'

import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '@/src/lib/firebase';
import { login, loginWithGoogle, register, uploadProfilePicture } from '@/src/lib/authService';

export default function MyChartDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Login Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [role, setRole] = useState('patient');
  const [staffCode, setStaffCode] = useState('');
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegistering) {
        if (role === 'staff' && staffCode !== 'Medicaldoctor2026!') {
          setError('Invalid Staff Code');
          return;
        }
        const user = await register(email, password, role);
        if (user && profilePic) {
          await uploadProfilePicture(profilePic, user.uid);
        }
      } else {
        await login(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed.');
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      await loginWithGoogle();
    } catch (err) {
      setError('Failed to login with Google.');
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // User is logged in, try to fetch data
        try {
          const q = query(collection(db, "records"), where("patientId", "==", currentUser.uid));
          const querySnapshot = await getDocs(q);
          const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setRecords(data);
        } catch (error) {
          console.error("Error fetching records:", error);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div className="p-10">Loading Alera Care...</div>;

  if (!user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-50">
        <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg border border-slate-100">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Alera Care Collective Portal</h1>
            <h2 className="mt-2 text-sm text-slate-600">
              {isRegistering ? 'Create your new account' : 'Sign in to access your records'}
            </h2>
          </div>
          
          {error && <p className="text-red-500 text-center">{error}</p>}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email address</label>
                <input
                  id="email"
                  type="email"
                  required
                  className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
                <input
                  id="password"
                  type="password"
                  required
                  className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {isRegistering && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">I am a:</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border"
                  >
                    <option value="patient">Patient</option>
                    <option value="staff">Staff</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#4A3A33] font-['Lato']">Profile Picture</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProfilePic(e.target.files ? e.target.files[0] : null)}
                    className="mt-1 block w-full text-sm text-[#4A3A33] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#EFE7DD] file:text-[#4A3A33] hover:file:bg-[#D9A68A]/20"
                  />
                </div>

                {role === 'staff' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Staff Access Code</label>
                    <input
                      type="password"
                      placeholder="Enter code"
                      value={staffCode}
                      onChange={(e) => setStaffCode(e.target.value)}
                      className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border"
                    />
                  </div>
                )}
              </div>
            )}

            <button type="submit" className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
              {isRegistering ? 'Register' : 'Sign in'}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-slate-500">Or continue with</span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full flex justify-center items-center gap-3 py-2.5 px-4 border border-slate-300 rounded-lg shadow-sm bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors"
          >
            Google
            <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Sign in with Google
          </button>

          <div className="text-center">
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-sm font-medium text-[#8AAB88] hover:text-[#4A3A33] transition-colors font-['Lato']"
            >
              {isRegistering ? 'Already have an account? Sign in' : 'Need an account? Register'}
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-[#EFE7DD]">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Playfair+Display:wght@400;700&display=swap');
      `}} />
      <div className="w-full max-w-4xl flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm border border-[#D9A68A]/20">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-[#4A3A33] rounded-full flex items-center justify-center">
            <span className="text-[#EFE7DD] font-bold text-lg font-['Playfair_Display']">A</span>
          </div>
          <h1 className="text-2xl font-bold text-[#4A3A33] font-['Playfair_Display']">Alera Care Collective</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-[#4A3A33] font-medium font-['Lato']">{user.email}</span>
          <button 
            onClick={() => signOut(auth)}
            className="px-4 py-2 text-sm text-[#D9A68A] hover:bg-[#D9A68A]/10 rounded-lg transition-colors font-medium border border-[#D9A68A] font-['Lato']"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="w-full max-w-4xl grid gap-6">
        {/* Feature Placeholder */}
        <div className="p-6 border border-[#A8C0CE]/30 rounded-xl shadow-sm bg-white">
          <h2 className="text-xl font-semibold mb-4 text-[#4A3A33] font-['Playfair_Display']">Medical Records</h2>
          {records.length === 0 ? (
            <div className="text-center py-10 bg-[#EFE7DD]/30 rounded-lg border border-dashed border-[#A8C0CE]">
              <p className="text-[#4A3A33]/70 font-['Lato']">No records found.</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {records.map((r) => (
                <li key={r.id} className="p-4 bg-white rounded-lg border border-[#A8C0CE]/30 hover:border-[#8AAB88] transition-colors shadow-sm text-[#4A3A33] font-['Lato']">
                  {JSON.stringify(r)}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
