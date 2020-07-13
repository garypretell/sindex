import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ParroquiaComponent } from './components/parroquia.component';
import { DocumentoComponent } from '../documento/components/documento.component';
import { PagoComponent } from '../pago/pago/pago.component';
import { LibroComponent } from '../libro/libro.component';
import { ParroquiaDetailComponent } from './parroquia-detail/parroquia-detail.component';
import { AdminGuard } from '../auth/guards';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: ParroquiaComponent, canActivate: [AdminGuard], pathMatch: 'full' },
      { path: ':p',
        children: [
          { path: '', component: ParroquiaDetailComponent,  pathMatch: 'full' },
          {
            path: 'documentos',
            children: [
              { path: '', component: DocumentoComponent,  pathMatch: 'full' },
              { path: ':doc/libros', component: LibroComponent }
            ]
          },
          {
            path: 'pagos',
            component: PagoComponent
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParroquiaRoutingModule { }
