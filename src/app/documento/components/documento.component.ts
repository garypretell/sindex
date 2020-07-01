import { Component, OnInit } from '@angular/core';
import { DocumentoService } from '../documento.service';

@Component({
  selector: 'app-documento',
  templateUrl: './documento.component.html',
  styleUrls: ['./documento.component.css']
})
export class DocumentoComponent implements OnInit {

  constructor(documentoService: DocumentoService) { }

  ngOnInit() {
  }

}
