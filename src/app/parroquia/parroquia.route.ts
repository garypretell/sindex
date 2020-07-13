import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ParroquiaComponent } from './components/parroquia.component';
import { DocumentoComponent } from '../documento/components/documento.component';
import { PagoComponent } from '../pago/pago/pago.component';
import { LibroComponent } from '../libro/libro.component';
import { ParroquiaDetailComponent } from './parroquia-detail/parroquia-detail.component';
import { AdminGuard } from '../auth/guards';
import { TodosComponent } from '../libro/todos/todos.component';

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
              { path: ':doc',
                children: [
                    { path: '', redirectTo: 'libros',  pathMatch: 'full' },
                    { path: 'libros', component: LibroComponent },
                    { path: 'listado', component: TodosComponent }
                ]
              }
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
