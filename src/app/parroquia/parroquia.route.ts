import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ParroquiaComponent } from './components/parroquia.component';
import { DocumentoComponent } from '../documento/components/documento.component';

const routes: Routes = [
  {
    path: '',
    component: ParroquiaComponent
  },
  {
    path: 'documentos',
    component: DocumentoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParroquiaRoutingModule { }
