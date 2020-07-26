import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { NumbertoWords } from '../utils/numbertowords';
declare var jQuery: any;
declare const $;

@Component({
  selector: 'app-buscar-bautismo',
  templateUrl: './buscar-bautismo.component.html',
  styleUrls: ['./buscar-bautismo.component.css']
})
export class BuscarBautismoComponent implements OnInit {
  @ViewChild('myModalEdit') myModalEdit: ElementRef;
  @Input() editarRegistro: any;

  valor: any;

  datosImprimir: any;
  text: any = 'https://github.com/werthdavid/ngx-kjua';
  yearBaut: any;
  yearNac: any;
  mesBaut: any;
  diaBaut: any;
  mesNac: any;
  diaNac: any;
  numbers = [];
  pushkey: any;
  apellidos: any;
  nombres: any;
  apellidosD: any;
  nombresD: any;
  constructor(
    public afs: AngularFirestore,
  ) { }

  ngOnInit() {
    this.valor = this.editarRegistro;
  }

  updateBautismo() {
    alert(this.editarRegistro);
  }

  enableEditing() {
    jQuery(this.myModalEdit.nativeElement).modal('show');
  }

  seleccionar(data) {

    this.pushkey = this.afs.createId();
    this.datosImprimir = null;
    this.text = `https://magnum-50f46.firebaseapp.com/Impresiones/${this.pushkey}`;
    this.datosImprimir = data;
    // tslint:disable-next-line:max-line-length
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const myDateB = new Date((data.fecha).replace(/-/g, '/'));
    const myDateN = new Date((data.fechanac).replace(/-/g, '/'));

    this.yearBaut = NumbertoWords.Miles(myDateB.getFullYear());
    this.mesBaut = monthNames[myDateB.getMonth()];
    this.diaBaut = myDateB.getDate();
    // Datos de Bautismos
    this.yearNac = myDateN.getFullYear();
    this.mesNac = monthNames[myDateN.getMonth()];
    this.diaNac = myDateN.getDate();

  }

  imprimir(data) {
    const datos = {
      nombres: data.nombres,
      apellidos: data.apellidos,
      fecha: data.fecha,
      createdAt: Date.now()
    };
    this.afs.doc(`Impresiones/${this.pushkey}`).set(datos);
  }

  print(data) {
    this.imprimir(data);
    // tslint:disable-next-line:one-variable-per-declaration
    let printContents, popupWin;
    printContents = document.getElementById('print-section').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Print tab</title>
          <link rel="stylesheet preload" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
          <style>
          .mm {
            border-top: 1px dotted rgb(49, 43, 43) ;
            color: #fff;
            background-color: #fff;
            height: 1px;
        }
        a {
            border-bottom:1px dotted #9999CC;
            text-decoration:none;
          }
          * {
            font-size: 0.93rem;
          }
          @media print{
            @page {size: Landscape}
            .printTD{
            display: inherit;
            }
            thead {
            display: table-row-group
            }

            td{
            overflow-wrap: break-word;
            word-break: break-word;
            }
            }
          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}
    <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>
    </body>
      </html>`
    );
    popupWin.document.close();
  }

}
