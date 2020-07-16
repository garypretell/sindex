import { Component, OnInit, OnDestroy } from '@angular/core';
import { PaginationService } from 'src/app/parroquia/pagination.service';
import { FormBuilder } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'src/app/auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { ParroquiaService } from 'src/app/parroquia/parroquia.service';
import { map, takeUntil, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css']
})
export class TodosComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject();
  message: any;
  midiocesis: any;
  miparroquia: any;
  midocumento: any;
  documento: any;

  diocesis: any;
  parroquia: any;

  elemento: any;

  constructor(
    public page: PaginationService,
    public formBuilder: FormBuilder,
    public afs: AngularFirestore,
    public auth: AuthService,
    public router: Router,
    public activatedroute: ActivatedRoute,
    public parroquiaService: ParroquiaService
  ) { }

  sub;
  ngOnInit() {
    this.elemento = document.getElementById('content');
    this.parroquiaService.currentMessage.pipe(map(message => this.message = message), takeUntil(this.unsubscribe$)).subscribe();
    this.sub = this.activatedroute.paramMap.subscribe(params => {
      this.midiocesis = params.get('d');
      this.miparroquia = params.get('p');
      this.documento = params.get('doc');
      this.midocumento = this.miparroquia + '_' + params.get('doc');
      this.page.init('Libros', 'numLibro', this.midiocesis, this.miparroquia, this.midocumento, { reverse: true, prepend: false });
    });

    this.afs.doc(`Diocesis/${this.midiocesis}`).valueChanges().pipe(switchMap((m: any) => {
      return this.afs.doc(`Parroquias/${this.miparroquia}`).valueChanges().pipe(map((data: any) => {
        this.diocesis = {nombre: m.nombre, id: data.diocesis};
        this.parroquia = {nombre: data.nombre, id: data.parroquia};
      }));
    }), takeUntil(this.unsubscribe$)).subscribe();
  }

  ngOnDestroy() {
    this.page.reset();
    this.sub.unsubscribe();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  scrollHandler(e) {
    if (e === 'bottom') {
      this.page.more();
    }
  }

  onTop() {
    this.elemento.scrollIntoView = document.documentElement.scrollIntoView({behavior: 'smooth'});
  }

  onScroll() {
    this.page.more();
  }

  trackByFn(index, item) {
    return item.id;
  }

  goRegistrar(libro) {
      this.router.navigate(['/diocesis', this.midiocesis, 'parroquia',
      this.miparroquia, 'documentos', this.documento, 'libros', libro.numLibro, 'registrar']);
  }

  goDocumentos() {
    this.router.navigate(['/diocesis', this.midiocesis, 'parroquia', this.miparroquia, 'documentos']);
  }

  goParroquia() {
    this.router.navigate(['/diocesis', this.midiocesis, 'parroquia', this.miparroquia, ]);
  }

  goListado(libro) {
    this.router.navigate(['/diocesis', this.midiocesis, 'parroquia',
    this.miparroquia, 'documentos', this.documento, 'libros', libro.numLibro]);
  }
}
