import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { doc, docData, Firestore, setDoc } from '@angular/fire/firestore';
import { getDownloadURL, ref, Storage, uploadString } from '@angular/fire/storage';
import { Photo } from '@capacitor/camera';
import { collection, getDoc, getDocs, updateDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private auth: Auth, private firestore: Firestore, private storage: Storage) { }

  getUserProfile() {
    const user: any = this.auth.currentUser;
    const userDocRef = doc(this.firestore, `users/${user.uid}`);
    return docData(userDocRef, { idField: 'uid' });
  }

  async getContactss(){
    const userDocRef = collection(this.firestore, "users");
    const docData = await getDocs(userDocRef);
    return docData;
  }

  async saveUser(user: any) {
      const userDocRef = doc(this.firestore, `users/${user.uid}`);
      const docData = await getDoc(userDocRef);
      const profileData = docData.data();
      if (profileData) {
        await updateDoc(userDocRef, {
          email: user.email,
        });
      } else {
        await setDoc(userDocRef, {
          email: user.email,
          uid: user.uid,
        });
      }
  }

  async saveToken(token: string) {
    setTimeout(async() => {
     
    const user: any = this.auth.currentUser;
    if (user) {
      const userDocRef = doc(this.firestore, `users/${user.uid}`);
      await updateDoc(userDocRef, {
        token: token
      });
    }

  }, 10000);

  }

  async uploadImage(cameraFile: Photo) {
    const user: any = this.auth.currentUser;
    const path = `uploads/${user.uid}/profile.webp`;
    const storageRef = ref(this.storage, path);

    try {
      await uploadString(storageRef, cameraFile.base64String || "", 'base64');

      const imageUrl = await getDownloadURL(storageRef);

      const userDocRef = doc(this.firestore, `users/${user.uid}`);
      await updateDoc(userDocRef, {
        imageUrl
      });
      return true;
    } catch (e) {
      return null;
    }
  }

}
