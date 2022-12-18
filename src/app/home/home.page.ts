import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { UploadService } from '../services/upload.service';
import { PushNotifications } from '@capacitor/push-notifications';
import { collection, CollectionReference, DocumentData } from 'firebase/firestore';
import { collectionData, doc, docData, Firestore, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  profile: any;
  contacts: any;

  constructor(
    private uploadService: UploadService,
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private firestore: Firestore,
    private http: HttpClient
  ) {
    this.uploadService.getUserProfile().subscribe((data) => {
      this.profile = data;
    });
  }

  ngOnInit() {
    this.getContacts();
  }

  async getContacts() {
    const contactCollection = collection(this.firestore, 'users');
    this.contacts = this.getAll(contactCollection)
  }

  getAll(contactCollection: CollectionReference<DocumentData>) {
    return collectionData(contactCollection, {
      idField: 'id',
    }) as Observable<any[]>;
  }

  notify(contact:any){

    // let options = {
    //   headers:  new HttpHeaders(
    //     {
    //       'Content-Type': 'application/json',
    //       'Authorization': 'key=AAAAN5BIc5g:APA91bGjZ21Y4EqAejPqnRgyEv-5zldN6EZ0j5KzaslBNlMW7lBcrzCb-k9o1yw0mj4KeU9l6Y0AZBNiETsyJS19DiEi7X4nUOtIkxlzgPpzpOZqrvx93mqAch68yVSOEbE6cixZBtfz'
    //     })
    // }

    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', 'key=AAAAN5BIc5g:APA91bGjZ21Y4EqAejPqnRgyEv-5zldN6EZ0j5KzaslBNlMW7lBcrzCb-k9o1yw0mj4KeU9l6Y0AZBNiETsyJS19DiEi7X4nUOtIkxlzgPpzpOZqrvx93mqAch68yVSOEbE6cixZBtfz')

    let postData = {
      "to": contact.token,
      "click_action": "FCM_PLUGIN_ACTIVITY",
      "notification": {
        "title": "Notification",
        "body": contact.email + " sent you a notification",
        "sound": "default"
      },
      "data": {
        "email": contact.email,
        "uid": contact.uid,
      }
    }

    debugger
    this.http.post('https://fcm.googleapis.com/fcm/send', postData, {headers: headers}).subscribe(results => {
      debugger
    }, (err: any)=>{
debugger
    });

  }

  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }

  goToContactDetail(contact:any){
    this.router.navigateByUrl(`/detail/${contact.uid}`, { replaceUrl: true });
  }

  async changeImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos // Camera, Photos or Prompt!
    });

    if (image) {
      const loading = await this.loadingController.create();
      await loading.present();

      const result = await this.uploadService.uploadImage(image);
      loading.dismiss();

      if (!result) {
        const alert = await this.alertController.create({
          header: 'Upload failed',
          message: 'There was a problem uploading your image.',
          buttons: ['OK']
        });
        await alert.present();
      }
    }
  }

}
