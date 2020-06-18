
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

// components

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignInComponent } from './components/sign-in';
// modules
import { AuthRoutesModule } from './auth.routes';

// services
import { RequireAuthGuard, RequireUnauthGuard, AdminGuard, EditorGuard, AuthGuard, SuperGuard } from './guards';
import { AuthService } from './auth.service';

@NgModule({
  declarations: [
    SignInComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AuthRoutesModule

  ],
  providers: [
    AuthService,
    RequireAuthGuard,
    RequireUnauthGuard,
    AdminGuard,
    EditorGuard,
    AuthGuard,
    SuperGuard
  ]
})
export class AuthModule { }
