import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit, OnDestroy {
  usuarios$: Observable<any>;
  searchObject: any = {};
  constructor(
    public afs: AngularFirestore,
    public activatedroute: ActivatedRoute
  ) { }

  sub;
  ngOnInit() {
    this.sub = this.activatedroute.data.subscribe((data: { usuarios: Observable<any[]> }) => {
      this.usuarios$ = data.usuarios;
    });

  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
