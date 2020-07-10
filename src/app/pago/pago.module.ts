import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PagoComponent } from './pago/pago.component';
import { PagoRoutingModule } from './pago.route';
import { FilterPipeModule } from 'ngx-filter-pipe';

@NgModule({
  declarations: [PagoComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PagoRoutingModule,
    FilterPipeModule
  ]
})
export class PagoModule { }
