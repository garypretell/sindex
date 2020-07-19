import { Component, OnInit, Input } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
declare var jQuery: any;
declare const $;


@Component({
  selector: 'app-libro-buscar',
  templateUrl: './libro-buscar.component.html',
  styleUrls: ['./libro-buscar.component.css']
})
export class LibroBuscarComponent implements OnInit {
  @Input() registros: any;
  @Input() campos: any;
  @Input() documento: any;
  p = 1;

  searchObject: any = {};
  userFilterF: any = { estado: 'true' };
  constructor(
    private dragulaService: DragulaService
  ) { }

  ngOnInit() {
  }

  deleteRegistro(registro) {}

  enableEditing(evente, registro) {}

  keytab(event) {
    $('input').keydown(function(e) {
      if (e.which === 13) {
        const index = $('input').index(this) + 1;
        $('input').eq(index).focus();
      }
    });
  }

}
