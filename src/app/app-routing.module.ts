import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from './auth/components/sign-in/sign-in.component';
import { RequireUnauthGuard, RequireAuthGuard, EditorGuard, AdminGuard } from './auth/guards';
import { DiocesisComponent } from './diocesis/components/diocesis.component';
import { InicioComponent } from './inicio/components/inicio.component';
import { DocumentoComponent } from './documento/components/documento.component';
import { ParroquiaComponent } from './parroquia/components/parroquia.component';
import { MidiocesisComponent } from './diocesis/midiocesis/midiocesis.component';
import { AccountComponent } from './account/components/account.component';
import { ChatComponent } from './chat/components/chat.component';
import { ChatUserComponent } from './chat-user/chat-user.component';


const routes: Routes = [
  { path: '', component: SignInComponent, canActivate: [RequireUnauthGuard] },
  { path: 'Home', component: InicioComponent, canActivate: [RequireAuthGuard] },
  { path: 'documentos', component: DocumentoComponent, canActivate: [EditorGuard] },
  { path: 'registrar', component: AccountComponent, canActivate: [RequireUnauthGuard] },
  { path: 'Chat', component: ChatComponent, canActivate: [AdminGuard] },
  { path: 'diocesis/:d/parroquia/:p', component: ParroquiaComponent, canActivate: [AdminGuard] },
  { path: 'diocesis/:d/parroquia/:p/documentos', component: DocumentoComponent,  canActivate: [EditorGuard] },
  { path: 'chats/:id', component: ChatUserComponent, canActivate: [AdminGuard] },
  {
    path: 'diocesis', component: DiocesisComponent, canActivate: [EditorGuard],
    children: [
      {
        path: ':id', component: MidiocesisComponent, canActivate: [EditorGuard],
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
