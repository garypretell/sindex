import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import * as firebase from 'firebase/app';
import { switchMap, map, takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
declare var jQuery: any;
declare const $;

@Component({
  selector: 'app-bautismo',
  templateUrl: './bautismo.component.html',
  styleUrls: ['./bautismo.component.css']
})
export class BautismoComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject();
  @ViewChild('myModal') myModal: ElementRef;
  @ViewChild('myModalDirectorio') myModalDirectorio: ElementRef;
  @ViewChild('myModalDirectorio1') myModalDirectorio1: ElementRef;
  libro: any;
  addBautismoForm: FormGroup;
  addDirectorioForm: FormGroup;
  addLibroForm: FormGroup;
  esconder: boolean;
  registro: any;
  celebrantes: any[];
  micelebrante: any;
  micelebrante2: any;
  celebranteObs$: Observable<any>;
  celebranteObs2$: Observable<any>;

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

    this.esconder = true;
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

      this.libros$ = this.afs.collection(`Libros`, ref => ref.where('diocesis', '==', this.midiocesis)
        .where('parroquia', '==', this.miparroquia)
        .where('documento', '==', this.miparroquia + '_BAUTISMO').orderBy('createdAt', 'desc').limit(6)).valueChanges();
    });

    this.afs.doc(`Diocesis/${this.midiocesis}`).valueChanges().pipe(switchMap((m: any) => {
      return this.afs.doc(`Parroquias/${this.miparroquia}`).valueChanges().pipe(map((data: any) => {
        this.diocesis = {nombre: m.nombre, id: data.diocesis};
        this.parroquia = {nombre: data.nombre, id: data.parroquia};
      }));
    }), takeUntil(this.unsubscribe$)).subscribe();

    this.addLibroForm = this.formBuilder.group({
      numLibro: ['', [Validators.required]],
      contador: [''],
      documento: [''],
      diocesis: [''],
      parroquia: [''],
      createdAt: [''],
    });

    this.addBautismoForm = this.formBuilder.group({
      nombres: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      lugar: ['', [Validators.required]],
      fechanac: ['', [Validators.required]],
      fechareg: ['', [Validators.required]],
      fecha: ['', [Validators.required]],
      celebrante: [''],
      celebrante2: [''],
      documento: [''],
      nomceleb: ['', [Validators.required]],
      doyfe: ['', [Validators.required]],
      nomPadre: [''],
      apePadre: [''],
      lugarPadre: [''],
      nomMadre: [''],
      apeMadre: [''],
      lugarMadre: [''],
      nomPadrino: [''],
      apePadrino: [''],
      nomMadrina: [''],
      apeMadrina: [''],
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

  async addBautismo() {
    const { uid } = await this.auth.getUser();
    const autoId = this.afs.createId();
    this.addBautismoForm.get('fechanac').setValue((this.addBautismoForm.value.fechanac));
    this.addBautismoForm.get('fechareg').setValue((this.addBautismoForm.value.fechareg));
    this.addBautismoForm.get('fecha').setValue((this.addBautismoForm.value.fecha));
    this.addBautismoForm.get('celebrante').setValue(this.micelebrante);
    this.addBautismoForm.get('celebrante2').setValue(this.micelebrante2);
    this.addBautismoForm.get('libro').setValue(parseFloat(this.milibro));
    this.addBautismoForm.get('numeroreg').setValue(this.registro);
    this.addBautismoForm.get('diocesis').setValue(this.diocesis);
    this.addBautismoForm.get('parroquia').setValue(this.parroquia);
    this.addBautismoForm.get('usuario').setValue(uid);
    this.addBautismoForm.get('createdAt').setValue(Date.parse(new Date().toISOString().substring(0, 10)));
    this.addBautismoForm.get('documento').setValue('BAUTISMO');
    const batch = this.afs.firestore.batch();
    this.afs.doc(`Registros/${autoId}`).set(this.addBautismoForm.value, { merge: true });
    batch.commit().then(() => {
      const datos = { contador: firebase.firestore.FieldValue.increment(1) };
      const rutaDoc = this.miparroquia + '_' + this.documento;
      const value = { value: firebase.firestore.FieldValue.increment(1) };
      this.afs.doc(`Documentos/${rutaDoc}`).set(value, { merge: true });
      const rutaDio = this.midiocesis + '_' + this.documento;
      this.afs.doc(`Documentos/${rutaDio}`).set(value, { merge: true });
      this.afs.doc(`Libros/${this.miruta}`).set(datos, { merge: true });
      this.afs.doc(`docs/BAUTISMO`).set(value, { merge: true });
      this.registro += 1;
      this.addBautismoForm.reset();
      this.micelebrante = 'Select One';
      this.micelebrante2 = 'Select One';
    });

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

  formDirectorio() {
    jQuery(this.myModalDirectorio.nativeElement).modal('show');
  }

  formDirectorio1() {
    jQuery(this.myModalDirectorio1.nativeElement).modal('show');
  }

  celebranteChanged(da) {
    this.addBautismoForm.get('nomceleb').enable();
    this.celebranteObs$ = this.afs.collection(`${da}`, ref => ref.where('diocesis', '==', this.midiocesis)
      .where('parroquia', '==', this.miparroquia))
      .valueChanges({ idField: 'id' });
  }

  celebranteChanged2(da) {
    this.addBautismoForm.get('doyfe').enable();
    this.celebranteObs2$ = this.afs.collection(`${da}`, ref => ref.where('diocesis', '==', this.midiocesis)
      .where('parroquia', '==', this.miparroquia))
      .valueChanges({ idField: 'id' });
  }

  trackByFn(index, item) {
    return item.id;
  }

  get nombres() {
    return this.addBautismoForm.get('nombres');
  }

  get apellidos() {
    return this.addBautismoForm.get('apellidos');
  }

  get lugar() {
    return this.addBautismoForm.get('lugar');
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


}
