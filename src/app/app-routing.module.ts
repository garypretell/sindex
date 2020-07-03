import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from './auth/components/sign-in/sign-in.component';
import { RequireUnauthGuard, RequireAuthGuard, EditorGuard } from './auth/guards';
import { DiocesisComponent } from './diocesis/components/diocesis.component';
import { InicioComponent } from './inicio/components/inicio.component';
import { DocumentoComponent } from './documento/components/documento.component';


const routes: Routes = [
  { path: '', component: SignInComponent, canActivate: [RequireUnauthGuard]  },
  { path: 'diocesis', component: DiocesisComponent, canActivate: [EditorGuard]  },
  { path: 'documentos', component: DocumentoComponent, canActivate: [EditorGuard]  },
  { path: 'Home', component: InicioComponent,  canActivate: [RequireAuthGuard]  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
