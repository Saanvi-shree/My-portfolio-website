import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  sendSignInLinkToEmail, 
  isSignInWithEmailLink, 
  signInWithEmailLink,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  browserLocalPersistence,
  setPersistence,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  increment, 
  serverTimestamp,
  collection,
  getDocs
} from 'firebase/firestore';
import { auth, db } from './firebase';
import { handleFirestoreError, OperationType } from './utils';

// Ensure persistence
setPersistence(auth, browserLocalPersistence);

export async function syncUser(firebaseUser) {
  if (!firebaseUser) return null;
  const userRef = doc(db, 'users', firebaseUser.uid);
  try {
    const userSnap = await getDoc(userRef);
    const now = serverTimestamp();
    
    if (userSnap.exists()) {
      const data = userSnap.data();
      const isAdmin = data.role === 'admin' || firebaseUser.email === 'nrpavithrarao@gmail.com';
      const displayNameValue = isAdmin ? 'Saanvishree' : (data.username || data.name || 'Scholar');
      const updateData = {
        profilePhoto: firebaseUser.photoURL || data.profilePhoto || '',
        visitCount: increment(1),
        lastActive: now,
        uid: firebaseUser.uid
      };
      await updateDoc(userRef, updateData);
      return { ...data, ...updateData, username: displayNameValue, name: displayNameValue, role: isAdmin ? 'admin' : (data.role || 'user') };
    } else {
      const isAdminEmail = firebaseUser.email === 'nrpavithrarao@gmail.com';
      const defaultName = isAdminEmail ? 'Saanvishree' : (firebaseUser.displayName || (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'Scholar'));
      const regName = (typeof window !== 'undefined' && window.pendingRegName) || defaultName;
      const regRelation = (typeof window !== 'undefined' && window.pendingRegRelation) || 'Academic Visitor';
      
      const newUser = {
        uid: firebaseUser.uid,
        name: regName,
        username: regName,
        email: firebaseUser.email || '',
        phone: firebaseUser.phoneNumber || '',
        profilePhoto: firebaseUser.photoURL || '',
        role: isAdminEmail ? 'admin' : 'user',
        relationship: regRelation,
        isBlocked: false,
        visitCount: 1,
        lastActive: now,
        createdAt: now,
        isNewUser: !isAdminEmail
      };
      await setDoc(userRef, newUser);
      return newUser;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${firebaseUser.uid}`);
  }
}

export async function handleGoogleLogin() {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
}

export async function handleEmailLinkLogin(email) {
  const actionCodeSettings = {
    url: window.location.origin, // Use origin for safety
    handleCodeInApp: true
  };
  await sendSignInLinkToEmail(auth, email, actionCodeSettings);
  window.localStorage.setItem('emailForSignIn', email);
}

export async function checkEmailLinkAuth() {
  if (isSignInWithEmailLink(auth, window.location.href)) {
    let email = window.localStorage.getItem('emailForSignIn');
    if (!email) {
      email = window.prompt('Please provide your email for confirmation');
    }
    if (email) {
       await signInWithEmailLink(auth, email, window.location.href);
       window.localStorage.removeItem('emailForSignIn');
    }
  }
}

let recaptchaVerifier = null;

export function clearRecaptcha() {
  if (recaptchaVerifier) {
    try {
      recaptchaVerifier.clear();
    } catch {
      // ignore clear errors
    }
    recaptchaVerifier = null;
  }
}

export function setupRecaptcha(containerId = 'recaptcha-anchor-target') {
  clearRecaptcha();
  const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
  if (!container) {
    throw new Error("reCAPTCHA container element not found in DOM");
  }
  container.innerHTML = ''; // reset container
  
  recaptchaVerifier = new RecaptchaVerifier(auth, container, {
    size: 'invisible',
    callback: () => {
      // reCAPTCHA solved
    },
    'expired-callback': () => {
      clearRecaptcha();
    }
  });
  return recaptchaVerifier;
}

export async function signInWithPhone(phoneNumber, verifier) {
  try {
    return await signInWithPhoneNumber(auth, phoneNumber, verifier);
  } catch (error) {
    // translate specific Firebase error codes
    let userMsg = error.message;
    if (error.code === 'auth/operation-not-allowed') {
      userMsg = "Phone Sign-In is not enabled in Firebase Console. Please enable Phone Auth in Firebase Console under Authentication > Sign-in method, or sign in with Google / Email.";
    } else if (error.code === 'auth/invalid-phone-number') {
      userMsg = "Invalid phone number format. Please ensure country code is included (e.g. +91 9876543210 or +1 2345678900).";
    } else if (error.code === 'auth/quota-exceeded') {
      userMsg = "SMS quota exceeded for today. Please sign in using Google or Email.";
    } else if (error.code === 'auth/captcha-check-failed') {
      userMsg = "reCAPTCHA verification failed. Please try again.";
    } else if (error.code === 'auth/too-many-requests') {
      userMsg = "Too many attempts. Please try again in a few minutes, or use Google login.";
    }
    const customErr = new Error(userMsg);
    customErr.code = error.code;
    throw customErr;
  }
}

export function signOut() {
  return firebaseSignOut(auth);
}

export function onAuth(callback) {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      try {
        const synced = await syncUser(firebaseUser);
        callback(synced || firebaseUser);
      } catch (err) {
        console.warn("User sync fallback:", err);
        callback(firebaseUser);
      }
    } else {
      callback(null);
    }
  });
}

export async function loginWithDemoPhoneUser(phoneNumber = '+91 98765 43210', displayName = 'Verified Mobile Visitor') {
  const mockUid = 'phone_user_' + phoneNumber.replace(/\D/g, '');
  const userRef = doc(db, 'users', mockUid);
  const now = serverTimestamp();
  
  try {
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const data = snap.data();
      const updated = {
        lastActive: now,
        visitCount: increment(1)
      };
      await updateDoc(userRef, updated);
      return { ...data, ...updated, uid: mockUid };
    } else {
      const newUser = {
        uid: mockUid,
        name: displayName,
        username: displayName.toLowerCase().replace(/\s+/g, '_'),
        email: `${mockUid}@portfolio.visitor`,
        phone: phoneNumber,
        profilePhoto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        role: 'user',
        relationship: 'Academic Visitor',
        isBlocked: false,
        visitCount: 1,
        lastActive: now,
        createdAt: now,
        isNewUser: false
      };
      await setDoc(userRef, newUser);
      return newUser;
    }
  } catch (err) {
    console.error("Demo phone user error:", err);
    return {
      uid: mockUid,
      name: displayName,
      username: 'mobile_visitor',
      phone: phoneNumber,
      role: 'user',
      relationship: 'Academic Visitor'
    };
  }
}

export async function blockUser(userId, blocked = true) {
  const userRef = doc(db, 'users', userId);
  return updateDoc(userRef, { isBlocked: blocked });
}

export async function updateProfileName(userId, newName) {
  const userRef = doc(db, 'users', userId);
  return updateDoc(userRef, { name: newName, username: newName, isNewUser: false });
}

export async function updateProfile(userId, profileData) {
  const userRef = doc(db, 'users', userId);
  return updateDoc(userRef, profileData);
}

export async function handleEmailSignup(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export async function handleEmailLogin(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function handleForgotPassword(email) {
  return sendPasswordResetEmail(auth, email);
}

export async function getAllUsers() {
  try {
    const snap = await getDocs(collection(db, 'users'));
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'users');
    return [];
  }
}
