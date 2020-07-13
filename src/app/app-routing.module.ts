import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { RequireUnauthGuard, RequireAuthGuard, EditorGuard, AdminGuard } from './auth/guards';
import { DiocesisComponent } from './diocesis/components/diocesis.component';
import { MidiocesisComponent } from './diocesis/midiocesis/midiocesis.component';
import { ParroquiaResolverGuard } from './parroquia/parroquia-resolver.guard';


const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
    canActivate: [RequireUnauthGuard]
  },
  {
    path: 'Home',
    loadChildren: () => import('./inicio/inicio.module').then(m => m.InicioModule),
    canActivate: [RequireAuthGuard]
  },
  {
    path: 'diocesis/:d/parroquia',
    loadChildren: () => import('./parroquia/parroquia.module').then(m => m.ParroquiaModule),
    canActivate: [EditorGuard],
    resolve: { parroquias: ParroquiaResolverGuard}
  },
  {
    path: 'Chat',
    loadChildren: () => import('./chat/chat.module').then(m => m.ChatModule),
    canActivate: [AdminGuard],
    // resolve: { chats: ChatResolverGuard}
  },
  {
    path: 'chats/:id',
    loadChildren: () => import('./chat-user/chat-user.module').then(m => m.ChatUserModule),
    canActivate: [AdminGuard]
  },
  {
    path: 'registrar',
    loadChildren: () => import('./account/account.module').then(m => m.AccountModule),
    canActivate: [RequireUnauthGuard]
  },
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
  imports: [RouterModule.forRoot(routes,
    {
      // enableTracing: true, // <-- debugging purposes only
      preloadingStrategy: PreloadAllModules
    })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
