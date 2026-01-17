'use client'

import { useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, User } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '@/src/lib/firebase';

export default function MyChartDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
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
        <h1 className="text-4xl font-bold mb-8 text-gray-900">MyChart Portal</h1>
        <button 
          onClick={handleLogin}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
        >
          Sign in with Google
        </button>
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
