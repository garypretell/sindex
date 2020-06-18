import { Meta, Title } from '@angular/platform-browser';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Observable, of} from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
declare var jQuery: any;
declare const $;

@Component({
  selector: 'app-sign-in',
  styleUrls: ['./sign-in.component.css'],
  templateUrl: './sign-in.component.html'
})
export class SignInComponent implements OnInit {
  @ViewChild('myModal') myModal: ElementRef;
  parroquiasCollection: AngularFirestoreCollection<any>;
  parroquias$: Observable<any[]>;
  ocultar: boolean;
  searchObject: any = { estado: 'true' };
  diocesis: string;
  parroquia: any;
  constructor(
    public meta: Meta, public title: Title,
    public auth: AuthService,
    public router: Router,
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,

  ) {
    this.meta.updateTag({ name: 'description', content: 'Sign In' });
    this.title.setTitle('Sindex');
    this.ocultar = true;
    this.diocesis = 'vacio';
  }

  ngOnInit() {

  }

  getColor(color) {
    switch (color) {
      case true:
        return 'black';
      case false:
        return 'red';
    }
  }

  createWithGoogle() {
    const diocesis: any = {
      id: this.diocesis,
      nombre: $('#diocesis option:selected').text().substr(1)
    };

    const parroquia: any = {
      id: this.parroquia,
      nombre: $('#parroquia option:selected').text().substr(1)
    };

    if (this.diocesis === 'vacio') {
      this.ocultar = false;
    } else {
      this.ocultar = true;
      this.auth.createWithGoogle(diocesis, parroquia).then(() => this.postSignIn());
    }
    jQuery(this.myModal.nativeElement).modal('hide');
  }

  signInWithGoogle() {
    this.auth.signInWithGoogle().then(() => {
      this.auth.user$ = this.afAuth.authState.pipe(
        switchMap(user => {
          if (user) {
            return this.afs.doc(`usuarios/${user.uid}`).valueChanges();
          } else {
            return of(null);
          }
        }));
      this.postSignIn();
    });
  }

  postSignIn(): void {
    this.router.navigate(['/Home']);
  }

}
