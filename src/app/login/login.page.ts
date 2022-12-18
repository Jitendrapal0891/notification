import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { doc, docData, Firestore, setDoc } from '@angular/fire/firestore';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UploadService } from '../services/upload.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  isSubmitted: boolean = false;

  constructor(public formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private auth: Auth,
    private firestore: Firestore,
    private uploadService: UploadService
  ) { }


  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password: ['', [Validators.required]],
    })
  }

  async submitForm() {
    debugger;
    this.isSubmitted = true;
    if (!this.loginForm.valid) {
      console.log('Please provide all the required values!')
    } else {
      console.log(this.loginForm.value);

      const user: any = await this.authService.register(this.loginForm.value);
      if (!user) {
        const loggedInUser: any = await this.authService.login(this.loginForm.value);
        this.uploadService.saveUser(loggedInUser.user);
        this.router.navigateByUrl("/home");
      } else {
        this.uploadService.saveUser(user.user);
        this.router.navigateByUrl("/home");
      }
    }
  }

  
}
