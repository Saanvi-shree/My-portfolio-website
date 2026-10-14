import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { handleFirestoreError, OperationType } from './utils';

export const DEFAULT_SITE_SETTINGS = {
  heroTitle: "Saanvishree",
  heroSubtitle: "Just a growing girl.",
  heroBio: "Just a growing girl exploring, creating, and dancing through life.",
  heroTag: "Personal Space & Portfolio",
  aboutBio: "Just a growing girl navigating the world, learning new things every day, expressing creativity through dance and ideas, and building things with passion.",
  quote: "Learning, growing, and dancing through every step.",
  primaryButtonText: "Explore My Work",
  secondaryButtonText: "About Me"
};

export async function getSiteSettings() {
  try {
    const docRef = doc(db, 'site_settings', 'home');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { ...DEFAULT_SITE_SETTINGS, ...snap.data() };
    }
    return DEFAULT_SITE_SETTINGS;
  } catch (error) {
    console.warn("Could not fetch site settings, using defaults:", error);
    return DEFAULT_SITE_SETTINGS;
  }
}

export function subscribeToSiteSettings(callback) {
  const docRef = doc(db, 'site_settings', 'home');
  return onSnapshot(docRef, (snap) => {
    if (snap.exists()) {
      callback({ ...DEFAULT_SITE_SETTINGS, ...snap.data() });
    } else {
      callback(DEFAULT_SITE_SETTINGS);
    }
  }, (error) => {
    console.warn("Settings subscription fallback to default:", error);
    callback(DEFAULT_SITE_SETTINGS);
  });
}

export async function updateSiteSettings(settingsData) {
  try {
    const docRef = doc(db, 'site_settings', 'home');
    const payload = {
      ...settingsData,
      updatedAt: serverTimestamp()
    };
    await setDoc(docRef, payload, { merge: true });
    return { ...DEFAULT_SITE_SETTINGS, ...settingsData };
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'site_settings/home');
    throw error;
  }
}

export const saveSiteSettings = updateSiteSettings;
