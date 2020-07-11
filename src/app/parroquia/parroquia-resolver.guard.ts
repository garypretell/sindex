import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Resolve,
  Router,
} from '@angular/router';
import { Observable, EMPTY, of } from 'rxjs';
import { promise } from 'protractor';
import { AngularFirestore } from '@angular/fire/firestore';
import { catchError, take, map, first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ParroquiaResolverGuard implements Resolve<Observable<any>> {
  constructor(private afs: AngularFirestore, private router: Router) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return of(this.afs
      .collection(`Parroquias`, (ref) =>
        ref
          .where('diocesis', '==', route.paramMap.get('d'))
          .orderBy('createdAt', 'asc')
      )
      .valueChanges({ idField: 'id' }));
      // .pipe(take(1));
      // .pipe(
      //   map((item) => {
      //     if (item) {
      //       console.log('items', item); // this logs just fine.
      //       return item; // this doesen't resolve the router guard.
      //     }
      //   })
      // );
  }
}
