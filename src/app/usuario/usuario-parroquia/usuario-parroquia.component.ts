import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { User } from 'firebase';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-usuario-parroquia',
  templateUrl: './usuario-parroquia.component.html',
  styleUrls: ['./usuario-parroquia.component.css']
})
export class UsuarioParroquiaComponent implements OnInit, OnDestroy {
  usuarios$: Observable<any>;
  searchObject: any = {};
  constructor(
    public afs: AngularFirestore,
    public activatedroute: ActivatedRoute,
    public auth: AuthService,
  ) { }


  sub;
  ngOnInit() {
    this.sub = this.activatedroute.data.subscribe((data: { usuariosParroquia: Observable<any[]> }) => {
      this.usuarios$ = data.usuariosParroquia;
    });

  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }


}
