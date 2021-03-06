import { Meta, Title } from '@angular/platform-browser';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Observable, of} from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
declare var jQuery: any;
declare const $;

@Component({
  selector: 'app-sign-in',
  styleUrls: ['./sign-in.component.css'],
  templateUrl: './sign-in.component.html'
})
export class SignInComponent implements OnInit {
  @ViewChild('myModal') myModal: ElementRef;
  @ViewChild('myToast') myToast: ElementRef;
  currentDate: any;
  parroquiasCollection: AngularFirestoreCollection<any>;
  parroquias$: Observable<any[]>;
  ocultar: boolean;
  searchObject: any = { estado: 'true' };
  diocesis: string;
  parroquia: any;
  midata: any[];
  view: any;
  constructor(
    public meta: Meta, public title: Title,
    public auth: AuthService,
    public router: Router,
    public formBuilder: FormBuilder,
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,

  ) {
    this.view = [innerWidth / 1.3, 400];
    this.currentDate = new Date();
    this.meta.updateTag({ name: 'description', content: 'Sign In' });
    this.title.setTitle('Sindex');
    this.ocultar = true;
    this.diocesis = 'vacio';
  }

  sub;
  ngOnInit() {
    this.sub = this.afs.collection('docs', ref => ref.where('code', '==', 'principal')).valueChanges()
    .subscribe(data => {
      this.midata = data;
    });
    $('#myToast').toast('show');
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
      this.postSignIn();
    });
  }

  postSignIn() {
    this.router.navigate(['/Home']);
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }

  onSelect(data): void {
    // console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    // console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    // console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  onResize(event) {
    this.view = [event.target.innerWidth / 1.35, 400];
  }

  goAccount() {
    this.router.navigate(['/registrar']);
  }

}
