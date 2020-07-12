import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
// import Swiper from 'swiper/bundle';
// import 'swiper/swiper-bundle.css';
declare var $: any;

@Component({
  selector: 'app-libro',
  templateUrl: './libro.component.html',
  styleUrls: ['./libro.component.css']
})
export class LibroComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject();
  midiocesis: any;
  miparroquia: any;
  midocumento: any;

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
      this.midocumento = params.get('doc');
    })).subscribe();

    // const mySwiper = new Swiper('.swiper-container', {
    //   effect: 'cube',
    //   grabCursor: true,
    //   cubeEffect: {
    //     shadow: true,
    //     slideShadows: true,
    //     shadowOffset: 20,
    //     shadowScale: 0.94,
    //   },
    //   pagination: {
    //     el: '.swiper-pagination',
    //   },
    // });

    // const mySwiper = new Swiper('.swiper-container', {
    //   // Optional parameters
    //   direction: 'vertical',
    //   loop: true,

    //   // If we need pagination
    //   pagination: {
    //     el: '.swiper-pagination',
    //   },

    //   // Navigation arrows
    //   navigation: {
    //     nextEl: '.swiper-button-next',
    //     prevEl: '.swiper-button-prev',
    //   },

    //   // And if we need scrollbar
    //   scrollbar: {
    //     el: '.swiper-scrollbar',
    //   },
    // });
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

}
