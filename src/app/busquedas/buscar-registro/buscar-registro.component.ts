import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { switchMap, map, takeUntil } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';

@Component({
  selector: 'app-buscar-registro',
  templateUrl: './buscar-registro.component.html',
  styleUrls: ['./buscar-registro.component.css']
})
export class BuscarRegistroComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject();
  avanzada = false;
  fecha = false;
  principal: any;
  campos$: Observable<any>;
  registros$: Observable<any>;
  registros: any[];
  p = 1;
  searchObject: any = {};

  midiocesis: any;
  miparroquia: any;
  parroquia: any;
  documento: any;
  midocumento: any;
  constructor(
    private activatedroute: ActivatedRoute,
    public afs: AngularFirestore,
    public router: Router,
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

  search(search) {
    if (this.fecha) {
      const apellidos = this.searchObject.apellidos;
      const nombres = this.searchObject.nombres;
      this.afs.collection(`Registros`, ref => ref.where('parroquia.id', '==', this.miparroquia)
        .where('documento', '==', this.documento)
        .orderBy('apellidos').orderBy('nombres')
        .startAt(apellidos, nombres).endAt((apellidos + '\uf8ff'), (nombres + '\uf8ff'))
      ).valueChanges({ idField: 'id' }).pipe(map((m: any) => {
        this.registros = m.filter((f: any) => {
          return f.fecha >= Date.parse(this.searchObject.desde) && f.fecha <= Date.parse(this.searchObject.hasta);
        });
        return this.registros;
      })).subscribe();
    } else {
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

}
