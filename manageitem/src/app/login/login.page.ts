import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import {AlertController, NavController} from '@ionic/angular';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  validations_form: FormGroup;
  errorMessage: string = '';
  constructor(
      private navCtrl: NavController,
      private authService: AuthenticationService,
      private formBuilder: FormBuilder,
      public alert: AlertController
      ) { }

      ngOnInit() {
        this.validations_form = this.formBuilder.group({
          email: new FormControl('', Validators.compose([
            Validators.required,
            Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
          ])),
          password: new FormControl('', Validators.compose([
            Validators.minLength(5),
            Validators.required
          ])),
        });
      }
     
      validation_messages = {
        'email': [
          { type: 'required', message: 'Email is required.' },
          { type: 'pattern', message: 'Please enter a valid email.' }
        ],
        'password': [
          { type: 'required', message: 'Password is required.' },
          { type: 'minlength', message: 'Password must be at least 5 characters long.' }
        ]
      };
     
      loginUser(value){
        this.authService.loginUser(value)
        .then(res => {
          console.log(res);
          this.navCtrl.navigateForward('/home');
        }, err => {
          this.showAlert("Error",err.message )
        })
      }    

  async showAlert(header: string, message: string) {
    const alert = await this.alert.create({
      header,
      message,
      buttons: ["OK"]
    })
    await alert.present();
  }
}
