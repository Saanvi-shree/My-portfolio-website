import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL 
} from 'firebase/storage';
import { storage } from './firebase';

/**
 * Uploads a file to Firebase Storage
 * @param {File} file 
 * @param {string} path 
 * @param {function} onProgress 
 * @returns {Promise<string>} Download URL
 */
export async function uploadFile(file, path, onProgress) {
  if (!file) return null;
  
  const storageRef = ref(storage, path);
  const uploadTask = uploadBytesResumable(storageRef, file);
  
  return new Promise((resolve, reject) => {
    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(progress);
      }, 
      (error) => reject(error), 
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
        });
      }
    );
  });
}
