
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { FilterPipeModule } from 'ngx-filter-pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { ParroquiaRoutingModule } from './parroquia.route';
import { ParroquiaComponent } from './components/parroquia.component';
import { DocumentoComponent } from '../documento/components/documento.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { LibroComponent } from '../libro/libro.component';


@NgModule({
  declarations: [ParroquiaComponent, DocumentoComponent, LibroComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ParroquiaRoutingModule,
    NgxChartsModule,
    NgxPaginationModule,
    FilterPipeModule
  ]
})
export class ParroquiaModule { }
