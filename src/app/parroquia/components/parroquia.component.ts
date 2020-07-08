import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { switchMap, map } from 'rxjs/operators';
import { Subject, Observable, of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

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
  today: number = Date.now();

  items: Observable<any[]>;
  data: any;

  midiocesis;
  miparroquia: any;

  constructor(
    public auth: AuthService,
    public afs: AngularFirestore,
    private activatedroute: ActivatedRoute,
    public router: Router,
  ) {
  }

  sub;
  ngOnInit() {
    this.sub = this.auth.user$.pipe(switchMap((m: any) => {
      if (m) {
        return this.afs.doc(`Parroquias/${m.parroquia.id}`).valueChanges().pipe(map((data: any) => {
          if (data) {
            this.miparroquia = m.parroquia.id;
            this.principal = data.principal;
            this.estaparroquia = data;
          }
        }));
      }
      else {
        return of(null);
      }
    }),
      switchMap(d => {
        return this.activatedroute.paramMap.pipe(map(params => {
          this.items = this.afs.collection<any>(`Parroquias`, ref => ref.where('diocesis', '==', params.get('d'))
            .orderBy('createdAt', 'asc')).valueChanges({ idField: 'id' });
          this.data = params.get('d');
        }));
      })).subscribe();
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

  goDocumentos(parroquia) {
    this.router.navigate(['/diocesis', parroquia.diocesis, 'parroquia', parroquia.id, 'documentos']);
  }

}
