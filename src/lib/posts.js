import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDoc, 
  setDoc,
  increment, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { handleFirestoreError, OperationType } from './utils';

export function subscribeToPosts(categoryId, callback) {
  const postsRef = collection(db, 'stories');
  let q = query(postsRef, orderBy('createdAt', 'desc'));
  
  if (categoryId) {
    q = query(postsRef, where('category', '==', categoryId), orderBy('createdAt', 'desc'));
  }
  
  return onSnapshot(q, (snap) => {
    const posts = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(posts, snap.size);
  }, (err) => {
    handleFirestoreError(err, OperationType.LIST, 'stories');
  });
}

export function subscribeToPostDetails(postId, callback) {
  const postRef = doc(db, 'stories', postId);
  return onSnapshot(postRef, (snap) => {
    if (snap.exists()) {
      callback({ id: snap.id, ...snap.data() });
    } else {
      callback(null);
    }
  }, (err) => handleFirestoreError(err, OperationType.GET, `stories/${postId}`));
}

export async function createPost(postData) {
  return addDoc(collection(db, 'stories'), {
    title: postData.title,
    abstract: postData.abstract || '',
    content: postData.content,
    category: postData.category,
    tags: postData.tags || [],
    githubUrl: postData.githubUrl || '',
    demoUrl: postData.demoUrl || '',
    documentUrl: postData.documentUrl || '',
    visibility: postData.visibility || 'public',
    isFeatured: !!postData.isFeatured,
    imageUrl: postData.imageUrl || '',
    authorId: postData.authorId,
    authorName: postData.authorName,
    likesCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
}

export async function updatePost(postId, postData) {
  const postRef = doc(db, 'stories', postId);
  return updateDoc(postRef, {
    ...postData,
    updatedAt: serverTimestamp()
  });
}

export async function deletePost(postId) {
  return deleteDoc(doc(db, 'stories', postId));
}

export async function toggleLike(userId, postId) {
  const likeId = `${userId}_${postId}`;
  const likeRef = doc(db, 'likes', likeId);
  const postRef = doc(db, 'stories', postId);
  
  const snap = await getDoc(likeRef);
  if (snap.exists()) {
    await deleteDoc(likeRef);
    return updateDoc(postRef, { likesCount: increment(-1) });
  } else {
    await setDoc(likeRef, { userId, postId, createdAt: serverTimestamp() });
    return updateDoc(postRef, { likesCount: increment(1) });
  }
}

export async function checkIfLiked(userId, postId) {
  if (!userId) return false;
  const likeRef = doc(db, 'likes', `${userId}_${postId}`);
  const snap = await getDoc(likeRef);
  return snap.exists();
}

export async function toggleFeatured(postId, currentFeaturedState) {
  const postRef = doc(db, 'stories', postId);
  return updateDoc(postRef, { isFeatured: !currentFeaturedState });
}
