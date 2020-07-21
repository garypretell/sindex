import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-buscar-bautismo',
  templateUrl: './buscar-bautismo.component.html',
  styleUrls: ['./buscar-bautismo.component.css']
})
export class BuscarBautismoComponent implements OnInit {
  @Input() documento: any;
  constructor() { }

  ngOnInit() {
  }

}
