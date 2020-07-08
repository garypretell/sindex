import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ParroquiaService {
  parroquiasCollection: AngularFirestoreCollection<any>;
  parroquias$: Observable<any[]>;
  parroquiaDoc: AngularFirestoreDocument<any>;
  constructor(public afs: AngularFirestore,  private http: HttpClient) {
    this.parroquiasCollection = afs.collection<any>('Parroquias');
    this.parroquias$ = this.parroquiasCollection.valueChanges({idField: 'id'});
   }


   getparroquias() { return this.parroquias$; }

   getParroquia(id) {
     return this.afs.collection(`Parroquias`, ref => ref.where('diocesis', '==', id)).valueChanges({idField: 'id'});
   }

   addparroquia(parroquia: any) { return this.parroquiasCollection.add(parroquia); }

   deleteparroquia(parroquia: any) {
    this.parroquiaDoc = this.afs.doc(`parroquia/${parroquia.id}`);
    parroquia.estado = false;
    return this.parroquiaDoc.update(parroquia);
   }

   updateparroquia(parroquia: any) {
    this.parroquiaDoc = this.afs.doc(`parroquia/${parroquia.id}`);
    return this.parroquiaDoc.update(parroquia);
   }
}
