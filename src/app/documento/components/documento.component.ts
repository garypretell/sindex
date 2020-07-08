import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { DocumentoService } from '../documento.service';

@Component({
  selector: 'app-documento',
  templateUrl: './documento.component.html',
  styleUrls: ['./documento.component.css']
})
export class DocumentoComponent implements OnInit, OnDestroy {
  documentos$: Observable<any>;
  parroquia$: Observable<any>;
  today: number = Date.now();

  view: any[];

  // options
  showDataLabel = true;
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'DOCUMENTO';
  showYAxisLabel = true;
  yAxisLabel = 'REGISTROS';
  nombreGrafica: any;
  constructor(
    public auth: AuthService,
    public afs: AngularFirestore,
    private activatedroute: ActivatedRoute,
    public documentoService: DocumentoService
  ) {
  }

  sub;
  ngOnInit() {
    this.view = [innerWidth / 2.0, 300];
    this.sub = this.activatedroute.paramMap.pipe(map(params => {
      this.documentos$ = this.afs.collection('charts', ref => ref.where('code', '==', params.get('p'))
      .orderBy('name', 'asc')).valueChanges();
      this.parroquia$ = this.afs.doc(`Parroquias/${params.get('p')}`).valueChanges();
    })).subscribe();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  onSelect(event) {
    console.log(event);
  }

  onResize(event) {
    this.view = [event.target.innerWidth / 1.8, 300];
  }
}
