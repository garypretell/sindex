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
  private unsubscribe$ = new Subject();
  midata$: Observable<any>;
  apps$: Observable<any>;
  midiocesis: any;
  miparroquia: any;
  miusuario: any;

  constructor(
    public afs: AngularFirestore,
    public router: Router,
    public activatedroute: ActivatedRoute,
    public auth: AuthService
  ) { }

  sub;
  ngOnInit() {
    this.midata$ = this.afs.collection('Registrsos').valueChanges().pipe(map(m => {
      return m.map((v: any) => {
        return ({ ...v, valor: v.value });
      });
    }));

    this.activatedroute.paramMap.pipe(switchMap(params => {
      this.midiocesis = params.get('d');
      this.miparroquia = params.get('p');
      this.miusuario = params.get('u');
      return this.afs.collection('Registros', ref => ref.where('usuarioid', '==', params.get('u')))
        .valueChanges().pipe(map((m: any) => {
          // this.midata$ =
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
          ).subscribe(data => console.log(data));
        }));
    }), takeUntil(this.unsubscribe$)).subscribe();

  }

  ngOnDestroy() {
    // this.sub.unsubscribe();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
