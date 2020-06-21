import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';

import { map, switchMap } from 'rxjs/operators';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { Diocesis } from './models';
import { HttpClient } from '@angular/common/http';


@Injectable({
    providedIn: 'root'
  })
export class DiocesisService {
  diocesisCollection: AngularFirestoreCollection<Diocesis>;
  diocesis$: Observable<Diocesis[]>;
  diocesisDoc: AngularFirestoreDocument<Diocesis>;
  p: 1;
  nombreFilter$: BehaviorSubject<any|null>;
  diocesisItems$: Observable<any[]>;

  constructor(public afs: AngularFirestore,  private http: HttpClient) {

    this.diocesisCollection = afs.collection<Diocesis>('Diocesis', ref => ref.orderBy('createdAt', 'desc'));
    this.diocesis$ = this.diocesisCollection.valueChanges({idField: 'id'});
    this.nombreFilter$ = new BehaviorSubject(null);
    this.diocesisItems$ = combineLatest(
      this.nombreFilter$
    ).pipe(
      switchMap(([nombre]) =>
      afs.collection('Diocesis', ref => {
        let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
        if (nombre) { query = query.where('nombre', '==', nombre ).orderBy('createdAt', 'desc'); }
        return query;
      }).valueChanges({idField: 'id'})));
  }

  listarDiocesis() {
    return this.diocesis$;
  }

  crearDiocesis(diocesis: Diocesis) {
    // const obj = Object.assign(proyecto);
    return  this.diocesisCollection.add(diocesis);
  }

  eliminarDiocesis(diocesis: Diocesis) {
    this.diocesisDoc = this.afs.doc(`Diocesis/${diocesis.id}`);
    diocesis.estado = false;
    return this.diocesisDoc.update(diocesis);
  }

  actualizarDiocesis(diocesis: Diocesis) {
    this.diocesisDoc = this.afs.doc(`Diocesis/${diocesis.id}`);
    return  this.diocesisDoc.update(diocesis);
  }

  filterByNombre(nombre: string|null) {
    this.nombreFilter$.next(nombre);
  }

  public getDepartamentos(): Observable<any> {
    return this.http.get('../assets/ubigeo-peru.json').pipe(map((res: any) => res));
  }

}
