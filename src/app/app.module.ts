import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import {NgxPaginationModule} from 'ngx-pagination';
import { FilterPipeModule } from 'ngx-filter-pipe';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { SignInComponent } from './auth/components/sign-in/sign-in.component';
import { DiocesisComponent } from './diocesis/components/diocesis.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { SuperGuard, AuthGuard, EditorGuard, RequireAuthGuard, RequireUnauthGuard, AdminGuard } from './auth/guards';
import { InicioComponent } from './inicio/components/inicio.component';
import { DocumentoComponent } from './documento/components/documento.component';
import { AppHeaderComponent } from './app-header.component';
import { ParroquiaComponent } from './parroquia/components/parroquia.component';
import { MidiocesisComponent } from './diocesis/midiocesis/midiocesis.component';
import { AccountComponent } from './account/components/account.component';


@NgModule({
  declarations: [
    AppComponent,
    AppHeaderComponent,
    SignInComponent,
    DiocesisComponent,
    InicioComponent,
    DocumentoComponent,
    ParroquiaComponent,
    MidiocesisComponent,
    AccountComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    NgxChartsModule,
    NgxPaginationModule,
    FilterPipeModule
  ],
  providers: [
    RequireAuthGuard,
    RequireUnauthGuard,
    AdminGuard,
    EditorGuard,
    AuthGuard,
    SuperGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
