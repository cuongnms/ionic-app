import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  
  // authenticationState = new BehaviorSubject(false);
  // constructor(private storage: Storage, private plt: Platform) { 
  //   this.plt.ready().then(()=>{
  //     this.checkToken();
  //   });
  // }

  // checkToken() {
  //   return this.storage.get(TOKEN_KEY).then(res =>{
  //     if(res){
  //       this.authenticationState.next(true);
  //     }
  //   });
  // }

  // login() {
  //   return this.storage.set(TOKEN_KEY, 'cuongnm').then(res =>{
  //     this.authenticationState.next(true);
  //   });
  // }

  // logout() {
  //   return this.storage.remove(TOKEN_KEY).then(() =>{
  //     this.authenticationState.next(false);
  //   });
  // }

  // isAuthentication() {
  //   return this.authenticationState.value;
  // }

  constructor(){}
   loginUser(value){
    return new Promise<any>((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(value.email, value.password)
      .then(
        res => resolve(res),
        err => reject(err))
    })
   }
  
   logoutUser(){
     return new Promise((resolve, reject) => {
       if(firebase.auth().currentUser){
         firebase.auth().signOut()
         .then(() => {
           console.log("Log out");
           location.reload();
           resolve();
         }).catch((error) => {
           reject();
         });
       }
     })
   }
  
   userDetails(){
     return firebase.auth().currentUser;
   }
}
