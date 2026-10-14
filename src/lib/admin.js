import { 
  collection, 
  query, 
  orderBy, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  setDoc,
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

export function subscribeToCategories(callback) {
  const q = query(collection(db, 'chapters'), orderBy('order', 'asc'));
  return onSnapshot(q, (snap) => {
    const categories = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(categories);
  }, (err) => {
    console.error("Error subscribing to chapters:", err);
  });
}

export async function getCategories() {
  const q = query(collection(db, 'chapters'), orderBy('order', 'asc'));
  const caps = await getDocs(q);
  return caps.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function createCategory(catData) {
  return addDoc(collection(db, 'chapters'), {
    ...catData,
    createdAt: serverTimestamp()
  });
}

export async function updateCategory(catId, catData) {
  const catRef = doc(db, 'chapters', catId);
  return updateDoc(catRef, catData);
}

export async function deleteCategory(catId) {
  return deleteDoc(doc(db, 'chapters', catId));
}

export async function initCategories(adminId, categories) {
  for (const cat of categories) {
    await setDoc(doc(db, 'chapters', cat.id), {
      ...cat,
      order: categories.indexOf(cat)
    });
  }
}

// --- AI Memory Collection Management Operations (Points to knowledge_base) ---

export function subscribeToAiMemories(callback) {
  const q = query(collection(db, 'knowledge_base'), orderBy('updatedAt', 'desc'));
  return onSnapshot(q, (snap) => {
    const memories = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(memories);
  }, (err) => {
    console.error("Error subscribing to knowledge_base:", err);
  });
}

export async function getAiMemories() {
  const q = query(collection(db, 'knowledge_base'), orderBy('updatedAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function createAiMemory(memoryData) {
  // Save both compatibility sets for fields (title/content and question/answer)
  return addDoc(collection(db, 'knowledge_base'), {
    ...memoryData,
    question: memoryData.question || memoryData.title || "",
    answer: memoryData.answer || memoryData.content || "",
    title: memoryData.title || memoryData.question || "",
    content: memoryData.content || memoryData.answer || "",
    updatedAt: new Date().toISOString()
  });
}

export async function updateAiMemory(memoryId, memoryData) {
  const memoryRef = doc(db, 'knowledge_base', memoryId);
  return updateDoc(memoryRef, {
     ...memoryData,
     question: memoryData.question || memoryData.title || "",
     answer: memoryData.answer || memoryData.content || "",
     title: memoryData.title || memoryData.question || "",
     content: memoryData.content || memoryData.answer || "",
     updatedAt: new Date().toISOString()
  });
}

export async function deleteAiMemory(memoryId) {
  return deleteDoc(doc(db, 'knowledge_base', memoryId));
}

// --- FAQ Collection Management Operations ---

export function subscribeToFaqs(callback) {
  const q = query(collection(db, 'faq'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    const faqs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(faqs);
  }, (err) => {
    console.error("Error subscribing to faq:", err);
  });
}

export async function getFaqs() {
  const q = query(collection(db, 'faq'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function createFaq(faqData) {
  return addDoc(collection(db, 'faq'), {
    ...faqData,
    createdAt: new Date().toISOString()
  });
}

export async function updateFaq(faqId, faqData) {
  const faqRef = doc(db, 'faq', faqId);
  return updateDoc(faqRef, faqData);
}

export async function deleteFaq(faqId) {
  return deleteDoc(doc(db, 'faq', faqId));
}
