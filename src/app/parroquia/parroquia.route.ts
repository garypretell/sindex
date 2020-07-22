import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ParroquiaComponent } from './components/parroquia.component';
import { DocumentoComponent } from '../documento/components/documento.component';
import { PagoComponent } from '../pago/pago/pago.component';
import { LibroComponent } from '../libro/libro/libro.component';
import { ParroquiaDetailComponent } from './parroquia-detail/parroquia-detail.component';
import { AdminGuard, EditorGuard } from '../auth/guards';
import { TodosComponent } from '../libro/todos/todos.component';
import { ListadoComponent } from '../libro/listado/listado.component';
import { PlantillaComponent } from '../plantilla/plantilla/plantilla.component';
import { PlantillaGeneralComponent } from '../plantilla/plantilla-general/plantilla-general.component';
import { TemplateComponent } from '../plantilla/template/template.component';
import { BuscarRegistroComponent } from '../busquedas/buscar-registro/buscar-registro.component';
import { UsuarioParroquiaComponent } from '../usuario/usuario-parroquia/usuario-parroquia.component';
import { ParroquiaUsuarioResolverGuard } from './parroquia-usuario-resolver.guard';
import { report } from 'process';
import { ReporteComponent } from '../usuario/reporte/reporte.component';


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
                    { path: 'buscar', component: BuscarRegistroComponent },
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
          },
          {
            path: 'usuarios',
            children: [
              {path: '', component: UsuarioParroquiaComponent,
              canActivate: [AdminGuard],
              resolve: { usuariosParroquia: ParroquiaUsuarioResolverGuard},  pathMatch: 'full'},
              {path: ':u',
              children: [
                { path: '', redirectTo: 'reportes',  pathMatch: 'full'},
                { path: 'reportes', component: ReporteComponent }
              ]
              }
            ]
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
