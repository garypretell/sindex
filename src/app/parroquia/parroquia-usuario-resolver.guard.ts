import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Resolve,
  Router,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
@Injectable({
  providedIn: 'root',
})
export class ParroquiaUsuarioResolverGuard implements Resolve<Observable<any>> {
  constructor(private afs: AngularFirestore) { }
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return of(this.afs
      .collection(`usuarios`, ref => ref.where('parroquia.id', '==', route.paramMap.get('p'))).valueChanges({ idField: 'id' }));
  }
}
