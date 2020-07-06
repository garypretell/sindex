import { Component, OnInit, OnDestroy } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { of, Observable, from, Subject } from 'rxjs';
import { map, switchMap, tap, flatMap, concatMap, take, debounceTime, takeUntil } from 'rxjs/operators';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';

import { Router } from '@angular/router';
import { DocumentoService } from 'src/app/documento/documento.service';
declare var jQuery: any;
declare const $;

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject();
  @ViewChild('myToast') myToast: ElementRef;
  midata: any[];
  view: any;
  pedidosForm: FormGroup;
  p: 1;
  searchDoc: any = { name: '' };
  diocesis: any;
  parroquia: any;
  constructor(public formBuilder: FormBuilder,
              private afs: AngularFirestore,
              public auth: AuthService,
              private router: Router,
              public documentoService: DocumentoService) {
              this.view = [innerWidth / 1.5, 400];
  }

  sub;
  async ngOnInit() {

    this.pedidosForm = this.formBuilder.group({
      apellidos: ['', [Validators.required]],
      nombres: ['', [Validators.required]],
      correo: ['', [Validators.required]],
      diocesis: ['', [Validators.required]],
      parroquia: ['', [Validators.required]],
      celular: ['', [Validators.required]],
      estado: [''],
      fecha: ['']
    });

    const { uid } = await this.auth.getUser();
    this.sub = await this.afs.doc(`usuarios/${uid}`).valueChanges().subscribe((data: any) => {
      this.diocesis = data.diocesis;
      this.parroquia = data.parroquia;
    });

    this.sub = this.afs.collection('charts', ref => ref.where('code', '==', 'aa')).valueChanges()
      .subscribe(data => {
        this.midata = data;
      });

    $('#myToast').toast('show');
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    // this.unsubscribe$.next();
    // this.unsubscribe$.complete();
  }

  getColor(documento) {
    switch (documento) {
      case true:
        return 'green';
      case false:
        return 'black';
    }
  }

  showModal() {
    // jQuery(this.myModal.nativeElement).modal('show');
  }

  trackByFn(index, item) {
    return item.id;
  }

  onSelect(data): void {
    // console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    // console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    // console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  onResize(event) {
    this.view = [event.target.innerWidth / 1.35, 400];
  }

  signOut() {
    this.auth.signOut().then(() => {
      this.router.navigate(['/']);
    });
  }

  goParroquia(){
    this.router.navigate(['/diocesis', this.diocesis.id, 'parroquia', this.parroquia.id]);
  }

  alerta() {
  }

}
