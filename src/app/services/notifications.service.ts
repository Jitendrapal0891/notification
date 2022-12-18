import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { PushNotifications, PushNotificationActionPerformed } from '@capacitor/push-notifications';
import { UploadService } from './upload.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(private uploadService: UploadService) { }
  initPush() {
    if (Capacitor.getPlatform() !== 'web') {
      this.registerPush();
    }
  }
  private registerPush() {
    PushNotifications.requestPermissions().then(permission => {
      if (permission.receive === 'granted') {
        PushNotifications.register();
      }
      else {
        // If permission is not granted
      }
    });
    PushNotifications.addListener('registration', (token) => {
      console.log(token);
      this.uploadService.saveToken(token.value)
    });
    PushNotifications.addListener('registrationError', (err) => {
      console.log(err);
    });
    PushNotifications.addListener('pushNotificationReceived', (notifications) => {
      console.log(notifications);
    });

    PushNotifications.addListener('pushNotificationActionPerformed', (notifications: PushNotificationActionPerformed) => {
      console.log("clicked", notifications);
    });

  }
}
