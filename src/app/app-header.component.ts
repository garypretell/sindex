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
  async ngOnInit() {
    this.sub = this.auth.user$.pipe(switchMap(data => {
      if (data) {
        return this.afs.doc(`usuarios/${data.uid}`).valueChanges().pipe(map((m: any) => {
          this.super = m.roles.super;
          this.name$ = m.displayName;
          this.foto = m.foto;
        }));
      }else {
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

  goLibro() {
    this.auth.user$.pipe(map(data => {
      if (data) {
        const diocesis = data.diocesis.id;
        const parroquia = data.parroquia.id;
        this.router.navigate(['/diocesis', diocesis, 'parroquia', parroquia, 'documentos']);
      } else {
        return of(null);
      }
    }), takeUntil(this.unsubscribe$)).subscribe();
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
