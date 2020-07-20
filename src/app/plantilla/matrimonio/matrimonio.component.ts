import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { takeUntil, switchMap, map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import * as firebase from 'firebase/app';
declare var jQuery: any;
declare const $;

@Component({
  selector: 'app-matrimonio',
  templateUrl: './matrimonio.component.html',
  styleUrls: ['./matrimonio.component.css']
})
export class MatrimonioComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject();
  @ViewChild('myModalDirectorio') myModalDirectorio: ElementRef;
  @ViewChild('myModalDirectorio1') myModalDirectorio1: ElementRef;
  @ViewChild('myModal') myModal: ElementRef;
  utils$: Observable<any>;
  libros$: Observable<any>;

  addParroquiaForm: FormGroup;
  addMatrimonioForm: FormGroup;
  addDirectorioForm: FormGroup;

  celebrantes: any[];
  micelebrante: any;
  micelebrante2: any;
  celebranteObs$: Observable<any>;
  celebranteObs2$: Observable<any>;
  ultimosacramentoArray: any[] = [];
  estadocivilArray: any[] = [];


  midiocesis: any;
  miparroquia: any;
  midocumento: any;
  documento: any;
  milibro: any;
  miruta: any;
  diocesis: any;
  parroquia: any;
  registro: any;

  constructor(
    public auth: AuthService,
    public formBuilder: FormBuilder,
    public afs: AngularFirestore,
    private router: Router,
    private activatedroute: ActivatedRoute
  ) {
    this.celebrantes = [{ id: 1, nombre: 'Diacono' }, { id: 2, nombre: 'Obispo' }, { id: 3, nombre: 'Presbitero' }];
    this.estadocivilArray = [{ id: 1, nombre: 'Casada' }, { id: 2, nombre: 'Casado' }, { id: 3, nombre: 'Soltera' },
    { id: 4, nombre: 'Soltero' }, { id: 5, nombre: 'Unión Libre' }, { id: 6, nombre: 'Viuda' }, { id: 7, nombre: 'Viudo' }];
    this.ultimosacramentoArray = [{ id: 1, nombre: 'SI' }, { id: 2, nombre: 'NO' }];
  }

  sub;
  ngOnInit() {
    this.utils$ = this.afs.collection('utils').valueChanges({ idField: 'id' });
    this.sub = this.activatedroute.paramMap.subscribe(params => {
      this.midiocesis = params.get('d');
      this.miparroquia = params.get('p');
      this.documento = params.get('doc');
      this.midocumento = this.miparroquia + '_' + this.documento;
      this.milibro = params.get('l');
      this.miruta = this.midocumento + '_' + this.milibro;
      this.actualizarData(this.miruta);
      this.libros$ = this.afs.collection(`Libros`, ref => ref.where('diocesis', '==', this.midiocesis)
        .where('parroquia', '==', this.miparroquia)
        .where('documento', '==', this.miparroquia + '_MATRIMONIO').orderBy('createdAt', 'desc').limit(6)).valueChanges();
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

    this.addMatrimonioForm = this.formBuilder.group({
      fecha: ['', [Validators.required]],
      fechareg: ['', [Validators.required]],
      celebrante: [''],
      nomceleb: ['', [Validators.required]],

      nombres: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      dni: ['', [Validators.required]],
      nompadreP: [''],
      nommadreP: [''],
      lugarP: [''],
      fechaP: [''],
      libroP: [''],
      regP: [''],


      nombresM: ['', [Validators.required]],
      apellidosM: ['', [Validators.required]],
      dniM: ['', [Validators.required]],
      nompadreM: [''],
      nommadreM: [''],
      lugarM: [''],
      fechaM: [''],
      libroM: [''],
      regM: [''],

      celebrante2: [''],
      doyfe: ['', [Validators.required]],

      documento: [''],

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

  formDirectorio() {
    jQuery(this.myModalDirectorio.nativeElement).modal('show');
  }

  async addMatrimonio() {
    const { uid } = await this.auth.getUser();
    const autoId = this.afs.createId();
    this.addMatrimonioForm.get('celebrante').setValue(this.micelebrante);
    this.addMatrimonioForm.get('celebrante2').setValue(this.micelebrante2);
    this.addMatrimonioForm.get('libro').setValue(parseFloat(this.milibro));
    this.addMatrimonioForm.get('numeroreg').setValue(this.registro);
    this.addMatrimonioForm.get('diocesis').setValue(this.diocesis);
    this.addMatrimonioForm.get('parroquia').setValue(this.parroquia);
    this.addMatrimonioForm.get('usuario').setValue(uid);
    this.addMatrimonioForm.get('createdAt').setValue(Date.now());
    this.addMatrimonioForm.get('documento').setValue('MATRIMONIO');

    const batch = this.afs.firestore.batch();
    this.afs.doc(`Registros/${autoId}`).set(this.addMatrimonioForm.value, { merge: true });
    batch.commit().then(() => {
      const rutaDoc = this.miparroquia + '_' + this.documento;
      const value = { value: firebase.firestore.FieldValue.increment(1) };
      this.afs.doc(`Documentos/${rutaDoc}`).set(value, { merge: true });
      const datos = { contador: firebase.firestore.FieldValue.increment(1) };
      this.afs.doc(`Libros/${this.miruta}`).set(datos, { merge: true });
      this.afs.doc(`docs/MATRIMONIO`).set(datos, { merge: true });
      this.registro += 1;
      this.addMatrimonioForm.reset();
      this.micelebrante = 'Select One';
      this.micelebrante2 = 'Select One';
    });

  }

  celebranteChanged2(c) {
    this.addMatrimonioForm.get('doyfe').enable();
    this.celebranteObs2$ = this.afs.collection(`${c}`, ref => ref.where('diocesis', '==', this.midiocesis)
      .where('parroquia', '==', this.miparroquia))
      .valueChanges({ idField: 'id' });
  }

  celebranteChanged(c) {
    this.addMatrimonioForm.get('nomceleb').enable();
    this.celebranteObs$ = this.afs.collection(`${c}`, ref => ref.where('diocesis', '==', this.midiocesis)
      .where('parroquia', '==', this.miparroquia))
      .valueChanges({ idField: 'id' });
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

  formDirectorio1() {
    jQuery(this.myModalDirectorio1.nativeElement).modal('show');
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
