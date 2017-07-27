import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController,Platform, ToastController } from 'ionic-angular';
import firebase from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import { Profile } from '../../models/profile';
import { AngularFireDatabase, FirebaseObjectObservable  } from 'angularfire2/database';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class Home {

  profileData: FirebaseObjectObservable<Profile>;
  user={};
  profile = {} as Profile;
  profileDetails = true;
  constructor(private afDb: AngularFireDatabase,private toast: ToastController,private afAuth:AngularFireAuth,public alert: AlertController,public platform: Platform,public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.afAuth.authState.subscribe(data => {
       this.user = data;
       this.profileData = this.afDb.object(`users/${data.uid}`);
       if(null != data.photoURL){
        this.profile.picture = data.photoURL;
       }else{
        this.profile.picture = "http://via.placeholder.com/140x100"; 
       }
       this.toast.create({
         message: "Welcome to Walkmydog "+data.email,
         duration: 3000
       }).present();
       //console.log(this.profileData);
       console.log(this.user);
     });
  }
  logoutUser(){
        let alert = this.alert.create({
        title: 'Confirm',
        message: 'Do you want sing out and exit?',
        buttons: [{
          text: "sing out and exit?",
          handler: () => { this.exitApp() }
        }, {
          text: "Cancel",
          role: 'cancel'
        }]
      })
      alert.present();
  }
  saveProfile(){
    if(null != this.profile.username){
      this.afAuth.authState.take(1).subscribe(auth => {
        this.afDb.object(`users/${auth.uid}`).set(this.profile).then(() => alert("Datos actualizados correctamente")); this.profileDetails = false;;
      })
    }else{
      alert("el nombre de usuario no puede estar vacio");
    }
  }  
  exitApp(){
    firebase.auth().signOut();
    this.platform.exitApp();
  }
}
