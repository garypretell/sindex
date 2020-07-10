import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DocumentoComponent } from './components/documento.component';
import { DocumentoRoutingModule } from './documento.route';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [DocumentoComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DocumentoRoutingModule,
    NgxChartsModule,
    NgxPaginationModule,
    FilterPipeModule

  ]
})
export class DocumentoModule { }
