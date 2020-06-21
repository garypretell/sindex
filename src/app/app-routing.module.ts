import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from './auth/components/sign-in';
import { RequireUnauthGuard } from './auth/guards';
import { DiocesisComponent } from './diocesis/components/diocesis.component';


const routes: Routes = [
  { path: '', component: SignInComponent, canActivate: [RequireUnauthGuard]  },
  { path: 'diocesis', component: DiocesisComponent, canActivate: [RequireUnauthGuard]  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
