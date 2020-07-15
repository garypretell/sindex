
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { FilterPipeModule } from 'ngx-filter-pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { ParroquiaRoutingModule } from './parroquia.route';
import { ParroquiaComponent } from './components/parroquia.component';
import { DocumentoComponent } from '../documento/components/documento.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { LibroComponent } from '../libro/libro/libro.component';
import { ParroquiaDetailComponent } from './parroquia-detail/parroquia-detail.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { TodosComponent } from '../libro/todos/todos.component';
import { PaginationService } from './pagination.service';
import { AngularSplitModule } from 'angular-split';
import { ListadoComponent } from '../libro/listado/listado.component';


@NgModule({
  declarations: [ParroquiaComponent, DocumentoComponent, LibroComponent, ParroquiaDetailComponent, TodosComponent, ListadoComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ParroquiaRoutingModule,
    NgxChartsModule,
    NgxPaginationModule,
    FilterPipeModule,
    InfiniteScrollModule,
    AngularSplitModule
  ],
   providers: [
    PaginationService
  ]
})
export class ParroquiaModule { }
