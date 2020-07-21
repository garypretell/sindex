import { Component, OnInit, ViewChild, ElementRef, OnDestroy, Input, AfterViewInit, AfterViewChecked } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/auth/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { map, takeUntil, switchMap } from 'rxjs/operators';
import { Observable, Subject, of } from 'rxjs';
import { DocumentoService } from '../documento.service';
import { ParroquiaService } from 'src/app/parroquia/parroquia.service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
declare var jQuery: any;
declare const $;

@Component({
  selector: 'app-documento',
  templateUrl: './documento.component.html',
  styleUrls: ['./documento.component.css']
})
export class DocumentoComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('myModal') myModal: ElementRef;
  message: string;

  private unsubscribe$ = new Subject();
  @ViewChild('editModal') editModal: ElementRef;
  docs$: Observable<any>;
  documentos$: Observable<any>;
  parroquia$: Observable<any>;
  documentotoEdit: any = {};
  searchDoc: any = {};
  checkBoxValue: boolean;

  plantilla: boolean;

  midiocesis: any;
  miparroquia: any;
  diocesis: any;
  parroquia: any;

  public addDocumentoForm: FormGroup;
  today: number = Date.now();

  view: any[];

  // options
  showDataLabel = true;
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'DOCUMENTO';
  showYAxisLabel = true;
  yAxisLabel = 'REGISTROS';
  nombreGrafica: any;
  constructor(
    public formBuilder: FormBuilder,
    private location: Location,
    public auth: AuthService,
    public router: Router,
    private afs: AngularFirestore,
    private activatedroute: ActivatedRoute,
    public documentoService: DocumentoService,
    public parroquiaService: ParroquiaService
  ) {
    this.view = [innerWidth / 2.0, 300];
    this.checkBoxValue = false;
  }

  sub;
  ngOnInit() {
    this.sub = this.activatedroute.paramMap.pipe(map(params => {
      this.parroquia$ = this.afs.doc(`Parroquias/${params.get('p')}`).valueChanges();
      this.documentos$ = this.afs.collection('Documentos', ref => ref.where('parroquia', '==', params.get('p'))
        .orderBy('createdAt', 'desc')).valueChanges({ idField: 'ids' });
      this.midiocesis = params.get('d');
      this.miparroquia = params.get('p');
    })).subscribe();
    this.docs$ = this.afs.collection(`docs`).valueChanges({ idField: 'id' });

    this.afs.doc(`Diocesis/${this.midiocesis}`).valueChanges().pipe(switchMap((m: any) => {
      return this.afs.doc(`Parroquias/${this.miparroquia}`).valueChanges().pipe(map((data: any) => {
        this.diocesis = { nombre: m.nombre, id: data.diocesis };
        this.parroquia = { nombre: data.nombre, id: data.parroquia };
      }));
    }), takeUntil(this.unsubscribe$)).subscribe();

    this.addDocumentoForm = this.formBuilder.group({
      nombre: ['', [Validators.required]]
    });
  }

  ngAfterViewChecked() {
    $('[data-toggle="tooltip"]').tooltip();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onSelect(event) {
    // console.log(event);
  }

  onResize(event) {
    this.view = [event.target.innerWidth / 1.8, 300];
  }

  async agregarDocumentos() {
    const documentos: any = [
      {
        id: 'BAUTISMO', name: 'BAUTISMO', value: 0, total_aprox: 100000, Libros: 0, principal: true, plantilla: true
        , diocesis: this.midiocesis, parroquia: this.miparroquia, createdAt: Date.now()
      },
      {
        id: 'CONFIRMACION', name: 'CONFIRMACION', value: 0, total_aprox: 100000, Libros: 0, principal: true, plantilla: true
        , diocesis: this.midiocesis, parroquia: this.miparroquia, createdAt: Date.now()
      },
      {
        id: 'DEFUNCION', name: 'DEFUNCION', value: 0, total_aprox: 100000, Libros: 0, principal: true, plantilla: true
        , diocesis: this.midiocesis, parroquia: this.miparroquia, createdAt: Date.now()
      },
      {
        id: 'MATRIMONIO', name: 'MATRIMONIO', value: 0, total_aprox: 100000, Libros: 0, principal: true, plantilla: true,
        diocesis: this.midiocesis, parroquia: this.miparroquia, createdAt: Date.now()
      }];

    const diocesisArray: any = [
      {
        id: 'BAUTISMO', name: 'BAUTISMO', value: 0, diocesis: this.midiocesis, estado: 'diocesis'
      },
      {
        id: 'CONFIRMACION', name: 'CONFIRMACION', value: 0, diocesis: this.midiocesis, estado: 'diocesis'
      },
      {
        id: 'DEFUNCION', name: 'DEFUNCION', value: 0, diocesis: this.midiocesis, estado: 'diocesis'
      },
      {
        id: 'MATRIMONIO', name: 'MATRIMONIO', value: 0, diocesis: this.midiocesis, estado: 'diocesis'
      }];

    documentos.map((m: any) => {
      const rutaDiocesis = this.midiocesis + '_' + m.id;
      const ruta = this.miparroquia + '_' + m.id;
      this.afs.doc(`Documentos/${ruta}`).set(m);
    });

    this.afs.doc(`Parroquias/${this.miparroquia}`).valueChanges().pipe(map((data: any) => {
      if (data) {
        const roles = data.principal;
        if (roles) {
          diocesisArray.map((m: any) => {
            const rutaDiocesis = this.midiocesis + '_' + m.id;
            this.afs.doc(`Documentos/${rutaDiocesis}`).set(m);
          });
        }
      } else {
        return of(null);
      }
    }), takeUntil(this.unsubscribe$)).subscribe();

    this.afs.doc(`Parroquias/${this.miparroquia}`).set({ registrar: true }, { merge: true });
  }

  updateDocumento(documento) {
    const id = this.miparroquia + '_' + documento.id;
    this.afs.doc(`Documentos/${id}`).update(this.documentotoEdit);
    jQuery(this.editModal.nativeElement).modal('hide');
  }

  editDocumento(documento) {
    $('[data-toggle="tooltip"]').tooltip('hide');
    const id = this.miparroquia + '_' + documento.id;
    this.afs.doc(`Documentos/${id}`).valueChanges().pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      this.documentotoEdit = data;
    });
    jQuery(this.editModal.nativeElement).modal('show');
  }

  backClicked() {
    this.router.navigate(['/diocesis', this.midiocesis, 'parroquia', this.miparroquia]);
  }

  goLibro(documento) {
    this.router.navigate(['/diocesis', this.midiocesis, 'parroquia', this.miparroquia, 'documentos', documento.id, 'libros']);
  }

  getColor(documento) {
    switch (documento) {
      case true:
        return 'green';
      case false:
        return 'black';
    }
  }

  showModal() {
    jQuery(this.myModal.nativeElement).modal('show');
  }

  addDocumento() {
    const documento: any = {
      id: (this.addDocumentoForm.value.nombre).replace(/ /g, ''),
      nombre: this.addDocumentoForm.value.nombre,
      name: this.addDocumentoForm.value.nombre,
      Libros: 0,
      principal: false,
      diocesis: this.midiocesis,
      parroquia: this.miparroquia,
      plantilla: false,
      value: 0,
      createdAt: Date.now()
    };
    const ruta = this.miparroquia + '_' + documento.id;
    const rutaDiocesis = this.midiocesis + '_' + documento.id;
    this.afs.firestore.doc(`Documentos/${ruta}`).get()
      .then(docSnapshot => {
        if (docSnapshot.exists) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Este documento ya existe!',
          });
          this.addDocumentoForm.reset();
        } else {
          this.afs.doc(`Documentos/${ruta}`).set(documento);
          this.addDocumentoForm.reset();
          jQuery(this.myModal.nativeElement).modal('hide');
        }
      });
  }

  deleteDocumento(documento) {
    Swal.fire({
      title: 'Esta seguro de eliminar este Documento?',
      // text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar!'
    }).then((result) => {
      if (result.value) {
        this.afs.doc(`Documentos/${documento.ids}`).delete();
        Swal.fire(
          'Eliminado!',
          'El documento ha sido eliminado.',
          'success'
        );
      }
    });
  }

  goPlantilla(documento) {
    this.router.navigate(['/diocesis', this.midiocesis, 'parroquia', this.miparroquia,
      'documentos', documento.id, 'template']);
  }

  buscarDocumentos(documento) {
    const array = ['BAUTISMO', 'MATRIMONIO', 'DEFUNCION', 'CONFIRMACION'];
    const value = documento.id;
    const isInArray = array.includes(value);
    if (isInArray) {
      return this.router.navigate(['/diocesis', this.midiocesis, 'parroquia', this.miparroquia,
        'documentos', documento.id, 'buscar']);
    }
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'No tiene acceso a esta funcionalidad!',
      footer: '<a href>Desea ponerse en contacto con el Administrador?</a>'
    });
  }


}
