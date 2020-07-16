import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { ParroquiaService } from 'src/app/parroquia/parroquia.service';
import { Subject, Observable } from 'rxjs';
import { map, takeUntil, switchMap } from 'rxjs/operators';
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
  mifecha = Date.now();

  diocesis: any;
  parroquia: any;

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

    this.afs.doc(`Diocesis/${this.midiocesis}`).valueChanges().pipe(switchMap((m: any) => {
      return this.afs.doc(`Parroquias/${this.miparroquia}`).valueChanges().pipe(map((data: any) => {
        this.diocesis = { nombre: m.nombre, id: data.diocesis };
        this.parroquia = { nombre: data.nombre, id: data.parroquia };
      }));
    }), takeUntil(this.unsubscribe$)).subscribe();
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

  printLibro() {
    // tslint:disable-next-line:one-variable-per-declaration
    let printContents, popupWin;
    if ( this.documento === 'MATRIMONIO'){
      printContents = document.getElementById('print-section2').innerHTML;
    }else {
      printContents = document.getElementById('print-section').innerHTML;
    }
    popupWin = window.open('', '', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Print tab</title>
          <style>
          table.border {
            border: 2px #000000;
            border-style: solid;
            border-collapse: collapse;
            width: 100%;
          }

          table.noborder {
            border: 0px #ffffff;
            border-style: none;
            border-collapse: collapse;
            width: 100%;
          }

          tr {
            font-family: Sans-Serif;
          }

          tr.tablerowodd {
            font-family: Sans-Serif;
          }

          tr.tableroweven {
            background-color: #ddFFFF;
            font-family: Sans-Serif;
            color: #FF0000;
          }

          th {
            font-weight: bold;
            vertical-align: top;
            border-style: solid;
            border-width: 1px;
            background: d0d0d0;
            font-size: smaller;
            padding-left: 5px;
            padding-right: 5px;
          }

          td {
            border-width: 1px;
            border-style: solid;
            padding-left: 3px;
            padding-right: 3px;
            font-size: smaller;
          }

          td.barcode {
            border-width: 1px;
            border-style: solid;
            padding-left: 3px;
            padding-right: 3px;
            font-family: "IDAutomationHC39M", "Lucida Console", Verdana;
            font-size: 8pt;
          }

          td.smalltextmono {
            border-width: 1px;
            border-style: solid;
            padding-left: 3px;
            padding-right: 3px;
            font-family: "Lucida Console", Verdana;
            font-size: 8pt;
          }

          td.yellowbkg {
            border-width: 1px;
            border-style: solid;
            padding-left: 3px;
            padding-right: 3px;
            font-size: smaller;
            background-color: #FFFF00;
          }

          thead {
            display: table-header-group
          }

          @media print {
            body {-webkit-print-color-adjust: exact;}
            @page {size: portrait}
            .page-break {
              display: block;
              page-break-before: always;
            }
          }
          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();

  }

  trackByFn(index, item) {
    return item.id;
  }
}
