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
export class UsuarioResolverGuard implements Resolve<Observable<any>> {
  constructor(private afs: AngularFirestore, public router: Router) { }
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return of(this.afs
      .collection(`usuarios`).valueChanges({ idField: 'id' }));
  }
}
