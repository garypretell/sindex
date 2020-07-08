import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { switchMap, map, takeUntil } from 'rxjs/operators';
import { Subject, Observable, of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ParroquiaService } from '../parroquia.service';
declare var jQuery: any;
declare const $;

@Component({
  selector: 'app-parroquia',
  templateUrl: './parroquia.component.html',
  styleUrls: ['./parroquia.component.css']
})
export class ParroquiaComponent implements OnInit, OnDestroy {
  @ViewChild('editModal') editModal: ElementRef;
  private unsubscribe$ = new Subject();

  parroquiatoEdit: any = {};
  estaparroquia: any = {};
  searchObject: any = {};
  principal: boolean;
  today: number = Date.now();

  items: Observable<any[]>;
  data: any;

  midiocesis;
  miparroquia: any;

  constructor(
    public auth: AuthService,
    public afs: AngularFirestore,
    private activatedroute: ActivatedRoute,
    public router: Router,
    public parroquiaService: ParroquiaService
  ) {
  }

  sub;
  ngOnInit() {
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
        return this.activatedroute.paramMap.pipe(map(params => {
          this.items = this.afs.collection<any>(`Parroquias`, ref => ref.where('diocesis', '==', params.get('d'))
            .orderBy('createdAt', 'asc')).valueChanges({ idField: 'id' });
          this.data = params.get('d');
        }));
      })).subscribe();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  goPago() {

  }

  enableEditar($event, estaparroquia) {

  }

  onSelect(event) {
    console.log(event);
  }

  goDocumentos(parroquia) {
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
        this.parroquiaService.deleteparroquia(parroquia);
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
    this.afs.doc(`Parroquias/${parroquia.id}`).update(this.parroquiatoEdit);
    jQuery(this.editModal.nativeElement).modal('hide');
  }

  getColor(estado) {
    switch (estado) {
      case true:
        return 'black';
      case false:
        return 'red';
    }
  }

}
