import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { switchMap, map, takeUntil } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { BuscarBautismoComponent } from '../buscar-bautismo/buscar-bautismo.component';
import { BuscarConfirmacionComponent } from '../buscar-confirmacion/buscar-confirmacion.component';
declare var jQuery: any;
declare const $;


@Component({
  selector: 'app-buscar-registro',
  templateUrl: './buscar-registro.component.html',
  styleUrls: ['./buscar-registro.component.css']
})
export class BuscarRegistroComponent implements OnInit, OnDestroy {
  @ViewChild('myModalEdit') myModalEdit: ElementRef;
  @ViewChild(BuscarBautismoComponent) childBautismo: BuscarBautismoComponent;
  @ViewChild(BuscarConfirmacionComponent) childConfirmacion: BuscarConfirmacionComponent;
  // @ViewChild(BuscarBautismoComponent) childDefuncion: BuscarBautismoComponent;
  private unsubscribe$ = new Subject();
  max = new Date().toISOString().substring(0, 10);
  hoyF = new Date().toISOString().substring(0, 10);
  today = new Date().toISOString().substring(0, 10);
  desde = new Date().toISOString().substring(0, 10);
  hasta = new Date().toISOString().substring(0, 10);

  avanzada = false;
  fecha = false;
  principal: any;
  campos$: Observable<any>;
  registros$: Observable<any>;
  registros: any[];
  p = 1;
  searchObject: any = {};
  editarRegistro: any = {};

  micodigo: any;
  midiocesis: any;
  miparroquia: any;
  parroquia: any;
  documento: any;
  midocumento: any;
  constructor(
    private activatedroute: ActivatedRoute,
    public afs: AngularFirestore,
    public router: Router,
    public auth: AuthService
  ) { }

  sub;
  ngOnInit() {
    this.sub = this.activatedroute.paramMap.pipe(switchMap(params => {
      this.midiocesis = params.get('d');
      this.miparroquia = params.get('p');
      this.documento = params.get('doc');
      this.midocumento = this.miparroquia + '_' + this.documento;
      this.documento = params.get('doc');
      this.campos$ = this.afs.doc(`Plantillas/${this.midocumento}`).valueChanges();
      // this.registros$ = this.afs.collection(`Registros`, ref => ref
      // .where('parroquia.id', '==', this.miparroquia).where('documento', '==', this.documento)
      // .orderBy('createdAt', 'asc')).valueChanges({ idField: 'id' });
      return this.afs.doc(`Parroquias/${params.get('p')}`).valueChanges().pipe(map((m: any) => {
        this.principal = m.principal;
        return m;
      }));
    })).subscribe();

    this.afs.doc(`Diocesis/${this.midiocesis}`).valueChanges().pipe(switchMap((m: any) => {
      return this.afs.doc(`Parroquias/${this.miparroquia}`).valueChanges().pipe(map((data: any) => {
        this.parroquia = { nombre: data.nombre, id: data.parroquia };
      }));
    }), takeUntil(this.unsubscribe$)).subscribe();

  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  search() {
    if (this.fecha) {
      if (this.searchObject.apellidos && this.searchObject.nombres) {
        const apellidos = this.searchObject.apellidos;
        const nombres = this.searchObject.nombres;
        this.afs.collection(`Registros`, ref => ref.where('parroquia.id', '==', this.miparroquia)
          .where('documento', '==', this.documento)
          .orderBy('apellidos').orderBy('nombres')
          .startAt(apellidos, nombres).endAt((apellidos + '\uf8ff'), (nombres + '\uf8ff'))
        ).valueChanges({ idField: 'id' }).pipe(map((m: any) => {
          this.registros = m.filter((f: any) => {
            return f.fecha >= (this.desde) && f.fecha <= (this.hasta);
          });
          return this.registros;
        })).subscribe();
      }

    } else {
      if (this.searchObject.apellidos && this.searchObject.nombres) {
        const apellidos = this.searchObject.apellidos;
        const nombres = this.searchObject.nombres;
        this.afs.collection(`Registros`, ref => ref.where('parroquia.id', '==', this.miparroquia)
          .where('documento', '==', this.documento)
          .orderBy('apellidos').orderBy('nombres')
          .startAt(apellidos, nombres).endAt((apellidos + '\uf8ff'), (nombres + '\uf8ff'))
        ).valueChanges({ idField: 'id' }).pipe(map((m: any) => {
          this.registros = m;
        })).subscribe();
      }
    }
  }

  printLibro() { }
  goParroquia() {
    this.router.navigate(['/diocesis', this.midiocesis, 'parroquia', this.miparroquia]);
  }

  goDocumento() {
    this.router.navigate(['/diocesis', this.midiocesis, 'parroquia', this.miparroquia, 'documentos']);
  }

  searchAvanzada() {
    if (!this.avanzada) {
      this.fecha = false;
    }
  }

  enableEditing(item) {
    this.afs.doc(`Registros/${item.id}`).valueChanges().pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      this.editarRegistro = data;
    });
    this.micodigo = item.id;
    this.callChild(this.documento);
  }

  callChild(documento) {
    switch (documento) {
      case 'BAUTISMO':
        this.childBautismo.enableEditing();
        break;
      case 'CONFIRMACION':
        this.childConfirmacion.enableEditing();
        break;
      case 'DEFUNCION':
        // Declaraciones ejecutadas cuando el resultado de expresión coincide con el valor2
        break;
      case 'MATRIMONIO':
        // Declaraciones ejecutadas cuando el resultado de expresión coincide con valorN
        break;
      default:
        // Declaraciones ejecutadas cuando ninguno de los valores coincide con el valor de la expresión
        break;
    }
  }

  seleccionarChild(documento, item) {
    switch (documento) {
      case 'BAUTISMO':
        this.childBautismo.seleccionar(item);
        break;
      case 'CONFIRMACION':
        this.childConfirmacion.enableEditing();
        break;
      case 'DEFUNCION':
        // Declaraciones ejecutadas cuando el resultado de expresión coincide con el valor2
        break;
      case 'MATRIMONIO':
        // Declaraciones ejecutadas cuando el resultado de expresión coincide con valorN
        break;
      default:
        // Declaraciones ejecutadas cuando ninguno de los valores coincide con el valor de la expresión
        break;
    }
  }

  print(item) {
    this.printChild(this.documento, item);
  }

  seleccionar(item) {
    this.editarRegistro = item;
    this.seleccionarChild(this.documento, item);
  }

  printChild(documento, item) {
    switch (documento) {
      case 'BAUTISMO':
        this.childBautismo.print(item);
        break;
      case 'CONFIRMACION':
        this.childConfirmacion.enableEditing();
        break;
      case 'DEFUNCION':
        // Declaraciones ejecutadas cuando el resultado de expresión coincide con el valor2
        break;
      case 'MATRIMONIO':
        // Declaraciones ejecutadas cuando el resultado de expresión coincide con valorN
        break;
      default:
        // Declaraciones ejecutadas cuando ninguno de los valores coincide con el valor de la expresión
        break;
    }
  }

}
