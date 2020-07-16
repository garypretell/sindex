import { Component, OnInit, OnDestroy, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subject, Observable } from 'rxjs';
import { map, takeUntil, switchMap } from 'rxjs/operators';
import { ParroquiaService } from '../../parroquia/parroquia.service';
// import Swiper from 'swiper/bundle';
// import 'swiper/swiper-bundle.css';
import Swal from 'sweetalert2';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import * as firebase from 'firebase/app';
declare var jQuery: any;
declare const $;

@Component({
  selector: 'app-libro',
  templateUrl: './libro.component.html',
  styleUrls: ['./libro.component.css']
})
export class LibroComponent implements OnInit, OnDestroy, AfterViewChecked {
  numLibro: any;
  message: any;
  private unsubscribe$ = new Subject();
  @ViewChild('addMLibro') addMLibro: ElementRef;
  @ViewChild('myToast') myToast: ElementRef;
  addLibroForm: FormGroup;

  currentDate = new Date();
  midiocesis: any;
  miparroquia: any;
  documento: any;
  midocumento: any;

  diocesis: any;
  parroquia: any;

  tipoBusqueda: boolean;

  topTen$: Observable<any>;

  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    private afs: AngularFirestore,
    private activatedroute: ActivatedRoute,
    public parroquiaService: ParroquiaService
  ) { }

  sub;
  ngOnInit() {
    this.tipoBusqueda = true;
    this.parroquiaService.currentMessage.pipe(map(message => this.message = message), takeUntil(this.unsubscribe$)).subscribe();
    this.sub = this.activatedroute.paramMap.pipe(map(params => {
      this.midiocesis = params.get('d');
      this.miparroquia = params.get('p');
      this.documento = params.get('doc');
      this.midocumento = this.miparroquia + '_' + this.documento;
      this.topTen$ = this.afs.collection(`Libros`, ref => ref.where('diocesis', '==', this.midiocesis)
      .where('parroquia', '==', this.miparroquia)
      .where('documento', '==', this.midocumento).orderBy('createdAt', 'desc').limit(6)).valueChanges();
    })).subscribe();

    this.afs.doc(`Diocesis/${this.midiocesis}`).valueChanges().pipe(switchMap((m: any) => {
      return this.afs.doc(`Parroquias/${this.miparroquia}`).valueChanges().pipe(map((data: any) => {
        this.diocesis = {nombre: m.nombre, id: data.diocesis};
        this.parroquia = {nombre: data.nombre, id: data.parroquia};
      }));
    }), takeUntil(this.unsubscribe$)).subscribe();

    this.addLibroForm = this.formBuilder.group({
      numLibro: ['', [Validators.required]]
    });
  }

  ngAfterViewChecked() {
    $('.toast').toast('show');
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  goDocumentos() {
    this.router.navigate(['/diocesis', this.midiocesis, 'parroquia', this.miparroquia, 'documentos']);
  }

  goParroquia() {
    this.router.navigate(['/diocesis', this.midiocesis, 'parroquia', this.miparroquia, ]);
  }

  showModal() {
    jQuery(this.addMLibro.nativeElement).modal('show');
  }

  mostrarTodo() {
    this.router.navigate(['/diocesis', this.midiocesis, 'parroquia', this.miparroquia, 'documentos', this.documento, 'listado']);
  }

  goListado(libro) {
    // tslint:disable-next-line:max-line-length
    this.router.navigate(['/diocesis', this.midiocesis, 'parroquia', this.miparroquia, 'documentos', this.documento, 'libros', libro.numLibro]);
  }

  goLibro() {
    if (this.numLibro) {
      if (this.tipoBusqueda) {
        this.router.navigate(['/diocesis', this.midiocesis, 'parroquia', this.miparroquia,
        'documentos', this.documento, 'libros', this.numLibro, 'registrar']);
      } else {
        this.router.navigate(['/diocesis', this.midiocesis, 'parroquia', this.miparroquia,
        'documentos', this.documento, 'libros', this.numLibro]);
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Ingrese número de libro a buscar!',
      });

    }

  }

  addLibro() {
    const libro: any = {
      contador: 0,
      diocesis: this.midiocesis,
      parroquia: this.miparroquia,
      documento: this.midocumento,
      nomdoc: this.documento,
      numLibro: this.addLibroForm.value.numLibro,
      createdAt: Date.now()
    };

    const id = this.miparroquia + '_' + this.documento + '_' + this.addLibroForm.value.numLibro;
    this.afs.firestore.doc(`Libros/${id}`).get()
      .then(docSnapshot => {
        if (docSnapshot.exists) {
          alert('Este Libro ya existe!');
          this.addLibroForm.reset();
        } else {
          const ruta = this.miparroquia + '_' + this.documento;
          const datos = { Libros: firebase.firestore.FieldValue.increment(1) };
          this.afs.doc(`Documentos/${ruta}`).set(datos, { merge: true });
          this.afs.doc(`Libros/${id}`).set(libro);
          this.addLibroForm.reset();
        }
      });
  }

  registrar(libro) {
    this.router.navigate(['/diocesis', this.midiocesis, 'parroquia', this.miparroquia,
        'documentos', this.documento, 'libros', libro.numLibro, 'registrar']);
  }
}
