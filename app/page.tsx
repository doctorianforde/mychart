'use client'

import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '@/src/lib/firebase';
import { login, loginWithGoogle, register } from '@/src/lib/authService';

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
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegistering) {
        if (role === 'staff' && staffCode !== 'ACC20252026') {
          setError('Invalid Staff Code');
          return;
        }
        await register(email, password, role);
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

  if (loading) return <div className="p-10">Loading MyChart...</div>;

  if (!user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
        <div className="w-full max-w-md space-y-8">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">MyChart Portal</h1>
          <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-gray-900">
            {isRegistering ? 'Create an account' : 'Sign in to your account'}
          </h2>
          
          {error && <p className="text-red-500 text-center">{error}</p>}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="-space-y-px rounded-md shadow-sm">
              <input
                type="email"
                required
                className="relative block w-full rounded-t-md border-0 p-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                required
                className="relative block w-full rounded-b-md border-0 p-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {isRegistering && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">I am a:</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 p-2 text-base ring-1 ring-inset ring-gray-300 focus:outline-none sm:text-sm"
                  >
                    <option value="patient">Patient</option>
                    <option value="staff">Staff</option>
                  </select>
                </div>

                {role === 'staff' && (
                  <input
                    type="text"
                    placeholder="Staff Secret Code"
                    value={staffCode}
                    onChange={(e) => setStaffCode(e.target.value)}
                    className="relative block w-full rounded-md border-0 p-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                )}
              </div>
            )}

            <button type="submit" className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              {isRegistering ? 'Register' : 'Sign in'}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Google
          </button>

          <div className="text-center">
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              {isRegistering ? 'Already have an account? Sign in' : 'Need an account? Register'}
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-white">
      <div className="w-full max-w-4xl flex justify-between items-center mb-12 border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-800">Patient Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{user.email}</span>
          <button 
            onClick={() => signOut(auth)}
            className="text-sm text-red-600 hover:underline font-medium"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="w-full max-w-4xl grid gap-6">
        {/* Feature Placeholder */}
        <div className="p-6 border rounded-lg shadow-sm bg-gray-50">
          <h2 className="text-xl font-semibold mb-2">Medical Records</h2>
          {records.length === 0 ? (
            <p className="text-gray-500">No records found.</p>
          ) : (
            <ul className="space-y-2">
              {records.map((r) => (
                <li key={r.id} className="p-2 bg-white rounded border">{JSON.stringify(r)}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
