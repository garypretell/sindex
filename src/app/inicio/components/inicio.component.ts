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
declare var jQuery: any;
declare const $;

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit, OnDestroy {
  @ViewChild('myToast') myToast: ElementRef;
  private unsubscribe$ = new Subject();
  currentDate: any;
    pedidosForm: FormGroup;
    pedidosForm2: FormGroup;
  constructor(
    public auth: AuthService,
    public formBuilder: FormBuilder,
    public afs: AngularFirestore,
    private router: Router
  ) {  }

  ngOnInit() {
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

    this.pedidosForm2 = this.formBuilder.group({
      apellidos: ['', [Validators.required]],
      nombres: ['', [Validators.required]],
      celular: ['', [Validators.required]],
      mensaje: ['', [Validators.required]],
      estado: [''],
      fecha: ['']
    });
    this.currentDate = new Date();
    // this.load();
  }


  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  alerta() {

  }

  alerta2() {

  }
}
