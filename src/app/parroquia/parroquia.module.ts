
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
import { NgxKjuaModule } from 'ngx-kjua';
import { TodosComponent } from '../libro/todos/todos.component';
import { PaginationService } from './pagination.service';
import { AngularSplitModule } from 'angular-split';
import { ListadoComponent } from '../libro/listado/listado.component';
import { BautismoComponent } from '../plantilla/bautismo/bautismo.component';
import { PlantillaComponent } from '../plantilla/plantilla/plantilla.component';
import { MatrimonioComponent } from '../plantilla/matrimonio/matrimonio.component';
import { ConfirmacionComponent } from '../plantilla/confirmacion/confirmacion.component';
import { DefuncionComponent } from '../plantilla/defuncion/defuncion.component';
import { PlantillaGeneralComponent } from '../plantilla/plantilla-general/plantilla-general.component';
import { TemplateComponent } from '../plantilla/template/template.component';
import { PlantillaDirective } from '../plantilla/plantilla.directive';
import { DragulaModule } from 'ng2-dragula';
import { DefaultComponent } from '../plantilla/default/default.component';
import { LibroBuscarComponent } from '../libro/libro-buscar/libro-buscar.component';
import { BuscarRegistroComponent } from '../busquedas/buscar-registro/buscar-registro.component';
import { BuscarBautismoComponent } from '../busquedas/buscar-bautismo/buscar-bautismo.component';
import { ReporteComponent } from '../usuario/reporte/reporte.component';
import { DirectorioComponent } from '../directorio/directorio.component';
import { DirectorioDetailComponent } from '../directorio/directorio-detail/directorio-detail.component';
import { BuscarConfirmacionComponent } from '../busquedas/buscar-confirmacion/buscar-confirmacion.component';

@NgModule({
  declarations: [
    ParroquiaComponent,
    DocumentoComponent,
    LibroComponent,
    ParroquiaDetailComponent,
    TodosComponent,
    ListadoComponent,
    PlantillaComponent,
    PlantillaGeneralComponent,
    BautismoComponent,
    BuscarBautismoComponent,
    ConfirmacionComponent,
    DefuncionComponent,
    MatrimonioComponent,
    TemplateComponent,
    DefaultComponent,
    PlantillaDirective,
    LibroBuscarComponent,
    BuscarRegistroComponent,
    ReporteComponent,
    DirectorioComponent,
    DirectorioDetailComponent,
    BuscarConfirmacionComponent

  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ParroquiaRoutingModule,
    NgxChartsModule,
    NgxPaginationModule,
    FilterPipeModule,
    InfiniteScrollModule,
    AngularSplitModule,
    DragulaModule,
    NgxKjuaModule
  ],
   providers: [
    PaginationService
  ]
})
export class ParroquiaModule { }
