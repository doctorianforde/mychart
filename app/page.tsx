'use client'

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { collection, query, where, getDocs, addDoc, getDoc, doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/src/lib/firebase';
import { login, loginWithGoogle, register, uploadProfilePicture } from '@/src/lib/authService';

export default function MyChartDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Login Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [role, setRole] = useState('patient');
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [comorbidities, setComorbidities] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [staffCode, setStaffCode] = useState('');
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Diabetes Log State
  const [logDate, setLogDate] = useState('');
  const [logTime, setLogTime] = useState('');
  const [glucoseValue, setGlucoseValue] = useState('');
  const [lastMealTime, setLastMealTime] = useState('');
  const [logMessage, setLogMessage] = useState('');

  // Hypertension Log State
  const [readingSite, setReadingSite] = useState('left_arm');
  const [pulse, setPulse] = useState('');
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [hypertensionLogMessage, setHypertensionLogMessage] = useState('');

  // Prescription State
  const [prescriptionText, setPrescriptionText] = useState('');

  const handleHypertensionLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!logDate || !logTime || !systolic || !diastolic || !pulse) {
      setHypertensionLogMessage('Please fill in all fields.');
      return;
    }

    const systolicValue = parseInt(systolic);
    const diastolicValue = parseInt(diastolic);

    const value = {
      systolic: systolicValue,
      diastolic: diastolicValue,
      pulse: parseInt(pulse),
    };

    let flag = 'Normal';
    if (systolicValue > 180 || diastolicValue > 120) {
      flag = 'Hypertensive Crisis';
    } else if (systolicValue >= 140 || diastolicValue >= 90) {
      flag = 'High';
    } else if (systolicValue < 90 || diastolicValue < 60) {
      flag = 'Low';
    }

    if (flag === 'Hypertensive Crisis' || flag === 'Low') {
      alert(`DANGER: ${flag} Reading.\n\nPlease contact emergency services immediately.`);
      try {
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: 'office@aleracarecollective.com',
            subject: `ALERT: ${flag} Blood Pressure Reading - ${userData.email}`,
            text: `
              Patient: ${userData.email}
              Contact: ${userData.phoneNumber || 'Not provided'}
              Reading: ${systolic}/${diastolic} mmHg, Pulse: ${pulse} bpm
              Time: ${new Date(`${logDate}T${logTime}`).toLocaleString()}
            `
          })
        });
      } catch (error) {
        console.error("Failed to send email alert:", error);
      }
    }


    const newRecord = {
      patientId: user.uid,
      patientEmail: user.email,
      patientPhone: userData.phoneNumber || null,
      type: 'Hypertension Log',
      readingSite: readingSite,
      value: value,
      unit: 'mmHg',
      readingTime: new Date(`${logDate}T${logTime}`).toISOString(),
      flag: flag,
      createdAt: new Date().toISOString()
    };

    try {
      const docRef = await addDoc(collection(db, "records"), newRecord);
      setRecords([...records, { id: docRef.id, ...newRecord }]);
      setHypertensionLogMessage('Reading logged successfully.');
      setSystolic('');
      setDiastolic('');
      setPulse('');
    } catch (err) {
      console.error("Error logging reading", err);
      setHypertensionLogMessage('Failed to log reading.');
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegistering) {
        if (role === 'staff' && staffCode !== 'ACC20252026' && staffCode !== 'Medicaldoctor2026!') {
          setError('Invalid Staff Code');
          return;
        }
        const user = await register(email, password, role, { 
          phoneNumber,
          fullName,
          age,
          comorbidities
        });
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
          // Fetch user profile data (role, phone, etc)
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          let currentRole = 'patient';
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData(data);
            currentRole = data.role;
          }

          let q;
          if (currentRole === 'staff') {
            q = query(collection(db, "records"));
          } else {
            q = query(collection(db, "records"), where("patientId", "==", currentUser.uid));
          }

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

  const handleDiabetesLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !userData) return;

    if (!logDate || !logTime || !glucoseValue) {
      setLogMessage('Please fill in all fields (Date, Time, Glucose).');
      return;
    }

    const readingDateTime = new Date(`${logDate}T${logTime}`);
    const mealDateTime = new Date(`${logDate}T${lastMealTime}`);
    
    // If meal time is later than reading time, assume meal was yesterday
    if (mealDateTime > readingDateTime) {
      mealDateTime.setDate(mealDateTime.getDate() - 1);
    }

    if (isNaN(readingDateTime.getTime())) {
      setLogMessage('Invalid date or time.');
      return;
    }

    // Calculate hours difference
    const diffMs = readingDateTime.getTime() - mealDateTime.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    let type = 'RBS'; // Random Blood Sugar
    if (diffHours >= 8) type = 'FBS'; // Fasting
    else if (diffHours >= 0.75 && diffHours <= 1.25) type = '1 hr PP';
    else if (diffHours >= 1.75 && diffHours <= 2.25) type = '2 hr PP';

    const value = parseFloat(glucoseValue);
    let flag = 'Normal';
    
    // Flag Logic
    if (value < 70) flag = 'Low';
    else if (type === 'FBS' && value > 130) flag = 'High';
    else if (type !== 'FBS' && value > 180) flag = 'High';

    // Alerts
    if (flag === 'Low') {
      alert("WARNING: Low Glucose Reading.\n\nPlease consume a meal or fast-acting carbohydrate immediately.\n\nConsider contacting emergency services if you feel unwell.");
    } else if (flag === 'High') {
      // Call API to send email
      try {
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: 'office@aleracarecollective.com',
            subject: `ALERT: High Glucose Reading - ${userData.email}`,
            text: `
              Patient: ${userData.email}
              Contact: ${userData.phoneNumber || 'Not provided'}
              Reading: ${value} mg/dL (${type})
              Time: ${readingDateTime.toLocaleString()}
            `
          })
        });
        alert(`High reading detected. An alert has been sent to the office for patient ${userData.email}.`);
      } catch (error) {
        console.error("Failed to send email alert:", error);
        alert(`High reading detected. Please contact the office immediately.`);
      }
    }

    const newRecord = {
      patientId: user.uid,
      patientEmail: user.email,
      patientPhone: userData.phoneNumber || null,
      type: 'Diabetes Log',
      subType: type,
      value: value,
      unit: 'mg/dL',
      readingTime: readingDateTime.toISOString(),
      lastMealTime: mealDateTime.toISOString(),
      flag: flag,
      createdAt: new Date().toISOString()
    };

    try {
      const docRef = await addDoc(collection(db, "records"), newRecord);
      setRecords([...records, { id: docRef.id, ...newRecord }]);
      setLogMessage('Reading logged successfully.');
      setGlucoseValue('');
    } catch (err) {
      console.error("Error logging reading", err);
      setLogMessage('Failed to log reading.');
    }
  };

  const filteredRecords = records.filter(record => {
    if (userData?.role !== 'staff') return true;
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();

    const valueMatch = (record.type === 'Hypertension Log') 
      ? (record.value.systolic?.toString().includes(term) || record.value.diastolic?.toString().includes(term))
      : record.value?.toString().toLowerCase().includes(term);

    return (
      record.patientEmail?.toLowerCase().includes(term) ||
      record.patientPhone?.toLowerCase().includes(term) ||
      valueMatch ||
      record.type?.toLowerCase().includes(term)
    );
  });

  const handleUpdatePrescription = async () => {
    if (!selectedPatient || !selectedPatient.uid) return;
    try {
      await updateDoc(doc(db, "users", selectedPatient.uid), {
        prescriptions: prescriptionText
      });
      alert("Prescription updated successfully");
      // Update local state
      setSelectedPatient({ ...selectedPatient, prescriptions: prescriptionText });
    } catch (error) {
      console.error("Error updating prescription:", error);
      alert("Failed to update prescription");
    }
  };

  const viewPatientProfile = async (patientId: string) => {
    const patientDoc = await getDoc(doc(db, "users", patientId));
    if (patientDoc.exists()) {
      const data = patientDoc.data();
      setSelectedPatient({ ...data, uid: patientId });
      setPrescriptionText(data.prescriptions || '');
    }
  };

  const handleSetCurrentTime = () => {
    const now = new Date();
    const date = [
      now.getFullYear(),
      (now.getMonth() + 1).toString().padStart(2, '0'),
      now.getDate().toString().padStart(2, '0'),
    ].join('-');
    const time = [
      now.getHours().toString().padStart(2, '0'),
      now.getMinutes().toString().padStart(2, '0'),
    ].join(':');
    setLogDate(date);
    setLogTime(time);
  };

  if (loading) return <div className="p-10">Loading MyChart...</div>;

  if (!user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-50">
        <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg border border-slate-100">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Image src="/blacklogo2.png" alt="MyChart by Alera" width={200} height={50} style={{ objectFit: 'contain' }} />
            </div>
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
                <div className="relative">
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border pr-10"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center mt-6"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <span className="text-xs text-slate-500 font-medium">Hide</span>
                    ) : (
                      <span className="text-xs text-slate-500 font-medium">Show</span>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {isRegistering && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Full Name</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Age</label>
                  <input
                    type="number"
                    required
                    className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border"
                    placeholder="30"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Comorbidities</label>
                  <textarea
                    className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border"
                    placeholder="e.g. Hypertension, Asthma"
                    value={comorbidities}
                    onChange={(e) => setComorbidities(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Phone Number</label>
                  <input
                    type="tel"
                    required
                    className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border"
                    placeholder="(555) 555-5555"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
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
        @import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Montserrat:wght@400;700&display=swap');
      `}} />
      <div className="w-full max-w-4xl flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm border border-[#D9A68A]/20">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-[#4A3A33] rounded-full flex items-center justify-center overflow-hidden">
            {userData?.photoURL ? (
              <img src={userData.photoURL} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <span className="text-[#EFE7DD] font-bold text-lg font-['Montserrat']">{user.email?.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <Image src="/blacklogo2.png" alt="MyChart by Alera" width={180} height={45} style={{ objectFit: 'contain' }} />
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

      {/* Profile Section */}
      {(userData?.role === 'patient' || selectedPatient) && (
        <div className="w-full max-w-4xl mb-8 p-6 bg-white rounded-xl shadow-sm border border-[#D9A68A]/20">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#4A3A33] font-['Montserrat']">
                {selectedPatient ? selectedPatient.fullName : userData.fullName || 'Patient Profile'}
              </h2>
              <p className="text-[#4A3A33]/70 font-['Lato']">
                {selectedPatient ? selectedPatient.email : userData.email}
              </p>
            </div>
            {userData?.role === 'staff' && selectedPatient && (
              <button 
                onClick={() => setSelectedPatient(null)}
                className="text-sm text-[#8AAB88] hover:underline"
              >
                Close Profile
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-[#4A3A33] mb-2">Details</h3>
              <p><span className="font-medium">Age:</span> {selectedPatient ? selectedPatient.age : userData.age}</p>
              <p><span className="font-medium">Phone:</span> {selectedPatient ? selectedPatient.phoneNumber : userData.phoneNumber}</p>
              <p><span className="font-medium">Comorbidities:</span> {selectedPatient ? selectedPatient.comorbidities : userData.comorbidities}</p>
            </div>
            <div>
              <h3 className="font-bold text-[#4A3A33] mb-2">Prescriptions</h3>
              {userData?.role === 'staff' ? (
                <div className="space-y-2">
                  <textarea 
                    className="w-full h-32 rounded-lg border-[#A8C0CE] shadow-sm p-2 text-[#4A3A33]"
                    value={prescriptionText}
                    onChange={(e) => setPrescriptionText(e.target.value)}
                    placeholder="Enter prescriptions here..."
                  />
                  <button 
                    onClick={handleUpdatePrescription}
                    className="px-4 py-2 bg-[#8AAB88] text-white rounded-lg hover:bg-[#7a9b78] transition-colors"
                  >
                    Update Prescription
                  </button>
                </div>
              ) : (
                <div className="p-4 bg-[#EFE7DD]/30 rounded-lg border border-[#A8C0CE] min-h-[8rem]">
                  <p className="whitespace-pre-wrap">{userData.prescriptions || 'No active prescriptions.'}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Booking Section - Only for Patients */}
      {userData?.role === 'patient' && (
        <div className="w-full max-w-4xl mb-8 p-6 bg-white rounded-xl shadow-sm border border-[#D9A68A]/20">
          <h2 className="text-xl font-semibold mb-4 text-[#4A3A33] font-['Montserrat']">Book an Appointment</h2>
          <iframe
            src="https://alera-care-collective.au5.cliniko.com/bookings"
            style={{ width: '100%', height: '600px', border: 'none', borderRadius: '8px' }}
            title="Cliniko Bookings"
          ></iframe>
        </div>
      )}

      {/* Hypertension Log Section - Only for Patients */}
      {userData?.role === 'patient' && (
        <div className="w-full max-w-4xl mb-8 p-6 bg-white rounded-xl shadow-sm border border-[#D9A68A]/20">
          <h2 className="text-xl font-semibold mb-4 text-[#4A3A33] font-['Montserrat']">Log Blood Pressure Reading</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <form onSubmit={handleHypertensionLog} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#4A3A33] font-['Lato']">Date</label>
                <input 
                  type="date" 
                  required 
                  value={logDate} 
                  onChange={(e) => setLogDate(e.target.value)}
                  className="mt-1 block w-full rounded-lg border-[#A8C0CE] shadow-sm p-2 text-[#4A3A33]"
                />
              </div>
              <div>
                <div className="relative">
                  <label className="block text-sm font-medium text-[#4A3A33] font-['Lato']">Time of Reading</label>
                  <input 
                    type="time" 
                    required 
                    value={logTime} 
                    onChange={(e) => setLogTime(e.target.value)}
                    className="mt-1 block w-full rounded-lg border-[#A8C0CE] shadow-sm p-2 text-[#4A3A33]"
                  />
                  <button
                    type="button"
                    onClick={handleSetCurrentTime}
                    className="absolute top-6 right-2 text-xs text-blue-500 hover:underline"
                  >
                    Now
                  </button>
                </div>
              </div>
               <div>
                <label className="block text-sm font-medium text-[#4A3A33] font-['Lato']">Reading Site</label>
                <select
                  value={readingSite}
                  onChange={(e) => setReadingSite(e.target.value)}
                  className="mt-1 block w-full rounded-lg border-[#A8C0CE] shadow-sm p-2 text-[#4A3A33]"
                >
                  <option value="left_arm">Left Arm</option>
                  <option value="right_arm">Right Arm</option>
                  <option value="left_wrist">Left Wrist</option>
                  <option value="right_wrist">Right Wrist</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4A3A33] font-['Lato']">Systolic (Top Number)</label>
                <input 
                  type="number" 
                  required 
                  placeholder="e.g. 120"
                  value={systolic} 
                  onChange={(e) => setSystolic(e.target.value)}
                  className="mt-1 block w-full rounded-lg border-[#A8C0CE] shadow-sm p-2 text-[#4A3A33]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4A3A33] font-['Lato']">Diastolic (Bottom Number)</label>
                <input 
                  type="number" 
                  required 
                  placeholder="e.g. 80"
                  value={diastolic} 
                  onChange={(e) => setDiastolic(e.target.value)}
                  className="mt-1 block w-full rounded-lg border-[#A8C0CE] shadow-sm p-2 text-[#4A3A33]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4A3A33] font-['Lato']">Pulse (BPM)</label>
                <input 
                  type="number" 
                  required 
                  placeholder="e.g. 70"
                  value={pulse} 
                  onChange={(e) => setPulse(e.target.value)}
                  className="mt-1 block w-full rounded-lg border-[#A8C0CE] shadow-sm p-2 text-[#4A3A33]"
                />
              </div>
              <button type="submit" className="w-full py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-[#EFE7DD] bg-[#4A3A33] hover:bg-[#3a2e28] transition-colors font-['Lato']">
                Log BP Reading
              </button>
              {hypertensionLogMessage && <p className="mt-4 text-sm text-[#8AAB88] font-['Lato']">{hypertensionLogMessage}</p>}
            </form>
            <div className="prose">
              <h3 className="font-semibold text-[#4A3A33] font-['Montserrat']">How to Measure Your Blood Pressure Correctly</h3>
              <p>Follow these steps from the American Heart Association:</p>
              <ul>
                <li><strong>Be still.</strong> Don't smoke, drink caffeinated beverages or exercise within 30 minutes before measuring your blood pressure. Empty your bladder and ensure at least 5 minutes of quiet rest before measurements.</li>
                <li><strong>Sit correctly.</strong> Sit with your back straight and supported (on a dining chair, rather than a sofa). Your feet should be flat on the floor and your legs should not be crossed. Your arm should be supported on a flat surface (such as a table) with the upper arm at heart level.</li>
                <li><strong>Measure on a bare arm.</strong> Roll up your sleeve. The cuff should be placed on a bare arm.</li>
                <li><strong>Take multiple readings.</strong> Take at least two readings one minute apart and record both results.</li>
              </ul>
              <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                <h4 className="font-semibold">Correct Posture Diagram</h4>
                <p className="text-sm text-gray-600">[Placeholder for a diagram showing correct seating posture: back straight, feet flat, arm supported at heart level.]</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Diabetes Log Section - Only for Patients */}
      {userData?.role === 'patient' && (
        <div className="w-full max-w-4xl mb-8 p-6 bg-white rounded-xl shadow-sm border border-[#D9A68A]/20">
          <h2 className="text-xl font-semibold mb-4 text-[#4A3A33] font-['Montserrat']">Log Glucose Reading</h2>
          <form onSubmit={handleDiabetesLog} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#4A3A33] font-['Lato']">Date</label>
              <input 
                type="date" 
                required 
                value={logDate} 
                onChange={(e) => setLogDate(e.target.value)}
                className="mt-1 block w-full rounded-lg border-[#A8C0CE] shadow-sm p-2 text-[#4A3A33]"
              />
            </div>
            <div>
              <div className="relative">
                <label className="block text-sm font-medium text-[#4A3A33] font-['Lato']">Time of Reading</label>
                <input 
                  type="time" 
                  required 
                  value={logTime} 
                  onChange={(e) => setLogTime(e.target.value)}
                  className="mt-1 block w-full rounded-lg border-[#A8C0CE] shadow-sm p-2 text-[#4A3A33]"
                />
                <button
                  type="button"
                  onClick={handleSetCurrentTime}
                  className="absolute top-6 right-2 text-xs text-blue-500 hover:underline"
                >
                  Now
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4A3A33] font-['Lato']">Glucose (mg/dL)</label>
              <input 
                type="number" 
                required 
                placeholder="e.g. 120"
                value={glucoseValue} 
                onChange={(e) => setGlucoseValue(e.target.value)}
                className="mt-1 block w-full rounded-lg border-[#A8C0CE] shadow-sm p-2 text-[#4A3A33]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4A3A33] font-['Lato']">Time of Last Meal</label>
              <input 
                type="time" 
                required 
                value={lastMealTime} 
                onChange={(e) => setLastMealTime(e.target.value)}
                className="mt-1 block w-full rounded-lg border-[#A8C0CE] shadow-sm p-2 text-[#4A3A33]"
              />
            </div>
            <button type="submit" className="md:col-span-2 mt-2 w-full py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-[#EFE7DD] bg-[#4A3A33] hover:bg-[#3a2e28] transition-colors font-['Lato']">
              Log Reading
            </button>
          </form>
          {logMessage && <p className="mt-4 text-sm text-[#8AAB88] font-['Lato']">{logMessage}</p>}
        </div>
      )}

      <div className="w-full max-w-4xl grid gap-6">
        {/* Feature Placeholder */}
        <div className="p-6 border border-[#A8C0CE]/30 rounded-xl shadow-sm bg-white">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
            <h2 className="text-xl font-semibold text-[#4A3A33] font-['Montserrat']">
              {userData?.role === 'staff' ? 'All Patient Records' : 'Medical Records'}
            </h2>
            {userData?.role === 'staff' && (
              <input
                type="text"
                placeholder="Search by email, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64 rounded-lg border-[#A8C0CE] shadow-sm p-2 text-sm text-[#4A3A33] font-['Lato'] border"
              />
            )}
          </div>
          {filteredRecords.length === 0 ? (
            <div className="text-center py-10 bg-[#EFE7DD]/30 rounded-lg border border-dashed border-[#A8C0CE]">
              <p className="text-[#4A3A33]/70 font-['Lato']">No records found.</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {filteredRecords.map((r) => (
                <li key={r.id} className="p-4 bg-white rounded-lg border border-[#A8C0ce]/30 hover:border-[#8AAB88] transition-colors shadow-sm text-[#4A3A33] font-['Lato']">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-bold block">{r.subType || r.type}</span>
                      <span className="text-sm text-gray-500">{new Date(r.readingTime || r.createdAt).toLocaleString()}</span>
                      {userData?.role === 'staff' && (
                        <span className="text-xs text-[#8AAB88] block mt-1 font-medium">Patient: {r.patientEmail}</span>
                      )}
                      {userData?.role === 'staff' && (
                        <button 
                          onClick={() => viewPatientProfile(r.patientId)}
                          className="text-xs text-[#4A3A33] underline mt-1 hover:text-[#8AAB88]"
                        >
                          View Profile
                        </button>
                      )}
                    </div>
                    <div className="text-right">
                      {r.type === 'Hypertension Log' ? (
                        <>
                          <span className="text-xl font-bold block">{r.value.systolic}/{r.value.diastolic} <span className="text-sm font-normal">{r.unit}</span></span>
                          <span className="text-sm text-gray-500">Pulse: {r.value.pulse} bpm</span>
                        </>
                      ) : (
                        <span className="text-xl font-bold block">{r.value} <span className="text-sm font-normal">{r.unit}</span></span>
                      )}
                      {r.flag && r.flag !== 'Normal' && <span className="text-xs font-bold text-red-500 px-2 py-1 bg-red-50 rounded-full">{r.flag}</span>}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
