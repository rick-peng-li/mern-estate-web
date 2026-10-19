import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '@/utils/firebase';

export const uploadImageToFirebase = (file, onProgress = () => {}) =>
  new Promise((resolve, reject) => {
    const storage = getStorage(app);
    const fileName = `${Date.now()}-${file.name}`;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress(Math.round(progress));
      },
      (error) => reject(error),
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then(resolve)
          .catch(reject);
      }
    );
  });
