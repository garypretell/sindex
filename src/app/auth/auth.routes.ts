import { AngularFireAuthGuard, hasCustomClaim, redirectUnauthorizedTo, redirectLoggedInTo, canActivate } from '@angular/fire/auth-guard';
import { ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';



// components
import { SignInComponent } from './components/sign-in';

// guards
import { RequireUnauthGuard, AdminGuard } from './guards';
const redirectLoggedInToItems = () => redirectLoggedInTo(['Home']);

export const AuthRoutesModule: ModuleWithProviders = RouterModule.forChild([
  {
    path: '',
    component: SignInComponent,
    canActivate: [RequireUnauthGuard]
  }
]);
