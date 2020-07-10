import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { firestore } from 'firebase/app';

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
     return  this.afs.collection(`Parroquias`, ref => ref.where('diocesis', '==', id)).valueChanges({idField: 'id'});
   }

   async createParroquias(parroquia) {
    this.afs.doc(`Parroquias/${(parroquia.parroquia)}`).set(parroquia, { merge: true });
    const diocesis: any = {
      id: parroquia.parroquia,
      nombre: parroquia.nombre
    };
    await this.afs.doc(`Diocesis/${parroquia.diocesis}`).update({
      parroquias: firestore.FieldValue.arrayUnion(diocesis)
    });
  }

  async removeParroquias(parroquia: any) {
    const diocesis: any = {
      id: parroquia.parroquia,
      nombre: parroquia.nombre
    };
    await this.afs.doc(`Diocesis/${parroquia.diocesis}`).update({
      parroquias: firestore.FieldValue.arrayRemove(diocesis)
    });
    this.parroquiaDoc = this.afs.doc(`Parroquias/${parroquia.id}`);
    parroquia.estado = false;
    return this.parroquiaDoc.update(parroquia);

  }

  async updateParroquias(parroquia: any) {
    if (parroquia.estado === true) {
      const diocesis: any = {
        id: parroquia.parroquia,
        nombre: parroquia.nombre
      };
      await this.afs.doc(`Diocesis/${parroquia.diocesis}`).update({
        parroquias: firestore.FieldValue.arrayUnion(diocesis)
      });
    }
    this.parroquiaDoc = this.afs.doc(`Parroquias/${parroquia.id}`);
    return this.parroquiaDoc.update(parroquia);
  }
}
