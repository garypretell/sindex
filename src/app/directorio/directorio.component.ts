import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
declare var jQuery: any;
declare const $;

@Component({
  selector: 'app-directorio',
  templateUrl: './directorio.component.html',
  styleUrls: ['./directorio.component.css']
})
export class DirectorioComponent implements OnInit {

  directorio$: Observable<any>;
  searchObject: any = {};
  addDirectorioForm: FormGroup;
  constructor(
    public auth: AuthService,
    public formBuilder: FormBuilder,
    public afs: AngularFirestore,
    public router: Router,
    private activatedroute: ActivatedRoute
  ) { }

  ngOnInit() {

    this.directorio$ = this.afs.collection(`Directorio`).valueChanges({idField: 'id'});

    this.addDirectorioForm = this.formBuilder.group({
      categoria: ['', [Validators.required]],
    });
  }

  addDirectorio() {
    const datos: any = {
      categoria: this.addDirectorioForm.value.categoria.replace(/ /g, '')
    };

    this.afs.firestore.doc(`Directorio/${this.addDirectorioForm.value.categoria.replace(/ /g, '')}`).get()
      .then(docSnapshot => {
        if (docSnapshot.exists) {
          alert('Este Libro ya existe!');
          this.addDirectorioForm.reset();
        } else {
          this.afs.doc(`Directorio/${this.addDirectorioForm.value.categoria}`).set(datos, { merge: true });
          this.addDirectorioForm.reset();
        }
      });
  }

  deleteDirectorio(directorio) {
    Swal.fire({
      title: 'Esta seguro de eliminar esta Categoría?',
      // text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar!'
    }).then((result) => {
      if (result.value) {
        this.afs.doc(`Directorio/${directorio.id}`).delete();
        Swal.fire(
          'Eliminado!',
          'La categoría ha sido eliminada.',
          'success'
        );
      }
    });
  }

}
