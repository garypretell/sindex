import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { switchMap, map } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-parroquia',
  templateUrl: './parroquia.component.html',
  styleUrls: ['./parroquia.component.css']
})
export class ParroquiaComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject();

  estaparroquia: any = {};
  searchObject: any = {};
  principal: boolean;
  fechaActual: any;

  items: Observable<any[]>;
  data: any;

  midiocesis;
  miparroquia: any;

  single: any[];
  multi: any[];

  view: any[];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'DOCUMENTO';
  showYAxisLabel = true;
  yAxisLabel = 'REGISTROS';

  constructor(public auth: AuthService,
              public afs: AngularFirestore,
              private activatedroute: ActivatedRoute
              ) {
              }

  sub;
  ngOnInit() {
    this.view = [innerWidth / 2.0, 300];
    this.fechaActual = new Date();
    this.sub = this.auth.user$.pipe(switchMap((m: any) => {
      return this.afs.doc(`Parroquias/${m.parroquia.id}`).valueChanges().pipe(map((data: any) => {
        if (data) {
          this.miparroquia = m.parroquia.id;
          this.principal = data.principal;
          this.estaparroquia = data;
        }
      }));
    }),
    switchMap(d => {
      return this.activatedroute.paramMap.pipe(map(params => {
        this.items = this.afs.collection<any>(`Parroquias`, ref => ref.where('diocesis', '==', params.get('d'))
        .orderBy('createdAt', 'asc')).valueChanges({ idField: 'id' });
        this.data = params.get('d');
      }));
    })).subscribe();

    this.sub = this.afs.collection('charts', ref => ref.where('code', '==', 'aa')).valueChanges()
      .subscribe(data => {
        this.single = data;
      });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  goPago() {

  }

  enableEditar($event, estaparroquia) {

  }

  onSelect(event) {
    console.log(event);
  }

  onResize(event) {
    this.view = [event.target.innerWidth / 1.8, 300];
  }

}
