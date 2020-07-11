import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DocumentoService {
  documentosCollection: AngularFirestoreCollection<any>;
  documentos$: Observable<any[]>;
  documentoDoc: AngularFirestoreDocument<any>;
  constructor(public afs: AngularFirestore,  private http: HttpClient) {
    this.documentosCollection = afs.collection<any>('charts');
    this.documentos$ = this.documentosCollection.valueChanges({idField: 'id'});
   }


   getDocumentos() { return this.documentos$; }
   getDocumento(id) {
    return this.afs.collection(`Documentos`, ref => ref.where('parroquia', '==', id)).valueChanges({idField: 'id'});
  }

   addDocumento(documento: any) { return this.documentosCollection.add(documento); }

   deleteDocumento(documento: any) {
    this.documentoDoc = this.afs.doc(`Documento/${documento.id}`);
    documento.estado = false;
    return this.documentoDoc.update(documento);
   }

   updateDocumento(documento: any) {
    this.documentoDoc = this.afs.doc(`Documento/${documento.id}`);
    return this.documentoDoc.update(documento);
   }
}
