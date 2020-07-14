import { Component, OnInit, OnDestroy } from '@angular/core';
import { PaginationService } from 'src/app/parroquia/pagination.service';
import { FormBuilder } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'src/app/auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { ParroquiaService } from 'src/app/parroquia/parroquia.service';
import { map, takeUntil } from 'rxjs/operators';

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

    const array = ['BAUTISMO', 'MATRIMONIO', 'DEFUNCION', 'CONFIRMACION'];
    const value = this.midocumento;
    const isInArray = array.includes(value);
    if (isInArray === true) {
      this.router.navigate(['/Diocesis', this.midiocesis, 'Parroquia',
      this.miparroquia, 'Documento', this.midocumento, 'Libro', libro.numLibro]);
    }
    console.log(isInArray);
    // this.router.navigate(['/Diocesis', this.midiocesis, 'Parroquia', this.miparroquia,
    //  'Documento', this.midocumento, 'Libro', libro.numLibro ]);
  }

  goDocumentos() {
    this.router.navigate(['/diocesis', this.midiocesis, 'parroquia', this.miparroquia, 'documentos']);
  }

  goParroquia() {
    this.router.navigate(['/diocesis', this.midiocesis, 'parroquia', this.miparroquia, ]);
  }
}
