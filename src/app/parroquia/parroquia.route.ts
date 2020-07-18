import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ParroquiaComponent } from './components/parroquia.component';
import { DocumentoComponent } from '../documento/components/documento.component';
import { PagoComponent } from '../pago/pago/pago.component';
import { LibroComponent } from '../libro/libro/libro.component';
import { ParroquiaDetailComponent } from './parroquia-detail/parroquia-detail.component';
import { AdminGuard } from '../auth/guards';
import { TodosComponent } from '../libro/todos/todos.component';
import { ListadoComponent } from '../libro/listado/listado.component';
import { PlantillaComponent } from '../plantilla/plantilla/plantilla.component';
import { PlantillaGeneralComponent } from '../plantilla/plantilla-general/plantilla-general.component';
import { TemplateComponent } from '../plantilla/template/template.component';

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
                    { path: 'listado', component: TodosComponent },
                    { path: 'template', component: TemplateComponent, canActivate: [AdminGuard] },
                    { path: 'libros',
                      children: [
                        {path: '', component: LibroComponent,  pathMatch: 'full'},
                        { path: ':l',
                         children: [
                           { path: '', component: ListadoComponent,  pathMatch: 'full'},
                           { path: 'registrar', component: PlantillaComponent }
                         ]
                        }
                      ]
                    }
                ]
              }
            ]
          },
          {
            path: 'pagos',
            component: PagoComponent
          },
          {
            path: 'plantillas',
            component: PlantillaGeneralComponent
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
