import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/filter';
import { Observable, Subject, of } from 'rxjs';
import { map, takeUntil, switchMap } from 'rxjs/operators';
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
    this.sub = this.auth.user$.pipe(switchMap(data => {
      if (data) {
        return this.afs.doc(`usuarios/${data.uid}`).valueChanges().pipe(map((m: any) => {
          this.super = m.roles.super;
          this.name$ = m.displayName;
          this.foto = m.foto;
        }));
      } else {
        return of(null);
      }
    })).subscribe();
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

  limpiar() {

  }

  async goParroquia() {
    const { uid } = await this.auth.getUser();
    this.afs.doc(`usuarios/${uid}`).valueChanges().pipe(map((data: any) => {
      if (data) {
        const valor = data.diocesis;
        this.codigo = valor.id;
        this.router.navigate(['/diocesis', this.codigo, 'parroquia', data.parroquia.id]);
      } else {
        return of(null);
      }
    }), takeUntil(this.unsubscribe$)).subscribe();
  }

  async goLibro() {
    const { uid } = await this.auth.getUser();
    this.afs.doc(`usuarios/${uid}`).valueChanges().pipe(map((data: any) => {
      if (data) {
        const diocesis = data.diocesis;
        const parroquia = data.parroquia;
        return this.router.navigate(['/diocesis', diocesis.id, 'parroquia', parroquia.id, 'documentos']);
      } else {
        return of(null);
      }
    }), takeUntil(this.unsubscribe$)).subscribe();
  }

  async goUsuarios() {
    const { uid } = await this.auth.getUser();
    this.afs.doc(`usuarios/${uid}`).valueChanges().pipe(map((data: any) => {
      if (data) {
        const diocesis = data.diocesis;
        const parroquia = data.parroquia;
        return this.router.navigate(['/diocesis', diocesis.id, 'parroquia',  parroquia.id, 'usuarios']);
      } else {
        return of(null);
      }
    }), takeUntil(this.unsubscribe$)).subscribe();
  }

  listado() {
    // jQuery(this.myModal.nativeElement).modal('show');
  }

  async listar() {
    const { uid } = await this.auth.getUser();
    this.afs.doc(`usuarios/${uid}`).valueChanges().pipe(map((data: any) => {
      if (data) {
        const parroquia = data.parroquia.id;
        this.documentos$ = this.afs.doc(`Parroquias/${parroquia}`).valueChanges();
      } else {
        return of(null);
      }
    }), takeUntil(this.unsubscribe$)).subscribe();
  }

  async goDirectorio(directorio) {
    const { uid } = await this.auth.getUser();
    this.afs.doc(`usuarios/${uid}`).valueChanges().pipe(map((data: any) => {
      if (data) {
        const diocesis = data.diocesis;
        const parroquia = data.parroquia;
        return this.router.navigate(['/diocesis', diocesis.id, 'parroquia',  parroquia.id, 'directorio', directorio]);
      } else {
        return of(null);
      }
    }), takeUntil(this.unsubscribe$)).subscribe();
  }
}
