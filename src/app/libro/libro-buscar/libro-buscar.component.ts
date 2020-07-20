import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import Swal from 'sweetalert2';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
declare var jQuery: any;
declare const $;


@Component({
  selector: 'app-libro-buscar',
  templateUrl: './libro-buscar.component.html',
  styleUrls: ['./libro-buscar.component.css']
})
export class LibroBuscarComponent implements OnInit, OnDestroy {
  @ViewChild('myModalEditS') myModalEditS: ElementRef;
  private unsubscribe$ = new Subject();
  newObject: any = {};
  editObject: any = {};
  micodigo: any;
  @Input() registros: any;
  @Input() campos: any;
  @Input() documento: any;
  p = 1;

  searchObject: any = {};
  userFilterF: any = { estado: 'true' };
  constructor(
    private dragulaService: DragulaService,
    public afs: AngularFirestore
  ) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  keytab(event) {
    $('input').keydown(function(e) {
      if (e.which === 13) {
        const index = $('input').index(this) + 1;
        $('input').eq(index).focus();
      }
    });
  }

  deleteRegistro(registro) {
    Swal.fire({
      title: 'Esta seguro de eliminar este Registro?',
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
      this.editObject = data;
    });
    this.micodigo = item.id;
    jQuery(this.myModalEditS.nativeElement).modal('show');
  }

  updateRegistroS() {
    this.afs.doc(`Registros/${this.micodigo}`).set(this.editObject, { merge: true });
    jQuery(this.myModalEditS.nativeElement).modal('hide');
  }

}
