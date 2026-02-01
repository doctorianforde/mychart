import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from "firebase/auth";
import { 
  doc, 
  setDoc, 
  getDoc, 
  deleteDoc,
  updateDoc 
} from "firebase/firestore";
import { auth, db } from "./firebase";

// --- Authentication ---

export const login = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  // Fetch user role from Firestore
  const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
  return { user: userCredential.user, role: userDoc.data()?.role };
};

export const register = async (email, password, role = "patient", additionalData = {}) => {
  // Note: In a real app, ensure only Admins can create 'staff' accounts via Security Rules or Admin SDK
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const uid = userCredential.user.uid;

  // Create user document with role
  await setDoc(doc(db, "users", uid), {
    email,
    role, // 'patient' or 'staff'
    createdAt: new Date(),
    ...additionalData
  });

  return userCredential.user;
};

export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  // Check if user document exists in Firestore
  const userDocRef = doc(db, "users", user.uid);
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    // Create new user document (default to patient)
    await setDoc(userDocRef, {
      email: user.email,
      role: "patient",
      createdAt: new Date(),
      photoURL: user.photoURL
    });
    return { user, role: "patient" };
  }

  return { user, role: userDoc.data()?.role };
};

export const logout = () => signOut(auth);

export const resetPassword = async (email) => {
  await sendPasswordResetEmail(auth, email);
};

// --- Profile Section (Staff) ---

const resizeImage = (file, maxWidth = 500, maxHeight = 500) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Output as JPEG with 0.7 quality to ensure small size
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

export const uploadProfilePicture = async (file, uid) => {
  if (!file) return null;

  try {
    const base64Image = await resizeImage(file);
    
    await updateDoc(doc(db, "users", uid), {
      photoURL: base64Image
    });
    return base64Image;
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    throw error;
  }
};

// --- Deletion (Staff Only) ---

export const deleteUserAccount = async (targetUid) => {
  // 1. Delete User Data from Firestore
  await deleteDoc(doc(db, "users", targetUid));

  // 2. Log instruction for manual deletion (Cloud Functions skipped to avoid Blaze plan)
  console.log("User data deleted from Firestore. Please manually delete the user from Firebase Authentication.");
};