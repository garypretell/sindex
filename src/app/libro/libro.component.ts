import { Component, OnInit, OnDestroy, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
// import Swiper from 'swiper/bundle';
// import 'swiper/swiper-bundle.css';
declare var jQuery: any;
declare const $;

@Component({
  selector: 'app-libro',
  templateUrl: './libro.component.html',
  styleUrls: ['./libro.component.css']
})
export class LibroComponent implements OnInit, OnDestroy, AfterViewChecked {
  private unsubscribe$ = new Subject();
  @ViewChild('myToast') myToast: ElementRef;
  currentDate = new Date();
  midiocesis: any;
  miparroquia: any;
  documento: any;
  midocumento: any;

  topTen$: Observable<any>;

  constructor(

    public router: Router,
    private afs: AngularFirestore,
    private activatedroute: ActivatedRoute,
  ) { }

  sub;
  ngOnInit() {
    this.sub = this.activatedroute.paramMap.pipe(map(params => {
      this.midiocesis = params.get('d');
      this.miparroquia = params.get('p');
      this.documento = params.get('doc');
      this.midocumento = this.miparroquia + '_' + this.documento;
      this.topTen$ = this.afs.collection(`Libros`, ref => ref.where('diocesis', '==', this.midiocesis)
      .where('parroquia', '==', this.miparroquia)
      .where('documento', '==', this.midocumento).orderBy('createdAt', 'desc').limit(12)).valueChanges();
    })).subscribe();
  }

  ngAfterViewChecked() {
    $('.toast').toast('show');
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  goDocumentos() {
    this.router.navigate(['/diocesis', this.midiocesis, 'parroquia', this.miparroquia, 'documentos']);
  }

  goParroquia() {
    this.router.navigate(['/diocesis', this.midiocesis, 'parroquia', this.miparroquia, ]);
  }

  showModal() {

  }

  mostrarTodo() {
    this.router.navigate(['/diocesis', this.midiocesis, 'parroquia', this.miparroquia, 'documentos', this.documento, 'listado']);
  }

  closeToast() {
    alert('as');
    jQuery(this.myToast.nativeElement).toast('hide');
    $('#myToast').toast('hide');
    $('.toast').toast('hide');
    $('#myToast').toast('hide');
  }
}
