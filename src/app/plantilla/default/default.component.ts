import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { FormBuilder } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { switchMap, map, takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import * as firebase from 'firebase/app';
declare var jQuery: any;
declare const $;

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.css']
})
export class DefaultComponent implements OnInit, OnDestroy {
  @ViewChild('myModalEditS') myModalEditS: ElementRef;
  private unsubscribe$ = new Subject();
  midiocesis: any;
  miparroquia: any;
  midocumento: any;
  documento: any;
  milibro: any;
  miruta: any;

  micodigo: any;

  diocesis: any;
  parroquia: any;

  registros$: Observable<any>;
  campos$: Observable<any>;
  newObject: any = {};
  editObject: any = {};
  registrotoEdit: any = {};
  userFilterF: any = { estado: 'true' };
  p: any;

  constructor(
    public auth: AuthService,
    public formBuilder: FormBuilder,
    public afs: AngularFirestore,
    public router: Router,
    private activatedroute: ActivatedRoute
  ) { }

  sub;
  ngOnInit() {
    this.sub = this.activatedroute.paramMap.subscribe(params => {
      this.midiocesis = params.get('d');
      this.miparroquia = params.get('p');
      this.documento = params.get('doc');
      this.midocumento = this.miparroquia + '_' + this.documento;
      this.milibro = params.get('l');
      this.miruta = this.midocumento + '_' + this.milibro;
      this.actualizarData(this.miruta);
      this.campos$ = this.afs.doc(`Plantillas/${this.midocumento}`).valueChanges();
      this.registros$ = this.afs.collection(`Registros`, ref => ref.where('parroquia.id', '==', this.miparroquia)
      .where('documento', '==', this.documento).where('libro', '==', parseFloat(this.milibro)).orderBy('createdAt', 'desc').limit(6))
      .valueChanges({ idField: 'id'});
    });

    this.afs.doc(`Diocesis/${this.midiocesis}`).valueChanges().pipe(switchMap((m: any) => {
      return this.afs.doc(`Parroquias/${this.miparroquia}`).valueChanges().pipe(map((data: any) => {
        this.diocesis = { nombre: m.nombre, id: data.diocesis };
        this.parroquia = { nombre: data.nombre, id: data.parroquia };
      }));
    }), takeUntil(this.unsubscribe$)).subscribe();
    $('input:text:visible:first').focus();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  goParroquia() {
    this.router.navigate(['/diocesis', this.midiocesis, 'parroquia', this.miparroquia]);
  }

  goDocumento() {
    this.router.navigate(['/diocesis', this.midiocesis, 'parroquia', this.miparroquia, 'documentos']);
  }

  goLibro() {
    this.router.navigate(['/diocesis', this.midiocesis, 'parroquia', this.miparroquia, 'documentos', this.documento, 'libros']);
  }

  add(registro) {
    registro.libro = parseFloat(this.milibro);
    registro.createdAt = Date.parse(new Date().toISOString().substring(0, 10));
    registro.usuarioid = firebase.auth().currentUser.uid;
    registro.diocesis = this.diocesis;
    registro.parroquia = this.parroquia;
    registro.documento = this.documento;
    this.afs.collection(`Registros`).add(registro);
    const datos = { contador: firebase.firestore.FieldValue.increment(1) };
    const rutaDoc = this.miparroquia + '_' + this.documento;
    const value = { value: firebase.firestore.FieldValue.increment(1) };
    this.afs.doc(`Documentos/${rutaDoc}`).set(value, { merge: true });
    this.afs.doc(`Libros/${this.miruta}`).set(datos, { merge: true });
    this.newObject = {};
    registro = null;
    // $('input:text:visible:first').focus();
    $('input:enabled:visible:first').focus();
  }

  keytab(event) {
    $('input').keydown(function(e) {
      if (e.which === 13) {
        const index = $('input').index(this) + 1;
        $('input').eq(index).focus();
      }
    });
  }

  actualizarData(libro) {
    this.afs.firestore.doc(`Libros/${libro}`).get()
      .then(docSnapshot => {
        if (!docSnapshot.exists) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Este Libro no ha sido registrado!'
          });
          this.goLibro();
        }
      }
      );
  }

  deleteRegistro(registro) {
    Swal.fire({
      title: 'Esta seguro de eliminar este Registro?',
      // text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar!'
    }).then((result) => {
      if (result.value) {
        this.afs.doc(`Registros/${registro.id}`).delete();
        Swal.fire(
          'Eliminado!',
          'El registro ha sido eliminado.',
          'success'
        );
      }
    });
  }

  enableEditing($event, item) {
    this.afs.doc(`Registros/${item.id}`).valueChanges().pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
     this.registrotoEdit = data;
     this.editObject = data;
    });
    this.micodigo = item.id;
    jQuery(this.myModalEditS.nativeElement).modal('show');
  }

  updateRegistroS(registrotoEdit) {
    this.afs.doc(`Registros/${this.micodigo}`).set(this.editObject, {merge: true});
    jQuery(this.myModalEditS.nativeElement).modal('hide');
  }

  goListado() {
    this.router.navigate(['/diocesis', this.midiocesis, 'parroquia', this.miparroquia, 'documentos',
    this.documento, 'libros', this.milibro]);
  }
}
