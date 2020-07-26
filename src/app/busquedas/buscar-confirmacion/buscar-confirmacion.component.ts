import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
declare var jQuery: any;
declare const $;

@Component({
  selector: 'app-buscar-confirmacion',
  templateUrl: './buscar-confirmacion.component.html',
  styleUrls: ['./buscar-confirmacion.component.css']
})
export class BuscarConfirmacionComponent implements OnInit {
  @ViewChild('myModalEdit') myModalEdit: ElementRef;
  @Input() editarRegistro: any;
  constructor() { }

  ngOnInit() {
  }

  enableEditing() {
    jQuery(this.myModalEdit.nativeElement).modal('show');
  }

  updateConfirmacion() {}

}
