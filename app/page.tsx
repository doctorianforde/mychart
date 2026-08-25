'use client'

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { collection, query, where, getDocs, addDoc, getDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { auth, db } from '@/src/lib/firebase';
import AuthForm from '@/src/components/AuthForm';
import HypertensionForm from '@/src/components/HypertensionForm';
import DiabetesForm from '@/src/components/DiabetesForm';
import LabResultsManager from '@/src/components/LabResultsManager';
import WeightLogForm from '@/src/components/WeightLogForm';
import ReferralsManager from '@/src/components/ReferralsManager';
import WhatsAppSupport from '@/src/components/WhatsAppSupport';
import PatientSearchSelect from '@/src/components/PatientSearchSelect';
import PatientAlertsPanel from '@/src/components/PatientAlertsPanel';
import RecordsList from '@/src/components/RecordsList';
import { login, loginWithGoogle, register, uploadProfilePicture, resetPassword } from '@/src/lib/authService';


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
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetMessage, setResetMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loadingSelectedPatientData, setLoadingSelectedPatientData] = useState(false);

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

  // Lab Results State
  const [labResults, setLabResults] = useState<any[]>([]);
  const [labFile, setLabFile] = useState<File | null>(null);
  const [labDescription, setLabDescription] = useState('');
  const [labUploadMessage, setLabUploadMessage] = useState('');
  const [labUploading, setLabUploading] = useState(false);
  const [labUploadProgress, setLabUploadProgress] = useState(0);

  // Referrals State
  const [referrals, setReferrals] = useState<any[]>([]);
  const [referralFile, setReferralFile] = useState<File | null>(null);
  const [referralDescription, setReferralDescription] = useState('');
  const [referralUploadMessage, setReferralUploadMessage] = useState('');
  const [referralUploading, setReferralUploading] = useState(false);
  const [referralUploadProgress, setReferralUploadProgress] = useState(0);

  // Staff Patient Selector
  const [patientList, setPatientList] = useState<any[]>([]);

  // File upload constraints
  const ALLOWED_FILE_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return 'Invalid file type. Accepted: PDF, JPG, PNG, GIF, WebP, DOC, DOCX';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File size exceeds 10MB limit.';
    }
    return null;
  };

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
      patientName: userData.fullName || null, // FIX: Include patient name
      patientPhone: userData.phoneNumber || null,
      type: 'Hypertension Log',
      readingSite: readingSite,
      value: value,
      unit: 'mmHg',
      readingTime: new Date(`${logDate}T${logTime}`).toISOString(),
      flag: flag,
      createdAt: new Date().toISOString()
    };

    console.log('[DEBUG] Creating record with patientName:', newRecord.patientName);

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
        const user = await register(email, password);
        const idToken = await user.getIdToken();
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken, role, staffCode, fullName, phoneNumber, age, comorbidities }),
        });
        if (!res.ok) throw new Error('Registration failed. Please try again.');
        const { role: assignedRole } = await res.json();
        if (role === 'staff' && assignedRole !== 'staff') {
          setError('Invalid Staff Code');
          return;
        }
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

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResetMessage('');
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    try {
      await resetPassword(email);
      setResetMessage('Password reset email sent! Check your inbox.');
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email.');
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

          if (currentRole === 'staff') {
            // Staff no longer eager-load every patient's records: fetch the
            // patient roster (cheap) and a scoped "who has an abnormal
            // reading" query for triage. Per-patient records/labs/referrals
            // load on demand once a patient is selected (see the
            // selectedPatient effect below).
            try {
              const patientsQuery = query(collection(db, "users"), where("role", "==", "patient"));
              const patientsSnapshot = await getDocs(patientsQuery);
              const patients = patientsSnapshot.docs.map(d => ({
                uid: d.id,
                email: d.data().email,
                fullName: d.data().fullName || '',
              }));
              patients.sort((a, b) => (a.fullName || a.email).localeCompare(b.fullName || b.email));
              setPatientList(patients);
            } catch (err) {
              console.error("Error fetching patient list:", err);
            }

            try {
              const alertsQuery = query(collection(db, "records"), where("flag", "!=", "Normal"));
              const alertsSnapshot = await getDocs(alertsQuery);
              setAlerts(alertsSnapshot.docs.map(d => ({ id: d.id, ...d.data() })));
            } catch (err) {
              console.error("Error fetching flagged records:", err);
            }
          } else {
            const q = query(collection(db, "records"), where("patientId", "==", currentUser.uid));
            const querySnapshot = await getDocs(q);
            setRecords(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

            try {
              const labQuery = query(collection(db, "labResults"), where("patientId", "==", currentUser.uid));
              const labSnapshot = await getDocs(labQuery);
              const labData = labSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
              labData.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
              setLabResults(labData);
            } catch (err) {
              console.error("Error fetching lab results:", err);
            }

            try {
              const refQuery = query(collection(db, "referrals"), where("patientId", "==", currentUser.uid));
              const refSnapshot = await getDocs(refQuery);
              const refData = refSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
              refData.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
              setReferrals(refData);
            } catch (err) {
              console.error("Error fetching referrals:", err);
            }
          }
        } catch (error) {
          console.error("Error fetching records:", error);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Staff: load the selected patient's records/labs/referrals on demand
  // instead of eager-loading every patient's data at login.
  useEffect(() => {
    if (userData?.role !== 'staff') return;

    if (!selectedPatient?.uid) {
      setRecords([]);
      setLabResults([]);
      setReferrals([]);
      return;
    }

    let cancelled = false;
    setLoadingSelectedPatientData(true);

    (async () => {
      try {
        const [recordsSnap, labSnap, refSnap] = await Promise.all([
          getDocs(query(collection(db, "records"), where("patientId", "==", selectedPatient.uid))),
          getDocs(query(collection(db, "labResults"), where("patientId", "==", selectedPatient.uid))),
          getDocs(query(collection(db, "referrals"), where("patientId", "==", selectedPatient.uid))),
        ]);
        if (cancelled) return;

        const recordsData = recordsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        recordsData.sort((a: any, b: any) => new Date(b.readingTime || b.createdAt).getTime() - new Date(a.readingTime || a.createdAt).getTime());
        setRecords(recordsData);

        const labData = labSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        labData.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setLabResults(labData);

        const refData = refSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        refData.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setReferrals(refData);
      } catch (err) {
        console.error("Error fetching selected patient's data:", err);
      } finally {
        if (!cancelled) setLoadingSelectedPatientData(false);
      }
    })();

    return () => { cancelled = true; };
  }, [selectedPatient?.uid, userData?.role]);

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
      patientName: userData.fullName || null, // FIX: Include patient name
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
      patientName: userData.fullName || null, // FIX: Include patient name
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

  const handleFileUpload = async (
    e: React.FormEvent,
    collectionName: 'labResults' | 'referrals',
    file: File | null,
    description: string,
    setUploading: (v: boolean) => void,
    setProgress: (v: number) => void,
    setMessage: (v: string) => void,
    setFile: (v: File | null) => void,
    setDesc: (v: string) => void,
    currentList: any[],
    setList: (v: any[]) => void,
  ) => {
    e.preventDefault();
    if (!user || !userData) return;

    let targetPatientId: string;
    let targetPatientEmail: string;
    let targetPatientName: string;

    if (userData.role === 'staff') {
      if (!selectedPatient?.uid) {
        setMessage('Please select a patient.');
        return;
      }
      targetPatientId = selectedPatient.uid;
      targetPatientEmail = selectedPatient.email;
      targetPatientName = selectedPatient.fullName;
    } else {
      targetPatientId = user.uid;
      targetPatientEmail = user.email || '';
      targetPatientName = userData.fullName || '';
    }

    if (!file) {
      setMessage('Please select a file to upload.');
      return;
    }

    const validationError = validateFile(file);
    if (validationError) {
      setMessage(validationError);
      return;
    }

    setUploading(true);
    setProgress(0);
    setMessage('');

    try {
      const storage = getStorage();
      const timestamp = Date.now();
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const storagePath = `${collectionName}/${targetPatientId}/${timestamp}_${sanitizedFileName}`;
      const storageRef = ref(storage, storagePath);

      // Upload file and get download URL
      const snapshot = await uploadBytesResumable(storageRef, file);
      setProgress(100);
      const fileURL = await getDownloadURL(snapshot.ref);

      const metadata = {
        patientId: targetPatientId,
        patientEmail: targetPatientEmail,
        patientName: targetPatientName, // Include patient name
        uploadedBy: user.uid,
        uploaderRole: userData.role,
        uploaderEmail: user.email,
        fileName: file.name,
        fileURL,
        filePath: storagePath,
        description: description.trim(),
        fileType: file.type,
        fileSize: file.size,
        createdAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, collectionName), metadata);
      setList([{ id: docRef.id, ...metadata }, ...currentList]);
      setMessage('File uploaded successfully!');
      setFile(null);
      setDesc('');
      setProgress(0);

      // Reset file input
      const fileInputs = document.querySelectorAll(`input[data-upload="${collectionName}"]`);
      fileInputs.forEach((input: any) => { input.value = ''; });
    } catch (error: any) {
      console.error(`Error uploading to ${collectionName}:`, error);
      setMessage(`Upload failed: ${error?.code || error?.message || 'Unknown error'}. Please try again.`);
    } finally {
      setUploading(false);
    }
  };

  const handleFileDelete = async (
    docId: string,
    filePath: string,
    collectionName: 'labResults' | 'referrals',
    currentList: any[],
    setList: (v: any[]) => void,
  ) => {
    if (!confirm('Are you sure you want to delete this file?')) return;
    try {
      const storage = getStorage();
      const storageRef = ref(storage, filePath);
      await deleteObject(storageRef);
      await deleteDoc(doc(db, collectionName, docId));
      setList(currentList.filter(item => item.id !== docId));
    } catch (error) {
      console.error(`Error deleting from ${collectionName}:`, error);
      alert('Failed to delete file. Please try again.');
    }
  };

  const handleRecordDelete = async (recordId: string, recordType: string) => {
    if (!confirm(`Are you sure you want to delete this ${recordType} record? This action cannot be undone.`)) return;

    try {
      await deleteDoc(doc(db, 'records', recordId));
      setRecords(records.filter(r => r.id !== recordId));
      alert('Record deleted successfully.');
    } catch (error) {
      console.error('Error deleting record:', error);
      alert('Failed to delete record. Please try again.');
    }
  };

  const handlePatientDelete = async (patientId: string, patientName: string, patientEmail: string) => {
    const confirmation = prompt(
      `⚠️ WARNING: This will PERMANENTLY delete ALL data for ${patientName} (${patientEmail}).\n\n` +
      `This includes:\n` +
      `- All health records (blood pressure, glucose, weight)\n` +
      `- All lab results and files\n` +
      `- All referrals and files\n` +
      `- The patient account itself\n\n` +
      `This action CANNOT be undone!\n\n` +
      `Type "DELETE" to confirm:`
    );

    if (confirmation !== 'DELETE') {
      if (confirmation !== null) {
        alert('Deletion cancelled. You must type "DELETE" exactly to confirm.');
      }
      return;
    }

    try {
      // Delete all health records
      const recordsQuery = query(collection(db, 'records'), where('patientId', '==', patientId));
      const recordsSnapshot = await getDocs(recordsQuery);
      const deleteRecordsPromises = recordsSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deleteRecordsPromises);

      // Delete all lab results and files
      const labResultsQuery = query(collection(db, 'labResults'), where('patientId', '==', patientId));
      const labResultsSnapshot = await getDocs(labResultsQuery);
      const storage = getStorage();
      const deleteLabPromises = labResultsSnapshot.docs.map(async (docSnap) => {
        const data = docSnap.data();
        if (data.filePath) {
          try {
            const storageRef = ref(storage, data.filePath);
            await deleteObject(storageRef);
          } catch (e) {
            console.warn('Could not delete lab file:', e);
          }
        }
        await deleteDoc(docSnap.ref);
      });
      await Promise.all(deleteLabPromises);

      // Delete all referrals and files
      const referralsQuery = query(collection(db, 'referrals'), where('patientId', '==', patientId));
      const referralsSnapshot = await getDocs(referralsQuery);
      const deleteReferralPromises = referralsSnapshot.docs.map(async (docSnap) => {
        const data = docSnap.data();
        if (data.filePath) {
          try {
            const storageRef = ref(storage, data.filePath);
            await deleteObject(storageRef);
          } catch (e) {
            console.warn('Could not delete referral file:', e);
          }
        }
        await deleteDoc(docSnap.ref);
      });
      await Promise.all(deleteReferralPromises);

      // Delete profile picture if exists
      const userDoc = await getDoc(doc(db, 'users', patientId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.photoURL) {
          try {
            // Extract path from URL if it's a Firebase Storage URL
            const photoPath = `profilePictures/${patientId}`;
            const photoRef = ref(storage, photoPath);
            await deleteObject(photoRef);
          } catch (e) {
            console.warn('Could not delete profile picture:', e);
          }
        }
      }

      // Finally, delete the user account
      await deleteDoc(doc(db, 'users', patientId));

      // Update local state
      setRecords(records.filter(r => r.patientId !== patientId));
      setLabResults(labResults.filter(r => r.patientId !== patientId));
      setReferrals(referrals.filter(r => r.patientId !== patientId));
      setPatientList(patientList.filter(p => p.uid !== patientId));
      setAlerts(alerts.filter(r => r.patientId !== patientId));

      // If viewing this patient's profile, close it
      if (selectedPatient?.uid === patientId) {
        setSelectedPatient(null);
      }

      alert(`Patient ${patientName} and all their data have been permanently deleted.`);
    } catch (error) {
      console.error('Error deleting patient:', error);
      alert('Failed to delete patient. Please try again or contact support.');
    }
  };

  const filteredRecords = records.filter(record => {
    // Filter this patient's records by search term
    if (userData?.role !== 'staff') return true;
    const term = searchTerm.toLowerCase();
    const matchesSearchTerm = (
      !searchTerm ||
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
    try {
      const userDocRef = doc(db, "users", patientId);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const data = userDocSnap.data();
        setSelectedPatient({ uid: patientId, ...data });
        setPrescriptionText(data.prescriptions || '');

        // Scroll to top when profile is selected
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        alert('Patient document not found.');
      }
    } catch (error) {
      console.error("Error fetching patient profile:", error);
      alert("Failed to load patient profile.");
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

  const handleExportPdf = async () => {
    try {
      const { default: jsPDF } = await import('jspdf');
      const { default: autoTable } = await import('jspdf-autotable');

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
    } catch (error) {
      console.error("Error exporting PDF:", error);
      alert("Failed to export PDF. Please try again.");
    }
  };

    const handleExportExcel = async () => {
    try {
      // Dynamically import the library to avoid bundling issues and keep bundle size small
      const XLSX = await import('xlsx');

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
    } catch (err) {
      console.error("Failed to export Excel:", err);
      alert("An error occurred while generating the Excel file.");
    }
  };

  if (loading) return <div className="p-10">Loading MyChart...</div>;

if (!user) {
    return (
      <AuthForm 
        email={email} setEmail={setEmail}
        password={password} setPassword={setPassword}
        isRegistering={isRegistering} setIsRegistering={setIsRegistering}
        role={role} setRole={setRole}
        fullName={fullName} setFullName={setFullName}
        age={age} setAge={setAge}
        comorbidities={comorbidities} setComorbidities={setComorbidities}
        phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber}
        staffCode={staffCode} setStaffCode={setStaffCode}
        setProfilePic={setProfilePic}
        error={error} setError={setError}
        showPassword={showPassword} setShowPassword={setShowPassword}
        isForgotPassword={isForgotPassword} setIsForgotPassword={setIsForgotPassword}
        resetMessage={resetMessage} setResetMessage={setResetMessage}
        handleSubmit={handleSubmit}
        handleForgotPassword={handleForgotPassword}
        handleGoogleLogin={handleGoogleLogin}
      />
    );
  }
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#EFE7DD] via-[#f7f2ea] to-[#EFE7DD] p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 bg-white/90 backdrop-blur-sm p-5 rounded-2xl shadow-lg border border-white/60">
          {/* Centered App Title */}
          <div className="text-center mb-6">
            <h1 className="text-xl md:text-2xl font-semibold text-[#4A3A33] font-['Montserrat']">MyChart by Alera</h1>
            <p className="text-sm md:text-base text-[#4A3A33]/70 mt-1">Patient Portal</p>
          </div>

          {/* Profile and Sign Out Row */}
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
              <div className="text-center md:text-left">
                <Image src="/blacklogo2.png" alt="MyChart by Alera" width={180} height={45} style={{ objectFit: 'contain' }} priority />
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

        {/* Patient Workspace - Staff Only */}
        {userData?.role === 'staff' && (
          <div className="mb-8 p-4 sm:p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60">
            <PatientAlertsPanel
              alertRecords={alerts}
              patientList={patientList}
              onSelectPatient={viewPatientProfile}
            />
            {selectedPatient ? (
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <p className="text-base text-[#4A3A33]">
                  Currently viewing: <span className="font-bold">{selectedPatient.fullName || selectedPatient.email}</span>
                </p>
                <button
                  onClick={() => setSelectedPatient(null)}
                  className="text-sm font-semibold text-[#8AAB88] hover:text-[#4A3A33] px-4 py-2 rounded-lg hover:bg-[#8AAB88]/10 transition-all"
                >
                  Change patient
                </button>
              </div>
            ) : (
              <PatientSearchSelect
                patients={patientList}
                alertPatientIds={new Set(alerts.map((r) => r.patientId).filter(Boolean))}
                onSelect={viewPatientProfile}
              />
            )}
          </div>
        )}

        {/* Profile Section */}
        {(userData?.role === 'patient' || selectedPatient) && (
          <div className="mb-8 p-4 sm:p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60">
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
                  onClick={() => handlePatientDelete(selectedPatient.uid, selectedPatient.fullName, selectedPatient.email)}
                  className="text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 px-4 py-2 rounded-lg transition-all shrink-0 shadow-md"
                >
                  Delete Patient
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
          <div className="mb-8 p-4 sm:p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60">
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
          <HypertensionForm
            logDate={logDate} setLogDate={setLogDate}
            logTime={logTime} setLogTime={setLogTime}
            readingSite={readingSite} setReadingSite={setReadingSite}
            systolic={systolic} setSystolic={setSystolic}
            diastolic={diastolic} setDiastolic={setDiastolic}
            pulse={pulse} setPulse={setPulse}
            hypertensionLogMessage={hypertensionLogMessage}
            handleHypertensionLog={handleHypertensionLog}
            handleSetCurrentTime={handleSetCurrentTime}
          />
        )}
        {/* Diabetes Log Section - Only for Patients */}
        {userData?.role === 'patient' && (
          <DiabetesForm
            logDate={logDate} setLogDate={setLogDate}
            logTime={logTime} setLogTime={setLogTime}
            glucoseValue={glucoseValue} setGlucoseValue={setGlucoseValue}
            lastMealTime={lastMealTime} setLastMealTime={setLastMealTime}
            logMessage={logMessage}
            handleDiabetesLog={handleDiabetesLog}
            handleSetCurrentTime={handleSetCurrentTime}
          />
        )}

        {/* Weight Log Section - Only for Patients */}
        {userData?.role === 'patient' && (
          <WeightLogForm 
            logDate={logDate} setLogDate={setLogDate}
            logTime={logTime} setLogTime={setLogTime}
            weightValue={weightValue} setWeightValue={setWeightValue}
            weightLogMessage={weightLogMessage}
            handleWeightLog={handleWeightLog}
            handleSetCurrentTime={handleSetCurrentTime}
          />
        )}

        {/* Lab Results Section - Both Roles */}
        <div className="mb-8 p-4 sm:p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60">
          {/* Lab Results Display */}
          <LabResultsManager
            userData={userData}
            user={user}
            labResults={labResults}
            labFile={labFile}
            setLabFile={setLabFile}
            labDescription={labDescription}
            setLabDescription={setLabDescription}
            labUploading={labUploading}
            setLabUploading={setLabUploading}
            labUploadProgress={labUploadProgress}
            setLabUploadProgress={setLabUploadProgress}
            labUploadMessage={labUploadMessage}
            setLabUploadMessage={setLabUploadMessage}
            selectedPatient={selectedPatient}
            handleFileUpload={handleFileUpload}
            handleFileDelete={handleFileDelete}
            setLabResults={setLabResults}
            validateFile={validateFile}
          />
        </div>

{/* Referrals Section - Both Roles */}
        <ReferralsManager
          userData={userData}
          user={user}
          referrals={referrals}
          referralFile={referralFile}
          setReferralFile={setReferralFile}
          referralDescription={referralDescription}
          setReferralDescription={setReferralDescription}
          referralUploading={referralUploading}
          setReferralUploading={setReferralUploading}
          referralUploadProgress={referralUploadProgress}
          setReferralUploadProgress={setReferralUploadProgress}
          referralUploadMessage={referralUploadMessage}
          setReferralUploadMessage={setReferralUploadMessage}
          selectedPatient={selectedPatient}
          handleFileUpload={handleFileUpload}
          handleFileDelete={handleFileDelete}
          setReferrals={setReferrals}
          validateFile={validateFile}
        />

        {/* WhatsApp Support for Patients */}
        {userData?.role === 'patient' && (
          <WhatsAppSupport
            userData={userData}
            officeNumber="18684625372"
          />
        )}

        <div className="p-4 sm:p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#4A3A33] font-['Montserrat'] mb-4">
              {userData?.role === 'staff' ? 'Patient Records' : 'Medical Records'}
            </h2>
          </div>

          {userData?.role === 'staff' && !selectedPatient ? (
            <p className="text-[#4A3A33]/60">Select a patient above to view their records.</p>
          ) : (
          <div className="space-y-4">
            {userData?.role === 'staff' && (
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Filter by reading type or value..."
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
            {loadingSelectedPatientData ? (
              <div className="text-center py-16 text-[#4A3A33]/60">Loading records...</div>
            ) : (
              <RecordsList
                records={filteredRecords}
                onDelete={userData?.role === 'staff' ? handleRecordDelete : undefined}
                emptyTitle={userData?.role === 'staff' ? 'No records for this patient yet.' : 'No records found.'}
                emptySubtitle={userData?.role === 'staff' ? 'Their health readings will appear here once logged.' : 'Your health readings will appear here once logged.'}
              />
            )}
          </div>
          )}
        </div>

        {/* Footer with Links to Legal Pages */}
        <div className="mt-12 mb-8 bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/60">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/tos"
              className="px-6 py-3 text-sm font-semibold text-[#4A3A33] bg-white border-2 border-[#D9A68A] hover:bg-[#EFE7DD] rounded-xl transition-all shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy"
              className="px-6 py-3 text-sm font-semibold text-[#4A3A33] bg-white border-2 border-[#D9A68A] hover:bg-[#EFE7DD] rounded-xl transition-all shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
            >
              Privacy Policy
            </Link>
          </div>
          <p className="text-center text-xs text-[#4A3A33]/60 mt-4">
            © {new Date().getFullYear()} Alera Care Collective. All rights reserved.
          </p>
        </div>
      </div>
    </main>
  );
}
