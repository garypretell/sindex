import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { FormBuilder } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { switchMap, map, takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
declare var jQuery: any;
declare const $;

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.css']
})
export class DefaultComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject();
  midiocesis: any;
  miparroquia: any;
  midocumento: any;
  documento: any;
  milibro: any;
  miruta: any;

  diocesis: any;
  parroquia: any;

  registros$: Observable<any>;
  campos$: Observable<any>;
  newObject: any = {};
  userFilterF: any = { estado: 'true' };
  p: any;

  constructor(
    public auth: AuthService,
    public formBuilder: FormBuilder,
    public afs: AngularFirestore,
    public router: Router,
    private activatedroute: ActivatedRoute
  ) { }

  sub;
  ngOnInit() {
    this.sub = this.activatedroute.paramMap.subscribe(params => {
      this.midiocesis = params.get('d');
      this.miparroquia = params.get('p');
      this.documento = params.get('doc');
      this.midocumento = this.miparroquia + '_' + this.documento;
      this.milibro = params.get('l');
      this.miruta = this.midocumento + '_' + this.milibro;
      this.actualizarData(this.miruta);
      this.campos$ = this.afs.doc(`Plantillas/${this.midocumento}`).valueChanges();
    });

    this.afs.doc(`Diocesis/${this.midiocesis}`).valueChanges().pipe(switchMap((m: any) => {
      return this.afs.doc(`Parroquias/${this.miparroquia}`).valueChanges().pipe(map((data: any) => {
        this.diocesis = { nombre: m.nombre, id: data.diocesis };
        this.parroquia = { nombre: data.nombre, id: data.parroquia };
      }));
    }), takeUntil(this.unsubscribe$)).subscribe();
    $('input:text:visible:first').focus();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  goParroquia() {
    this.router.navigate(['/diocesis', this.midiocesis, 'parroquia', this.miparroquia]);
  }

  goDocumento() {
    this.router.navigate(['/diocesis', this.midiocesis, 'parroquia', this.miparroquia, 'documentos']);
  }

  goLibro() {
    this.router.navigate(['/diocesis', this.midiocesis, 'parroquia', this.miparroquia, 'documentos', this.documento, 'libros']);
  }

  add(registro) {
    this.newObject = {};
    registro = null;
    // $('input:text:visible:first').focus();
    $('input:enabled:visible:first').focus();
  }

  keytab(event) {
    $('input').keydown(function(e) {
      if (e.which === 13) {
        const index = $('input').index(this) + 1;
        $('input').eq(index).focus();
      }
    });
  }

  actualizarData(libro) {
    this.afs.firestore.doc(`Libros/${libro}`).get()
      .then(docSnapshot => {
        if (!docSnapshot.exists) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Este Libro no ha sido registrado!'
          });
          this.goLibro();
        }
      }
      );
  }
}
