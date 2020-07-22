import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { FilterPipeModule } from 'ngx-filter-pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { UsuarioRoutingModule } from './usuario.route';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AngularSplitModule } from 'angular-split';
import { DragulaModule } from 'ng2-dragula';

import { UsuarioComponent } from './usuario/usuario.component';
import { UsuarioDiocesisComponent } from './usuario-diocesis/usuario-diocesis.component';
import { UsuarioParroquiaComponent } from './usuario-parroquia/usuario-parroquia.component';

@NgModule({
  declarations: [
    UsuarioComponent,
    UsuarioDiocesisComponent,
    UsuarioParroquiaComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UsuarioRoutingModule,
    NgxChartsModule,
    NgxPaginationModule,
    FilterPipeModule,
    InfiniteScrollModule,
    AngularSplitModule,
    DragulaModule
  ]
})
export class UsuarioModule { }
