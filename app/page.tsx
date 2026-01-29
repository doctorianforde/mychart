'use client'

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { collection, query, where, getDocs, addDoc, getDoc, doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/src/lib/firebase';
import { login, loginWithGoogle, register, uploadProfilePicture } from '@/src/lib/authService';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

function ProfileImage({ src, alt, className, fallback }: { src?: string | null, alt: string, className?: string, fallback: React.ReactNode }) {
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
  }, [src]);

  if (!src || error) {
    return <>{fallback}</>;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
}

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
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

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

  // Weight Log State
  const [weightValue, setWeightValue] = useState('');
  const [weightLogMessage, setWeightLogMessage] = useState('');

  const handleProfilePicUpdate = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit.');
      return;
    }

    try {
      const targetUid = selectedPatient ? selectedPatient.uid : user.uid;
      const newPhotoURL = await uploadProfilePicture(file, targetUid);
      
      if (selectedPatient) {
        setSelectedPatient({ ...selectedPatient, photoURL: newPhotoURL });
      } else {
        setUserData({ ...userData, photoURL: newPhotoURL });
      }
    } catch (err) {
      console.error("Error updating profile picture:", err);
      alert("Failed to update profile picture.");
    }
  };

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
      flag = 'Stage 2 High';
    } else if (systolicValue >= 130 || diastolicValue >= 80) {
      flag = 'Stage 1 High';
    } else if (systolicValue < 90 || diastolicValue < 60) {
      flag = 'Low';
    } else if (systolicValue >= 120 && diastolicValue < 80) {
      flag = 'Elevated';
    }

    if (flag === 'Hypertensive Crisis' || flag === 'Low') {
      alert(`DANGER: ${flag} Reading.\n\nAn alert has been sent to the office.\n\nConsider contacting emergency services if you feel unwell.`);
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
    } else if (flag === 'Stage 2 High') {
      alert(`WARNING: Stage 2 High Blood Pressure Reading.\n\nAn alert has been sent to the office.`);
      try {
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: 'office@aleracarecollective.com',
            subject: `WARNING: Stage 2 High Blood Pressure Reading - ${userData.email}`,
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

  const handleWeightLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !userData) return;

    if (!logDate || !logTime || !weightValue) {
      setWeightLogMessage('Please fill in all fields (Date, Time, Weight).');
      return;
    }

    const readingDateTime = new Date(`${logDate}T${logTime}`);

    if (isNaN(readingDateTime.getTime())) {
      setWeightLogMessage('Invalid date or time.');
      return;
    }

    const newRecord = {
      patientId: user.uid,
      patientEmail: user.email,
      patientPhone: userData.phoneNumber || null,
      type: 'Weight Log',
      value: parseFloat(weightValue),
      unit: 'kg', // Assuming kilograms, can be made dynamic if needed
      readingTime: readingDateTime.toISOString(),
      createdAt: new Date().toISOString()
    };

    try {
      const docRef = await addDoc(collection(db, "records"), newRecord);
      setRecords([...records, { id: docRef.id, ...newRecord }]);
      setWeightLogMessage('Weight logged successfully.');
      setWeightValue('');
    } catch (err) {
      console.error("Error logging weight", err);
      setWeightLogMessage('Failed to log weight.');
    }
  };

  const filteredRecords = records.filter(record => {
    // Filter by search term
    if (userData?.role !== 'staff') return true;
    const term = searchTerm.toLowerCase();
    const matchesSearchTerm = (
      !searchTerm ||
      record.patientEmail?.toLowerCase().includes(term) ||
      record.patientPhone?.toLowerCase().includes(term) ||
      ((record.type === 'Hypertension Log') 
        ? (record.value.systolic?.toString().includes(term) || record.value.diastolic?.toString().includes(term))
        : record.value?.toString().toLowerCase().includes(term)) ||
      record.type?.toLowerCase().includes(term)
    );

    // Filter by date range
    let matchesDateRange = true;
    if (startDate && endDate) {
      const recordDate = new Date(record.createdAt || record.readingTime);
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setDate(end.getDate() + 1); // Include records up to the end of the end date
      matchesDateRange = recordDate >= start && recordDate < end;
    } else if (startDate && !endDate) {
      const recordDate = new Date(record.createdAt || record.readingTime);
      const start = new Date(startDate);
      matchesDateRange = recordDate >= start;
    } else if (!startDate && endDate) {
      const recordDate = new Date(record.createdAt || record.readingTime);
      const end = new Date(endDate);
      end.setDate(end.getDate() + 1); // Include records up to the end of the end date
      matchesDateRange = recordDate < end;
    }
    
    return matchesSearchTerm && matchesDateRange;
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

  const handleExportPdf = () => {
    const doc = new jsPDF();
    doc.text("Patient Records", 14, 15);

    const tableColumn = ["Date", "Patient Email", "Type", "Sub Type", "Value", "Unit", "Flag"];
    const tableRows: (string | number)[][] = [];

    filteredRecords.forEach(record => {
      const recordData = [
        new Date(record.createdAt || record.readingTime).toLocaleString(),
        record.patientEmail,
        record.type,
        record.subType || '-',
        record.type === 'Hypertension Log' ? `${record.value.systolic}/${record.value.diastolic} (Pulse: ${record.value.pulse})` : record.type === 'Weight Log' ? `${record.value} ${record.unit}` : record.value,
        record.unit,
        record.flag || '-',
      ];
      tableRows.push(recordData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20
    });
    doc.save('patient_records.pdf');
  };

  const handleExportExcel = () => {
    const data = filteredRecords.map(record => ({
      Date: new Date(record.createdAt || record.readingTime).toLocaleString(),
      "Patient Email": record.patientEmail,
      Type: record.type,
      "Sub Type": record.subType || '-',
      Value: record.type === 'Hypertension Log' ? `${record.value.systolic}/${record.value.diastolic} (Pulse: ${record.value.pulse})` : record.type === 'Weight Log' ? `${record.value} ${record.unit}` : record.value,
      Unit: record.unit,
      Flag: record.flag || '-',
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Patient Records");
    XLSX.writeFile(wb, "patient_records.xlsx");
  };

  if (loading) return <div className="p-10">Loading MyChart...</div>;

  if (!user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-br from-[#EFE7DD] via-[#f7f2ea] to-[#EFE7DD]">
        <div className="w-full max-w-md">
          <div className="bg-white/80 backdrop-blur-sm p-10 rounded-2xl shadow-xl border border-white/50">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <Image src="/blacklogo2.png" alt="MyChart by Alera" width={200} height={50} style={{ objectFit: 'contain' }} priority />
              </div>
              <h2 className="text-sm font-medium text-[#4A3A33]/70 tracking-wide">
                {isRegistering ? 'Create your new account' : 'Sign in to access your records'}
              </h2>
            </div>

          {error && (
            <div className="mb-6 bg-gradient-to-r from-red-50 to-red-50/50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm">
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-base font-bold text-[#4A3A33] mb-3">Email address</label>
                <input
                  id="email"
                  type="email"
                  required
                  className="block w-full rounded-xl border-2 border-[#D9A68A]/40 bg-white shadow-sm focus:border-[#8AAB88] focus:ring-2 focus:ring-[#8AAB88]/20 text-base p-4 text-[#4A3A33] placeholder:text-[#4A3A33]/40 transition-all"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <div className="relative">
                  <label htmlFor="password" className="block text-base font-bold text-[#4A3A33] mb-3">Password</label>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="block w-full rounded-xl border-2 border-[#D9A68A]/40 bg-white shadow-sm focus:border-[#8AAB88] focus:ring-2 focus:ring-[#8AAB88]/20 text-base p-4 pr-16 text-[#4A3A33] placeholder:text-[#4A3A33]/40 transition-all"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute top-11 right-4 text-sm text-[#8AAB88] hover:text-[#4A3A33] font-semibold px-3 py-2 rounded-md hover:bg-[#8AAB88]/10"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
            </div>

            {isRegistering && (
              <div className="space-y-6 pt-2">
                <div>
                  <label className="block text-base font-bold text-[#4A3A33] mb-3">Full Name</label>
                  <input
                    type="text"
                    required
                    className="block w-full rounded-xl border-2 border-[#D9A68A]/40 bg-white shadow-sm focus:border-[#8AAB88] focus:ring-2 focus:ring-[#8AAB88]/20 text-base p-4 text-[#4A3A33] placeholder:text-[#4A3A33]/40 transition-all"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-base font-bold text-[#4A3A33] mb-3">Age</label>
                  <input
                    type="number"
                    required
                    className="block w-full rounded-xl border-2 border-[#D9A68A]/40 bg-white shadow-sm focus:border-[#8AAB88] focus:ring-2 focus:ring-[#8AAB88]/20 text-base p-4 text-[#4A3A33] placeholder:text-[#4A3A33]/40 transition-all"
                    placeholder="30"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-base font-bold text-[#4A3A33] mb-3">Comorbidities</label>
                  <textarea
                    rows={3}
                    className="block w-full rounded-xl border-2 border-[#D9A68A]/40 bg-white shadow-sm focus:border-[#8AAB88] focus:ring-2 focus:ring-[#8AAB88]/20 text-base p-4 text-[#4A3A33] placeholder:text-[#4A3A33]/40 transition-all resize-none"
                    placeholder="e.g. Hypertension, Asthma"
                    value={comorbidities}
                    onChange={(e) => setComorbidities(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-base font-bold text-[#4A3A33] mb-3">Phone Number</label>
                  <input
                    type="tel"
                    required
                    className="block w-full rounded-xl border-2 border-[#D9A68A]/40 bg-white shadow-sm focus:border-[#8AAB88] focus:ring-2 focus:ring-[#8AAB88]/20 text-base p-4 text-[#4A3A33] placeholder:text-[#4A3A33]/40 transition-all"
                    placeholder="(555) 555-5555"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-base font-bold text-[#4A3A33] mb-3">I am a:</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="block w-full rounded-xl border-2 border-[#D9A68A]/40 bg-white shadow-sm focus:border-[#8AAB88] focus:ring-2 focus:ring-[#8AAB88]/20 text-base p-4 text-[#4A3A33] transition-all cursor-pointer"
                  >
                    <option value="patient">Patient</option>
                    <option value="staff">Staff</option>
                  </select>
                </div>

                <div>
                  <label className="block text-base font-bold text-[#4A3A33] mb-3">Profile Picture</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (!file.type.startsWith('image/')) {
                          alert('Please upload a valid image file.');
                          e.target.value = '';
                          setProfilePic(null);
                          return;
                        }
                        if (file.size > 5 * 1024 * 1024) {
                          alert('File size exceeds 5MB limit.');
                          e.target.value = '';
                          setProfilePic(null);
                          return;
                        }
                        setProfilePic(file);
                      } else {
                        setProfilePic(null);
                      }
                    }}
                    className="block w-full text-base text-[#4A3A33] file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-base file:font-bold file:bg-[#EFE7DD] file:text-[#4A3A33] hover:file:bg-[#D9A68A]/30 file:transition-all file:cursor-pointer cursor-pointer"
                  />
                </div>

                {role === 'staff' && (
                  <div>
                    <label className="block text-base font-bold text-[#4A3A33] mb-3">Staff Access Code</label>
                    <input
                      type="password"
                      placeholder="Enter code"
                      value={staffCode}
                      onChange={(e) => setStaffCode(e.target.value)}
                      className="block w-full rounded-xl border-2 border-[#D9A68A]/40 bg-white shadow-sm focus:border-[#8AAB88] focus:ring-2 focus:ring-[#8AAB88]/20 text-base p-4 text-[#4A3A33] placeholder:text-[#4A3A33]/40 transition-all"
                    />
                  </div>
                )}
              </div>
            )}

            <button type="submit" className="w-full flex justify-center py-4 px-8 rounded-xl shadow-md text-lg font-bold text-white bg-gradient-to-r from-[#4A3A33] to-[#5e4d44] hover:from-[#3a2e28] hover:to-[#4A3A33] focus:outline-none focus:ring-4 focus:ring-[#4A3A33]/20 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
              {isRegistering ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-[#D9A68A]/30" />
            </div>
            <div className="relative flex justify-center text-base">
              <span className="bg-white/80 backdrop-blur-sm px-5 text-[#4A3A33]/60 font-semibold">Or continue with</span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full flex justify-center items-center gap-3 py-4 px-8 border-2 border-[#D9A68A]/30 rounded-xl shadow-sm bg-white hover:bg-[#EFE7DD]/30 text-base font-bold text-[#4A3A33] focus:outline-none focus:ring-4 focus:ring-[#8AAB88]/20 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            <svg className="h-6 w-6" aria-hidden="true" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Sign in with Google
          </button>

          <div className="text-center mt-6">
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-base font-bold text-[#8AAB88] hover:text-[#4A3A33] underline decoration-2 underline-offset-4 transition-colors py-2 px-4"
            >
              {isRegistering ? 'Already have an account? Sign in' : 'Need an account? Register'}
            </button>
          </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#EFE7DD] via-[#f7f2ea] to-[#EFE7DD] p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 bg-white/90 backdrop-blur-sm p-5 rounded-2xl shadow-lg border border-white/60">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-gradient-to-br from-[#4A3A33] to-[#5e4d44] rounded-2xl flex items-center justify-center overflow-hidden shadow-md ring-2 ring-white">
                <ProfileImage
                  src={userData?.photoURL}
                  alt="Profile"
                  className="h-full w-full object-cover"
                  fallback={<span className="text-[#EFE7DD] font-bold text-xl font-['Montserrat']">{user.email?.charAt(0).toUpperCase()}</span>}
                />
              </div>
              <div>
                <Image src="/blacklogo2.png" alt="MyChart by Alera" width={180} height={45} style={{ objectFit: 'contain' }} priority />
                <p className="text-xs text-[#4A3A33]/60 mt-0.5 font-medium">Patient Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold text-[#4A3A33]">{userData?.fullName || 'User'}</p>
                <p className="text-xs text-[#4A3A33]/60">{user.email}</p>
              </div>
              <button
                onClick={() => signOut(auth)}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#D9A68A] to-[#c9906f] hover:from-[#c9906f] hover:to-[#D9A68A] rounded-xl transition-all shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Profile Section */}
        {(userData?.role === 'patient' || selectedPatient) && (
          <div className="mb-8 p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60">
            <div className="flex flex-col sm:flex-row justify-between items-start mb-8 gap-4">
              <div className="flex items-center gap-4 sm:gap-6 min-w-0">
                <div className="relative group h-16 w-16 sm:h-24 sm:w-24 shrink-0">
                  <div className="h-full w-full bg-gradient-to-br from-[#4A3A33] to-[#5e4d44] rounded-2xl flex items-center justify-center overflow-hidden shadow-md ring-4 ring-white">
                    <ProfileImage
                      src={selectedPatient ? selectedPatient.photoURL : userData.photoURL}
                      alt="Profile"
                      className="h-full w-full object-cover"
                      fallback={<span className="text-[#EFE7DD] font-bold text-2xl sm:text-4xl font-['Montserrat']">{(selectedPatient ? selectedPatient.email : userData.email)?.charAt(0).toUpperCase()}</span>}
                    />
                  </div>
                  <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-2xl">
                    <span className="text-white text-xs font-bold bg-black/50 px-2 py-1 rounded backdrop-blur-sm">Edit</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleProfilePicUpdate}
                    />
                  </label>
                </div>
                <div className="min-w-0">
                  <h2 className="text-xl sm:text-3xl font-bold text-[#4A3A33] font-['Montserrat'] mb-1 break-words">
                    {selectedPatient ? selectedPatient.fullName : userData.fullName || 'Patient Profile'}
                  </h2>
                  <p className="text-sm sm:text-base text-[#4A3A33]/60 font-medium truncate">
                    {selectedPatient ? selectedPatient.email : userData.email}
                  </p>
                </div>
              </div>
              {userData?.role === 'staff' && selectedPatient && (
                <button
                  onClick={() => setSelectedPatient(null)}
                  className="text-sm font-semibold text-[#8AAB88] hover:text-[#4A3A33] px-4 py-2 rounded-lg hover:bg-[#8AAB88]/10 transition-all shrink-0"
                >
                  Close Profile
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-5">
                <h3 className="text-xl font-bold text-[#4A3A33] font-['Montserrat'] mb-4 pb-2 border-b-2 border-[#D9A68A]/30">Patient Details</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-base font-bold text-[#4A3A33] min-w-[120px]">Age:</span>
                    <span className="text-lg text-[#4A3A33]">{selectedPatient ? selectedPatient.age : userData.age}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-base font-bold text-[#4A3A33] min-w-[120px]">Phone:</span>
                    <span className="text-lg text-[#4A3A33]">{selectedPatient ? selectedPatient.phoneNumber : userData.phoneNumber}</span>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="text-base font-bold text-[#4A3A33] min-w-[120px]">Comorbidities:</span>
                    <span className="text-lg text-[#4A3A33]">{selectedPatient ? selectedPatient.comorbidities : userData.comorbidities || 'None reported'}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-5">
                <h3 className="text-xl font-bold text-[#4A3A33] font-['Montserrat'] mb-4 pb-2 border-b-2 border-[#D9A68A]/30">Prescriptions</h3>
                {userData?.role === 'staff' ? (
                  <div className="space-y-4">
                    <textarea
                      className="w-full h-32 rounded-xl border-2 border-[#D9A68A]/40 bg-white shadow-sm focus:border-[#8AAB88] focus:ring-2 focus:ring-[#8AAB88]/20 p-4 text-base text-[#4A3A33] placeholder:text-[#4A3A33]/40 transition-all resize-none"
                      value={prescriptionText}
                      onChange={(e) => setPrescriptionText(e.target.value)}
                      placeholder="Enter prescriptions here..."
                    />
                    <button
                      onClick={handleUpdatePrescription}
                      className="px-6 py-3.5 text-base font-bold text-white bg-gradient-to-r from-[#8AAB88] to-[#7a9b78] hover:from-[#7a9b78] hover:to-[#8AAB88] rounded-xl transition-all shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
                    >
                      Update Prescription
                    </button>
                  </div>
                ) : (
                  <div className="p-6 bg-gradient-to-br from-[#EFE7DD]/50 to-[#f7f2ea]/30 rounded-xl border-2 border-[#D9A68A]/20 min-h-[8rem] shadow-sm">
                    <p className="whitespace-pre-wrap text-lg leading-relaxed text-[#4A3A33]">{userData.prescriptions || 'No active prescriptions.'}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Booking Section - Only for Patients */}
        {userData?.role === 'patient' && (
          <div className="mb-8 p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60">
            <h2 className="text-2xl font-bold mb-6 text-[#4A3A33] font-['Montserrat']">Book an Appointment</h2>
            <div className="rounded-xl overflow-hidden shadow-md border border-[#D9A68A]/20">
              <iframe
                src="https://alera-care-collective.au5.cliniko.com/bookings"
                style={{ width: '100%', height: '600px', border: 'none' }}
                title="Cliniko Bookings"
              ></iframe>
            </div>
          </div>
        )}

        {/* Hypertension Log Section - Only for Patients */}
        {userData?.role === 'patient' && (
          <div className="mb-8 p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60">
            <h2 className="text-3xl font-bold mb-8 text-[#4A3A33] font-['Montserrat']">Log Blood Pressure Reading</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <form onSubmit={handleHypertensionLog} className="space-y-6">
                <div>
                  <label className="block text-base font-bold text-[#4A3A33] mb-3">Date</label>
                  <input
                    type="date"
                    required
                    value={logDate}
                    onChange={(e) => setLogDate(e.target.value)}
                    className="block w-full rounded-xl border-2 border-[#D9A68A]/40 bg-white shadow-sm focus:border-[#8AAB88] focus:ring-2 focus:ring-[#8AAB88]/20 p-4 text-base text-[#4A3A33] transition-all"
                  />
                </div>
                <div>
                  <div>
                    <label className="block text-base font-bold text-[#4A3A33] mb-3">Time of Reading</label>
                    <div className="flex gap-2">
                      <input
                        type="time"
                        required
                        value={logTime}
                        onChange={(e) => setLogTime(e.target.value)}
                        className="block flex-1 min-w-0 rounded-xl border-2 border-[#D9A68A]/40 bg-white shadow-sm focus:border-[#8AAB88] focus:ring-2 focus:ring-[#8AAB88]/20 p-4 text-base text-[#4A3A33] transition-all"
                      />
                      <button
                        type="button"
                        onClick={handleSetCurrentTime}
                        className="shrink-0 text-sm text-[#8AAB88] hover:text-[#4A3A33] font-bold px-4 py-2 rounded-xl border-2 border-[#8AAB88]/30 hover:bg-[#8AAB88]/10 transition-all"
                      >
                        Now
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-base font-bold text-[#4A3A33] mb-3">Reading Site</label>
                  <select
                    value={readingSite}
                    onChange={(e) => setReadingSite(e.target.value)}
                    className="block w-full rounded-xl border-2 border-[#D9A68A]/40 bg-white shadow-sm focus:border-[#8AAB88] focus:ring-2 focus:ring-[#8AAB88]/20 p-4 text-base text-[#4A3A33] transition-all cursor-pointer"
                  >
                    <option value="left_arm">Left Arm</option>
                    <option value="right_arm">Right Arm</option>
                    <option value="left_wrist">Left Wrist</option>
                    <option value="right_wrist">Right Wrist</option>
                  </select>
                </div>
                <div>
                  <label className="block text-base font-bold text-[#4A3A33] mb-3">Systolic (Top Number)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 120"
                    value={systolic}
                    onChange={(e) => setSystolic(e.target.value)}
                    className="block w-full rounded-xl border-2 border-[#D9A68A]/40 bg-white shadow-sm focus:border-[#8AAB88] focus:ring-2 focus:ring-[#8AAB88]/20 p-4 text-lg text-[#4A3A33] placeholder:text-[#4A3A33]/40 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-base font-bold text-[#4A3A33] mb-3">Diastolic (Bottom Number)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 80"
                    value={diastolic}
                    onChange={(e) => setDiastolic(e.target.value)}
                    className="block w-full rounded-xl border-2 border-[#D9A68A]/40 bg-white shadow-sm focus:border-[#8AAB88] focus:ring-2 focus:ring-[#8AAB88]/20 p-4 text-lg text-[#4A3A33] placeholder:text-[#4A3A33]/40 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-base font-bold text-[#4A3A33] mb-3">Pulse (BPM)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 70"
                    value={pulse}
                    onChange={(e) => setPulse(e.target.value)}
                    className="block w-full rounded-xl border-2 border-[#D9A68A]/40 bg-white shadow-sm focus:border-[#8AAB88] focus:ring-2 focus:ring-[#8AAB88]/20 p-4 text-lg text-[#4A3A33] placeholder:text-[#4A3A33]/40 transition-all"
                  />
                </div>
                <button type="submit" className="w-full py-4 px-8 rounded-xl shadow-md text-lg font-bold text-white bg-gradient-to-r from-[#4A3A33] to-[#5e4d44] hover:from-[#3a2e28] hover:to-[#4A3A33] focus:outline-none focus:ring-4 focus:ring-[#4A3A33]/20 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
                  Log BP Reading
                </button>
                {hypertensionLogMessage && <p className="text-base text-[#8AAB88] font-bold mt-2">{hypertensionLogMessage}</p>}
              </form>
              <div className="bg-gradient-to-br from-[#EFE7DD]/40 to-[#f7f2ea]/20 p-6 rounded-xl border-2 border-[#D9A68A]/20">
                <h3 className="text-xl font-bold text-[#4A3A33] font-['Montserrat'] mb-5">How to Measure Your Blood Pressure Correctly</h3>
                <p className="text-base text-[#4A3A33] font-semibold mb-5">Follow these steps from the American Heart Association:</p>
                <ul className="space-y-4 text-base text-[#4A3A33] leading-relaxed">
                  <li className="flex gap-3"><span className="text-[#8AAB88] font-bold text-xl">•</span><span><strong className="text-[#4A3A33] font-bold">Be still.</strong> Don't smoke, drink caffeinated beverages or exercise within 30 minutes before measuring your blood pressure. Empty your bladder and ensure at least 5 minutes of quiet rest before measurements.</span></li>
                  <li className="flex gap-3"><span className="text-[#8AAB88] font-bold text-xl">•</span><span><strong className="text-[#4A3A33] font-bold">Sit correctly.</strong> Sit with your back straight and supported (on a dining chair, rather than a sofa). Your feet should be flat on the floor and your legs should not be crossed. Your arm should be supported on a flat surface (such as a table) with the upper arm at heart level.</span></li>
                  <li className="flex gap-3"><span className="text-[#8AAB88] font-bold text-xl">•</span><span><strong className="text-[#4A3A33] font-bold">Measure on a bare arm.</strong> Roll up your sleeve. The cuff should be placed on a bare arm.</span></li>
                  <li className="flex gap-3"><span className="text-[#8AAB88] font-bold text-xl">•</span><span><strong className="text-[#4A3A33] font-bold">Take multiple readings.</strong> Take at least two readings one minute apart and record both results.</span></li>
                </ul>
                <div className="mt-6 p-4 rounded-xl bg-white border border-[#D9A68A]/20">
                  <h4 className="font-semibold text-[#4A3A33] mb-3 text-sm">Correct Posture Diagram</h4>
                  <Image src="/bp_posture.jpg" alt="Correct posture for blood pressure measurement" width={500} height={300} style={{ objectFit: 'contain' }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Diabetes Log Section - Only for Patients */}
        {userData?.role === 'patient' && (
          <div className="mb-8 p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60">
            <h2 className="text-3xl font-bold mb-8 text-[#4A3A33] font-['Montserrat']">Log Glucose Reading</h2>
            <form onSubmit={handleDiabetesLog} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-base font-bold text-[#4A3A33] mb-3">Date</label>
                <input
                  type="date"
                  required
                  value={logDate}
                  onChange={(e) => setLogDate(e.target.value)}
                  className="block w-full rounded-xl border-2 border-[#D9A68A]/40 bg-white shadow-sm focus:border-[#8AAB88] focus:ring-2 focus:ring-[#8AAB88]/20 p-4 text-base text-[#4A3A33] transition-all"
                />
              </div>
              <div>
                <div className="relative">
                  <label className="block text-base font-bold text-[#4A3A33] mb-3">Time of Reading</label>
                  <input
                    type="time"
                    required
                    value={logTime}
                    onChange={(e) => setLogTime(e.target.value)}
                    className="block w-full rounded-xl border-2 border-[#D9A68A]/40 bg-white shadow-sm focus:border-[#8AAB88] focus:ring-2 focus:ring-[#8AAB88]/20 p-4 text-base text-[#4A3A33] transition-all"
                  />
                  <button
                    type="button"
                    onClick={handleSetCurrentTime}
                    className="absolute top-11 right-16 text-sm text-[#8AAB88] hover:text-[#4A3A33] font-bold px-3 py-2 rounded-md hover:bg-[#8AAB88]/10"
                  >
                    Now
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-base font-bold text-[#4A3A33] mb-3">Glucose (mg/dL)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 120"
                  value={glucoseValue}
                  onChange={(e) => setGlucoseValue(e.target.value)}
                  className="block w-full rounded-xl border-2 border-[#D9A68A]/40 bg-white shadow-sm focus:border-[#8AAB88] focus:ring-2 focus:ring-[#8AAB88]/20 p-4 text-lg text-[#4A3A33] placeholder:text-[#4A3A33]/40 transition-all"
                />
              </div>
              <div>
                <label className="block text-base font-bold text-[#4A3A33] mb-3">Time of Last Meal</label>
                <input
                  type="time"
                  required
                  value={lastMealTime}
                  onChange={(e) => setLastMealTime(e.target.value)}
                  className="block w-full rounded-xl border-2 border-[#D9A68A]/40 bg-white shadow-sm focus:border-[#8AAB88] focus:ring-2 focus:ring-[#8AAB88]/20 p-4 text-base text-[#4A3A33] transition-all"
                />
              </div>
              <button type="submit" className="md:col-span-2 mt-2 w-full py-4 px-8 rounded-xl shadow-md text-lg font-bold text-white bg-gradient-to-r from-[#4A3A33] to-[#5e4d44] hover:from-[#3a2e28] hover:to-[#4A3A33] focus:outline-none focus:ring-4 focus:ring-[#4A3A33]/20 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
                Log Reading
              </button>
            </form>
            {logMessage && <p className="mt-4 text-base text-[#8AAB88] font-bold">{logMessage}</p>}
          </div>
        )}

        {/* Weight Log Section - Only for Patients */}
        {userData?.role === 'patient' && (
          <div className="mb-8 p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60">
            <h2 className="text-3xl font-bold mb-8 text-[#4A3A33] font-['Montserrat']">Log Weight</h2>
            <form onSubmit={handleWeightLog} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-base font-bold text-[#4A3A33] mb-3">Date</label>
                <input
                  type="date"
                  required
                  value={logDate}
                  onChange={(e) => setLogDate(e.target.value)}
                  className="block w-full rounded-xl border-2 border-[#D9A68A]/40 bg-white shadow-sm focus:border-[#8AAB88] focus:ring-2 focus:ring-[#8AAB88]/20 p-4 text-base text-[#4A3A33] transition-all"
                />
              </div>
              <div>
                <div>
                  <label className="block text-base font-bold text-[#4A3A33] mb-3">Time of Measurement</label>
                  <div className="flex gap-2">
                    <input
                      type="time"
                      required
                      value={logTime}
                      onChange={(e) => setLogTime(e.target.value)}
                      className="block flex-1 min-w-0 rounded-xl border-2 border-[#D9A68A]/40 bg-white shadow-sm focus:border-[#8AAB88] focus:ring-2 focus:ring-[#8AAB88]/20 p-4 text-base text-[#4A3A33] transition-all"
                    />
                    <button
                      type="button"
                      onClick={handleSetCurrentTime}
                      className="shrink-0 text-sm text-[#8AAB88] hover:text-[#4A3A33] font-bold px-4 py-2 rounded-xl border-2 border-[#8AAB88]/30 hover:bg-[#8AAB88]/10 transition-all"
                    >
                      Now
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-base font-bold text-[#4A3A33] mb-3">Weight (kg)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 70"
                  value={weightValue}
                  onChange={(e) => setWeightValue(e.target.value)}
                  className="block w-full rounded-xl border-2 border-[#D9A68A]/40 bg-white shadow-sm focus:border-[#8AAB88] focus:ring-2 focus:ring-[#8AAB88]/20 p-4 text-lg text-[#4A3A33] placeholder:text-[#4A3A33]/40 transition-all"
                />
              </div>
              <button type="submit" className="md:col-span-2 mt-2 w-full py-4 px-8 rounded-xl shadow-md text-lg font-bold text-white bg-gradient-to-r from-[#4A3A33] to-[#5e4d44] hover:from-[#3a2e28] hover:to-[#4A3A33] focus:outline-none focus:ring-4 focus:ring-[#4A3A33]/20 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
                Log Weight
              </button>
            </form>
            {weightLogMessage && <p className="mt-4 text-base text-[#8AAB88] font-bold">{weightLogMessage}</p>}
          </div>
        )}

        <div className="p-4 sm:p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#4A3A33] font-['Montserrat'] mb-4">
              {userData?.role === 'staff' ? 'All Patient Records' : 'Medical Records'}
            </h2>
            {userData?.role === 'staff' && (
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Search by email, phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border-2 border-[#D9A68A]/40 bg-white shadow-sm focus:border-[#8AAB88] focus:ring-2 focus:ring-[#8AAB88]/20 p-3 sm:p-4 text-base text-[#4A3A33] placeholder:text-[#4A3A33]/40 transition-all"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-xl border-2 border-[#D9A68A]/40 bg-white shadow-sm focus:border-[#8AAB88] focus:ring-2 focus:ring-[#8AAB88]/20 p-3 sm:p-4 text-sm sm:text-base text-[#4A3A33] transition-all"
                    title="Start Date"
                  />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full rounded-xl border-2 border-[#D9A68A]/40 bg-white shadow-sm focus:border-[#8AAB88] focus:ring-2 focus:ring-[#8AAB88]/20 p-3 sm:p-4 text-sm sm:text-base text-[#4A3A33] transition-all"
                    title="End Date"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleExportPdf}
                    className="py-3 px-4 sm:py-3.5 sm:px-5 rounded-xl shadow-md text-sm sm:text-base font-bold text-white bg-gradient-to-r from-[#D9A68A] to-[#c9906f] hover:from-[#c9906f] hover:to-[#D9A68A] focus:outline-none focus:ring-4 focus:ring-[#D9A68A]/20 transition-all"
                  >
                    Export PDF
                  </button>
                  <button
                    onClick={handleExportExcel}
                    className="py-3 px-4 sm:py-3.5 sm:px-5 rounded-xl shadow-md text-sm sm:text-base font-bold text-white bg-gradient-to-r from-[#8AAB88] to-[#7a9b78] hover:from-[#7a9b78] hover:to-[#8AAB88] focus:outline-none focus:ring-4 focus:ring-[#8AAB88]/20 transition-all"
                  >
                    Export Excel
                  </button>
                </div>
              </div>
            )}
          </div>
          {filteredRecords.length === 0 ? (
            <div className="text-center py-16 bg-gradient-to-br from-[#EFE7DD]/40 to-[#f7f2ea]/20 rounded-xl border-2 border-dashed border-[#D9A68A]/40">
              <div className="max-w-sm mx-auto">
                <div className="w-16 h-16 bg-[#D9A68A]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#D9A68A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-[#4A3A33]/70 font-medium">No records found.</p>
                <p className="text-sm text-[#4A3A33]/50 mt-1">Your health readings will appear here once logged.</p>
              </div>
            </div>
          ) : (
            <ul className="space-y-4">
              {filteredRecords.map((r) => {
                let flagClasses = '';
                if (r.flag === 'Hypertensive Crisis') {
                  flagClasses = 'bg-gradient-to-r from-red-600 to-red-700 text-white';
                } else if (r.flag === 'Low') {
                  flagClasses = 'bg-gradient-to-r from-blue-500 to-blue-600 text-white';
                } else if (r.flag === 'Stage 2 High' || r.flag === 'High') {
                  flagClasses = 'bg-gradient-to-r from-orange-500 to-red-500 text-white';
                } else if (r.flag === 'Stage 1 High') {
                  flagClasses = 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white';
                } else if (r.flag === 'Elevated') {
                  flagClasses = 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-[#4A3A33]';
                }
                return (
                <li key={r.id} className="p-4 sm:p-6 bg-gradient-to-br from-white to-[#EFE7DD]/10 rounded-xl border-2 border-[#D9A68A]/20 hover:border-[#8AAB88] hover:shadow-md transition-all duration-200 text-[#4A3A33]">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <span className="font-bold text-lg sm:text-xl">{r.subType || r.type}</span>
                        {r.flag && r.flag !== 'Normal' && (
                          <span className={`text-xs sm:text-sm font-bold px-3 py-1 sm:px-4 sm:py-1.5 rounded-full shadow-sm whitespace-nowrap ${flagClasses}`}>
                            {r.flag}
                          </span>
                        )}
                      </div>
                      <span className="text-sm sm:text-base text-[#4A3A33]/70 block font-medium">{new Date(r.readingTime || r.createdAt).toLocaleString()}</span>
                      {userData?.role === 'staff' && (
                        <>
                          <span className="text-sm text-[#8AAB88] block mt-2 sm:mt-3 font-bold truncate">Patient: {r.patientEmail}</span>
                          <button
                            onClick={() => viewPatientProfile(r.patientId)}
                            className="text-sm text-[#4A3A33] font-bold mt-1 sm:mt-2 hover:text-[#8AAB88] underline decoration-2 underline-offset-2 py-1"
                          >
                            View Profile
                          </button>
                        </>
                      )}
                    </div>
                    <div className="text-left sm:text-right shrink-0">
                      {r.type === 'Hypertension Log' ? (
                        <>
                          <span className="text-2xl sm:text-3xl font-bold block text-[#4A3A33]">
                            {r.value.systolic}/{r.value.diastolic}
                            <span className="text-sm sm:text-base font-normal ml-2 text-[#4A3A33]/60">{r.unit}</span>
                          </span>
                          <span className="text-sm sm:text-base text-[#4A3A33]/70 mt-1 sm:mt-2 block font-medium">Pulse: {r.value.pulse} bpm</span>
                        </>
                      ) : (
                        <span className="text-2xl sm:text-3xl font-bold block text-[#4A3A33]">
                          {r.value}
                          <span className="text-sm sm:text-base font-normal ml-2 text-[#4A3A33]/60">{r.unit}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
