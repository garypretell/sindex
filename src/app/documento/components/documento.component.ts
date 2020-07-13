import { Component, OnInit, ViewChild, ElementRef, OnDestroy, Input, AfterViewInit, AfterViewChecked } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/auth/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { map, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { DocumentoService } from '../documento.service';
import { ParroquiaService } from 'src/app/parroquia/parroquia.service';
declare var jQuery: any;
declare const $;

@Component({
  selector: 'app-documento',
  templateUrl: './documento.component.html',
  styleUrls: ['./documento.component.css']
})
export class DocumentoComponent implements OnInit, OnDestroy, AfterViewChecked {
  message: string;

  private unsubscribe$ = new Subject();
  @ViewChild('editModal') editModal: ElementRef;
  docs$: Observable<any>;
  documentos$: Observable<any>;
  parroquia$: Observable<any>;
  documentotoEdit: any = {};
  checkBoxValue: boolean;

  plantilla: boolean;

  midiocesis: any;
  miparroquia: any;

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
    this.sub = this.parroquiaService.currentMessage.subscribe(message => this.message = message);
    this.sub = this.activatedroute.paramMap.pipe(map(params => {
      this.parroquia$ = this.afs.doc(`Parroquias/${params.get('p')}`).valueChanges();
      this.documentos$ = this.afs.collection('Documentos', ref => ref.where('parroquia', '==', params.get('p'))
        .orderBy('name', 'asc')).valueChanges();
      this.midiocesis = params.get('d');
      this.miparroquia = params.get('p');
    })).subscribe();
    this.docs$ = this.afs.collection(`docs`).valueChanges({idField: 'id'});
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
    console.log(event);
  }

  onResize(event) {
    this.view = [event.target.innerWidth / 1.8, 300];
  }

  agregarDocumentos() {
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
    documentos.map((m: any) => {
      const ruta = this.miparroquia + '_' + m.id;
      this.afs.doc(`Documentos/${ruta}`).set(m);
    });
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
    // this.location.back();
  }

  goLibro(documento) {
    // const array = ['BAUTISMO', 'MATRIMONIO', 'DEFUNCION', 'CONFIRMACION'];
    // const value = documento.nombre;
    // const isInArray = array.includes(value);

    // if ( isInArray === false) {
    //   return this.router.navigate
    //   (['/Diocesis', this.midiocesis, 'Parroquia', this.miparroquia, 'Documento', documento.nombre, 'Registro']);
    // }
    this.router.navigate(['/diocesis', this.midiocesis, 'parroquia', this.miparroquia, 'documentos', documento.id, 'libros']);
  }

}
