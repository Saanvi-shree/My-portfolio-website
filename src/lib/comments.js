import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp,
  getDocs
} from 'firebase/firestore';
import { db } from './firebase';
import { handleFirestoreError, OperationType } from './utils';

export function subscribeToComments(postId, callback) {
  const q = query(
    collection(db, 'comments'), 
    where('postId', '==', postId), 
    orderBy('createdAt', 'asc')
  );
  
  return onSnapshot(q, (snap) => {
    const comments = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(comments, snap.size);
  }, (err) => handleFirestoreError(err, OperationType.LIST, 'comments'));
}

export async function getUserComments(userId) {
  try {
    const q = query(
      collection(db, 'comments'),
      where('authorId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, `comments/user/${userId}`);
    return [];
  }
}

export async function addComment(commentData) {
  return addDoc(collection(db, 'comments'), {
    ...commentData,
    createdAt: serverTimestamp()
  });
}

export async function deleteComment(commentId) {
  return deleteDoc(doc(db, 'comments', commentId));
}
