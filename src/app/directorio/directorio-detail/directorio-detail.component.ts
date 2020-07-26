import { Component, OnInit, OnDestroy } from '@angular/core';
import { map, takeUntil, switchMapTo, switchMap, find } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subject, Observable } from 'rxjs';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
declare var jQuery: any;
declare const $;

@Component({
  selector: 'app-directorio-detail',
  templateUrl: './directorio-detail.component.html',
  styleUrls: ['./directorio-detail.component.css']
})
export class DirectorioDetailComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject();
  directorio$: Observable<any>;
  searchObject: any = {};
  addDirectorioForm: FormGroup;

  midiocesis: any;
  miparroquia: any;
  micategoria: any;
  constructor(
    public auth: AuthService,
    public router: Router,
    public formBuilder: FormBuilder,
    private afs: AngularFirestore,
    private activatedroute: ActivatedRoute,
  ) { }

  sub;
  ngOnInit() {
    this.sub = this.activatedroute.paramMap.pipe(map(params => {
      this.midiocesis = params.get('d');
      this.miparroquia = params.get('p');
      this.micategoria = params.get('di');
      this.directorio$ = this.afs.collection(`${this.micategoria}`, ref => ref.where('parroquia', '==', this.miparroquia))
      .valueChanges({idField: 'id'});
      this.verficar(params.get('di'));
    })).subscribe();

    this.addDirectorioForm = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      dni: ['', Validators.compose([Validators.required, Validators.min(10000000), Validators.max(99999999)])],
      diocesis: [''],
      parroquia: [''],
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  verficar(categoria) {
    this.afs.collection(`Directorio`).valueChanges().pipe(map((data: any) => {
      const result = data.find((ev: any) => ev.categoria === categoria);
      if (!result) {
        this.router.navigate(['/Home']);
      }
    }), takeUntil(this.unsubscribe$)).subscribe();
  }

  addDirectorio() {
    const categoria = this.micategoria;
    const ruta = this.addDirectorioForm.value.dni;
    this.afs.firestore.doc(`${categoria}/${ruta}`).get()
      .then(docSnapshot => {
        if (docSnapshot.exists) {
          alert('Este usuario ya ha sido registrado!');
          this.addDirectorioForm.reset();
        } else {
          this.addDirectorioForm.value.diocesis = this.midiocesis;
          this.addDirectorioForm.value.parroquia = this.miparroquia;
          this.afs.doc(`${categoria}/${ruta}`).set(this.addDirectorioForm.value);
          this.addDirectorioForm.reset();
        }
      });
  }

  deleteUser(user) {
    const categoria = this.micategoria;
    Swal.fire({
      title: `Esta seguro de eliminar este ${categoria}?`,
      // text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar!'
    }).then((result) => {
      if (result.value) {
        this.afs.doc(`${categoria}/${user.id}`).delete();
        Swal.fire(
          'Eliminado!',
          `EL ${{categoria}} ha sido eliminada.`,
          'success'
        );
      }
    });
  }

}
