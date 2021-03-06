import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { RequireUnauthGuard, RequireAuthGuard, EditorGuard, AdminGuard } from './auth/guards';
import { ParroquiaResolverGuard } from './parroquia/parroquia-resolver.guard';
import { NotFoundComponent } from './not-found-component/not-found-component.component';
import { UsuarioResolverGuard } from './usuario/usuario-resolve.guard';


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
    path: 'usuarios',
    loadChildren: () => import('./usuario/usuario.module').then(m => m.UsuarioModule),
    canActivate: [EditorGuard],
    resolve: { usuarios: UsuarioResolverGuard}
  },
  {
    path: '**',
    component: NotFoundComponent
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
