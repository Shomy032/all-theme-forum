import { Injectable } from '@angular/core';
import { GoogleAuthProvider, User, UserCredential } from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';

type GoogleUser = { user : User , credential : any }

@Injectable({
  providedIn: 'root',
})
export class AuthService {

   storageName = 'userData';

  constructor(
    public afAuth: AngularFireAuth 
  ) {
  }

  GoogleAuth() {
    return this.AuthLogin(new GoogleAuthProvider());
  }

  AuthLogin(provider : any) {
    return this.afAuth
      .signInWithPopup(provider)
      .then((result) => {
        localStorage.setItem(this.storageName , JSON.stringify(result));
      })
      .catch((error) => {
        localStorage.removeItem(this.storageName);
      });
  }

  isAuthenticated(){
    return !!localStorage.getItem(this.storageName);
  }

  logoutUser(){
    this.afAuth.signOut().then(() => {
      location.reload();
   });
    localStorage.removeItem(this.storageName);
  }

  getUserData() :GoogleUser{
    try{
     return JSON.parse(localStorage.getItem(this.storageName) as string)
    }catch (err) {
      this.logoutUser()
      return {} as GoogleUser;
    }
  }

  getUserId(){
    return this.getUserData()?.user?.uid || null;
  }

  getToken(){
    return this.getUserData()?.credential?.idToken;
  }

  get userPicture() : string{
    return this.getUserData()?.user?.photoURL || "";
  }
}