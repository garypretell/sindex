import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from './auth/components/sign-in/sign-in.component';
import { RequireUnauthGuard, RequireAuthGuard, EditorGuard } from './auth/guards';
import { DiocesisComponent } from './diocesis/components/diocesis.component';
import { InicioComponent } from './inicio/components/inicio.component';
import { DocumentoComponent } from './documento/components/documento.component';
import { ParroquiaComponent } from './parroquia/components/parroquia.component';
import { MidiocesisComponent } from './diocesis/midiocesis/midiocesis.component';
import { AccountComponent } from './account/components/account.component';


const routes: Routes = [
  { path: '', component: SignInComponent, canActivate: [RequireUnauthGuard] },
  { path: 'Home', component: InicioComponent, canActivate: [RequireAuthGuard] },
  { path: 'documentos', component: DocumentoComponent, canActivate: [EditorGuard] },
  { path: 'registrar', component: AccountComponent, canActivate: [RequireUnauthGuard] },
  {
    path: 'diocesis', component: DiocesisComponent, canActivate: [EditorGuard],
    children: [
      {
        path: ':id', component: MidiocesisComponent, canActivate: [EditorGuard],
        children: [
          { path: 'parroquias', component: ParroquiaComponent, canActivate: [EditorGuard] }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
