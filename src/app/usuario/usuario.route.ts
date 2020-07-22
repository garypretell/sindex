import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminGuard, SuperGuard, EditorGuard } from '../auth/guards';
import { UsuarioComponent } from './usuario/usuario.component';
import { UsuarioDiocesisComponent } from './usuario-diocesis/usuario-diocesis.component';
import { UsuarioParroquiaComponent } from './usuario-parroquia/usuario-parroquia.component';

const routes: Routes = [
    {
        path: '',
        children: [
            { path: '', component: UsuarioComponent, canActivate: [EditorGuard], pathMatch: 'full' },
            { path: ':d',
                children: [
                    { path: '', component: UsuarioDiocesisComponent, pathMatch: 'full' }
                ]
            }
        ]
    }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UsuarioRoutingModule { }
