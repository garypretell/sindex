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
  selector: 'app-parroquia',
  templateUrl: './parroquia.component.html',
  styleUrls: ['./parroquia.component.css']
})
export class ParroquiaComponent implements OnInit, OnDestroy {
  message: string;
  parroquia: any;
  showdetalle: boolean;
  @ViewChild('editModal') editModal: ElementRef;
  @ViewChild('addModal') addModal: ElementRef;
  private unsubscribe$ = new Subject();

  public addParroquiaForm: FormGroup;

  parroquiatoEdit: any = {};
  estaparroquia: any = {};
  searchObject: any = {};
  principal: boolean;
  today: number = Date.now();

  items: Observable<any[]>;
  data: any;

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
    this.showdetalle = false;
    this.sub = this.auth.user$.pipe(switchMap((m: any) => {
      if (m) {
        return this.afs.doc(`Parroquias/${m.parroquia.id}`).valueChanges().pipe(map((data: any) => {
          if (data) {
            this.miparroquia = m.parroquia.id;
            this.principal = data.principal;
            this.estaparroquia = data;
          }
        }));
      }
      else {
        return of(null);
      }
    }),
      switchMap(d => {
        return this.activatedroute.data.pipe(map((data: { parroquias: Observable<any[]> }) => {
          this.items = data.parroquias;
        }));
      })
    ).subscribe();

    this.activatedroute.paramMap.pipe(takeUntil(this.unsubscribe$)).subscribe(params => {
      this.midiocesis = params.get('d');
    });

    this.addParroquiaForm = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      estado: ['', []],
      banco: ['', [Validators.required]],
      cuenta: ['', [Validators.required]],
      secretariaGeneral: ['', [Validators.required]],
      diocesis: [''],
      usuarios: ['']
    });
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

  deleteParroquia(parroquia) {
    Swal.fire({
      title: 'Esta seguro de eliminar esta Parroquia?',
      // text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar!'
    }).then((result) => {
      if (result.value) {
        this.parroquiaService.removeParroquias(parroquia);
        Swal.fire(
          'Eliminado!',
          'La Parroquia ha sido eliminada.',
          'success'
        );
      }
    });
  }

  editParroquia(parroquia) {
    this.afs.doc(`Parroquias/${parroquia.id}`).valueChanges().pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      this.parroquiatoEdit = data;
    });
    jQuery(this.editModal.nativeElement).modal('show');
  }

  updateParroquia(parroquia) {
    console.log(parroquia.id);
    this.afs.doc(`Parroquias/${parroquia.id}`).update(this.parroquiatoEdit);
    jQuery(this.editModal.nativeElement).modal('hide');
  }

  addParroquia() {
    const mifecha = new Date(Date.now());
    mifecha.setMonth(mifecha.getMonth() + 1);
    const id = this.midiocesis + '_' + (this.addParroquiaForm.value.nombre).replace(/ /g, '');
    const data: any = {
      banco: this.addParroquiaForm.value.banco,
      cuenta: this.addParroquiaForm.value.cuenta,
      estado: true,
      nombre: this.addParroquiaForm.value.nombre,
      total_imagenes: 0,
      diocesis: this.midiocesis,
      parroquia: id,
      usuarios: [],
      documentos: [],
      principal: this.addParroquiaForm.value.secretariaGeneral,
      createdAt: Date.now(),
      pago: 20,
      nextPay: mifecha
    };

    this.afs.firestore.doc(`Parroquias/${id}`).get()
      .then(docSnapshot => {
        if (docSnapshot.exists) {
          this.mensajeReject();
          this.addParroquiaForm.reset();
        } else {
          this.parroquiaService.createParroquias(data);
          this.addParroquiaForm.reset();
          this.mensajeAccept();
          jQuery(this.addModal.nativeElement).modal('hide');
        }
      });
  }

  show_addModal() {
    jQuery(this.addModal.nativeElement).modal('show');
  }

  getColor(estado) {
    switch (estado) {
      case true:
        return 'black';
      case false:
        return 'red';
    }
  }

  mensajeAccept() {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      }
    });

    Toast.fire({
      icon: 'success',
      title: 'Signed in successfully'
    });
  }

  mensajeReject() {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Esta parroquia ya existe!',
      // footer: '<a href>Why do I have this issue?</a>'
    });
  }

  newMessage(message) {
    this.parroquiaService.changeMessage(message);
  }

}
