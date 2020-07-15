import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { ParroquiaService } from 'src/app/parroquia/parroquia.service';
import { Subject, Observable } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listado',
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.css']
})
export class ListadoComponent implements OnInit, OnDestroy {
  message: any;
  private unsubscribe$ = new Subject();

  currentDate = new Date();
  midiocesis: any;
  miparroquia: any;
  documento: any;
  midocumento: any;
  milibro: any;

  miruta: any;

  registros$: Observable<any>;
  searchObject: any = {};
  p: any;

  constructor(
    public router: Router,
    private afs: AngularFirestore,
    private activatedroute: ActivatedRoute,
    public parroquiaService: ParroquiaService
  ) { }

  sub;
  ngOnInit() {
    this.parroquiaService.currentMessage.pipe(map(message => this.message = message), takeUntil(this.unsubscribe$)).subscribe();
    this.sub = this.activatedroute.paramMap.pipe(map(params => {
      this.midiocesis = params.get('d');
      this.miparroquia = params.get('p');
      this.documento = params.get('doc');
      this.midocumento = this.miparroquia + '_' + this.documento;
      this.milibro = params.get('l');
      this.miruta = this.midocumento + '_' + this.milibro;
      this.verifyData(this.miruta);
      this.registros$ = this.afs.collection(`Registros`, ref => ref.where('diocesis.id', '==', this.midiocesis)
      .where('parroquia.id', '==', this.miparroquia).where('documento', '==', this.documento)
      .where('libro', '==', parseFloat(this.milibro)).orderBy('numeroreg', 'asc')).valueChanges({ idField: 'id' });
    })).subscribe();
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

  verifyData(libro) {
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
      });
  }
}
