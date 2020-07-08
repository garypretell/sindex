import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/filter';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
declare var jQuery: any;
declare const $;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-header',
  templateUrl: 'app-header.component.html',
  styleUrls: ['./app-header.component.css']
})
export class AppHeaderComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject();
  @ViewChild('myModal') myModal: ElementRef;
  elementos: any[] = [];
  currentChoice: string;
  name$: any;
  codigo: any;
  message;
  mensaje: any;
  transferencia: any;
  super: boolean;
  parroquia: any;
  miparroquia: any;
  midiocesis: any;
  foto: any;
  documentos$: Observable<any>;
  constructor(
    public auth: AuthService,
    public afAuth: AngularFireAuth,
    public afs: AngularFirestore,
    public router: Router,
    public route: ActivatedRoute,
  ) {

    this.super = true;
  }
  sub;
  ngOnInit() {

    this.sub = this.afAuth.authState.subscribe(data => {
      if (data) {
        this.name$ = data.displayName;
        this.foto = data.photoURL;
      }
    });

    this.sub = this.auth.user$.subscribe(data => {
      if (data) {
        this.super = data.roles.super;
      }
    });

  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  signOut() {
    this.auth.signOut().then(() => {
      this.router.navigate(['/']);
    });
  }

  go(dato) {
    this.auth.user$.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      if (data) {
        const array = ['BAUTISMO', 'MATRIMONIO', 'DEFUNCION', 'CONFIRMACION'];
        const value = dato;
        const isInArray = array.includes(value);
        if (isInArray === false) {
          return this.router.navigate(['/Diocesis', data.diocesis.id, 'Parroquia', data.parroquia.id, 'Documento', dato, 'Registro']);
        }
        this.router.navigate(['/Diocesis', data.diocesis.id, 'Parroquia', data.parroquia.id, 'Documento', dato, 'Libros']);
      }
    });
  }

  limpiar() {

  }

  goParroquia() {
    this.auth.user$.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      if (data) {
        this.codigo = data.diocesis.id;
        this.router.navigate(['/diocesis', this.codigo, 'parroquia', data.parroquia.id]);
      }
    });
  }

  goLibro() {
    this.auth.user$.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      if (data) {
        const diocesis = data.diocesis.id;
        const parroquia = data.parroquia.id;
        this.router.navigate(['/diocesis', diocesis, 'parroquia', parroquia, 'documentos']);
      }
    });
  }

  listado() {
    // jQuery(this.myModal.nativeElement).modal('show');
  }

  listar() {
    this.auth.user$.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      if (data) {
        const parroquia = data.parroquia.id;
        this.documentos$ = this.afs.doc(`Parroquias/${parroquia}`).valueChanges();
      }
    });
  }

}
