import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { Observable, Subject } from 'rxjs';
import { takeUntil, switchMap, map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import * as firebase from 'firebase/app';
declare var jQuery: any;
declare const $;

@Component({
  selector: 'app-confirmacion',
  templateUrl: './confirmacion.component.html',
  styleUrls: ['./confirmacion.component.css']
})
export class ConfirmacionComponent implements OnInit, OnDestroy {
  @ViewChild('myModal') myModal: ElementRef;
  @ViewChild('myModalDirectorio') myModalDirectorio: ElementRef;
  @ViewChild('myModalDirectorio1') myModalDirectorio1: ElementRef;
  private unsubscribe$ = new Subject();

  addParroquiaForm: FormGroup;
  addConfirmacionForm: FormGroup;
  addDirectorioForm: FormGroup;

  utils$: any;

  celebrantes: any[];
  micelebrante: any;
  micelebrante2: any;
  celebranteObs$: Observable<any>;
  celebranteObs2$: Observable<any>;
  registro: any;

  libros$: Observable<any>;
  midiocesis: any;
  miparroquia: any;
  midocumento: any;
  documento: any;
  milibro: any;
  miruta: any;
  diocesis: any;
  parroquia: any;
  constructor(
    public auth: AuthService,
    public formBuilder: FormBuilder,
    public afs: AngularFirestore,
    public router: Router,
    private activatedroute: ActivatedRoute
  ) {
    this.celebrantes = [{ id: 1, nombre: 'Diacono' }, { id: 2, nombre: 'Obispo' }, { id: 3, nombre: 'Presbitero' }];
   }

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

      this.utils$ = this.afs.collection('utils').valueChanges({ idField: 'id' });

      this.libros$ = this.afs.collection(`Libros`, ref => ref.where('diocesis', '==', this.midiocesis)
        .where('parroquia', '==', this.miparroquia)
        .where('documento', '==', this.miparroquia + '_CONFIRMACION').orderBy('createdAt', 'desc').limit(6)).valueChanges();
    });

    this.afs.doc(`Diocesis/${this.midiocesis}`).valueChanges().pipe(switchMap((m: any) => {
      return this.afs.doc(`Parroquias/${this.miparroquia}`).valueChanges().pipe(map((data: any) => {
        this.diocesis = {nombre: m.nombre, id: data.diocesis};
        this.parroquia = {nombre: data.nombre, id: data.parroquia};
      }));
    }), takeUntil(this.unsubscribe$)).subscribe();

    this.addParroquiaForm = this.formBuilder.group({
      diocesis: ['', [Validators.required]],
      parroquia: ['', [Validators.required]],
    });

    this.addConfirmacionForm = this.formBuilder.group({
      nombres: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      edad: ['', [Validators.required]],
      fecha: ['', [Validators.required]],
      fechareg: ['', [Validators.required]],
      celebrante: [''],
      celebrante2: [''],
      documento: [''],
      nomceleb: ['', [Validators.required]],
      doyfe: ['', [Validators.required]],
      nomPadre: [''],
      apePadre: [''],
      nomMadre: [''],
      apeMadre: [''],
      nomPadrino: [''],
      apePadrino: [''],
      nomMadrina: [''],
      apeMadrina: [''],
      lugarBautismo: ['', [Validators.required]],
      libroBautismo: ['', [Validators.required]],
      numeroBautismo: ['', [Validators.required]],
      libro: [''],
      numeroreg: [''],
      diocesis: [''],
      parroquia: [''],
      comentarios: [''],
      usuario: [''],
      createdAt: ['']
    });

    this.addDirectorioForm = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      dni: ['', [Validators.required]],
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
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
        } else {
          this.registro = docSnapshot.data().contador + 1;
        }
      }
      );
  }

  async addConfirmacion() {
    const { uid } = await this.auth.getUser();
    const autoId = this.afs.createId();
    const lugar = $('#lugarBautismo option:selected').text().substr(1);

    this.addConfirmacionForm.get('celebrante').setValue(this.micelebrante);
    this.addConfirmacionForm.get('celebrante2').setValue(this.micelebrante2);
    this.addConfirmacionForm.get('libro').setValue(parseFloat(this.milibro));
    this.addConfirmacionForm.get('numeroreg').setValue(this.registro);
    this.addConfirmacionForm.get('diocesis').setValue(this.diocesis);
    this.addConfirmacionForm.get('parroquia').setValue(this.parroquia);
    this.addConfirmacionForm.get('usuario').setValue(uid);
    this.addConfirmacionForm.get('createdAt').setValue(Date.now());
    this.addConfirmacionForm.get('lugarBautismo').setValue(lugar);
    this.addConfirmacionForm.get('documento').setValue('CONFIRMACION');
    const batch = this.afs.firestore.batch();
    this.afs.doc(`Registros/${autoId}`).set(this.addConfirmacionForm.value, { merge: true });
    batch.commit().then(() => {
      const rutaDio = this.midiocesis + '_' + this.documento;
      const value = { value: firebase.firestore.FieldValue.increment(1) };
      this.afs.doc(`Documentos/${rutaDio}`).set(value, { merge: true });
      const rutaDoc = this.miparroquia + '_' + this.documento;
      this.afs.doc(`Documentos/${rutaDoc}`).set(value, { merge: true });
      const datos = { contador: firebase.firestore.FieldValue.increment(1) };
      this.afs.doc(`Libros/${this.miruta}`).set(datos, { merge: true });
      this.afs.doc(`docs/CONFIRMACION`).set(value, { merge: true });
      this.registro += 1;
      this.addConfirmacionForm.reset();
      this.micelebrante = 'Select One';
      this.micelebrante2 = 'Select One';
    });

  }

  celebranteChanged(da) {
    this.addConfirmacionForm.get('nomceleb').enable();
    this.celebranteObs$ = this.afs.collection(`${da}`, ref => ref.where('diocesis', '==', this.midiocesis)
      .where('parroquia', '==', this.miparroquia))
      .valueChanges({ idField: 'id' });
  }

  celebranteChanged2(da) {
    this.addConfirmacionForm.get('doyfe').enable();
    this.celebranteObs2$ = this.afs.collection(`${da}`, ref => ref.where('diocesis', '==', this.midiocesis)
      .where('parroquia', '==', this.miparroquia))
      .valueChanges({ idField: 'id' });
  }

  formDirectorio() {
    jQuery(this.myModalDirectorio.nativeElement).modal('show');
  }

  formDirectorio1() {
    jQuery(this.myModalDirectorio1.nativeElement).modal('show');
  }

  formParroquia() {
    jQuery(this.myModal.nativeElement).modal('show');
  }

  addDirectorio() {
    const directorio: any = {
      nombre: this.addDirectorioForm.value.nombre,
      dni: this.addDirectorioForm.value.dni,
      diocesis: this.midiocesis,
      parroquia: this.miparroquia
    };

    this.afs.firestore.doc(`${this.micelebrante}/${directorio.dni}`).get()
      .then(docSnapshot => {
        if (docSnapshot.exists) {
          alert('Este Nombre ya se encuentra Registrado');
          this.addDirectorioForm.reset();
        } else {
          this.afs.doc(`${this.micelebrante}/${directorio.dni}`).set(directorio);
          this.addDirectorioForm.reset();
        }
      });
  }

  addDirectorio2() {
    const directorio: any = {
      nombre: this.addDirectorioForm.value.nombre,
      dni: this.addDirectorioForm.value.dni,
      diocesis: this.midiocesis,
      parroquia: this.miparroquia
    };

    this.afs.firestore.doc(`${this.micelebrante2}/${directorio.dni}`).get()
      .then(docSnapshot => {
        if (docSnapshot.exists) {
          alert('Este Nombre ya se encuentra Registrado');
          this.addDirectorioForm.reset();
        } else {
          this.afs.doc(`${this.micelebrante2}/${directorio.dni}`).set(directorio);
          this.addDirectorioForm.reset();
        }
      });
  }

  addParroquia() {

    const miId = this.addParroquiaForm.value.diocesis.replace(/ /g, '') + '_' + this.addParroquiaForm.value.parroquia.replace(/ /g, '');
    this.afs.firestore.doc(`utils/${miId}`).get()
      .then(docSnapshot => {
        if (docSnapshot.exists) {
          alert('Esta Parroquia ya se encuentra registrada');
          this.addParroquiaForm.reset();
        } else {
          this.afs.doc(`utils/${miId}`).set(this.addParroquiaForm.value, { merge: true });
          this.addParroquiaForm.reset();
        }
      });
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

  goRegistrar(libro) {
    this.router.navigate(['/diocesis', this.midiocesis, 'parroquia', this.miparroquia, 'documentos', this.documento
      , 'libros', libro.numLibro, 'registrar']);
  }

  listar(libro) {
    this.router.navigate(['/diocesis', this.midiocesis, 'parroquia', this.miparroquia, 'documentos', this.documento
      , 'libros', libro.numLibro]);
  }


  trackByFn(index, item) {
    return item.id;
  }

}
