import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, takeUntil, groupBy, flatMap, mergeMap, toArray, switchMap, switchMapTo } from 'rxjs/operators';
import { Observable, Subject, of, from, zip } from 'rxjs';

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css']
})
export class ReporteComponent implements OnInit, OnDestroy {
  fechaActual = true;
  nomFecha = 'Día';
  max = new Date().toISOString().substring(0, 10);
  hoyF = new Date().toISOString().substring(0, 10);
  today = new Date().toISOString().substring(0, 10);
  desde = new Date().toISOString().substring(0, 10);
  hasta = new Date().toISOString().substring(0, 10);
  private unsubscribe$ = new Subject();
  midata$: Observable<any>;
  midiocesis: any;
  miparroquia: any;
  miusuario: any;
  usuarioDoc: Observable<any>;

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

  constructor(
    public afs: AngularFirestore,
    public router: Router,
    public activatedroute: ActivatedRoute,
    public auth: AuthService
  ) {
    this.view = [innerWidth / 2.0, 300];
  }

  sub;
  ngOnInit() {
    const mifecha = Date.parse(this.today);
    this.activatedroute.paramMap.pipe(switchMap(params => {
      this.usuarioDoc = this.afs.doc(`usuarios/${params.get('u')}`).valueChanges();
      this.midiocesis = params.get('d');
      this.miparroquia = params.get('p');
      this.miusuario = params.get('u');
      return this.getFecha(this.miusuario, mifecha);
    }), takeUntil(this.unsubscribe$)).subscribe();

  }

  ngOnDestroy() {
    // this.sub.unsubscribe();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onResize(event) {
    this.view = [event.target.innerWidth / 1.8, 300];
  }

  onSelect(event) {
    // console.log(event);
  }

  hoy() {
    this.today = new Date().toISOString().substring(0, 10);
    const mifecha = Date.parse(this.today);
    this.nomFecha = 'Día';
    this.fechaActual = true;
    return this.getFecha(this.miusuario, mifecha).pipe(takeUntil(this.unsubscribe$)).subscribe();
  }

  rango() {
    this.nomFecha = 'Rango de Fechas';
    this.fechaActual = false;
    this.changeBetween();
  }

  changeActual(today) {
    const mifecha = Date.parse(today);
    this.getFecha(this.miusuario, mifecha).pipe(takeUntil(this.unsubscribe$)).subscribe();
  }

  changeBetween() {
    const desde = Date.parse(this.desde);
    const hasta = Date.parse(this.hasta);
    this.getBetween(this.miusuario, desde, hasta).pipe(takeUntil(this.unsubscribe$)).subscribe();
  }

  getFecha(usuario, fecha) {
    return this.afs.collection('Registros', ref => ref.where('usuario', '==', usuario).where('createdAt', '==', fecha))
      .valueChanges().pipe(map((m: any) => {
        this.midata$ =
          of(m).pipe(
            mergeMap(res => res),
            groupBy((reg: any) => reg.documento),
            mergeMap(obs => {
              return obs.pipe(
                toArray(),
                map(apps => {
                  return { name: obs.key, value: apps.length };
                }));
            }),
            toArray()
          );
      }));
  }

  getBetween(usuario, desde, hasta) {
    return this.afs.collection('Registros', ref => ref.where('usuario', '==', usuario).where('createdAt', '>=', desde).where('createdAt', '<=', hasta).orderBy('createdAt'))
      .valueChanges().pipe(map((m: any) => {
        this.midata$ =
          of(m).pipe(
            mergeMap(res => res),
            groupBy((reg: any) => reg.documento),
            mergeMap(obs => {
              return obs.pipe(
                toArray(),
                map(apps => {
                  return { name: obs.key, value: apps.length };
                }));
            }),
            toArray()
          );
      }));
  }

  trackByFn(index, item) {
    return item.id;
  }

}
