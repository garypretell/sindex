import { AuthService } from 'src/app/auth/auth.service';
import { ParroquiaService } from '../parroquia.service';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { switchMap, map, takeUntil } from 'rxjs/operators';
import { Subject, Observable, of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

import { Validators, FormBuilder, FormGroup } from '@angular/forms';
declare var jQuery: any;
declare const $;

@Component({
  selector: 'app-parroquia-detail',
  templateUrl: './parroquia-detail.component.html',
  styleUrls: ['./parroquia-detail.component.css']
})
export class ParroquiaDetailComponent implements OnInit, OnDestroy {
  message: string;
  private unsubscribe$ = new Subject();

  miparroquia$: Observable<any>;

  midiocesis: any;
  miparroquia: any;

  constructor(
    public auth: AuthService,
    public formBuilder: FormBuilder,
    public afs: AngularFirestore,
    private activatedroute: ActivatedRoute,
    public router: Router,
    public parroquiaService: ParroquiaService
  ) {
  }

  sub;
  ngOnInit() {
    this.parroquiaService.currentMessage.subscribe(message => this.message = message);

    this.sub = this.activatedroute.paramMap.pipe(map(params => {
      this.midiocesis = params.get('d');
      this.miparroquia = params.get('p');
      this.afs.firestore.doc(`Parroquias/${params.get('p')}`).get()
      .then(docSnapshot => {
        if (!docSnapshot.exists) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Esta Parroquia no ha sido registrada!'
          });
          return this.router.navigate(['/Home']);
        } else {
          this.miparroquia$ = this.afs.doc(`Parroquias/${params.get('p')}`).valueChanges();
        }
      });
    })).subscribe();

  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  goPago(parroquia) {
    this.router.navigate(['/diocesis', this.midiocesis, 'parroquia', parroquia.id, 'pagos']);
  }

  enableEditar($event, estaparroquia) {

  }

  onSelect(event) {
    console.log(event);
  }

  goDocumentos(parroquia) {
    this.newMessage(parroquia.nombre);
    this.router.navigate(['/diocesis', parroquia.diocesis, 'parroquia', parroquia.id, 'documentos']);
  }

  editParroquia(parroquia) {
    // this.afs.doc(`Parroquias/${parroquia.id}`).valueChanges().pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
    //   this.parroquiatoEdit = data;
    // });
    // jQuery(this.editModal.nativeElement).modal('show');
  }

  updateParroquia(parroquia) {
    // this.afs.doc(`Parroquias/${parroquia.id}`).update(this.parroquiatoEdit);
    // jQuery(this.editModal.nativeElement).modal('hide');
  }

  newMessage(message) {
    this.parroquiaService.changeMessage(message);
  }

  verifyData(parroquia) {
    this.afs.firestore.doc(`Parroquias/${parroquia}`).get()
      .then(docSnapshot => {
        if (!docSnapshot.exists) {
          alert('Esta Parroquia no ha sido registrada');
          this.router.navigate(['/Home']);
        }
      });
  }

}
